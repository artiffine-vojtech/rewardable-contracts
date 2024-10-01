import { ethers, deployments } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'

import { RewardableLZ } from '../../hardhat-types/src'
import { parseEther } from 'ethers/lib/utils'
import { signPermit } from '../utils/signature-utils'
import { ContractFactory } from 'ethers'

import { Options } from '@layerzerolabs/lz-v2-utilities'
import { SendParamStruct } from '../../hardhat-types/src/contracts/RewardableLZ'

describe('Rewardable OFT', function () {
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

    // DEPLOYMENT #1: Deploy both OFT tokens
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

    // MOCKS ONLY: Set destination endpoints in mock endpoints
    await baseEndpoint.setDestLzEndpoint(
      polygonReward.address,
      polygonEndpoint.address
    )
    await polygonEndpoint.setDestLzEndpoint(
      baseReward.address,
      baseEndpoint.address
    )

    // DEPLOYMENT #2: Set enforced options
    await baseReward.setPeer(
      polygonEID,
      ethers.utils.zeroPad(polygonReward.address, 32)
    )
    await polygonReward.setPeer(
      baseEID,
      ethers.utils.zeroPad(baseReward.address, 32)
    )

    // DEPLOYMENT #3: Set enforced options
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
      baseReward,
      polygonReward,
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
      const { baseReward } = await loadFixture(deployContractFixture)
      console.log(
        'Gas used for deployment',
        (await baseReward.deployTransaction.wait()).gasUsed.toNumber()
      )
    })
  })

  describe('Initialize', async () => {
    it('Should set name correctly', async () => {
      const { baseReward } = await loadFixture(deployContractFixture)
      expect(await baseReward.name()).to.equal('Rewardable')
    })

    it('Should set symbol correctly', async () => {
      const { baseReward } = await loadFixture(deployContractFixture)
      expect(await baseReward.symbol()).to.equal('REWARD')
    })

    it('Should set decimals correctly', async () => {
      const { baseReward } = await loadFixture(deployContractFixture)
      expect(await baseReward.decimals()).to.equal(18)
    })

    it('Should set total supply correctly', async () => {
      const { baseReward } = await loadFixture(deployContractFixture)
      expect(await baseReward.totalSupply()).to.equal(
        parseEther(`${1_000_000_000}`)
      )
    })
  })

  describe('Transfer', async () => {
    it('Should transfer tokens correctly', async () => {
      const { baseReward, owner, user } = await loadFixture(
        deployContractFixture
      )
      await baseReward.transfer(user.address, parseEther(`${100}`))
      expect(await baseReward.balanceOf(user.address)).to.equal(
        parseEther(`${100}`)
      )
    })
  })

  describe('Transfer with permit', async () => {
    it('Should transfer tokens correctly', async () => {
      const { baseReward, owner, user } = await loadFixture(
        deployContractFixture
      )
      const value = parseEther('1')
      var timestamp =
        (await ethers.provider.getBlock('latest')).timestamp + 86400
      let permit = await signPermit(
        baseReward,
        owner,
        user.address,
        value,
        timestamp
      )

      const res = await baseReward.permit(
        permit.owner,
        permit.spender,
        permit.value,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s
      )

      const action = baseReward
        .connect(user)
        .transferFrom(owner.address, user.address, value.add(1))

      await expect(action).to.be.revertedWith('ERC20InsufficientAllowance')
    })

    it('Should transfer tokens correctly', async () => {
      const { baseReward, owner, user } = await loadFixture(
        deployContractFixture
      )
      const value = parseEther('1')
      var timestamp =
        (await ethers.provider.getBlock('latest')).timestamp + 86400
      let permit = await signPermit(
        baseReward,
        owner,
        user.address,
        value,
        timestamp
      )

      const res = await baseReward.permit(
        permit.owner,
        permit.spender,
        permit.value,
        permit.deadline,
        permit.v,
        permit.r,
        permit.s
      )

      const action = baseReward
        .connect(user)
        .transferFrom(owner.address, user.address, value)

      await expect(action).not.to.be.reverted

      expect(await baseReward.balanceOf(user.address)).to.equal(value)
    })
  })

  describe('Transfer between chains', async () => {
    it('should send a token from base to polygon mock endpoints', async function () {
      const { baseReward, user, polygonEID, owner, polygonReward } =
        await loadFixture(deployContractFixture)

      const initialAmount = await baseReward.balanceOf(owner.address)
      // Defining the amount of tokens to send and constructing the parameters for the send operation
      const tokensToSend = ethers.utils.parseEther('100')

      const sendParam: SendParamStruct = {
        dstEid: polygonEID,
        to: ethers.utils.zeroPad(user.address, 32),
        amountLD: tokensToSend,
        minAmountLD: tokensToSend,
        extraOptions: '0x',
        composeMsg: '0x',
        oftCmd: '0x',
      }

      // Fetching the native fee for the token send operation
      const msgFee = await baseReward.quoteSend(sendParam, false)

      // Executing the send operation from myOFTA contract
      await baseReward.send(sendParam, msgFee, owner.address, {
        value: msgFee.nativeFee,
      })

      // Fetching the final token balances of ownerA and ownerB
      const finalBalanceA = await baseReward.balanceOf(owner.address)
      const finalBalanceB = await polygonReward.balanceOf(user.address)

      // Asserting that the final balances are as expected after the send operation
      expect(finalBalanceA).eql(initialAmount.sub(tokensToSend))
      expect(finalBalanceB).eql(tokensToSend)
    })
  })
})
