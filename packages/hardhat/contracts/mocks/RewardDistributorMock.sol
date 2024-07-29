// contracts/RewardDistributorV1.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ECDSA} from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import {IERC20, SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IERC20Permit} from '@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol';
import {ERC20Burnable} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {Initializable} from '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol';

/**
 * @title RewardDistributorV1
 * @notice Contract for distributing rewards to users.
 * Users can create tasks and top up existing tasks with rewards.
 * Task completion logic is computed off-chain.
 */
contract RewardDistributorMock is UUPSUpgradeable, OwnableUpgradeable {
    using ECDSA for bytes32;
    using SafeERC20 for IERC20;

    /***** STATE *****/

    /// @notice Address of the reward token.
    IERC20 public rewardToken;

    /// @notice Address that signes data for withdrawals;
    address public tokenAdmin;

    /// @notice Address that receives fees after token burn.
    address public feeReceiver;

    /// @notice Reward token burn fee in basis points.
    uint public burnFee;

    /// @notice Reward token platform fee in basis points.
    uint public platformFee;

    /// @notice Maximum daily reward token withdrawal in basis points.
    uint public maxDailyWithdrawal;

    /// @notice Minimum reward token amount needed for withdrawal.
    uint public minWithdrawalAmount;

    /// @notice Total amount of claimed rewards per user.
    mapping(address => uint) public withdrawnRewards;

    /// @notice Total amount of deposited rewards for the task.
    uint[] public taskRewards;

    /// @dev Last withdrawal timestamp.
    uint private lastWithdrawalDay;

    /// @dev Total amount of withdrawn rewards today.
    uint private withdrawnToday;

    /// @dev TEST.
    uint public test;

    /***** EVENTS *****/

    event TokenAdminSet(address indexed tokenAdmin);
    event FeeReceiverSet(address indexed feeReceiver);
    event BurnFeeSet(uint indexed burnFee);
    event PlatformFeeSet(uint indexed platformFee);
    event MaxDailyWithdrawalSet(uint indexed maxDailyWithdrawal);
    event TaskCreated(uint indexed id, uint indexed rewardAmount, address indexed sponsor);
    event TaskToppedUp(uint indexed id, uint indexed rewardAmount, address indexed sponsor);
    event ProcessedFees(uint indexed platformFee, uint indexed burnAmount);
    event WithdrawnRewards(address indexed identity, uint indexed amount);

    /***** INITILIAZERS *****/

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Proxy constructor: initializes the contract.
     * @param _rewardToken Address of the reward token.
     * @param _owner Address of the owner.
     */
    function initialize(
        address _owner,
        address _rewardToken,
        address _tokenAdmin,
        address _feeReceiver,
        uint _burnFee,
        uint _platformFee,
        uint _maxDailyWithdrawal,
        uint _minWithdrawalAmount
    ) public initializer {
        require(_burnFee <= 1e4, '_burnFee > 1e4');
        require(_platformFee <= 1e4, '_platformFee > 1e4');
        require(_maxDailyWithdrawal <= 1e4, '_maxDailyWithdrawal > 1e4');
        __Ownable_init(_owner);
        rewardToken = IERC20(_rewardToken);
        tokenAdmin = _tokenAdmin;
        feeReceiver = _feeReceiver;
        burnFee = _burnFee;
        platformFee = _platformFee;
        maxDailyWithdrawal = _maxDailyWithdrawal;
        minWithdrawalAmount = _minWithdrawalAmount;
        lastWithdrawalDay = block.timestamp / 1 days;
        withdrawnToday = 0;
        test = _burnFee + _platformFee;
    }

    /***** EXTERNAL *****/

    function createTaskWithPermit(
        uint _rewardAmount,
        address _sponsor,
        uint256 _value,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external returns (uint id) {
        try IERC20Permit(address(rewardToken)).permit(_sponsor, address(this), _value, _deadline, _v, _r, _s) {} catch {}
        return createTask(_rewardAmount, _sponsor);
    }

    function createTask(uint _rewardAmount, address _sponsor) public returns (uint id) {
        require(_rewardAmount > 0, '_rewardAmount = 0');
        rewardToken.safeTransferFrom(_sponsor, address(this), _rewardAmount);
        uint amountAfterFees = _processFees(_rewardAmount);
        taskRewards.push(amountAfterFees);
        id = taskRewards.length - 1;
        emit TaskCreated(id, amountAfterFees, _sponsor);
    }

    function topUpTaskWithPermit(
        uint _rewardAmount,
        uint _id,
        address _sponsor,
        uint256 _value,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external {
        try IERC20Permit(address(rewardToken)).permit(_sponsor, address(this), _value, _deadline, _v, _r, _s) {} catch {}
        topUpTask(_rewardAmount, _id, _sponsor);
    }

    function topUpTask(uint _rewardAmount, uint _id, address _sponsor) public {
        require(_rewardAmount > 0, 'Top up amount is 0');
        require(taskRewards.length > _id, 'Task does not exist');
        rewardToken.safeTransferFrom(_sponsor, address(this), _rewardAmount);
        uint amountAfterFees = _processFees(_rewardAmount);
        taskRewards[_id] += amountAfterFees;
        emit TaskToppedUp(_id, amountAfterFees, _sponsor);
    }

    function withdrawRewards(address _identity, uint _amount, bytes calldata _data) external {
        // Validate proof of withdrawal
        (uint totalAmount, bytes32 message, bytes memory signature) = abi.decode(_data, (uint, bytes32, bytes));
        bytes32 expectedMessage = keccak256(abi.encodePacked('\x19Ethereum Signed Message:\n52', _identity, totalAmount));
        require(message == expectedMessage, 'Invalid proof of rewards');
        require(message.recover(signature) == tokenAdmin, 'Invalid proof signer');
        require(_amount >= minWithdrawalAmount, 'Amount < min withdrawal amount');
        require(withdrawnRewards[_identity] + _amount <= totalAmount, 'Amount exceeds max to withdraw');

        // Validate daily withdrawal limit
        uint currentDay = block.timestamp / 1 days;
        if (currentDay > lastWithdrawalDay) {
            lastWithdrawalDay = currentDay;
            withdrawnToday = 0;
        }
        uint balanceOfRewards = rewardToken.balanceOf(address(this));
        require(withdrawnToday + _amount <= (balanceOfRewards * maxDailyWithdrawal) / 1e4, 'Daily withdrawal limit exceeded');
        withdrawnToday += _amount;

        // Send out rewards
        withdrawnRewards[_identity] += _amount;
        rewardToken.safeTransfer(_identity, _amount);
        emit WithdrawnRewards(_identity, _amount);
    }

    /***** OWNER *****/

    function setTokenAdmin(address _tokenAdmin) external onlyOwner {
        require(_tokenAdmin != address(0), 'Token admin is address(0)');
        tokenAdmin = _tokenAdmin;
        emit TokenAdminSet(_tokenAdmin);
    }

    function setFeeReceiver(address _feeReceiver) external onlyOwner {
        feeReceiver = _feeReceiver;
        emit FeeReceiverSet(_feeReceiver);
    }

    function setBurnFee(uint _burnFee) external onlyOwner {
        require(_burnFee <= 1e4, 'Exceeds 100%');
        burnFee = _burnFee;
        emit BurnFeeSet(_burnFee);
    }

    function setPlatformFee(uint _platformFee) external onlyOwner {
        require(_platformFee <= 1e4, 'Exceeds 100%');
        platformFee = _platformFee;
        emit PlatformFeeSet(_platformFee);
    }

    function setMaxDailyWithdrawal(uint _maxDailyWithdrawal) external onlyOwner {
        require(_maxDailyWithdrawal <= 1e4, 'Exceeds 100%');
        maxDailyWithdrawal = _maxDailyWithdrawal;
        emit MaxDailyWithdrawalSet(_maxDailyWithdrawal);
    }

    function addToTest() external onlyOwner {
        test += 1;
    }

    /***** INTERNAL *****/

    function _processFees(uint _amount) internal returns (uint amountAfterFees) {
        uint fee = (_amount * platformFee) / 1e4;
        amountAfterFees = _amount - fee;
        uint burnAmount = (fee * burnFee) / 1e4;
        if (burnAmount > 0) ERC20Burnable(address(rewardToken)).burn(burnAmount);
        uint feeToSend = fee - burnAmount;
        if (feeToSend > 0) rewardToken.safeTransfer(feeReceiver, feeToSend);
        emit ProcessedFees(feeToSend, burnAmount);
    }

    /// @dev `onlyOwner` check for UUPS proxy upgrade authorization.
    function _authorizeUpgrade(address) internal override onlyOwner {}
}
