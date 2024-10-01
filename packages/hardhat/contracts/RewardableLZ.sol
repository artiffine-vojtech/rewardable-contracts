// contracts/RewardableLZ.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {OFT} from '@layerzerolabs/oft-evm/contracts/OFT.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {ERC20Burnable} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import {ERC20Permit} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';

contract RewardableLZ is OFT, ERC20Permit, ERC20Burnable {
    constructor(
        uint256 initialSupply,
        address lzEndpoint
    ) OFT('Rewardable', 'REWARD', lzEndpoint, msg.sender) ERC20Permit('Rewardable') Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
}
