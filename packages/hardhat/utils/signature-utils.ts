import { BigNumber, Signer } from 'ethers'
import { ethers } from 'hardhat'
import { ERC20, ERC20Permit } from '../../hardhat-types/src'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
export interface IVerifyIdentityRequestDto {
  identity: string
  totalAmount: BigNumber
}

export async function getUserVerificationData(
  identity: string,
  amount: BigNumber,
  signer: Signer
): Promise<string> {
  const dto = {
    identity: identity, // user public address
    totalAmount: amount, // total amount of rewards
  }
  const message = constructMessage(dto)
  const signature = await constructSignature(signer, dto)
  const identityVerifierData = await encodeDataForSmartContractCall(
    message,
    signature,
    amount
  )

  return identityVerifierData
}

export function constructMessage(dto: IVerifyIdentityRequestDto): string {
  const payload = ethers.utils.solidityPack(
    ['address', 'uint256'],
    [dto.identity, dto.totalAmount]
  )
  return ethers.utils.hashMessage(ethers.utils.arrayify(payload))
}

export async function constructSignature(
  signer: Signer,
  dto: IVerifyIdentityRequestDto
): Promise<string> {
  const payload = ethers.utils.solidityPack(
    ['address', 'uint256'],
    [dto.identity, dto.totalAmount]
  )
  return await signer.signMessage(ethers.utils.arrayify(payload))
}

export async function encodeDataForSmartContractCall(
  message: string,
  signature: string,
  totalAmount: BigNumber
): Promise<string> {
  return ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'bytes32', 'bytes'],
    [totalAmount, message, signature]
  )
}

// set the Permit type parameters
const types = {
  Permit: [
    {
      name: 'owner',
      type: 'address',
    },
    {
      name: 'spender',
      type: 'address',
    },
    {
      name: 'value',
      type: 'uint256',
    },
    {
      name: 'nonce',
      type: 'uint256',
    },
    {
      name: 'deadline',
      type: 'uint256',
    },
  ],
}

export async function signPermit(
  myToken: ERC20Permit,
  tokenOwner: SignerWithAddress,
  tokenReceiver: string,
  value: BigNumber,
  deadline: number
): Promise<{
  owner: string
  spender: string
  value: BigNumber
  deadline: number
  v: number
  r: string
  s: string
}> {
  // get the current nonce for the deployer address
  const nonces = await myToken.nonces(tokenOwner.address)

  // set the domain parameters
  const domain = {
    name: await myToken.name(),
    version: '1',
    chainId: (await ethers.provider.getNetwork()).chainId,
    verifyingContract: myToken.address,
  }

  // set the Permit type values
  const values = {
    owner: tokenOwner.address,
    spender: tokenReceiver,
    value: value,
    nonce: nonces,
    deadline: deadline,
  }

  // sign the Permit type data with the deployer's private key
  const signature = await tokenOwner._signTypedData(domain, types, values)

  // split the signature into its components
  const sig = ethers.utils.splitSignature(signature)

  // verify the Permit type data with the signature
  const recovered = ethers.utils.verifyTypedData(domain, types, values, sig)

  return {
    owner: tokenOwner.address,
    spender: tokenReceiver,
    value: value,
    deadline: deadline,
    v: sig.v,
    r: sig.r,
    s: sig.s,
  }
}
