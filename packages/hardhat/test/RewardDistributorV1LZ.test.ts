import { deployments, ethers, upgrades } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'

import {
  RewardDistributorV1LZ,
  RewardDistributorV1LZMock,
} from '../../hardhat-types/src'
import { parseEther } from 'ethers/lib/utils'
import { getUserVerificationData, signPermit } from '../utils/signature-utils'

import { Options } from '@layerzerolabs/lz-v2-utilities'
import {
  RewardableLZ,
  SendParamStruct,
} from '../../hardhat-types/src/contracts/RewardableLZ'
import { ContractFactory } from 'ethers'
import exp from 'constants'
import { parse } from 'path'

describe('RewardDistributorV1LZ', function () {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3, admin, feeReceiver] =
      await ethers.getSigners()

    const EndpointV2MockArtifact = await deployments.getArtifact(
      'EndpointV2Mock'
    )
    const EndpointV2Mock = new ContractFactory(
      EndpointV2MockArtifact.abi,
      EndpointV2MockArtifact.bytecode,
      owner
    )

    const baseEID = 1
    const polygonEID = 2
    const baseEndpoint = await EndpointV2Mock.deploy(baseEID)
    await baseEndpoint.deployed()
    const polygonEndpoint = await EndpointV2Mock.deploy(polygonEID)
    await polygonEndpoint.deployed()

    // Deploy Reward OFT
    const Reward = await ethers.getContractFactory('RewardableLZ')
    const baseReward = (await Reward.deploy(
      parseEther(`${1_000_000_000}`),
      baseEndpoint.address
    )) as RewardableLZ
    await baseReward.deployed()
    const polygonReward = (await Reward.deploy(
      parseEther(`${0}`),
      polygonEndpoint.address
    )) as RewardableLZ
    await polygonReward.deployed()

    // Set destination endpoints in mock endpoints
    await baseEndpoint.setDestLzEndpoint(
      polygonReward.address,
      polygonEndpoint.address
    )
    await polygonEndpoint.setDestLzEndpoint(
      baseReward.address,
      baseEndpoint.address
    )

    // Set peers
    await baseReward.setPeer(
      polygonEID,
      ethers.utils.zeroPad(polygonReward.address, 32)
    )
    await polygonReward.setPeer(
      baseEID,
      ethers.utils.zeroPad(baseReward.address, 32)
    )

    // Deploy RewardDistributor
    const RewardDistributor = await ethers.getContractFactory(
      'RewardDistributorV1LZ'
    )
    const rewardDistributor = (await upgrades.deployProxy(
      RewardDistributor,
      [
        owner.address,
        baseReward.address,
        admin.address,
        feeReceiver.address,
        5e3, // burn fee = 50% of platform fee
        5e2, // platform fee = 5% of rewards
        5e2, // max daily withdrawal = 5% of rewards balance
        parseEther('2'),
      ],
      { kind: 'uups' }
    )) as RewardDistributorV1LZ
    await rewardDistributor.deployed()

    await baseReward.transfer(user.address, parseEther('1000'))
    await baseReward.transfer(user2.address, parseEther('1000'))
    await baseReward.transfer(user3.address, parseEther('1000'))

    await baseReward.setEnforcedOptions([
      {
        eid: polygonEID,
        msgType: 1,
        options: Options.newOptions()
          .addExecutorLzReceiveOption(65000, 0)
          .toHex()
          .toString(),
      },
    ])

    await polygonReward.setEnforcedOptions([
      {
        eid: baseEID,
        msgType: 1,
        options: Options.newOptions()
          .addExecutorLzReceiveOption(65000, 0)
          .toHex()
          .toString(),
      },
    ])

    return {
      // contracts
      RewardDistributor,
      baseReward,
      polygonReward,
      rewardDistributor,
      // accounts
      owner,
      user,
      user2,
      user3,
      admin,
      feeReceiver,
      // LZ
      baseEID,
      polygonEID,
      baseEndpoint,
      polygonEndpoint,
    }
  }

  async function deployContractFixtureWithOneTask() {
    const {
      // contracts
      RewardDistributor,
      baseReward,
      polygonReward,
      rewardDistributor,
      // accounts
      owner,
      user,
      user2,
      user3,
      admin,
      feeReceiver,
      // LZ
      baseEID,
      polygonEID,
      baseEndpoint,
      polygonEndpoint,
    } = await loadFixture(deployContractFixture)
    await baseReward
      .connect(user)
      .approve(rewardDistributor.address, parseEther('105'))
    await rewardDistributor
      .connect(user)
      .createTask(parseEther('105'), user.address)
    return {
      // contracts
      RewardDistributor,
      baseReward,
      polygonReward,
      rewardDistributor,
      // accounts
      owner,
      user,
      user2,
      user3,
      admin,
      feeReceiver,
      // LZ
      baseEID,
      polygonEID,
      baseEndpoint,
      polygonEndpoint,
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
      const { RewardDistributor, owner, baseReward, admin, feeReceiver } =
        await loadFixture(deployContractFixture)
      try {
        await upgrades.deployProxy(
          RewardDistributor,
          [
            owner.address,
            baseReward.address,
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
      const { RewardDistributor, owner, baseReward, admin, feeReceiver } =
        await loadFixture(deployContractFixture)
      try {
        await upgrades.deployProxy(
          RewardDistributor,
          [
            owner.address,
            baseReward.address,
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
      const { RewardDistributor, owner, baseReward, admin, feeReceiver } =
        await loadFixture(deployContractFixture)
      try {
        await upgrades.deployProxy(
          RewardDistributor,
          [
            owner.address,
            baseReward.address,
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
      const { rewardDistributor, baseReward } = await loadFixture(
        deployContractFixture
      )
      expect(await rewardDistributor.rewardToken()).to.equal(baseReward.address)
    })

    it('Should set chainId correctly', async () => {
      const { rewardDistributor, baseEID } = await loadFixture(
        deployContractFixture
      )
      const lzSendParam = {
        destinationChainId: baseEID,
        addGas: 0,
        addEther: 0,
        topUp: 0,
      }
      const lzSendParamSameChain =
        await rewardDistributor.getSameChainLZSendParam()
      expect(lzSendParamSameChain.destinationChainId).to.equal(
        lzSendParam.destinationChainId
      )
      expect(lzSendParamSameChain.addGas).to.equal(lzSendParam.addGas)
      expect(lzSendParamSameChain.addEther).to.equal(lzSendParam.addEther)
      expect(lzSendParamSameChain.topUp).to.equal(lzSendParam.topUp)
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
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixture
      )
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1'))
      let action = rewardDistributor
        .connect(user)
        .createTask(parseEther('1').add(1), user.address)
      await expect(action).to.be.revertedWith('ERC20InsufficientAllowance')
    })

    it('Should transfer tokens correctly', async () => {
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixture
      )
      const userBalanceBefore = await baseReward.balanceOf(user.address)
      const distributorBalanceBefore = await baseReward.balanceOf(
        rewardDistributor.address
      )
      const feeReceiverBalanceBefore = await baseReward.balanceOf(
        rewardDistributor.feeReceiver()
      )
      const REWARD_AMOUNT = parseEther('1.05')
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, REWARD_AMOUNT)
      await rewardDistributor
        .connect(user)
        .createTask(REWARD_AMOUNT, user.address)
      expect(await baseReward.balanceOf(user.address)).to.equal(
        userBalanceBefore.sub(REWARD_AMOUNT)
      )
      expect(await baseReward.balanceOf(rewardDistributor.address)).to.equal(
        distributorBalanceBefore.add(REWARD_AMOUNT.sub(parseEther('0.025')))
      )
      expect(
        await baseReward.balanceOf(rewardDistributor.feeReceiver())
      ).to.equal(feeReceiverBalanceBefore.add(parseEther('0.025')))
    })

    it('Should burn fees correctly', async () => {
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixture
      )
      const totalSupply = await baseReward.totalSupply()
      const REWARD_AMOUNT = parseEther('1.05')
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, REWARD_AMOUNT)
      await rewardDistributor
        .connect(user)
        .createTask(REWARD_AMOUNT, user.address)
      expect(await baseReward.totalSupply()).to.equal(totalSupply)
    })

    it('Should update state correctly', async () => {
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixture
      )
      const REWARD_AMOUNT = parseEther('1.05')
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, REWARD_AMOUNT)
      await rewardDistributor
        .connect(user)
        .createTask(REWARD_AMOUNT, user.address)
      expect(await rewardDistributor.taskRewards(0)).to.equal(parseEther('1.0'))
    })

    it('Should emit correct event', async () => {
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixture
      )
      const REWARD_AMOUNT = parseEther('1.05')
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, REWARD_AMOUNT)
      const action = rewardDistributor
        .connect(user)
        .createTask(REWARD_AMOUNT, user.address)
      await expect(action)
        .to.emit(rewardDistributor, 'TaskCreated')
        .withArgs(0, parseEther('1.0'), user.address)
    })

    it('Should emit correct event on consecutive calls', async () => {
      const { rewardDistributor, baseReward, user, user2, user3 } =
        await loadFixture(deployContractFixture)
      const REWARD_AMOUNT = parseEther('1.05')
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, REWARD_AMOUNT)
      const action = rewardDistributor
        .connect(user)
        .createTask(REWARD_AMOUNT, user.address)
      await expect(action)
        .to.emit(rewardDistributor, 'TaskCreated')
        .withArgs(0, parseEther('1.0'), user.address)
      const REWARD_AMOUNT_2 = parseEther('2.1')
      await baseReward
        .connect(user3)
        .approve(rewardDistributor.address, REWARD_AMOUNT_2)
      const action2 = rewardDistributor
        .connect(user2)
        .createTask(REWARD_AMOUNT_2, user3.address)
      await expect(action2)
        .to.emit(rewardDistributor, 'TaskCreated')
        .withArgs(1, parseEther('2.0'), user3.address)
    })

    describe('WithPermit', async () => {
      it('Should revert if amount is 0', async () => {
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
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
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
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
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixture
        )
        const userBalanceBefore = await baseReward.balanceOf(user.address)
        const distributorBalanceBefore = await baseReward.balanceOf(
          rewardDistributor.address
        )
        const feeReceiverBalanceBefore = await baseReward.balanceOf(
          rewardDistributor.feeReceiver()
        )

        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1.05'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        expect(await baseReward.balanceOf(user.address)).to.equal(
          userBalanceBefore.sub(parseEther('1.05'))
        )
        expect(await baseReward.balanceOf(rewardDistributor.address)).to.equal(
          distributorBalanceBefore.add(
            parseEther('1.05').sub(parseEther('0.025'))
          )
        )
        expect(
          await baseReward.balanceOf(rewardDistributor.feeReceiver())
        ).to.equal(feeReceiverBalanceBefore.add(parseEther('0.025')))
      })

      it('Should burn fees correctly', async () => {
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixture
        )
        const totalSupply = await baseReward.totalSupply()
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1.05'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        expect(await baseReward.totalSupply()).to.equal(totalSupply)
      })

      it('Should update state correctly', async () => {
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1.05'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        expect(await rewardDistributor.taskRewards(0)).to.equal(
          parseEther('1.0')
        )
      })

      it('Should emit correct event', async () => {
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        const action = rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1.05'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        await expect(action)
          .to.emit(rewardDistributor, 'TaskCreated')
          .withArgs(0, parseEther('1.0'), user.address)
      })

      it('Should emit correct event on consecutive calls', async () => {
        const { rewardDistributor, baseReward, user, user2, user3 } =
          await loadFixture(deployContractFixture)
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        const action = rewardDistributor
          .connect(user)
          .createTaskWithPermit(
            parseEther('1.05'),
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )

        await expect(action)
          .to.emit(rewardDistributor, 'TaskCreated')
          .withArgs(0, parseEther('1.0'), user.address)

        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400

        let permit2 = await signPermit(
          baseReward,
          user3,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        const action2 = rewardDistributor
          .connect(user2)
          .createTaskWithPermit(
            parseEther('1.05'),
            user3.address,
            permit2.value,
            permit2.deadline,
            permit2.v,
            permit2.r,
            permit2.s
          )

        await expect(action2)
          .to.emit(rewardDistributor, 'TaskCreated')
          .withArgs(1, parseEther('1.0'), user3.address)
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
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const userBalanceBefore = await baseReward.balanceOf(user.address)
      const feeReceiverBalanceBefore = await baseReward.balanceOf(
        rewardDistributor.feeReceiver()
      )
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1.05'))
      await rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1.05'), 0, user.address)
      expect(await baseReward.balanceOf(rewardDistributor.address)).to.equal(
        parseEther('101.0').add(parseEther('2.525'))
      )
      expect(await baseReward.balanceOf(user.address)).to.equal(
        userBalanceBefore.sub(parseEther('1.05'))
      )
      expect(
        await baseReward.balanceOf(rewardDistributor.feeReceiver())
      ).to.equal(feeReceiverBalanceBefore.add(parseEther('0.025')))
    })

    it('Should burn fees correctly', async () => {
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const totalSupply = await baseReward.totalSupply()
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1.05'))
      await rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1.05'), 0, user.address)
      expect(await baseReward.totalSupply()).to.equal(totalSupply)
    })

    it('Should update state correctly', async () => {
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1.05'))
      await rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1.05'), 0, user.address)
      expect(await rewardDistributor.taskRewards(0)).to.equal(parseEther('101'))
    })

    it('Should emit correct event', async () => {
      const { rewardDistributor, baseReward, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      await baseReward
        .connect(user)
        .approve(rewardDistributor.address, parseEther('1.05'))
      const action = rewardDistributor
        .connect(user)
        .topUpTask(parseEther('1.05'), 0, user.address)
      await expect(action)
        .to.emit(rewardDistributor, 'TaskToppedUp')
        .withArgs(0, parseEther('1.0'), user.address)
    })

    describe('WithPermit', async () => {
      it('Should revert if task does not exist', async () => {
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixture
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
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
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
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
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
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
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        const userBalanceBefore = await baseReward.balanceOf(user.address)
        const feeReceiverBalanceBefore = await baseReward.balanceOf(
          rewardDistributor.feeReceiver()
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1.05'),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        expect(await baseReward.balanceOf(rewardDistributor.address)).to.equal(
          parseEther('101').add(parseEther('2.525'))
        )
        expect(await baseReward.balanceOf(user.address)).to.equal(
          userBalanceBefore.sub(parseEther('1.05'))
        )
        expect(
          await baseReward.balanceOf(rewardDistributor.feeReceiver())
        ).to.equal(feeReceiverBalanceBefore.add(parseEther('0.025')))
      })

      it('Should set toBurn fees correctly', async () => {
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        const totalSupply = await baseReward.totalSupply()
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        const toBurnBefore = await rewardDistributor.toBurn()

        await rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1.05'),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        expect(await baseReward.totalSupply()).to.equal(totalSupply)
        expect(await rewardDistributor.toBurn()).to.equal(
          parseEther('0.025').add(toBurnBefore)
        )
      })

      it('Should update state correctly', async () => {
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        await rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1.05'),
            0,
            user.address,
            permit.value,
            permit.deadline,
            permit.v,
            permit.r,
            permit.s
          )
        expect(await rewardDistributor.taskRewards(0)).to.equal(
          parseEther('101')
        )
      })

      it('Should emit correct event', async () => {
        const { rewardDistributor, baseReward, user } = await loadFixture(
          deployContractFixtureWithOneTask
        )
        var timestamp =
          (await ethers.provider.getBlock('latest')).timestamp + 86400
        let permit = await signPermit(
          baseReward,
          user,
          rewardDistributor.address,
          parseEther('1.05'),
          timestamp
        )

        let action = rewardDistributor
          .connect(user)
          .topUpTaskWithPermit(
            parseEther('1.05'),
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
          .withArgs(0, parseEther('1.0'), user.address)
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
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

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
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

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
        .withdrawRewards(
          user.address,
          parseEther('1'),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

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
        .withdrawRewards(
          user.address,
          parseEther('5').add(1),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

      await expect(action).to.be.revertedWith('Amount exceeds max to withdraw')
    })

    it('Should revert if amount exceeds claimable after many claims', async () => {
      const { rewardDistributor, baseReward, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('4'),
        admin
      )

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

      await expect(action).not.to.be.reverted

      let action2 = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2').add(1),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )
      await expect(action2).to.be.revertedWith('Amount exceeds max to withdraw')
    })

    it('Should revert if amount exceeds claimable after many different claims', async () => {
      const { rewardDistributor, baseReward, owner, user, admin } =
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
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof2,
          await rewardDistributor.getSameChainLZSendParam()
        )

      await expect(action).not.to.be.reverted

      let action2 = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof1,
          await rewardDistributor.getSameChainLZSendParam()
        )

      await expect(action2).not.to.be.reverted

      let action3 = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof1,
          await rewardDistributor.getSameChainLZSendParam()
        )
      await expect(action3).to.be.revertedWith('Amount exceeds max to withdraw')

      let action4 = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof2,
          await rewardDistributor.getSameChainLZSendParam()
        )
      await expect(action4).not.to.be.reverted

      let action5 = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof2,
          await rewardDistributor.getSameChainLZSendParam()
        )
      await expect(action5).to.be.revertedWith('Amount exceeds max to withdraw')
    })

    it('Should revert if chain id is incorrect', async () => {
      const { rewardDistributor, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('2'),
        admin
      )

      const lzSendParam = {
        destinationChainId: 897,
        addGas: 0,
        addEther: 0,
        topUp: 0,
      }

      let action = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof,
          lzSendParam
        )
      await expect(action).to.be.revertedWith('NoPeer').withArgs(897)
    })

    it('Should not revert if daily withdrawal amount was exceeded one day before', async () => {
      const { rewardDistributor, baseReward, user, admin } = await loadFixture(
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
        .withdrawRewards(
          user.address,
          parseEther('4.75'),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )
      await expect(action).not.to.be.reverted

      let balanceOfDistributor = await baseReward.balanceOf(
        rewardDistributor.address
      )
      let availableToWithdraw = balanceOfDistributor.mul(5).div(100)

      // Same day should revert
      let action2 = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          availableToWithdraw,
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

      await expect(action2).to.be.revertedWith(
        'Daily withdrawal limit exceeded'
      )

      // Next day should not revert
      await ethers.provider.send('evm_setNextBlockTimestamp', [nextDay])
      let action3 = rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          availableToWithdraw,
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

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
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

      expect(await rewardDistributor.withdrawnRewards(user.address)).to.be.eq(
        withdrawBefore.add(parseEther('2'))
      )
    })

    it('Should transfer tokens correctly', async () => {
      const { rewardDistributor, baseReward, user, admin } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('2'),
        admin
      )

      const userBalanceBefore = await baseReward.balanceOf(user.address)
      const distributorBalanceBefore = await baseReward.balanceOf(
        rewardDistributor.address
      )

      await rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

      expect(await baseReward.balanceOf(user.address)).to.be.eq(
        userBalanceBefore.add(parseEther('2'))
      )
      expect(await baseReward.balanceOf(rewardDistributor.address)).to.be.eq(
        distributorBalanceBefore.sub(parseEther('2'))
      )
    })

    it('Should transfer tokens correctly from base to polygon mock endpoint', async () => {
      const {
        rewardDistributor,
        baseReward,
        polygonReward,
        user,
        admin,
        polygonEID,
      } = await loadFixture(deployContractFixtureWithOneTask)
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('2'),
        admin
      )

      const userBalanceBefore = await baseReward.balanceOf(user.address)
      const userBalanceBeforePolygon = await polygonReward.balanceOf(
        user.address
      )
      const distributorBalanceBefore = await baseReward.balanceOf(
        rewardDistributor.address
      )

      const lzSendParam = {
        destinationChainId: polygonEID,
        addGas: 0,
        addEther: 0,
        topUp: 0,
      }

      const fee = await rewardDistributor.quoteSend(
        user.address,
        parseEther('2'),
        lzSendParam
      )

      await rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof,
          lzSendParam,
          { value: fee }
        )

      expect(await baseReward.balanceOf(user.address)).to.be.eq(
        userBalanceBefore
      )
      expect(await polygonReward.balanceOf(user.address)).to.be.eq(
        userBalanceBeforePolygon.add(parseEther('2'))
      )
      expect(await baseReward.balanceOf(rewardDistributor.address)).to.be.eq(
        distributorBalanceBefore.sub(parseEther('2'))
      )
    })

    it('Should transfer tokens correctly from base to polygon mock endpoint and TOP UP', async () => {
      const {
        rewardDistributor,
        baseReward,
        polygonReward,
        user,
        admin,
        polygonEID,
      } = await loadFixture(deployContractFixtureWithOneTask)
      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('2'),
        admin
      )

      const userEtherBalanceBefore = await ethers.provider.getBalance(
        user.address
      )
      const userBalanceBefore = await baseReward.balanceOf(user.address)
      const userBalanceBeforePolygon = await polygonReward.balanceOf(
        user.address
      )
      const distributorBalanceBefore = await baseReward.balanceOf(
        rewardDistributor.address
      )

      const lzSendParam = {
        destinationChainId: polygonEID,
        addGas: 0,
        addEther: 0,
        topUp: parseEther('0.1'),
      }

      const fee = await rewardDistributor.quoteSend(
        user.address,
        parseEther('2'),
        lzSendParam
      )

      await rewardDistributor.withdrawRewards(
        user.address,
        parseEther('2'),
        signedProof,
        lzSendParam,
        { value: fee }
      )

      expect(await baseReward.balanceOf(user.address)).to.be.eq(
        userBalanceBefore
      )
      expect(await polygonReward.balanceOf(user.address)).to.be.eq(
        userBalanceBeforePolygon.add(parseEther('2'))
      )
      expect(await baseReward.balanceOf(rewardDistributor.address)).to.be.eq(
        distributorBalanceBefore.sub(parseEther('2'))
      )
      expect(await ethers.provider.getBalance(user.address)).to.be.eq(
        userEtherBalanceBefore.add(parseEther('0.1'))
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

      let action = rewardDistributor.withdrawRewards(
        user.address,
        parseEther('2'),
        signedProof,
        await rewardDistributor.getSameChainLZSendParam()
      )

      await expect(action)
        .to.emit(rewardDistributor, 'WithdrawnRewards')
        .withArgs(user.address, parseEther('2'))
    })
  })

  describe('BurnFees', async () => {
    it('Should revert if not called by the owner', async () => {
      const { rewardDistributor, user } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      let action = rewardDistributor.connect(user).burnFees(parseEther('5'))
      await expect(action).to.be.revertedWith('OwnableUnauthorizedAccount')
    })

    it('Should revert if amount to recover exceeds toBurn', async () => {
      const { rewardDistributor, owner } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      let action = rewardDistributor.connect(owner).burnFees(parseEther('5'))
      await expect(action).to.be.revertedWith('Exceeds toBurn')
    })

    it('Should revert if amount to recover exceeds balance', async () => {
      const { rewardDistributor, owner, user, admin, baseReward } =
        await loadFixture(deployContractFixtureWithOneTask)

      await rewardDistributor.setMaxDailyWithdrawal(1e4)

      const balance = await baseReward.balanceOf(rewardDistributor.address)
      const signedProof = await getUserVerificationData(
        user.address,
        balance,
        admin
      )

      await rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          balance,
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

      let action = rewardDistributor.connect(owner).burnFees(parseEther('1'))
      await expect(action).to.be.revertedWith('Exceeds balance')
    })

    it('Should burn correct amounts', async () => {
      const { rewardDistributor, owner, baseReward } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const totalSupply = await baseReward.totalSupply()
      const toBurnBefore = await rewardDistributor.toBurn()
      const balanceBefore = await baseReward.balanceOf(
        rewardDistributor.address
      )
      const ownerBalanceBefore = await baseReward.balanceOf(owner.address)
      const amountToBurn = parseEther('1')
      const action = await rewardDistributor
        .connect(owner)
        .burnFees(amountToBurn)
      await expect(action)
        .to.emit(rewardDistributor, 'Burned')
        .withArgs(amountToBurn)
      expect(await rewardDistributor.toBurn()).to.be.eq(
        toBurnBefore.sub(amountToBurn)
      )
      expect(await baseReward.balanceOf(rewardDistributor.address)).to.be.eq(
        balanceBefore.sub(amountToBurn)
      )
      expect(await baseReward.balanceOf(owner.address)).to.be.eq(
        ownerBalanceBefore
      )
      expect(await baseReward.totalSupply()).to.be.eq(
        totalSupply.sub(amountToBurn)
      )
    })

    it('Should recover correct amounts', async () => {
      const { rewardDistributor, owner, baseReward } = await loadFixture(
        deployContractFixtureWithOneTask
      )
      const totalSupply = await baseReward.totalSupply()
      const toBurnBefore = await rewardDistributor.toBurn()
      const balanceBefore = await baseReward.balanceOf(
        rewardDistributor.address
      )
      const ownerBalanceBefore = await baseReward.balanceOf(owner.address)
      const amountToBurn = parseEther('1')
      const action = await rewardDistributor
        .connect(owner)
        .recoverFees(amountToBurn, owner.address)
      await expect(action)
        .to.emit(rewardDistributor, 'Recovered')
        .withArgs(amountToBurn, owner.address)
      expect(await rewardDistributor.toBurn()).to.be.eq(
        toBurnBefore.sub(amountToBurn)
      )
      expect(await baseReward.balanceOf(rewardDistributor.address)).to.be.eq(
        balanceBefore.sub(amountToBurn)
      )
      expect(await baseReward.balanceOf(owner.address)).to.be.eq(
        ownerBalanceBefore.add(amountToBurn)
      )
      expect(await baseReward.totalSupply()).to.be.eq(totalSupply)
    })
  })

  describe('Upgrade', async () => {
    it('Should revert if not owner', async () => {
      const { rewardDistributor, baseReward, admin, feeReceiver, owner, user } =
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

    it('Should upgrade correctly not breking things', async () => {
      const { rewardDistributor, baseReward, admin, feeReceiver, owner, user } =
        await loadFixture(deployContractFixtureWithOneTask)

      const signedProof = await getUserVerificationData(
        user.address,
        parseEther('2'),
        admin
      )

      await rewardDistributor
        .connect(user)
        .withdrawRewards(
          user.address,
          parseEther('2'),
          signedProof,
          await rewardDistributor.getSameChainLZSendParam()
        )

      const RewardDistributorMock = await ethers.getContractFactory(
        'RewardDistributorV1LZMock'
      )
      const rdMock = await RewardDistributorMock.deploy()
      await rdMock.deployed()
      await rewardDistributor
        .connect(owner)
        .upgradeToAndCall(rdMock.address, '0x')
      const v2 = rdMock.attach(
        rewardDistributor.address
      ) as RewardDistributorV1LZMock

      // Check if new added variable works
      expect(await v2.test()).to.be.eq(0)
      // Check if state is the same
      expect(await v2.owner()).to.be.eq(owner.address)
      expect(await v2.rewardToken()).to.be.eq(baseReward.address)
      expect(await v2.tokenAdmin()).to.be.eq(admin.address)
      expect(await v2.feeReceiver()).to.be.eq(feeReceiver.address)
      expect(await v2.burnFee()).to.be.eq(5e3)
      expect(await v2.platformFee()).to.be.eq(5e2)
      expect(await v2.maxDailyWithdrawal()).to.be.eq(5e2)
      expect(await v2.minWithdrawalAmount()).to.be.eq(parseEther('2'))
      expect(await v2.taskRewards(0)).to.be.eq(parseEther('100'))
      expect(await v2.withdrawnRewards(user.address)).to.be.eq(parseEther('2'))

      // Cannot get initliazed twice
      let action = v2.initialize(
        owner.address,
        baseReward.address,
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
