// contracts/Rewardable.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {ERC20Burnable} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import {ERC20Permit} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';

contract Rewardable is ERC20Permit, ERC20Burnable {
    constructor(uint256 initialSupply) ERC20('Rewardable', 'REWARD') ERC20Permit('Rewardable') {
        _mint(msg.sender, initialSupply);
    }
}
