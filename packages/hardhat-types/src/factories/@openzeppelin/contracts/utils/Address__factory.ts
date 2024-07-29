/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  Address,
  AddressInterface,
} from "../../../../@openzeppelin/contracts/utils/Address";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220392427b1e888aadbfe3f42cc0d1b284486556b79086a058148212d565f71014064736f6c63430008180033";

type AddressConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AddressConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Address__factory extends ContractFactory {
  constructor(...args: AddressConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Address> {
    return super.deploy(overrides || {}) as Promise<Address>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Address {
    return super.attach(address) as Address;
  }
  override connect(signer: Signer): Address__factory {
    return super.connect(signer) as Address__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AddressInterface {
    return new utils.Interface(_abi) as AddressInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Address {
    return new Contract(address, _abi, signerOrProvider) as Address;
  }
}
