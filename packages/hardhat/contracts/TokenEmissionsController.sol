// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import '@openzeppelin/contracts-4.8.3/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts-4.8.3/utils/math/SafeMath.sol';
import './interfaces/ITokenEmissionsController.sol';
import './interfaces/INFTWithLevel.sol';
import './utils/Adminable.sol';

/// @title TokenEmissionsController
/// @notice Staking contract with multiple token rewards and one emissioned reward.
contract TokenEmissionsController is ITokenEmissionsController, Adminable {
    using SafeMath for uint;
    using SafeERC20 for IERC20;

    /// @notice List of emission points
    EmissionPoint[] public emissions;
    /// @notice Current emission opint index
    uint256 public currentEmissionsIndex;
    /// @notice Start timestamp of latest emission point
    uint256 public emissionsStart;

    /// @notice Map of user lock times
    mapping(address => uint) public userLockTime;

    /// @notice Period during which new rewards are distributed.
    uint public rewardsDuration;

    /// @notice Amounts of user's accumulated rewards.
    mapping(address => mapping(address => uint)) public rewards;

    /// @notice Info about reward tokens distribution.
    mapping(address => Reward) public rewardData;

    /// @dev User balances.
    mapping(address => Balances) public balances;

    /// @notice Staking token for depositing.
    IERC20 public immutable stakingToken;

    /// @notice Staking token for depositing.
    address public immutable withdrawingAdmin;

    /// @notice NFT collection for boosting rewards.
    INFTWithLevel public immutable boosterNFT;

    /// @notice Array of registered reward tokens.
    address[] public rewardTokens;

    /// @notice Total scaled balances of deposited staking token.
    uint public totalScaled;

    /// @notice Snapshot of user's accounted reward tokens.
    mapping(address => mapping(address => uint)) private userRewardPerTokenPaid;

    constructor(
        IERC20 _stakingToken,
        INFTWithLevel _boosterNFT,
        address _rewardToken,
        address _withdrawingAdmin
    ) Adminable() Ownable(msg.sender) {
        stakingToken = _stakingToken;
        boosterNFT = _boosterNFT;
        _addReward(_rewardToken);
        withdrawingAdmin = _withdrawingAdmin;
    }

    /**
     * @inheritdoc ITokenEmissionsController
     */
    function startEmissions(EmissionPoint[] memory _emissions) external {
        require(emissions.length == 0, 'Emissions already started');
        require(_emissions.length > 0, 'No emissions');
        uint256 length = _emissions.length;
        uint256 emissionsSum;
        for (uint256 i = 0; i < length; i++) {
            require(_emissions[i].duration > 0 && _emissions[i].amount > 0, 'Invalid emission');
            emissionsSum += _emissions[i].amount;
            emissions.push(_emissions[i]);
        }
        emissionsStart = block.timestamp;
        IERC20(rewardTokens[0]).safeTransferFrom(msg.sender, address(this), emissionsSum);
        _setRewardsDuration(emissions[currentEmissionsIndex].duration);
        Reward storage r = rewardData[rewardTokens[0]];
        r.balance = emissions[currentEmissionsIndex].amount;
        _notifyReward(rewardTokens[0], emissions[currentEmissionsIndex].amount, rewardsDuration);
    }

    /** EXTERNAL FUNCTIONS **/

    /**
     * @inheritdoc ITokenEmissionsController
     */
    function deposit(uint _amount, address _onBehalfOf, LockTime _lock) external {
        require(msg.sender == _onBehalfOf || msg.sender == withdrawingAdmin, 'Not withdrawing admin');
        require(_amount > 0, 'Amount is zero');
        _updateReward(_onBehalfOf, rewardTokens);
        Balances storage bal = balances[_onBehalfOf];
        bal.staked = bal.staked.add(_amount);
        bal.lockBoost = (uint256(_lock).mul(5)).add(10);
        bal.lockScaled = bal.staked.mul(bal.lockBoost).div(10);
        uint scaled = bal.lockScaled;
        if (bal.boosted) {
            uint multiplier = _getMultiplier(bal.nftId);
            scaled = scaled.mul(multiplier).div(10);
        }
        totalScaled = totalScaled.sub(bal.scaled).add(scaled);
        bal.scaled = scaled;
        userLockTime[_onBehalfOf] = block.timestamp.add(60 days).add(uint256(_lock).mul(30 days));
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        emit Deposited(_onBehalfOf, _amount, scaled);
    }

    /**
     * @inheritdoc ITokenControllerCommons
     */
    function withdraw(uint _amount, address _onBehalfOf) external {
        require(msg.sender == _onBehalfOf || msg.sender == withdrawingAdmin, 'Not withdrawing admin');
        require(userLockTime[_onBehalfOf] <= block.timestamp, 'Locked');
        Balances storage bal = balances[_onBehalfOf];
        require(_amount <= bal.staked, 'Amount greater than staked');
        _updateReward(_onBehalfOf, rewardTokens);
        if (msg.sender == _onBehalfOf) {
            _getReward(rewardTokens);
        }
        uint scaled = _amount.mul(bal.lockBoost).div(10);
        if (bal.boosted) {
            uint multiplier = _getMultiplier(bal.nftId);
            scaled = scaled.mul(multiplier).div(10);
        }
        if (_amount == bal.staked) {
            scaled = bal.scaled;
            bal.lockBoost = 0;
        }
        bal.staked = bal.staked.sub(_amount);
        bal.lockScaled = bal.staked.mul(bal.lockBoost).div(10);
        bal.scaled = bal.scaled.sub(scaled);
        totalScaled = totalScaled.sub(scaled);
        stakingToken.safeTransfer(msg.sender, _amount);
        emit Withdrawn(_onBehalfOf, _amount, scaled);
    }

    /**
     * @inheritdoc ITokenControllerCommons
     */
    function stakeNFT(uint _tokenId) external {
        // require(msg.sender == boosterNFT.ownerOf(_tokenId), 'Must be NFT owner');
        // _updateReward(msg.sender, rewardTokens);
        // Balances storage bal = balances[msg.sender];
        // require(!bal.boosted, 'Balance already boosted');
        // uint multiplier = _getMultiplier(_tokenId);
        // uint scaled = bal.lockScaled.mul(multiplier).div(10);
        // uint newScaled = scaled - bal.lockScaled;
        // totalScaled = totalScaled.add(newScaled);
        // bal.scaled = bal.scaled.add(newScaled);
        // bal.nftId = _tokenId;
        // bal.boosted = true;
        // boosterNFT.transferFrom(msg.sender, address(this), _tokenId);
        // emit Deposited(msg.sender, 0, newScaled);
    }

    /**
     * @inheritdoc ITokenControllerCommons
     */
    function unstakeNFT() external {
        // _updateReward(msg.sender, rewardTokens);
        // if (userLockTime[msg.sender] <= block.timestamp) {
        //     _getReward(rewardTokens);
        // }
        // Balances storage bal = balances[msg.sender];
        // require(bal.boosted, 'NFT not staked');
        // uint takenOut = bal.scaled - bal.lockScaled;
        // totalScaled = totalScaled.sub(takenOut);
        // bal.scaled = bal.lockScaled;
        // bal.boosted = false;
        // boosterNFT.transferFrom(address(this), msg.sender, bal.nftId);
        // emit Withdrawn(msg.sender, 0, takenOut);
    }

    /**
     * @inheritdoc ITokenControllerCommons
     */
    function getReward(address[] calldata _rewardTokens) external {
        require(userLockTime[msg.sender] <= block.timestamp, 'Locked');
        _updateReward(msg.sender, _rewardTokens);
        _getReward(_rewardTokens);
    }

    /** VIEW FUNCTIONS **/

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
     * @inheritdoc ITokenControllerCommons
     */
    function claimableRewards(address _account) external view returns (RewardData[] memory claimable) {
        claimable = new RewardData[](rewardTokens.length);
        for (uint i = 0; i < claimable.length; i++) {
            claimable[i].token = rewardTokens[i];
            claimable[i].amount = _earned(
                _account,
                claimable[i].token,
                balances[_account].scaled,
                _rewardPerToken(rewardTokens[i], totalScaled)
            ).div(1e12);
        }
        return claimable;
    }

    /** OWNER FUNCTIONS **/

    /**
     * @inheritdoc ITokenControllerCommons
     */
    function addReward(address _rewardToken) external onlyAdmin {
        _addReward(_rewardToken);
    }

    /**
     * Add reward tokens for distribution over next 7 days.
     * @param _rewardTokens Array of addresses of the reward tokens.
     * @param _amounts Array of amounts of rewards tokens.
     */
    function notifyReward(address[] calldata _rewardTokens, uint[] calldata _amounts, uint _rewardsDuration) external onlyAdmin {
        require(_rewardsDuration > 0, 'Duration is zero');
        require(_rewardTokens.length == _amounts.length, 'Invalid input');
        _updateReward(address(this), _rewardTokens);
        uint length = _rewardTokens.length;
        for (uint i; i < length; i++) {
            address token = _rewardTokens[i];
            if (token == rewardTokens[0]) continue;
            Reward storage r = rewardData[token];
            require(r.periodFinish > 0, 'Unknown reward token');
            IERC20(token).safeTransferFrom(msg.sender, address(this), _amounts[i]);
            uint unseen = IERC20(token).balanceOf(address(this)).sub(r.balance);
            _notifyReward(token, unseen, _rewardsDuration);
            r.balance = r.balance.add(unseen);
        }
    }

    /** INTERNAL FUNCTIONS **/

    function _setRewardsDuration(uint256 _newRewardsDuration) internal {
        require(_newRewardsDuration > 0, 'Duration is zero');
        rewardsDuration = _newRewardsDuration;
    }

    function _getReward(address[] memory _rewardTokens) internal {
        uint length = _rewardTokens.length;
        for (uint i; i < length; i++) {
            address token = _rewardTokens[i];
            uint reward = rewards[msg.sender][token].div(1e12);
            Reward storage r = rewardData[token];
            // This is only called after _updateReward() which check below require():
            // require(r.periodFinish > 0, 'Unknown reward token');
            r.balance = r.balance.sub(reward);
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
            rewardData[_rewardsToken].rewardPerTokenStored.add(
                lastTimeRewardApplicable(_rewardsToken)
                    .sub(rewardData[_rewardsToken].lastUpdateTime)
                    .mul(rewardData[_rewardsToken].rewardRate)
                    .mul(1e18)
                    .div(_supply)
            );
    }

    function _earned(
        address _user,
        address _rewardsToken,
        uint _balance,
        uint _currentRewardPerToken
    ) internal view returns (uint) {
        return
            _balance.mul(_currentRewardPerToken.sub(userRewardPerTokenPaid[_user][_rewardsToken])).div(1e18).add(
                rewards[_user][_rewardsToken]
            );
    }

    function _addReward(address _rewardToken) internal {
        require(_rewardToken != address(stakingToken), 'Staking token is not reward');
        require(rewardData[_rewardToken].lastUpdateTime == 0);
        rewardTokens.push(_rewardToken);
        rewardData[_rewardToken].lastUpdateTime = block.timestamp;
        rewardData[_rewardToken].periodFinish = block.timestamp;
    }

    function _notifyReward(address _rewardsToken, uint _reward, uint _rewardsDuration) internal {
        Reward storage r = rewardData[_rewardsToken];
        if (block.timestamp >= r.periodFinish) {
            r.rewardRate = _reward.mul(1e12).div(_rewardsDuration);
        } else {
            uint remaining = r.periodFinish.sub(block.timestamp);
            uint leftover = remaining.mul(r.rewardRate).div(1e12);
            r.rewardRate = _reward.add(leftover).mul(1e12).div(_rewardsDuration);
        }
        r.lastUpdateTime = block.timestamp;
        r.periodFinish = block.timestamp.add(_rewardsDuration);
    }

    function _updateReward(address _account, address[] memory _rewardTokens) internal {
        uint length = _rewardTokens.length;
        for (uint i = 0; i < length; i++) {
            address token = _rewardTokens[i];
            Reward storage r = rewardData[token];
            require(r.periodFinish > 0, 'Unknown reward token');
            uint rpt = _rewardPerToken(token, totalScaled);
            r.rewardPerTokenStored = rpt;
            r.lastUpdateTime = lastTimeRewardApplicable(token);
            if (_account != address(this)) {
                rewards[_account][token] = _earned(_account, token, balances[_account].scaled, rpt);
                userRewardPerTokenPaid[_account][token] = rpt;
            }
            if (token == rewardTokens[0] && emissions.length > 0) {
                EmissionPoint storage e = emissions[currentEmissionsIndex];
                if (block.timestamp >= emissionsStart.add(e.duration)) {
                    currentEmissionsIndex++;
                    if (currentEmissionsIndex < emissions.length) {
                        e = emissions[currentEmissionsIndex];
                        emissionsStart = block.timestamp;
                        r.balance = r.balance.add(e.amount);
                        _setRewardsDuration(e.duration);
                        _notifyReward(token, e.amount, rewardsDuration);
                    }
                }
            }
        }
    }

    /**
     * @notice Get multiplier for the given NFT token.
     * @param _tokenId NFT token id.
     */
    function _getMultiplier(uint256 _tokenId) internal view returns (uint256) {
        uint256 level = boosterNFT.getLevelOfTokenById(_tokenId);

        if (level == 0) {
            // Diamond
            return 15; // 1.5 * SCALING_FACTOR
        } else if (level == 1) {
            // Platinum
            return 14; // 1.4 * SCALING_FACTOR
        } else if (level == 2) {
            // Gold
            return 13; // 1.3 * SCALING_FACTOR
        } else if (level == 3) {
            // Silver
            return 12; // 1.2 * SCALING_FACTOR
        } else if (level == 4) {
            // Bronze
            return 11; // 1.1 * SCALING_FACTOR
        } else {
            revert('Invalid token level');
        }
    }
}
