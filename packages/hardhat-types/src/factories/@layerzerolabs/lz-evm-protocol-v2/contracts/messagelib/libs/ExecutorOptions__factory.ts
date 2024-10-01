/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  ExecutorOptions,
  ExecutorOptionsInterface,
} from "../../../../../../@layerzerolabs/lz-evm-protocol-v2/contracts/messagelib/libs/ExecutorOptions";

const _abi = [
  {
    inputs: [],
    name: "Executor_InvalidLzComposeOption",
    type: "error",
  },
  {
    inputs: [],
    name: "Executor_InvalidLzReceiveOption",
    type: "error",
  },
  {
    inputs: [],
    name: "Executor_InvalidNativeDropOption",
    type: "error",
  },
] as const;

const _bytecode =
  "0x60566037600b82828239805160001a607314602a57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600080fdfea2646970667358221220bee9eda8c1960ba80685e28061a43eaed86195b8f54630b115ff8cddc30547cd64736f6c63430008180033";

type ExecutorOptionsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ExecutorOptionsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ExecutorOptions__factory extends ContractFactory {
  constructor(...args: ExecutorOptionsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ExecutorOptions> {
    return super.deploy(overrides || {}) as Promise<ExecutorOptions>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ExecutorOptions {
    return super.attach(address) as ExecutorOptions;
  }
  override connect(signer: Signer): ExecutorOptions__factory {
    return super.connect(signer) as ExecutorOptions__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ExecutorOptionsInterface {
    return new utils.Interface(_abi) as ExecutorOptionsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ExecutorOptions {
    return new Contract(address, _abi, signerOrProvider) as ExecutorOptions;
  }
}