// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import './ITokenEmissionsController.sol';

/// @title ITokenProxy
/// @notice Proxy for ITokenEmissionsController.
interface ITokenProxy {
    /**
     * @notice Deposit tokens to token controller via proxy
     * @param _amount Amount to deposit
     * @param _lock Lock time for the deposit
     */
    function deposit(uint _amount, ITokenEmissionsController.LockTime _lock) external;

    /**
     * @notice Withdraw tokens from the token controller via proxy
     * @param _amount Amount to withdraw
     */
    function withdraw(uint _amount) external;
}
