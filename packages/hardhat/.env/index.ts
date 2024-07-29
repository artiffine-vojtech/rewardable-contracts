import { config } from './vars'

interface IConfig {
  // base
  BASE_PRIVATE_KEY: string
  ALCHEMY_BASE_API_KEY: string
  // base sepolia
  BASESEPOLIA_PRIVATE_KEY: string
  ALCHEMY_BASESEPOLIA_API_KEY: string
  // etherscan
  BASESCAN_API_KEY: string
}

export type { IConfig }
export { config }
