// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {SafeERC20, IERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {ERC721Holder} from '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';
import {EnumerableSet} from '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import {INonfungiblePositionManager} from './interfaces/INonfungiblePositionManager.sol';
import {Adminable, Ownable} from './utils/Adminable.sol';

/// @title UniV3IncentivesController
/// @notice Staking contract with multiple token rewards for UniV3 positions.
contract UniV3IncentivesController is ERC721Holder, Adminable {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.UintSet;

    /***** STRUCTS *****/

    struct Reward {
        // Timestamp of the end of current rewards distribution.
        uint periodFinish;
        // Rewards distributed per second.
        uint rewardRate;
        // Timestamp of last update.
        uint lastUpdateTime;
        // Current snapshot of reward tokens per staked token.
        uint rewardPerTokenStored;
        // Current accounted for balance of reward tokens.
        uint balance;
    }

    struct RewardData {
        // Address of the reward token.
        address token;
        // Amount of the reward token.
        uint amount;
    }

    struct PositionConfig {
        // Address of token0.
        address token0;
        // Address of token1.
        address token1;
        // Minimum tick range.
        int24 tickLower;
        // Maximum tick range.
        int24 tickUpper;
    }

    struct NftInfo {
        // Amount of liquidity.
        uint liquidity;
        // Unlock time.
        uint id;
    }

    /***** STATE *****/

    /// @notice Amounts of user's accumulated rewards.
    mapping(address => mapping(address => uint)) public rewards;

    /// @notice Info about reward tokens distribution.
    mapping(address => Reward) public rewardData;

    /// @notice Array of registered reward tokens.
    address[] public rewardTokens;

    /// @notice UniV3 NFT liquidity.
    mapping(uint => uint) public nftLiquidity;

    /// @notice Sum of user's positions liquidity.
    mapping(address => uint) public userLiquidity;

    /// @notice Total liquidity of all users.
    uint public totalLiquidity;

    /// @notice NFT posiiotn configuration.
    PositionConfig public posConfig;

    /// @notice Address of UniV3 NFT.
    INonfungiblePositionManager public immutable nft;

    /// @notice List of user's UniV3 position ids.
    mapping(address => EnumerableSet.UintSet) private positions;

    /// @dev Snapshot of user's accounted reward tokens.
    mapping(address => mapping(address => uint)) private userRewardPerTokenPaid;

    /***** EVENTS *****/

    event Deposited(address indexed user, uint indexed nftId, uint indexed liquidity);
    event Withdrawn(address indexed user, uint indexed nftId, uint indexed liquidity);
    event RewardPaid(address indexed user, address indexed token, uint amount);
    event PositionRangesChanged(int24 indexed tickLower, int24 indexed tickUpper);

    constructor(INonfungiblePositionManager _nft, PositionConfig memory _posConfig, address _rewardToken) Ownable(msg.sender) {
        require(address(_nft) != address(0), 'nft zero address');
        require(_posConfig.token0 != address(0), 'token0 zero address');
        require(_posConfig.token1 != address(0), 'token1 zero address');
        require(_posConfig.token0 != _posConfig.token1, 'same tokens');
        require(_posConfig.tickLower < _posConfig.tickUpper, 'invalid tick range');
        require(_rewardToken != address(0), 'rewardToken zero address');
        nft = _nft;
        posConfig = _posConfig;
        _addReward(_rewardToken);
    }

    /***** EXTERNAL *****/

    function deposit(uint[] calldata _nftIds) external {
        _updateReward(msg.sender, rewardTokens);
        uint length = _nftIds.length;
        for (uint i = 0; i < length; i++) {
            uint nftId = _nftIds[i];
            (
                ,
                ,
                address _token0,
                address _token1,
                ,
                int24 _tickLower,
                int24 _tickUpper,
                uint128 liquidity,
                ,
                ,
                ,

            ) = INonfungiblePositionManager(address(nft)).positions(nftId);
            require(posConfig.tickLower <= _tickLower, 'Invalid lower tick');
            require(posConfig.tickUpper >= _tickUpper, 'Invalid upper tick');
            require(posConfig.token0 == _token0, 'Invalid token0');
            require(posConfig.token1 == _token1, 'Invalid token1');
            require(liquidity > 0, 'Invalid liquidity');
            positions[msg.sender].add(nftId);
            nftLiquidity[nftId] = liquidity;
            userLiquidity[msg.sender] += liquidity;
            totalLiquidity += liquidity;
            nft.safeTransferFrom(msg.sender, address(this), nftId);
            emit Deposited(msg.sender, nftId, liquidity);
        }
    }

    function withdraw(uint[] calldata _nftIds) external {
        _updateReward(msg.sender, rewardTokens);
        _getReward(rewardTokens);
        uint length = _nftIds.length;
        for (uint i = 0; i < length; i++) {
            uint nftId = _nftIds[i];
            require(positions[msg.sender].contains(nftId), 'Invalid nftId');
            positions[msg.sender].remove(nftId);
            uint liquidity = nftLiquidity[nftId];
            userLiquidity[msg.sender] -= liquidity;
            totalLiquidity -= liquidity;
            nftLiquidity[nftId] = 0;
            nft.transferFrom(address(this), msg.sender, nftId);
            emit Withdrawn(msg.sender, nftId, liquidity);
        }
    }

    function getReward(address[] calldata _rewardTokens) external {
        _updateReward(msg.sender, _rewardTokens);
        _getReward(_rewardTokens);
    }

    /** VIEW FUNCTIONS **/

    /**
     * @notice Get all NFTs deposited by user.
     * @param _account Address of the user.
     */
    function getAllUserNfts(address _account) external view returns (NftInfo[] memory allData) {
        uint[] memory nftIds = positions[_account].values();
        allData = new NftInfo[](nftIds.length);
        uint length = nftIds.length;
        for (uint i = 0; i < length; i++) {
            uint nftId = nftIds[i];
            allData[i] = NftInfo(nftLiquidity[nftId], nftId);
        }
    }

    /**
     * Calcualte last valid timestamp for reward token dsitribution.
     * @param _rewardsToken Address of the reward token.
     * @return Timestamp of last valid reward distribution.
     */
    function lastTimeRewardApplicable(address _rewardsToken) public view returns (uint) {
        uint periodFinish = rewardData[_rewardsToken].periodFinish;
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /**
     * @notice Get rewards accumulated for deposited NFTs.
     * @param _account Address of the user.
     */
    function claimableRewards(address _account) external view returns (RewardData[] memory claimable) {
        claimable = new RewardData[](rewardTokens.length);
        for (uint i = 0; i < claimable.length; i++) {
            claimable[i].token = rewardTokens[i];
            claimable[i].amount =
                _earned(_account, claimable[i].token, userLiquidity[_account], _rewardPerToken(rewardTokens[i], totalLiquidity)) /
                1e12;
        }
        return claimable;
    }

    /** OWNER FUNCTIONS **/

    function changePositionRanges(int24 _tickLower, int24 _tickUpper) external onlyOwner {
        require(_tickLower < _tickUpper, 'tick lower is gte tick upper');
        posConfig.tickLower = _tickLower;
        posConfig.tickUpper = _tickUpper;
        emit PositionRangesChanged(_tickLower, _tickUpper);
    }

    function addReward(address _rewardToken) external onlyAdmin {
        _addReward(_rewardToken);
    }

    /**
     * Add reward tokens for distribution over next 7 days.
     * @param _rewardTokens Array of addresses of the reward tokens.
     * @param _amounts Array of amounts of rewards tokens.
     */
    function notifyReward(address[] calldata _rewardTokens, uint[] calldata _amounts, uint _rewardsDuration) external onlyAdmin {
        _updateReward(address(this), _rewardTokens);
        uint length = _rewardTokens.length;
        for (uint i; i < length; i++) {
            address token = _rewardTokens[i];
            Reward storage r = rewardData[token];
            require(r.periodFinish > 0, 'Unknown reward token');
            IERC20(token).safeTransferFrom(msg.sender, address(this), _amounts[i]);
            uint unseen = IERC20(token).balanceOf(address(this)) - r.balance;
            _notifyReward(token, unseen, _rewardsDuration);
            r.balance += unseen;
        }
    }

    /** INTERNAL FUNCTIONS **/

    function _getReward(address[] memory _rewardTokens) internal {
        uint length = _rewardTokens.length;
        for (uint i; i < length; i++) {
            address token = _rewardTokens[i];
            uint reward = rewards[msg.sender][token] / 1e12;
            Reward storage r = rewardData[token];
            // This is only called after _updateReward() which check below require():
            // require(r.periodFinish > 0, 'Unknown reward token');
            r.balance -= reward;
            if (reward == 0) continue;
            rewards[msg.sender][token] = 0;
            IERC20(token).safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, token, reward);
        }
    }

    function _rewardPerToken(address _rewardsToken, uint _supply) internal view returns (uint) {
        if (_supply == 0) {
            return rewardData[_rewardsToken].rewardPerTokenStored;
        }
        return
            rewardData[_rewardsToken].rewardPerTokenStored +
            (((lastTimeRewardApplicable(_rewardsToken) - rewardData[_rewardsToken].lastUpdateTime) *
                rewardData[_rewardsToken].rewardRate *
                1e18) / _supply);
    }

    function _earned(
        address _user,
        address _rewardsToken,
        uint _balance,
        uint _currentRewardPerToken
    ) internal view returns (uint) {
        return
            ((_balance * (_currentRewardPerToken - userRewardPerTokenPaid[_user][_rewardsToken])) / 1e18) +
            rewards[_user][_rewardsToken];
    }

    function _addReward(address _rewardToken) internal {
        require(rewardData[_rewardToken].lastUpdateTime == 0);
        rewardTokens.push(_rewardToken);
        rewardData[_rewardToken].lastUpdateTime = block.timestamp;
        rewardData[_rewardToken].periodFinish = block.timestamp;
    }

    function _notifyReward(address _rewardsToken, uint _reward, uint _rewardsDuration) internal {
        Reward storage r = rewardData[_rewardsToken];
        if (block.timestamp >= r.periodFinish) {
            r.rewardRate = (_reward * 1e12) / _rewardsDuration;
        } else {
            uint remaining = r.periodFinish - block.timestamp;
            uint leftover = (remaining * r.rewardRate) / 1e12;
            r.rewardRate = ((_reward + leftover) * 1e12) / _rewardsDuration;
        }
        r.lastUpdateTime = block.timestamp;
        r.periodFinish = block.timestamp + _rewardsDuration;
    }

    function _updateReward(address _account, address[] memory _rewardTokens) internal {
        uint length = _rewardTokens.length;
        for (uint i = 0; i < length; i++) {
            address token = _rewardTokens[i];
            Reward storage r = rewardData[token];
            require(r.periodFinish > 0, 'Unknown reward token');
            uint rpt = _rewardPerToken(token, totalLiquidity);
            r.rewardPerTokenStored = rpt;
            r.lastUpdateTime = lastTimeRewardApplicable(token);
            if (_account != address(this)) {
                rewards[_account][token] = _earned(_account, token, userLiquidity[_account], rpt);
                userRewardPerTokenPaid[_account][token] = rpt;
            }
        }
    }
}
