import { ethers } from 'hardhat'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { parseEther } from 'ethers/lib/utils'
import env from 'hardhat'
import { BigNumber as bgj } from 'bignumber.js'

import { BigNumber, Contract } from 'ethers'
import {
  ERC20,
  INonfungiblePositionManager,
  UniV3IncentivesController,
} from '../../hardhat-types/src'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const K100_TOKENS = parseEther(`${100_000}`)
const K1_TOKENS = parseEther(`${1_000}`)
const ONE_DAY = 24 * 60 * 60
const NFT_LIQUIDITY = BigNumber.from('167175499835819766909277')

describe('UniV3IncentivesController', function () {
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user, user2, user3] = await ethers.getSigners()

    // deploy UniV3 positions NFT
    await env.uniswapV3.deploy(owner)

    const reward = (await env.uniswapV3.createERC20(
      'REWARD',
      'REWARD',
      owner
    )) as ERC20

    const [tokenA, tokenB] = [
      (await env.uniswapV3.createERC20('TOKENA', 'TOKENA', owner)) as ERC20,
      (await env.uniswapV3.createERC20('TOKENB', 'TOKENB', owner)) as ERC20,
    ].sort((a, b) => a.address.localeCompare(b.address))

    var mintOptions = {
      signer: owner,
      token0: tokenA.address,
      token1: tokenB.address,
      fee: 3000,
      amount0Desired: 1000,
      amount1Desired: 1000,
      price: 1,
    }
    const userNftId = await env.uniswapV3.mintPosition(mintOptions)
    const userNftId2 = await env.uniswapV3.mintPosition(mintOptions)
    const user2NftId = await env.uniswapV3.mintPosition(mintOptions)
    const user3NftId = await env.uniswapV3.mintPosition(mintOptions)
    const nft =
      (await env.uniswapV3.getPositionManager()) as INonfungiblePositionManager

    const position = await nft.positions(userNftId)

    // deploy the invcentives controller
    const posConfig = {
      token0: position.token0,
      token1: position.token1,
      tickLower: position.tickLower,
      tickUpper: position.tickUpper,
    }
    const UniV3IncentivesController = await ethers.getContractFactory(
      'UniV3IncentivesController'
    )
    const incentivesController = (await UniV3IncentivesController.deploy(
      nft.address,
      posConfig,
      reward.address
    )) as UniV3IncentivesController
    await incentivesController.deployed()

    await nft
      .connect(owner)
      .transferFrom(owner.address, user.address, userNftId)
    await nft
      .connect(owner)
      .transferFrom(owner.address, user.address, userNftId2)
    await nft
      .connect(owner)
      .transferFrom(owner.address, user2.address, user2NftId)
    await nft
      .connect(owner)
      .transferFrom(owner.address, user3.address, user3NftId)

    return {
      // contracts
      reward,
      tokenA,
      tokenB,
      nft,
      userNftId,
      userNftId2,
      user2NftId,
      user3NftId,
      incentivesController,
      posConfig,
      // accounts
      owner,
      user,
      user2,
      user3,
    }
  }

  async function deployCOntractFixtureWithUserStaked() {
    const {
      // contracts
      reward,
      tokenA,
      tokenB,
      nft,
      userNftId,
      userNftId2,
      user2NftId,
      user3NftId,
      incentivesController,
      posConfig,
      // accounts
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixture)
    await nft.connect(user).approve(incentivesController.address, userNftId)
    await nft.connect(user).approve(incentivesController.address, userNftId2)
    await incentivesController.connect(user).deposit([userNftId, userNftId2])
    return {
      // contracts
      reward,
      tokenA,
      tokenB,
      nft,
      userNftId,
      userNftId2,
      user2NftId,
      user3NftId,
      incentivesController,
      posConfig,
      // accounts
      owner,
      user,
      user2,
      user3,
    }
  }

  async function deployCOntractFixtureWithUserStakedOneNft() {
    const {
      // contracts
      reward,
      tokenA,
      tokenB,
      nft,
      userNftId,
      userNftId2,
      user2NftId,
      user3NftId,
      incentivesController,
      posConfig,
      // accounts
      owner,
      user,
      user2,
      user3,
    } = await loadFixture(deployContractFixture)
    await nft.connect(user).approve(incentivesController.address, userNftId)
    await incentivesController.connect(user).deposit([userNftId])
    return {
      // contracts
      reward,
      tokenA,
      tokenB,
      nft,
      userNftId,
      userNftId2,
      user2NftId,
      user3NftId,
      incentivesController,
      posConfig,
      // accounts
      owner,
      user,
      user2,
      user3,
    }
  }

  async function mintPosition(
    nft: INonfungiblePositionManager,
    options: {
      signer: SignerWithAddress
      token0: ERC20
      token1: ERC20
      fee: number
      amount0Desired: number | BigNumber
      amount1Desired: number | BigNumber
      price: number
      tickLower: number
      tickUpper: number
    }
  ): Promise<number> {
    const signerAddress = await options.signer.getAddress()

    //Parse amounts into ether
    let amount0DesiredEther = parseEther(options.amount0Desired.toString())

    let amount1DesiredEther = parseEther(options.amount1Desired.toString())

    // Approve Tokens
    //@ts-ignore
    await options.token0
      .connect(options.signer)
      .approve(nft.address, env.ethers.constants.MaxInt256)
    //@ts-ignore
    await options.token1
      .connect(options.signer)
      .approve(nft.address, env.ethers.constants.MaxInt256)

    let token0, token1

    // Sort tokens to avoid revert() from createAndInitializePoolIfNecessary in PoolInitializer
    if (options.token0.address < options.token1.address) {
      token0 = options.token0.address
      token1 = options.token1.address
    } else {
      token0 = options.token1.address
      token1 = options.token0.address
    }
    // calculate squareRootPrice for desired price
    const sqrtPrice = calculateSqrtPriceX96(options.price, 18, 18)

    // create and initialize pool if necessary
    await nft
      .connect(options.signer)
      .createAndInitializePoolIfNecessary(
        token0,
        token1,
        options.fee,
        sqrtPrice.toFixed(0)
      )

    const mintParams = {
      token0: token0,
      token1: token1,
      fee: options.fee,
      tickLower: options.tickLower,
      tickUpper: options.tickUpper,
      amount0Desired: amount0DesiredEther,
      amount1Desired: amount1DesiredEther,
      amount0Min: 0,
      amount1Min: 0,
      recipient: signerAddress,
      deadline: 9678825033,
    }

    // Mint with desired amounts
    const res = await nft
      .connect(options.signer)
      .mint(mintParams, { gasLimit: 15000000 })
    const tx = await res.wait()
    return Number(tx.logs[tx.logs.length - 1].topics[1])
  }

  function calculateSqrtPriceX96(
    price: number,
    token0Dec: number,
    token1Dec: number
  ) {
    const Q192 = bgj(2).exponentiatedBy(192)
    const _price = bgj(price).shiftedBy(token1Dec - token0Dec)
    const ratioX96 = _price.multipliedBy(Q192)
    const sqrtPriceX96 = ratioX96.sqrt()
    return sqrtPriceX96
  }

  describe('Deployment', () => {
    it('Should be the right set staking token', async () => {
      const { incentivesController } = await loadFixture(deployContractFixture)
      console.log(
        'Gas used for deployment',
        (await incentivesController.deployTransaction.wait()).gasUsed.toNumber()
      )
    })
    it('Should set nft correctly', async () => {
      const { incentivesController, nft } = await loadFixture(
        deployContractFixture
      )
      expect(await incentivesController.nft()).to.be.equals(nft.address)
    })
    it('Should set pos config correctly', async () => {
      const { incentivesController, posConfig } = await loadFixture(
        deployContractFixture
      )
      const savedPosConfig = await incentivesController.posConfig()
      expect(savedPosConfig.token0).to.be.deep.eq(posConfig.token0)
      expect(savedPosConfig.token1).to.be.deep.eq(posConfig.token1)
      expect(savedPosConfig.tickLower).to.be.deep.eq(posConfig.tickLower)
      expect(savedPosConfig.tickUpper).to.be.deep.eq(posConfig.tickUpper)
    })
    it('Should add reward correctly', async () => {
      const { incentivesController, reward } = await loadFixture(
        deployContractFixture
      )
      expect(await incentivesController.rewardTokens(0)).to.be.equals(
        reward.address
      )
    })
  })

  describe('Deposit', () => {
    it('Should revert if allowance is not given', async () => {
      const { incentivesController, user, userNftId } = await loadFixture(
        deployContractFixture
      )
      let action = incentivesController.connect(user).deposit([userNftId])
      await expect(action).to.be.revertedWith(
        'ERC721: transfer caller is not owner nor approved'
      )
    })

    it('Should revert if caller is not nft owner', async () => {
      const { incentivesController, nft, user, userNftId, user2NftId } =
        await loadFixture(deployContractFixture)
      await nft.connect(user).approve(incentivesController.address, userNftId)
      let action = incentivesController
        .connect(user)
        .deposit([userNftId, user2NftId])
      await expect(action).to.be.revertedWith(
        'ERC721: transfer caller is not owner nor approved'
      )
    })

    it('Should revert if nft token0 is incorrect', async () => {
      const { incentivesController, nft, owner, tokenB } = await loadFixture(
        deployContractFixture
      )

      // mint a token with higher address than tokenB
      let badToken: Contract | undefined
      while (true) {
        badToken = await env.uniswapV3.createERC20('TOKEN0', 'TOKEN0', owner)
        if (badToken.address > tokenB.address) {
          break
        }
      }

      var mintOptions = {
        signer: owner,
        token0: badToken.address,
        token1: tokenB.address,
        fee: 3000,
        amount0Desired: 1000,
        amount1Desired: 1000,
        price: 1,
      }
      const incorrectToken0 = await env.uniswapV3.mintPosition(mintOptions)

      await nft
        .connect(owner)
        .approve(incentivesController.address, incorrectToken0)
      let action = incentivesController
        .connect(owner)
        .deposit([incorrectToken0])
      await expect(action).to.be.revertedWith('Invalid token0')
    })

    it('Should revert if nft token1 is incorrect', async () => {
      const { incentivesController, nft, owner, tokenA, posConfig } =
        await loadFixture(deployContractFixture)

      // mint a token with higher address than tokenA
      let badToken: Contract | undefined
      while (true) {
        badToken = await env.uniswapV3.createERC20('TOKEN0', 'TOKEN0', owner)
        if (badToken.address > tokenA.address) {
          break
        }
      }

      var mintOptions = {
        signer: owner,
        token0: tokenA.address,
        token1: badToken.address,
        fee: 3000,
        amount0Desired: 1000,
        amount1Desired: 1000,
        price: 1,
      }
      const incorrectToken1 = await env.uniswapV3.mintPosition(mintOptions)

      await nft
        .connect(owner)
        .approve(incentivesController.address, incorrectToken1)
      let action = incentivesController
        .connect(owner)
        .deposit([incorrectToken1])
      await expect(action).to.be.revertedWith('Invalid token1')
    })

    it('Should revert if nft lowerTick is incorrect', async () => {
      const { incentivesController, nft, owner, tokenA, tokenB } =
        await loadFixture(deployContractFixture)
      var options = {
        signer: owner,
        token0: tokenA,
        token1: tokenB,
        fee: 3000,
        amount0Desired: 1000,
        amount1Desired: 1000,
        price: 1,
        tickLower: -240,
        tickUpper: 120,
      }
      const incorrectFee = await mintPosition(nft, options)
      await nft
        .connect(owner)
        .approve(incentivesController.address, incorrectFee)
      let action = incentivesController.connect(owner).deposit([incorrectFee])
      await expect(action).to.be.revertedWith('Invalid lower tick')
    })

    it('Should revert if nft upperTick is incorrect', async () => {
      const { incentivesController, nft, owner, tokenA, tokenB } =
        await loadFixture(deployContractFixture)
      var options = {
        signer: owner,
        token0: tokenA,
        token1: tokenB,
        fee: 3000,
        amount0Desired: 1000,
        amount1Desired: 1000,
        price: 1,
        tickLower: -120,
        tickUpper: 240,
      }
      const incorrectFee = await mintPosition(nft, options)
      await nft
        .connect(owner)
        .approve(incentivesController.address, incorrectFee)
      let action = incentivesController.connect(owner).deposit([incorrectFee])
      await expect(action).to.be.revertedWith('Invalid upper tick')
    })

    it('Should transfer nfts correctly', async () => {
      const { incentivesController, user, nft, userNftId, userNftId2 } =
        await loadFixture(deployContractFixture)
      await nft.connect(user).approve(incentivesController.address, userNftId)
      await nft.connect(user).approve(incentivesController.address, userNftId2)
      await incentivesController.connect(user).deposit([userNftId, userNftId2])

      expect(await nft.ownerOf(userNftId)).to.be.eq(
        incentivesController.address
      )
      expect(await nft.ownerOf(userNftId2)).to.be.eq(
        incentivesController.address
      )
    })

    it('Should transfer nfts correctly with different fee', async () => {
      const { incentivesController, nft, owner, tokenA, tokenB, posConfig } =
        await loadFixture(deployContractFixture)
      var options = {
        signer: owner,
        token0: tokenA,
        token1: tokenB,
        fee: 500,
        amount0Desired: 1000,
        amount1Desired: 1000,
        price: 1,
        tickLower: posConfig.tickLower,
        tickUpper: posConfig.tickUpper,
      }
      const incorrectFee = await mintPosition(nft, options)
      await nft
        .connect(owner)
        .approve(incentivesController.address, incorrectFee)
      await incentivesController.connect(owner).deposit([incorrectFee])

      expect(await nft.ownerOf(incorrectFee)).to.be.eq(
        incentivesController.address
      )
    })

    it('Should update state correctly', async () => {
      const { incentivesController, user, nft, userNftId, userNftId2 } =
        await loadFixture(deployContractFixture)
      await nft.connect(user).approve(incentivesController.address, userNftId)
      await nft.connect(user).approve(incentivesController.address, userNftId2)
      await incentivesController.connect(user).deposit([userNftId, userNftId2])

      expect(await incentivesController.totalLiquidity()).to.be.eq(
        NFT_LIQUIDITY.mul(2)
      )
      expect(await incentivesController.userLiquidity(user.address)).to.be.eq(
        NFT_LIQUIDITY.mul(2)
      )
      expect(await incentivesController.nftLiquidity(userNftId)).to.be.eq(
        NFT_LIQUIDITY
      )
      expect(await incentivesController.nftLiquidity(userNftId2)).to.be.eq(
        NFT_LIQUIDITY
      )
    })

    it('Should update state correctly after multiple deposits', async () => {
      const {
        incentivesController,
        user,
        user2,
        nft,
        userNftId,
        userNftId2,
        user2NftId,
      } = await loadFixture(deployContractFixture)
      // user 1
      await nft.connect(user).approve(incentivesController.address, userNftId)
      await nft.connect(user).approve(incentivesController.address, userNftId2)
      await incentivesController.connect(user).deposit([userNftId, userNftId2])
      // user 2
      await nft.connect(user2).approve(incentivesController.address, user2NftId)
      await incentivesController.connect(user2).deposit([user2NftId])

      expect(await incentivesController.totalLiquidity()).to.be.eq(
        NFT_LIQUIDITY.mul(3)
      )
      expect(await incentivesController.userLiquidity(user.address)).to.be.eq(
        NFT_LIQUIDITY.mul(2)
      )
      expect(await incentivesController.userLiquidity(user2.address)).to.be.eq(
        NFT_LIQUIDITY
      )

      expect(await incentivesController.nftLiquidity(userNftId)).to.be.eq(
        NFT_LIQUIDITY
      )
      expect(await incentivesController.nftLiquidity(userNftId2)).to.be.eq(
        NFT_LIQUIDITY
      )
      expect(await incentivesController.nftLiquidity(user2NftId)).to.be.eq(
        NFT_LIQUIDITY
      )
    })

    it('Should emit Deposited event correctly', async () => {
      const { incentivesController, user, nft, userNftId, userNftId2 } =
        await loadFixture(deployContractFixture)
      await nft.connect(user).approve(incentivesController.address, userNftId)
      await nft.connect(user).approve(incentivesController.address, userNftId2)
      let action = incentivesController
        .connect(user)
        .deposit([userNftId, userNftId2])
      await expect(action)
        .to.emit(incentivesController, 'Deposited')
        .withArgs(user.address, userNftId, NFT_LIQUIDITY)
        .and.to.emit(incentivesController, 'Deposited')
        .withArgs(user.address, userNftId2, NFT_LIQUIDITY)
    })
  })

  describe('Withdraw', () => {
    it('Should revert on withdrawing invalid nft', async () => {
      const { incentivesController, user, userNftId, user2NftId } =
        await loadFixture(deployCOntractFixtureWithUserStaked)
      let action = incentivesController
        .connect(user)
        .withdraw([userNftId, user2NftId])
      await expect(action).to.be.revertedWith('Invalid nftId')
    })

    it('Should transfer nft correctly', async () => {
      const { incentivesController, nft, user, userNftId2 } = await loadFixture(
        deployCOntractFixtureWithUserStaked
      )
      await incentivesController.connect(user).withdraw([userNftId2])
      expect(await nft.ownerOf(userNftId2)).to.be.eq(user.address)
    })

    it('Should transfer all nfts correctly', async () => {
      const { incentivesController, nft, user, userNftId, userNftId2 } =
        await loadFixture(deployCOntractFixtureWithUserStaked)
      await incentivesController.connect(user).withdraw([userNftId2, userNftId])
      expect(await nft.ownerOf(userNftId)).to.be.eq(user.address)
      expect(await nft.ownerOf(userNftId2)).to.be.eq(user.address)
    })

    it('Should update state correctly', async () => {
      const { incentivesController, user, userNftId } = await loadFixture(
        deployCOntractFixtureWithUserStaked
      )
      const beforeTotalLiquidity = await incentivesController.totalLiquidity()
      const beforeUserLiquidity = await incentivesController.userLiquidity(
        user.address
      )
      await incentivesController.connect(user).withdraw([userNftId])
      expect(await incentivesController.totalLiquidity()).to.be.eq(
        beforeTotalLiquidity.sub(NFT_LIQUIDITY)
      )
      expect(await incentivesController.userLiquidity(user.address)).to.be.eq(
        beforeUserLiquidity.sub(NFT_LIQUIDITY)
      )
      expect(await incentivesController.nftLiquidity(userNftId)).to.be.eq(0)
    })

    it('Should update state correctly on all withdrawal', async () => {
      const { incentivesController, user, userNftId, userNftId2 } =
        await loadFixture(deployCOntractFixtureWithUserStaked)
      const beforeTotalLiquidity = await incentivesController.totalLiquidity()
      const beforeUserLiquidity = await incentivesController.userLiquidity(
        user.address
      )
      await incentivesController.connect(user).withdraw([userNftId, userNftId2])
      expect(await incentivesController.totalLiquidity()).to.be.eq(
        beforeTotalLiquidity.sub(NFT_LIQUIDITY.mul(2))
      )
      expect(await incentivesController.userLiquidity(user.address)).to.be.eq(
        beforeUserLiquidity.sub(NFT_LIQUIDITY.mul(2))
      )
      expect(await incentivesController.totalLiquidity()).to.be.eq(0)
      expect(await incentivesController.userLiquidity(user.address)).to.be.eq(0)
      expect(await incentivesController.nftLiquidity(userNftId)).to.be.eq(0)
      expect(await incentivesController.nftLiquidity(userNftId2)).to.be.eq(0)
    })

    it('Should emit Withdrawn event correctly', async () => {
      const { incentivesController, user, nft, userNftId, userNftId2 } =
        await loadFixture(deployCOntractFixtureWithUserStaked)
      let action = incentivesController
        .connect(user)
        .withdraw([userNftId, userNftId2])
      await expect(action)
        .to.emit(incentivesController, 'Withdrawn')
        .withArgs(user.address, userNftId, NFT_LIQUIDITY)
        .and.to.emit(incentivesController, 'Withdrawn')
        .withArgs(user.address, userNftId2, NFT_LIQUIDITY)
    })
  })

  describe('getReward', () => {
    it('Should get all rewards if is the only one staked', async () => {
      const { incentivesController, user, owner, reward } = await loadFixture(
        deployCOntractFixtureWithUserStaked
      )
      await reward.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await reward.balanceOf(user.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([reward.address])
      expect(await reward.balanceOf(user.address)).to.be.gte(K1_TOKENS.sub(1))
    })

    it('Should get 1/3 of all rewards if is the only one staked after 15 days', async () => {
      const { incentivesController, user, owner, reward } = await loadFixture(
        deployCOntractFixtureWithUserStaked
      )
      await reward.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      expect(await reward.balanceOf(user.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([reward.address])
      expect(await reward.balanceOf(user.address)).to.be.eq(K1_TOKENS.div(3))
    })

    it('Should get 2/3 of all rewards if is the only one staked after 30 days', async () => {
      const { incentivesController, user, owner, reward } = await loadFixture(
        deployCOntractFixtureWithUserStaked
      )
      await reward.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(30).mul('86400')).toNumber(),
      ])
      expect(await reward.balanceOf(user.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([reward.address])
      expect(await reward.balanceOf(user.address)).to.be.eq(
        K1_TOKENS.div(3).mul(2)
      )
    })

    it('Should distribute rewards evenly between depositors', async () => {
      const { incentivesController, user, user2, nft, reward, user2NftId } =
        await loadFixture(deployCOntractFixtureWithUserStakedOneNft)
      await nft.connect(user2).approve(incentivesController.address, user2NftId)
      await incentivesController.connect(user2).deposit([user2NftId])
      await reward.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await reward.balanceOf(user.address)).to.be.eq(0)
      expect(await reward.balanceOf(user2.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([reward.address])
      await incentivesController.connect(user2).getReward([reward.address])
      expect(await reward.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
      expect(await reward.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
    })

    it('Should distribute properly when new user deposits during rewards distribution', async () => {
      const { incentivesController, user, user2, nft, reward, user2NftId } =
        await loadFixture(deployCOntractFixtureWithUserStakedOneNft)
      await nft.connect(user2).approve(incentivesController.address, user2NftId)
      await reward.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user2).deposit([user2NftId])
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await reward.balanceOf(user.address)).to.be.eq(0)
      expect(await reward.balanceOf(user2.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([reward.address])
      await incentivesController.connect(user2).getReward([reward.address])
      expect(await reward.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.div(3).mul(2).sub(1)
      )
      expect(await reward.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.div(3).sub(1)
      )
    })

    it('Should distribute properly when new user deposits and old one withdraw', async () => {
      const {
        incentivesController,
        user,
        user2,
        nft,
        reward,
        userNftId,
        user2NftId,
      } = await loadFixture(deployCOntractFixtureWithUserStakedOneNft)
      await nft.connect(user2).approve(incentivesController.address, user2NftId)
      await reward.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user2).deposit([user2NftId])
      expect(await reward.balanceOf(user.address)).to.be.eq(0)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(30).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user).withdraw([userNftId])
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      expect(await reward.balanceOf(user2.address)).to.be.eq(0)
      await incentivesController.connect(user).getReward([reward.address])
      await incentivesController.connect(user2).getReward([reward.address])
      expect(await reward.balanceOf(user.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
      expect(await reward.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.div(2).sub(1)
      )
    })

    it('Should distribute properly when notify rewards is called ', async () => {
      const { incentivesController, user, user2, nft, reward, user2NftId } =
        await loadFixture(deployCOntractFixtureWithUserStakedOneNft)
      await nft.connect(user2).approve(incentivesController.address, user2NftId)
      await incentivesController.connect(user2).deposit([user2NftId])
      await reward.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user2).getReward([reward.address])
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      expect(await reward.balanceOf(user2.address)).to.be.eq(
        K1_TOKENS.div(2).sub(1)
      )
      expect(await reward.balanceOf(user.address)).to.be.eq(0)
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(100).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user).getReward([reward.address])
      await incentivesController.connect(user2).getReward([reward.address])
      await incentivesController.connect(user2).getReward([reward.address])
      expect(await reward.balanceOf(user2.address)).to.be.gte(K1_TOKENS.sub(2))
      await incentivesController.connect(user).getReward([reward.address])
      expect(await reward.balanceOf(user.address)).to.be.gte(K1_TOKENS.sub(2))
    })

    // distribute without stakers
    it('Should distribute into the void if no one is staked', async () => {
      const { incentivesController, user, user2, nft, reward, user2NftId } =
        await loadFixture(deployContractFixture)
      await nft.connect(user2).approve(incentivesController.address, user2NftId)
      await reward.approve(incentivesController.address, K100_TOKENS)
      await incentivesController.notifyReward(
        [reward.address],
        [K1_TOKENS],
        45 * ONE_DAY
      )
      const currentTimestmap = BigNumber.from(
        (await ethers.provider.getBlock('latest')).timestamp
      )
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(15).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user2).deposit([user2NftId])
      expect(await reward.balanceOf(user2.address)).to.be.eq(0)
      // expect(await rewardToken.balanceOf(user.address)).to.be.eq(0);
      await ethers.provider.send('evm_setNextBlockTimestamp', [
        currentTimestmap.add(BigNumber.from(45).mul('86400')).toNumber(),
      ])
      await incentivesController.connect(user2).getReward([reward.address])
      expect(await reward.balanceOf(user2.address)).to.be.gte(
        K1_TOKENS.mul(2).div(3)
      )
    })
  })

  describe('ChangePositionRanges', () => {
    it('Should revert if caller is not owner', async () => {
      const { incentivesController, user } = await loadFixture(
        deployContractFixture
      )
      let action = incentivesController
        .connect(user)
        .changePositionRanges(-1000, 1000)
      await expect(action).to.be.revertedWith('OwnableUnauthorizedAccount')
    })

    it('Should revert if tick lower is gte tick upper', async () => {
      const { incentivesController, owner } = await loadFixture(
        deployContractFixture
      )
      let action = incentivesController
        .connect(owner)
        .changePositionRanges(100, 100)
      await expect(action).to.be.revertedWith('tick lower is gte tick upper')

      let action2 = incentivesController
        .connect(owner)
        .changePositionRanges(101, 100)
      await expect(action2).to.be.revertedWith('tick lower is gte tick upper')
    })

    it('Should change posConfig correctly', async () => {
      const { incentivesController, owner, posConfig } = await loadFixture(
        deployContractFixture
      )
      await incentivesController
        .connect(owner)
        .changePositionRanges(-1000, 1000)
      const posConfigAfter = await incentivesController.posConfig()
      expect(posConfigAfter.tickLower).to.be.eq(-1000)
      expect(posConfigAfter.tickUpper).to.be.eq(1000)
    })
  })
})
