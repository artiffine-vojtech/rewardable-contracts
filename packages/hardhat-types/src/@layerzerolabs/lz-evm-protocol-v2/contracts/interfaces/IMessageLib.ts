/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export type SetConfigParamStruct = {
  eid: PromiseOrValue<BigNumberish>;
  configType: PromiseOrValue<BigNumberish>;
  config: PromiseOrValue<BytesLike>;
};

export type SetConfigParamStructOutput = [number, number, string] & {
  eid: number;
  configType: number;
  config: string;
};

export interface IMessageLibInterface extends utils.Interface {
  functions: {
    "getConfig(uint32,address,uint32)": FunctionFragment;
    "isSupportedEid(uint32)": FunctionFragment;
    "messageLibType()": FunctionFragment;
    "setConfig(address,(uint32,uint32,bytes)[])": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "version()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getConfig"
      | "isSupportedEid"
      | "messageLibType"
      | "setConfig"
      | "supportsInterface"
      | "version"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getConfig",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "isSupportedEid",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "messageLibType",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setConfig",
    values: [PromiseOrValue<string>, SetConfigParamStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(functionFragment: "version", values?: undefined): string;

  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isSupportedEid",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "messageLibType",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "version", data: BytesLike): Result;

  events: {};
}

export interface IMessageLib extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IMessageLibInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    getConfig(
      _eid: PromiseOrValue<BigNumberish>,
      _oapp: PromiseOrValue<string>,
      _configType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string] & { config: string }>;

    isSupportedEid(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    messageLibType(overrides?: CallOverrides): Promise<[number]>;

    setConfig(
      _oapp: PromiseOrValue<string>,
      _config: SetConfigParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    version(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number] & {
        major: BigNumber;
        minor: number;
        endpointVersion: number;
      }
    >;
  };

  getConfig(
    _eid: PromiseOrValue<BigNumberish>,
    _oapp: PromiseOrValue<string>,
    _configType: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  isSupportedEid(
    _eid: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  messageLibType(overrides?: CallOverrides): Promise<number>;

  setConfig(
    _oapp: PromiseOrValue<string>,
    _config: SetConfigParamStruct[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  version(
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, number, number] & {
      major: BigNumber;
      minor: number;
      endpointVersion: number;
    }
  >;

  callStatic: {
    getConfig(
      _eid: PromiseOrValue<BigNumberish>,
      _oapp: PromiseOrValue<string>,
      _configType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    isSupportedEid(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    messageLibType(overrides?: CallOverrides): Promise<number>;

    setConfig(
      _oapp: PromiseOrValue<string>,
      _config: SetConfigParamStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    version(
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, number, number] & {
        major: BigNumber;
        minor: number;
        endpointVersion: number;
      }
    >;
  };

  filters: {};

  estimateGas: {
    getConfig(
      _eid: PromiseOrValue<BigNumberish>,
      _oapp: PromiseOrValue<string>,
      _configType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSupportedEid(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    messageLibType(overrides?: CallOverrides): Promise<BigNumber>;

    setConfig(
      _oapp: PromiseOrValue<string>,
      _config: SetConfigParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    version(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getConfig(
      _eid: PromiseOrValue<BigNumberish>,
      _oapp: PromiseOrValue<string>,
      _configType: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isSupportedEid(
      _eid: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    messageLibType(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setConfig(
      _oapp: PromiseOrValue<string>,
      _config: SetConfigParamStruct[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    version(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
