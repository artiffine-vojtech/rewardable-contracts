/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  OptionsBuilder,
  OptionsBuilderInterface,
} from "../../../../../../@layerzerolabs/oapp-evm/contracts/oapp/libs/OptionsBuilder";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint16",
        name: "optionType",
        type: "uint16",
      },
    ],
    name: "InvalidOptionType",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "max",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "actual",
        type: "uint256",
      },
    ],
    name: "InvalidSize",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220c6a821391c159647388ea6f4e24a3bc4b325830a155b11e9f93f30ac177e950a64736f6c63430008180033";

type OptionsBuilderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: OptionsBuilderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class OptionsBuilder__factory extends ContractFactory {
  constructor(...args: OptionsBuilderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<OptionsBuilder> {
    return super.deploy(overrides || {}) as Promise<OptionsBuilder>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): OptionsBuilder {
    return super.attach(address) as OptionsBuilder;
  }
  override connect(signer: Signer): OptionsBuilder__factory {
    return super.connect(signer) as OptionsBuilder__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): OptionsBuilderInterface {
    return new utils.Interface(_abi) as OptionsBuilderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): OptionsBuilder {
    return new Contract(address, _abi, signerOrProvider) as OptionsBuilder;
  }
}
