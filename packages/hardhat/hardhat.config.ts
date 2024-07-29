import fs from 'fs'
import path from 'path'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import '@typechain/hardhat'
import { task } from 'hardhat/config'
import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-uniswap'
import 'hardhat-contract-sizer'
import '@openzeppelin/hardhat-upgrades'

import { config as envConfig } from './.env/vars'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('tasksOnInit', 'Delete localContractAddress.ts', async (_args, hre) => {
  const contractsDir = path.join(hre.config.paths.root, '../hardhat-types/src')
  const filePath = path.join(contractsDir, '/localContractAddress.ts')
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    console.log('File localContractAddress.ts deleted')
  } else {
    console.log('File localContractAddress.ts not found')
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig & {
  typechain: {}
  etherscan: {}
} = {
  solidity: {
    compilers: [
      {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  // paths: {
  //   artifacts: '../frontend/artifacts',
  // },
  networks: {
    hardhat: {
      chainId: 1337,
      allowBlocksWithSameTimestamp: true,
      mining: {
        auto: true,
        interval: 12000,
      },
    },
    base: {
      url: `https://base-mainnet.g.alchemy.com/v2/${envConfig.ALCHEMY_BASE_API_KEY}`,
      accounts: [`0x${envConfig.BASE_PRIVATE_KEY}`],
    },
    basesepolia: {
      url: `https://base-sepolia.g.alchemy.com/v2/${envConfig.ALCHEMY_BASESEPOLIA_API_KEY}`,
      accounts: [`0x${envConfig.BASESEPOLIA_PRIVATE_KEY}`],
    },
  },
  typechain: {
    outDir: '../hardhat-types/src',
  },
  mocha: {
    timeout: 100000,
  },
  etherscan: {
    apiKey: envConfig.BASESCAN_API_KEY,
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org/',
        },
      },
      {
        network: 'basesepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org/',
        },
      },
    ],
  },
}

export default config
