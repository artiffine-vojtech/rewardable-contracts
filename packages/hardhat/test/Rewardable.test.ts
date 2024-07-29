import { ethers, upgrades } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'

import { Rewardable } from '../../hardhat-types/src'
import { parseEther } from 'ethers/lib/utils'
import { signPermit } from '../utils/signature-utils'

describe('Rewardable ERC20', function () {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3, admin, feeReceiver] =
      await ethers.getSigners()

    // Deploy Reward Token
    const Reward = await ethers.getContractFactory('Rewardable')
    const reward = (await Reward.deploy(
      parseEther(`${1_000_000_000}`)
    )) as Rewardable
    await reward.deployed()

    return {
      // contracts
      reward,
      // accounts
      owner,
      user,
      user2,
      user3,
      admin,
      feeReceiver,
    }
  }

  async function deployContractFixtureWithOneTask() {
    const {
      // contracts
      reward,
      // accounts
      owner,
      user,
      user2,
      user3,
      admin,
      feeReceiver,
    } = await loadFixture(deployContractFixture)
    return {
      reward,
      // accounts
      owner,
      user,
      user2,
      user3,
      admin,
      feeReceiver,
    }
  }

  describe('Deployment', async () => {
    it('Print out gas needed', async () => {
      const { reward } = await loadFixture(deployContractFixture)
      console.log(
        'Gas used for deployment',
        (await reward.deployTransaction.wait()).gasUsed.toNumber()
      )
    })
  })

  describe('Initialize', async () => {
    it('Should set name correctly', async () => {
      const { reward } = await loadFixture(deployContractFixture)
      expect(await reward.name()).to.equal('Rewardable')
    })

    it('Should set symbol correctly', async () => {
      const { reward } = await loadFixture(deployContractFixture)
      expect(await reward.symbol()).to.equal('REWARD')
    })

    it('Should set decimals correctly', async () => {
      const { reward } = await loadFixture(deployContractFixture)
      expect(await reward.decimals()).to.equal(18)
    })

    it('Should set total supply correctly', async () => {
      const { reward } = await loadFixture(deployContractFixture)
      expect(await reward.totalSupply()).to.equal(
        parseEther(`${1_000_000_000}`)
      )
    })
  })

  describe('Transfer', async () => {
    it('Should transfer tokens correctly', async () => {
      const { reward, owner, user } = await loadFixture(deployContractFixture)
      await reward.transfer(user.address, parseEther(`${100}`))
      expect(await reward.balanceOf(user.address)).to.equal(
        parseEther(`${100}`)
      )
    })
  })

  describe('Transfer with permit', async () => {
    it('Should transfer tokens correctly', async () => {
      const { reward, owner, user } = await loadFixture(deployContractFixture)
      const value = parseEther('1')
      var timestamp =
        (await ethers.provider.getBlock('latest')).timestamp + 86400
      let permit = await signPermit(
        reward,
        owner,
        user.address,
        value,
        timestamp
      )

      const res = await reward.permit(
        permit.owner,
        permit.spender,
        permit.value,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s
      )

      const action = reward
        .connect(user)
        .transferFrom(owner.address, user.address, value.add(1))

      await expect(action).to.be.revertedWith('ERC20InsufficientAllowance')
    })

    it('Should transfer tokens correctly', async () => {
      const { reward, owner, user } = await loadFixture(deployContractFixture)
      const value = parseEther('1')
      var timestamp =
        (await ethers.provider.getBlock('latest')).timestamp + 86400
      let permit = await signPermit(
        reward,
        owner,
        user.address,
        value,
        timestamp
      )

      const res = await reward.permit(
        permit.owner,
        permit.spender,
        permit.value,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s
      )

      const action = reward
        .connect(user)
        .transferFrom(owner.address, user.address, value)

      await expect(action).not.to.be.reverted

      expect(await reward.balanceOf(user.address)).to.equal(value)
    })
  })
})
