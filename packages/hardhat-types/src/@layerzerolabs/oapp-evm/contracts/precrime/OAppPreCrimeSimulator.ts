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
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../../common";

export type OriginStruct = {
  srcEid: PromiseOrValue<BigNumberish>;
  sender: PromiseOrValue<BytesLike>;
  nonce: PromiseOrValue<BigNumberish>;
};

export type OriginStructOutput = [number, string, BigNumber] & {
  srcEid: number;
  sender: string;
  nonce: BigNumber;
};

export type InboundPacketStruct = {
  origin: OriginStruct;
  dstEid: PromiseOrValue<BigNumberish>;
  receiver: PromiseOrValue<string>;
  guid: PromiseOrValue<BytesLike>;
  value: PromiseOrValue<BigNumberish>;
  executor: PromiseOrValue<string>;
  message: PromiseOrValue<BytesLike>;
  extraData: PromiseOrValue<BytesLike>;
};

export type InboundPacketStructOutput = [
  OriginStructOutput,
  number,
  string,
  string,
  BigNumber,
  string,
  string,
  string
] & {
  origin: OriginStructOutput;
  dstEid: number;
  receiver: string;
  guid: string;
  value: BigNumber;
  executor: string;
  message: string;
  extraData: string;
};

export interface OAppPreCrimeSimulatorInterface extends utils.Interface {
  functions: {
    "isPeer(uint32,bytes32)": FunctionFragment;
    "lzReceiveAndRevert(((uint32,bytes32,uint64),uint32,address,bytes32,uint256,address,bytes,bytes)[])": FunctionFragment;
    "lzReceiveSimulate((uint32,bytes32,uint64),bytes32,bytes,address,bytes)": FunctionFragment;
    "oApp()": FunctionFragment;
    "owner()": FunctionFragment;
    "preCrime()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setPreCrime(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "isPeer"
      | "lzReceiveAndRevert"
      | "lzReceiveSimulate"
      | "oApp"
      | "owner"
      | "preCrime"
      | "renounceOwnership"
      | "setPreCrime"
      | "transferOwnership"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "isPeer",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "lzReceiveAndRevert",
    values: [InboundPacketStruct[]]
  ): string;
  encodeFunctionData(
    functionFragment: "lzReceiveSimulate",
    values: [
      OriginStruct,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<string>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(functionFragment: "oApp", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "preCrime", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setPreCrime",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "isPeer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "lzReceiveAndRevert",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lzReceiveSimulate",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oApp", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "preCrime", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPreCrime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "PreCrimeSet(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PreCrimeSet"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface PreCrimeSetEventObject {
  preCrimeAddress: string;
}
export type PreCrimeSetEvent = TypedEvent<[string], PreCrimeSetEventObject>;

export type PreCrimeSetEventFilter = TypedEventFilter<PreCrimeSetEvent>;

export interface OAppPreCrimeSimulator extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: OAppPreCrimeSimulatorInterface;

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
    isPeer(
      _eid: PromiseOrValue<BigNumberish>,
      _peer: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    lzReceiveAndRevert(
      _packets: InboundPacketStruct[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    lzReceiveSimulate(
      _origin: OriginStruct,
      _guid: PromiseOrValue<BytesLike>,
      _message: PromiseOrValue<BytesLike>,
      _executor: PromiseOrValue<string>,
      _extraData: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    oApp(overrides?: CallOverrides): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    preCrime(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPreCrime(
      _preCrime: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  isPeer(
    _eid: PromiseOrValue<BigNumberish>,
    _peer: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  lzReceiveAndRevert(
    _packets: InboundPacketStruct[],
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  lzReceiveSimulate(
    _origin: OriginStruct,
    _guid: PromiseOrValue<BytesLike>,
    _message: PromiseOrValue<BytesLike>,
    _executor: PromiseOrValue<string>,
    _extraData: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  oApp(overrides?: CallOverrides): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  preCrime(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPreCrime(
    _preCrime: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    isPeer(
      _eid: PromiseOrValue<BigNumberish>,
      _peer: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    lzReceiveAndRevert(
      _packets: InboundPacketStruct[],
      overrides?: CallOverrides
    ): Promise<void>;

    lzReceiveSimulate(
      _origin: OriginStruct,
      _guid: PromiseOrValue<BytesLike>,
      _message: PromiseOrValue<BytesLike>,
      _executor: PromiseOrValue<string>,
      _extraData: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    oApp(overrides?: CallOverrides): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    preCrime(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setPreCrime(
      _preCrime: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "PreCrimeSet(address)"(preCrimeAddress?: null): PreCrimeSetEventFilter;
    PreCrimeSet(preCrimeAddress?: null): PreCrimeSetEventFilter;
  };

  estimateGas: {
    isPeer(
      _eid: PromiseOrValue<BigNumberish>,
      _peer: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lzReceiveAndRevert(
      _packets: InboundPacketStruct[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    lzReceiveSimulate(
      _origin: OriginStruct,
      _guid: PromiseOrValue<BytesLike>,
      _message: PromiseOrValue<BytesLike>,
      _executor: PromiseOrValue<string>,
      _extraData: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    oApp(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    preCrime(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPreCrime(
      _preCrime: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    isPeer(
      _eid: PromiseOrValue<BigNumberish>,
      _peer: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lzReceiveAndRevert(
      _packets: InboundPacketStruct[],
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    lzReceiveSimulate(
      _origin: OriginStruct,
      _guid: PromiseOrValue<BytesLike>,
      _message: PromiseOrValue<BytesLike>,
      _executor: PromiseOrValue<string>,
      _extraData: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    oApp(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    preCrime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPreCrime(
      _preCrime: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}