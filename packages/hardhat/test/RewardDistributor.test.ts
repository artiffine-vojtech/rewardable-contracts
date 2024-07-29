import { ethers, upgrades } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'

import {
  Rewardable,
  RewardDistributorMock,
  RewardDistributorV1,
} from '../../hardhat-types/src'
import { parseEther } from 'ethers/lib/utils'
import { getUserVerificationData, signPermit } from '../utils/signature-utils'

describe('RewardDistributorV1', function () {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3, admin, feeReceiver] =
      await ethers.getSigners()

    // Deploy Reward Token
    const Reward = await ethers.getContractFactory('Rewardable')
    const reward = (await Reward.deploy(parseEther('1000000'))) as Rewardable
    await reward.deployed()

    // Deploy RewardDistributor
    const RewardDistributor = await ethers.getContractFactory(
      'RewardDistributorV1'
    )
    const rewardDistributor = (await upgrades.deployProxy(
      RewardDistributor,
      [
        owner.address,
        reward.address,
        admin.address,
        feeReceiver.address,
        5e3, // burn fee = 50% of platform fee
        5e2, // platform fee = 5% of rewards
        5e2, // max daily withdrawal = 5% of rewards balance
        parseEther('2'),
      ],
      { kind: 'uups' }
    )) as RewardDistributorV1
    await rewardDistributor.deployed()

    await reward.transfer(user.address, parseEther('1000'))
    await reward.transfer(user2.address, parseEther('1000'))
    await reward.transfer(user3.address, parseEther('1000'))

    return {
      // contracts
      RewardDistributor,
      reward,
      rewardDistributor,
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
      RewardDistributor,
      reward,
      rewardDistributor,
      // accounts
      owner,
      user,
      user2,
      user3,
      admin,
      feeReceiver,
    } = await loadFixture(deployContractFixture)
    await reward
      .connect(user)
      .approve(rewardDistributor.address, parseEther('100'))
    await rewardDistributor
      .connect(user)
      .createTask(parseEther('100'), user.address)
    return {
      RewardDistributor,
      reward,
      rewardDistributor,
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
      const { rewardDistributor } = await loadFixture(deployContractFixture)
      console.log(
        'Gas used for deployment',
        (await rewardDistributor.deployTransaction.wait()).gasUsed.toNumber()
      )
    })
  })

  describe('Initialize', async () => {
    it('Should revert when burn fee is > 100%', async () => {
      const { RewardDistributor, owner, reward, admin, feeReceiver } =
        await loadFixture(deployContractFixture)
      try {
        await upgrades.deployProxy(
          RewardDistributor,
          [
            owner.address,
            reward.address,
            admin.address,
            feeReceiver.address,
            1e4 + 1,
            1e4,
            1e4,
            parseEther('10'),
          ],
          { kind: 'uups' }
        )
      } catch (error) {
        expect((error as Error).message).to.contain(
          `reason="VM Exception while processing transaction: reverted with reason string '_burnFee > 1e4'"`
        )
      }
    })

    it('Should revert when platform fee is > 100%', async () => {
      const { RewardDistributor, owner, reward, admin, feeReceiver } =
        await loadFixture(deployContractFixture)
      try {
        await upgrades.deployProxy(
          RewardDistributor,
          [
            owner.address,
            reward.address,
            admin.address,
            feeReceiver.address,
            1e4,
            1e4 + 1,
            1e4,
            parseEther('10'),
          ],
          { kind: 'uups' }
        )
      } catch (error) {
        expect((error as Error).message).to.contain(
          `reason="VM Exception while processing transaction: reverted with reason string '_platformFee > 1e4'"`
        )
      }
    })

    it('Should revert when max daily withdrawal is > 100%', async () => {
      const { RewardDistributor, owner, reward, admin, feeReceiver } =
        await loadFixture(deployContractFixture)
      try {
        await upgrades.deployProxy(
          RewardDistributor,
          [
            owner.address,
            reward.address,
            admin.address,
            feeReceiver.address,
            1e4,
            1e4,
            1e4 + 1,
            parseEther('10'),
          ],
          { kind: 'uups' }
        )
      } catch (error) {
        expect((error as Error).message).to.contain(
          `reason="VM Exception while processing transaction: reverted with reason string '_maxDailyWithdrawal > 1e4'"`
        )
      }
    })

    it('Should set owner correctly', async () => {
      const { rewardDistributor, owner } = await loadFixture(
        deployContractFixture
      )
      expect(await rewardDistributor.owner()).to.equal(owner.address)
    })

    it('Should set reward token correctly', async () => {
      const { rewardDistributor, reward } = await loadFixture(
        deployContractFixture
      )
      expect(await rewardDistributor.rewardToken()).to.equal(reward.address)
    })

    it('Should set token admin correctly', async () => {
      const { rewardDistributor, admin } = await loadFixture(
        deployContractFixture
      )
      expect(await rewardDistributor.tokenAdmin()).to.equal(admin.address)
    })

    it('Should set fee receiver correctly', async () => {
      const { rewardDistributor, feeReceiver } = await loadFixture(
        deployContractFixture
      )
      expect(await rewardDistributor.feeReceiver()).to.equal(
        feeReceiver.address
      )
    })

    it('Should set burn fee correctly', async () => {
      const { rewardDistributor } = await loadFixture(deployContractFixture)
      expect(await rewardDistributor.burnFee()).to.equal(5e3)
    })

    it('Should set platform fee correctly', async () => {
      const { rewardDistributor } = await loadFixture(deployContractFixture)
      expect(await rewardDistributor.platformFee()).to.equal(5e2)
    })

    it('Should set max daily withdrawal correctly', async () => {
      const { rewardDistributor } = await loadFixture(deployContractFixture)
      expect(await rewardDistributor.maxDailyWithdrawal()).to.equal(5e2)
    })

    it('Should set min withdrawal amount correctly', async () => {
      const { rewardDistributor } = await loadFixture(deployContractFixture)
      expect(await rewardDistributor.maxDailyWithdrawal()).to.equal(5e2)
    })
  })

  describe('CreateTask', async () => {
    it('Should revert if amount is 0', async () => {
      const { rewardDistributor, user } = await loadFixture(
        deployContractFixture
      )
      let action = rewardDistributor.connect(user).createTask(0, user.address)
      await expect(action).to.be.revertedWith('_rewardAmount = 0')
    })

    it('Should revert if allowance is too low', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixture
      )
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      let action = rewardDistributor
        .connect(user)
        .createTask(parseEther('1').add(1), user.address)
      await expect(action).to.be.revertedWith('ERC20InsufficientAllowance')
    })

    it('Should transfer tokens correctly', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixture
      )
      const userBalanceBefore = await reward.balanceOf(user.address)
      const distributorBalanceBefore = await reward.balanceOf(
        rewardDistributor.address
      )
      const feeReceiverBalanceBefore = await reward.balanceOf(
        rewardDistributor.feeReceiver()
      )
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      await rewardDistributor
        .connect(user)
        .createTask(parseEther('1'), user.address)
      expect(await reward.balanceOf(user.address)).to.equal(
        userBalanceBefore.sub(parseEther('1'))
      )
      expect(await reward.balanceOf(rewardDistributor.address)).to.equal(
        distributorBalanceBefore.add(parseEther('1').sub(parseEther('0.05')))
      )
      expect(await reward.balanceOf(rewardDistributor.feeReceiver())).to.equal(
        feeReceiverBalanceBefore.add(parseEther('0.025'))
      )
    })

    it('Should burn fees correctly', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixture
      )
      const totalSupply = await reward.totalSupply()
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      await rewardDistributor
        .connect(user)
        .createTask(parseEther('1'), user.address)
      expect(await reward.totalSupply()).to.equal(
        totalSupply.sub(parseEther('0.025'))
      )
    })

    it('Should update state correctly', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixture
      )
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      await rewardDistributor
        .connect(user)
        .createTask(parseEther('1'), user.address)
      expect(await rewardDistributor.taskRewards(0)).to.equal(
        parseEther('0.95')
      )
    })

    it('Should emit correct event', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixture
      )
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      const action = rewardDistributor
        .connect(user)
        .createTask(parseEther('1'), user.address)
      await expect(action)
        .to.emit(rewardDistributor, 'TaskCreated')
        .withArgs(0, parseEther('0.95'), user.address)
    })

    it('Should emit correct event on consecutive calls', async () => {
      const { rewardDistributor, reward, user, user2, user3 } =
        await loadFixture(deployContractFixture)
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      const action = rewardDistributor
        .connect(user)
        .createTask(parseEther('1'), user.address)
      await expect(action)
        .to.emit(rewardDistributor, 'TaskCreated')
        .withArgs(0, parseEther('0.95'), user.address)
      await reward
        .connect(user3)
        .approve(rewardDistributor.address, parseEther('1'))
      const action2 = rewardDistributor
        .connect(user2)
        .createTask(parseEther('1'), user3.address)
      await expect(action2)
        .to.emit(rewardDistributor, 'TaskCreated')
        .withArgs(1, parseEther('0.95'), user3.address)
    })

    describe('WithPermit', async () => {
      it('Should revert if amount is 0', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )
        let action = rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        await expect(action).to.be.revertedWith('_rewardAmount = 0')
      })

      it('Should revert if allowance is too low', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )
        let action = rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1').add(1),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        await expect(action).to.be.revertedWith('ERC20InsufficientAllowance')
      })

      it('Should transfer tokens correctly', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixture
        )
        const userBalanceBefore = await reward.balanceOf(user.address)
        const distributorBalanceBefore = await reward.balanceOf(
          rewardDistributor.address
        )
        const feeReceiverBalanceBefore = await reward.balanceOf(
          rewardDistributor.feeReceiver()
        )

        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        expect(await reward.balanceOf(user.address)).to.equal(
          userBalanceBefore.sub(parseEther('1'))
        )
        expect(await reward.balanceOf(rewardDistributor.address)).to.equal(
          distributorBalanceBefore.add(parseEther('1').sub(parseEther('0.05')))
        )
        expect(
          await reward.balanceOf(rewardDistributor.feeReceiver())
        ).to.equal(feeReceiverBalanceBefore.add(parseEther('0.025')))
      })

      it('Should burn fees correctly', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixture
        )
        const totalSupply = await reward.totalSupply()
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        expect(await reward.totalSupply()).to.equal(
          totalSupply.sub(parseEther('0.025'))
        )
      })

      it('Should update state correctly', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        expect(await rewardDistributor.taskRewards(0)).to.equal(
          parseEther('0.95')
        )
      })

      it('Should emit correct event', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        const action = rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        await expect(action)
          .to.emit(rewardDistributor, 'TaskCreated')
          .withArgs(0, parseEther('0.95'), user.address)
      })

      it('Should emit correct event on consecutive calls', async () => {
        const { rewardDistributor, reward, user, user2, user3 } =
          await loadFixture(deployContractFixture)
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        const action = rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        await expect(action)
          .to.emit(rewardDistributor, 'TaskCreated')
          .withArgs(0, parseEther('0.95'), user.address)

        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400

        let permit2 = await signPermit(
          reward,
          user3,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        const action2 = rewardDistributor
          .connect(user2)
          .createTaskWithPermit(
            parseEther('1'),
            user3.address,
            permit2.value,
            permit2.deadline,
            permit2.v,
            permit2.r,
            permit2.s
          )

        await expect(action2)
          .to.emit(rewardDistributor, 'TaskCreated')
          .withArgs(1, parseEther('0.95'), user3.address)
      })
    })
  })

  describe('TopUpTask', async () => {
    it('Should revert if task does not exist', async () => {
      const { rewardDistributor, user } = await loadFixture(
        deployContractFixture
      )
      let action = rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1'), 0, user.address)
      await expect(action).to.be.revertedWith('Task does not exist')
    })

    it('Should revert if top up amount is zero', async () => {
      const { rewardDistributor, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      let action = rewardDistributor.connect(user).topUpTask(0, 0, user.address)
      await expect(action).to.be.revertedWith('Top up amount is 0')
    })

    it('Should revert if allowance is too low', async () => {
      const { rewardDistributor, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      let action = rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1'), 0, user.address)
      await expect(action).to.be.revertedWith('ERC20InsufficientAllowance')
    })

    it('Should transfer tokens correctly', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const userBalanceBefore = await reward.balanceOf(user.address)
      const feeReceiverBalanceBefore = await reward.balanceOf(
        rewardDistributor.feeReceiver()
      )
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      await rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1'), 0, user.address)
      expect(await reward.balanceOf(rewardDistributor.address)).to.equal(
        parseEther('95.95')
      )
      expect(await reward.balanceOf(user.address)).to.equal(
        userBalanceBefore.sub(parseEther('1'))
      )
      expect(await reward.balanceOf(rewardDistributor.feeReceiver())).to.equal(
        feeReceiverBalanceBefore.add(parseEther('0.025'))
      )
    })

    it('Should burn fees correctly', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const totalSupply = await reward.totalSupply()
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      await rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1'), 0, user.address)
      expect(await reward.totalSupply()).to.equal(
        totalSupply.sub(parseEther('0.025'))
      )
    })

    it('Should update state correctly', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      await rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1'), 0, user.address)
      expect(await rewardDistributor.taskRewards(0)).to.equal(
        parseEther('95.95')
      )
    })

    it('Should emit correct event', async () => {
      const { rewardDistributor, reward, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      await reward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      const action = rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1'), 0, user.address)
      await expect(action)
        .to.emit(rewardDistributor, 'TaskToppedUp')
        .withArgs(0, parseEther('0.95'), user.address)
    })

    describe('WithPermit', async () => {
      it('Should revert if task does not exist', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        let action = rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1'),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        await expect(action).to.be.revertedWith('Task does not exist')
      })

      it('Should revert if top up amount is zero', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        let action = rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            0,
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        await expect(action).to.be.revertedWith('Top up amount is 0')
      })

      it('Should revert if allowance is too low', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        let action = rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1').add(1),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        await expect(action).to.be.revertedWith('ERC20InsufficientAllowance')
      })

      it('Should transfer tokens correctly', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        const userBalanceBefore = await reward.balanceOf(user.address)
        const feeReceiverBalanceBefore = await reward.balanceOf(
          rewardDistributor.feeReceiver()
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1'),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        expect(await reward.balanceOf(rewardDistributor.address)).to.equal(
          parseEther('95.95')
        )
        expect(await reward.balanceOf(user.address)).to.equal(
          userBalanceBefore.sub(parseEther('1'))
        )
        expect(
          await reward.balanceOf(rewardDistributor.feeReceiver())
        ).to.equal(feeReceiverBalanceBefore.add(parseEther('0.025')))
      })

      it('Should burn fees correctly', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        const totalSupply = await reward.totalSupply()
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1'),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        expect(await reward.totalSupply()).to.equal(
          totalSupply.sub(parseEther('0.025'))
        )
      })

      it('Should update state correctly', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1'),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        expect(await rewardDistributor.taskRewards(0)).to.equal(
          parseEther('95.95')
        )
      })

      it('Should emit correct event', async () => {
        const { rewardDistributor, reward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          reward,
          user,
          rewardDistributor.address,
          parseEther('1'),
          timestamp
        )

        let action = rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1'),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        await expect(action)
          .to.emit(rewardDistributor, 'TaskToppedUp')
          .withArgs(0, parseEther('0.95'), user.address)
      })
    })
  })

  describe('WithdrawRewards', async () => {
    it('Should revert if message differs from expected', async () => {
      const { rewardDistributor, user, user2, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user2.address,
        parseEther('10'),
        admin
      )

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof)

      await expect(action).to.be.revertedWith('Invalid proof of rewards')
    })

    it('Should revert if message is signed by wrong signer', async () => {
      const { rewardDistributor, user, user2 } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('10'),
        user2
      )

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof)

      await expect(action).to.be.revertedWith('Invalid proof signer')
    })

    it('Should revert if amount is < min withdrawal amount', async () => {
      const { rewardDistributor, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('10'),
        admin
      )

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('1'), signedProof)

      await expect(action).to.be.revertedWith('Amount < min withdrawal amount')
    })

    it('Should revert if amount exceeds claimable', async () => {
      const { rewardDistributor, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('5'),
        admin
      )

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('5').add(1), signedProof)

      await expect(action).to.be.revertedWith('Amount exceeds max to withdraw')
    })

    it('Should revert if amount exceeds claimable after many claims', async () => {
      const { rewardDistributor, reward, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('4'),
        admin
      )

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof)

      await expect(action).not.to.be.reverted

      let action2 = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2').add(1), signedProof)
      await expect(action2).to.be.revertedWith('Amount exceeds max to withdraw')
    })

    it('Should revert if amount exceeds claimable after many different claims', async () => {
      const { rewardDistributor, reward, owner, user, admin } =
        await loadFixture(deployContractFixtureWithOneTask)

      await rewardDistributor.connect(owner).setMaxDailyWithdrawal(1e3)

      const signedProof1 = await getUserVerificationData(
        user.address,
        parseEther('4'),
        admin
      )

      const signedProof2 = await getUserVerificationData(
        user.address,
        parseEther('6'),
        admin
      )

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof2)

      await expect(action).not.to.be.reverted

      let action2 = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof1)

      await expect(action2).not.to.be.reverted

      let action3 = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof1)
      await expect(action3).to.be.revertedWith('Amount exceeds max to withdraw')

      let action4 = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof2)
      await expect(action4).not.to.be.reverted

      let action5 = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof2)
      await expect(action5).to.be.revertedWith('Amount exceeds max to withdraw')
    })

    it('Should not revert if daily withdrawal amount was exceeded one day before', async () => {
      const { rewardDistributor, reward, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('10'),
        admin
      )

      var timestamp = (await ethers.provider.getBlock('latest')).timestamp
      var nextDay = timestamp + 86400

      // Should not revert
      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('4.75'), signedProof)
      await expect(action).not.to.be.reverted

      let balanceOfDistributor = await reward.balanceOf(
        rewardDistributor.address
      )
      let availableToWithdraw = balanceOfDistributor.mul(5).div(100)

      // Same day should revert
      let action2 = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, availableToWithdraw, signedProof)

      await expect(action2).to.be.revertedWith(
        'Daily withdrawal limit exceeded'
      )

      // Next day should not revert
      await ethers.provider.send('evm_setNextBlockTimestamp', [nextDay])
      let action3 = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, availableToWithdraw, signedProof)

      await expect(action3).not.to.be.reverted
    })

    it('Should update state correctly', async () => {
      const { rewardDistributor, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('2'),
        admin
      )

      const withdrawBefore = await rewardDistributor.withdrawnRewards(
        user.address
      )

      await rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof)

      expect(await rewardDistributor.withdrawnRewards(user.address)).to.be.eq(
        withdrawBefore.add(parseEther('2'))
      )
    })

    it('Should transfer tokens correctly', async () => {
      const { rewardDistributor, reward, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('2'),
        admin
      )

      const userBalanceBefore = await reward.balanceOf(user.address)
      const distributorBalanceBefore = await reward.balanceOf(
        rewardDistributor.address
      )

      await rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof)

      expect(await reward.balanceOf(user.address)).to.be.eq(
        userBalanceBefore.add(parseEther('2'))
      )
      expect(await reward.balanceOf(rewardDistributor.address)).to.be.eq(
        distributorBalanceBefore.sub(parseEther('2'))
      )
    })

    it('Should emit event correctly', async () => {
      const { rewardDistributor, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('10'),
        admin
      )

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof)

      await expect(action)
        .to.emit(rewardDistributor, 'WithdrawnRewards')
        .withArgs(user.address, parseEther('2'))
    })
  })

  describe('Upgrade', async () => {
    it('Should revert if not owner', async () => {
      const { rewardDistributor, reward, admin, feeReceiver, owner, user } =
        await loadFixture(deployContractFixtureWithOneTask)

      const RewardDistributorMock = await ethers.getContractFactory(
        'RewardDistributorMock'
      )
      const rdMock = await RewardDistributorMock.deploy()
      await rdMock.deployed()
      let action = rewardDistributor
        .connect(user)
        .upgradeToAndCall(rdMock.address, '0x')
      await expect(action).to.be.revertedWith('OwnableUnauthorizedAccount')
    })

    it('Should upgrade correctly not braking things', async () => {
      const { rewardDistributor, reward, admin, feeReceiver, owner, user } =
        await loadFixture(deployContractFixtureWithOneTask)

      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('2'),
        admin
      )

      await rewardDistributor
        .connect(user)
        .withdrawRewards(user.address, parseEther('2'), signedProof)

      const RewardDistributorMock = await ethers.getContractFactory(
        'RewardDistributorMock'
      )
      const rdMock = await RewardDistributorMock.deploy()
      await rdMock.deployed()
      await rewardDistributor
        .connect(owner)
        .upgradeToAndCall(rdMock.address, '0x')
      const v2 = rdMock.attach(
        rewardDistributor.address
      ) as RewardDistributorMock

      // Check if new added variable works
      expect(await v2.test()).to.be.eq(0)
      // Check if state is the same
      expect(await v2.owner()).to.be.eq(owner.address)
      expect(await v2.rewardToken()).to.be.eq(reward.address)
      expect(await v2.tokenAdmin()).to.be.eq(admin.address)
      expect(await v2.feeReceiver()).to.be.eq(feeReceiver.address)
      expect(await v2.burnFee()).to.be.eq(5e3)
      expect(await v2.platformFee()).to.be.eq(5e2)
      expect(await v2.maxDailyWithdrawal()).to.be.eq(5e2)
      expect(await v2.minWithdrawalAmount()).to.be.eq(parseEther('2'))
      expect(await v2.taskRewards(0)).to.be.eq(parseEther('95'))
      expect(await v2.withdrawnRewards(user.address)).to.be.eq(parseEther('2'))

      // Cannot get initliazed twice
      let action = v2.initialize(
        owner.address,
        reward.address,
        admin.address,
        feeReceiver.address,
        5e3, // burn fee = 50% of platform fee
        5e2, // platform fee = 5% of rewards
        5e2, // max daily withdrawal = 5% of rewards balance
        parseEther('2')
      )
      await expect(action).to.be.revertedWith('InvalidInitialization')

      // Check new requirement in setTokenAdmin
      let action2 = v2.setTokenAdmin(ethers.constants.AddressZero)
      await expect(action2).to.be.revertedWith('Token admin is address(0)')

      // Check if new added variable works
      await v2.addToTest()
      expect(await v2.test()).to.be.eq(1)
    })
  })
})
