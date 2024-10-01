// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import './ITokenControllerCommons.sol';

/// @title ITokenEmissionsController
/// @notice Interface for staking contract with multiple token rewards, with single emissions reward.
interface ITokenEmissionsController is ITokenControllerCommons {
    /**
     * Deposit staking tokens.
     * @param _amount Amount of staking token to deposit.
     * @param _lock Lock time for the deposit.
     */
    function deposit(uint _amount, address _onBehalfOf, LockTime _lock) external;

    /**
     * @notice Start token emissions.
     * @param _emissions Array of emissions (durations and amounts).
     */
    function startEmissions(EmissionPoint[] memory _emissions) external;
}
