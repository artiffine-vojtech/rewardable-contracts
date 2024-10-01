// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import '@openzeppelin/contracts-4.8.3/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts-4.8.3/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts-4.8.3/utils/math/SafeMath.sol';
import '@openzeppelin/contracts-4.8.3/access/Ownable.sol';
import './interfaces/ITokenProxy.sol';
import './interfaces/ITokenEmissionsController.sol';

/// @title TokenProxy
/// @notice Token proxy for deposit/withdrawing tokens to/from single-staked incentive controller
contract TokenProxy is ERC20, Ownable, ITokenProxy {
    using SafeERC20 for IERC20;
    ITokenEmissionsController public controller;
    IERC20 public immutable proxiedToken;

    constructor(string memory _name, string memory _symbol, address _token) ERC20(_name, _symbol) {
        proxiedToken = IERC20(_token);
    }

    /**
     *
     * @inheritdoc ITokenProxy
     */
    function deposit(uint _amount, ITokenEmissionsController.LockTime _lock) external {
        proxiedToken.safeTransferFrom(msg.sender, address(this), _amount);
        _mint(address(this), _amount);
        _approve(address(this), address(controller), _amount);
        controller.deposit(_amount, msg.sender, _lock);
    }

    /**
     *
     * @inheritdoc ITokenProxy
     */
    function withdraw(uint _amount) external {
        controller.withdraw(_amount, msg.sender);
        _burn(address(this), _amount);
        proxiedToken.safeTransfer(msg.sender, _amount);
    }

    /// @notice Set the controller for the proxy (callable only once)
    function setController(address _controller) external onlyOwner {
        require(address(controller) == address(0), 'Already initialized');
        controller = ITokenEmissionsController(_controller);
    }
}
