// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import './ITokenControllerCommons.sol';

/// @title IIncentivesController
/// @notice Interface for staking contract with multiple token rewards.
interface ITokenIncentivesController is ITokenControllerCommons {
    /**
     * Deposit staking tokens.
     * @param _amount Amount of staking token to deposit.
     * @param _onBehalfOf Receiver of the staked tokens.
     */
    function deposit(uint _amount, address _onBehalfOf) external;
}
