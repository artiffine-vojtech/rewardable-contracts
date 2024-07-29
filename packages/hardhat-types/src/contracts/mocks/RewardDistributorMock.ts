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
} from "../../common";

export interface RewardDistributorMockInterface extends utils.Interface {
  functions: {
    "UPGRADE_INTERFACE_VERSION()": FunctionFragment;
    "addToTest()": FunctionFragment;
    "burnFee()": FunctionFragment;
    "createTask(uint256,address)": FunctionFragment;
    "createTaskWithPermit(uint256,address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "feeReceiver()": FunctionFragment;
    "initialize(address,address,address,address,uint256,uint256,uint256,uint256)": FunctionFragment;
    "maxDailyWithdrawal()": FunctionFragment;
    "minWithdrawalAmount()": FunctionFragment;
    "owner()": FunctionFragment;
    "platformFee()": FunctionFragment;
    "proxiableUUID()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "rewardToken()": FunctionFragment;
    "setBurnFee(uint256)": FunctionFragment;
    "setFeeReceiver(address)": FunctionFragment;
    "setMaxDailyWithdrawal(uint256)": FunctionFragment;
    "setPlatformFee(uint256)": FunctionFragment;
    "setTokenAdmin(address)": FunctionFragment;
    "taskRewards(uint256)": FunctionFragment;
    "test()": FunctionFragment;
    "tokenAdmin()": FunctionFragment;
    "topUpTask(uint256,uint256,address)": FunctionFragment;
    "topUpTaskWithPermit(uint256,uint256,address,uint256,uint256,uint8,bytes32,bytes32)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "upgradeToAndCall(address,bytes)": FunctionFragment;
    "withdrawRewards(address,uint256,bytes)": FunctionFragment;
    "withdrawnRewards(address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "UPGRADE_INTERFACE_VERSION"
      | "addToTest"
      | "burnFee"
      | "createTask"
      | "createTaskWithPermit"
      | "feeReceiver"
      | "initialize"
      | "maxDailyWithdrawal"
      | "minWithdrawalAmount"
      | "owner"
      | "platformFee"
      | "proxiableUUID"
      | "renounceOwnership"
      | "rewardToken"
      | "setBurnFee"
      | "setFeeReceiver"
      | "setMaxDailyWithdrawal"
      | "setPlatformFee"
      | "setTokenAdmin"
      | "taskRewards"
      | "test"
      | "tokenAdmin"
      | "topUpTask"
      | "topUpTaskWithPermit"
      | "transferOwnership"
      | "upgradeToAndCall"
      | "withdrawRewards"
      | "withdrawnRewards"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "UPGRADE_INTERFACE_VERSION",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "addToTest", values?: undefined): string;
  encodeFunctionData(functionFragment: "burnFee", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "createTask",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "createTaskWithPermit",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "feeReceiver",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "maxDailyWithdrawal",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minWithdrawalAmount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "platformFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "proxiableUUID",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setBurnFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setFeeReceiver",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxDailyWithdrawal",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setPlatformFee",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTokenAdmin",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "taskRewards",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "test", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "topUpTask",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "topUpTaskWithPermit",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeToAndCall",
    values: [PromiseOrValue<string>, PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawRewards",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BytesLike>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawnRewards",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "UPGRADE_INTERFACE_VERSION",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addToTest", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burnFee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createTask", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createTaskWithPermit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "feeReceiver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxDailyWithdrawal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minWithdrawalAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "platformFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "proxiableUUID",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setBurnFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setFeeReceiver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxDailyWithdrawal",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setPlatformFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTokenAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "taskRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "test", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "tokenAdmin", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "topUpTask", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "topUpTaskWithPermit",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "upgradeToAndCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawRewards",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawnRewards",
    data: BytesLike
  ): Result;

  events: {
    "BurnFeeSet(uint256)": EventFragment;
    "FeeReceiverSet(address)": EventFragment;
    "Initialized(uint64)": EventFragment;
    "MaxDailyWithdrawalSet(uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "PlatformFeeSet(uint256)": EventFragment;
    "ProcessedFees(uint256,uint256)": EventFragment;
    "TaskCreated(uint256,uint256,address)": EventFragment;
    "TaskToppedUp(uint256,uint256,address)": EventFragment;
    "TokenAdminSet(address)": EventFragment;
    "Upgraded(address)": EventFragment;
    "WithdrawnRewards(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BurnFeeSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "FeeReceiverSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Initialized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MaxDailyWithdrawalSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PlatformFeeSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProcessedFees"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TaskCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TaskToppedUp"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenAdminSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Upgraded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "WithdrawnRewards"): EventFragment;
}

export interface BurnFeeSetEventObject {
  burnFee: BigNumber;
}
export type BurnFeeSetEvent = TypedEvent<[BigNumber], BurnFeeSetEventObject>;

export type BurnFeeSetEventFilter = TypedEventFilter<BurnFeeSetEvent>;

export interface FeeReceiverSetEventObject {
  feeReceiver: string;
}
export type FeeReceiverSetEvent = TypedEvent<
  [string],
  FeeReceiverSetEventObject
>;

export type FeeReceiverSetEventFilter = TypedEventFilter<FeeReceiverSetEvent>;

export interface InitializedEventObject {
  version: BigNumber;
}
export type InitializedEvent = TypedEvent<[BigNumber], InitializedEventObject>;

export type InitializedEventFilter = TypedEventFilter<InitializedEvent>;

export interface MaxDailyWithdrawalSetEventObject {
  maxDailyWithdrawal: BigNumber;
}
export type MaxDailyWithdrawalSetEvent = TypedEvent<
  [BigNumber],
  MaxDailyWithdrawalSetEventObject
>;

export type MaxDailyWithdrawalSetEventFilter =
  TypedEventFilter<MaxDailyWithdrawalSetEvent>;

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

export interface PlatformFeeSetEventObject {
  platformFee: BigNumber;
}
export type PlatformFeeSetEvent = TypedEvent<
  [BigNumber],
  PlatformFeeSetEventObject
>;

export type PlatformFeeSetEventFilter = TypedEventFilter<PlatformFeeSetEvent>;

export interface ProcessedFeesEventObject {
  platformFee: BigNumber;
  burnAmount: BigNumber;
}
export type ProcessedFeesEvent = TypedEvent<
  [BigNumber, BigNumber],
  ProcessedFeesEventObject
>;

export type ProcessedFeesEventFilter = TypedEventFilter<ProcessedFeesEvent>;

export interface TaskCreatedEventObject {
  id: BigNumber;
  rewardAmount: BigNumber;
  sponsor: string;
}
export type TaskCreatedEvent = TypedEvent<
  [BigNumber, BigNumber, string],
  TaskCreatedEventObject
>;

export type TaskCreatedEventFilter = TypedEventFilter<TaskCreatedEvent>;

export interface TaskToppedUpEventObject {
  id: BigNumber;
  rewardAmount: BigNumber;
  sponsor: string;
}
export type TaskToppedUpEvent = TypedEvent<
  [BigNumber, BigNumber, string],
  TaskToppedUpEventObject
>;

export type TaskToppedUpEventFilter = TypedEventFilter<TaskToppedUpEvent>;

export interface TokenAdminSetEventObject {
  tokenAdmin: string;
}
export type TokenAdminSetEvent = TypedEvent<[string], TokenAdminSetEventObject>;

export type TokenAdminSetEventFilter = TypedEventFilter<TokenAdminSetEvent>;

export interface UpgradedEventObject {
  implementation: string;
}
export type UpgradedEvent = TypedEvent<[string], UpgradedEventObject>;

export type UpgradedEventFilter = TypedEventFilter<UpgradedEvent>;

export interface WithdrawnRewardsEventObject {
  identity: string;
  amount: BigNumber;
}
export type WithdrawnRewardsEvent = TypedEvent<
  [string, BigNumber],
  WithdrawnRewardsEventObject
>;

export type WithdrawnRewardsEventFilter =
  TypedEventFilter<WithdrawnRewardsEvent>;

export interface RewardDistributorMock extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: RewardDistributorMockInterface;

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
    UPGRADE_INTERFACE_VERSION(overrides?: CallOverrides): Promise<[string]>;

    addToTest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    burnFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    createTask(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createTaskWithPermit(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _deadline: PromiseOrValue<BigNumberish>,
      _v: PromiseOrValue<BigNumberish>,
      _r: PromiseOrValue<BytesLike>,
      _s: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    feeReceiver(overrides?: CallOverrides): Promise<[string]>;

    initialize(
      _owner: PromiseOrValue<string>,
      _rewardToken: PromiseOrValue<string>,
      _tokenAdmin: PromiseOrValue<string>,
      _feeReceiver: PromiseOrValue<string>,
      _burnFee: PromiseOrValue<BigNumberish>,
      _platformFee: PromiseOrValue<BigNumberish>,
      _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
      _minWithdrawalAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    maxDailyWithdrawal(overrides?: CallOverrides): Promise<[BigNumber]>;

    minWithdrawalAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    platformFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    proxiableUUID(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<[string]>;

    setBurnFee(
      _burnFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setFeeReceiver(
      _feeReceiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMaxDailyWithdrawal(
      _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setPlatformFee(
      _platformFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTokenAdmin(
      _tokenAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    taskRewards(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    test(overrides?: CallOverrides): Promise<[BigNumber]>;

    tokenAdmin(overrides?: CallOverrides): Promise<[string]>;

    topUpTask(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _id: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    topUpTaskWithPermit(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _id: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _deadline: PromiseOrValue<BigNumberish>,
      _v: PromiseOrValue<BigNumberish>,
      _r: PromiseOrValue<BytesLike>,
      _s: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawRewards(
      _identity: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdrawnRewards(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  UPGRADE_INTERFACE_VERSION(overrides?: CallOverrides): Promise<string>;

  addToTest(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  burnFee(overrides?: CallOverrides): Promise<BigNumber>;

  createTask(
    _rewardAmount: PromiseOrValue<BigNumberish>,
    _sponsor: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createTaskWithPermit(
    _rewardAmount: PromiseOrValue<BigNumberish>,
    _sponsor: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    _deadline: PromiseOrValue<BigNumberish>,
    _v: PromiseOrValue<BigNumberish>,
    _r: PromiseOrValue<BytesLike>,
    _s: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  feeReceiver(overrides?: CallOverrides): Promise<string>;

  initialize(
    _owner: PromiseOrValue<string>,
    _rewardToken: PromiseOrValue<string>,
    _tokenAdmin: PromiseOrValue<string>,
    _feeReceiver: PromiseOrValue<string>,
    _burnFee: PromiseOrValue<BigNumberish>,
    _platformFee: PromiseOrValue<BigNumberish>,
    _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
    _minWithdrawalAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  maxDailyWithdrawal(overrides?: CallOverrides): Promise<BigNumber>;

  minWithdrawalAmount(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  platformFee(overrides?: CallOverrides): Promise<BigNumber>;

  proxiableUUID(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  rewardToken(overrides?: CallOverrides): Promise<string>;

  setBurnFee(
    _burnFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setFeeReceiver(
    _feeReceiver: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMaxDailyWithdrawal(
    _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setPlatformFee(
    _platformFee: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTokenAdmin(
    _tokenAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  taskRewards(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  test(overrides?: CallOverrides): Promise<BigNumber>;

  tokenAdmin(overrides?: CallOverrides): Promise<string>;

  topUpTask(
    _rewardAmount: PromiseOrValue<BigNumberish>,
    _id: PromiseOrValue<BigNumberish>,
    _sponsor: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  topUpTaskWithPermit(
    _rewardAmount: PromiseOrValue<BigNumberish>,
    _id: PromiseOrValue<BigNumberish>,
    _sponsor: PromiseOrValue<string>,
    _value: PromiseOrValue<BigNumberish>,
    _deadline: PromiseOrValue<BigNumberish>,
    _v: PromiseOrValue<BigNumberish>,
    _r: PromiseOrValue<BytesLike>,
    _s: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  upgradeToAndCall(
    newImplementation: PromiseOrValue<string>,
    data: PromiseOrValue<BytesLike>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawRewards(
    _identity: PromiseOrValue<string>,
    _amount: PromiseOrValue<BigNumberish>,
    _data: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdrawnRewards(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    UPGRADE_INTERFACE_VERSION(overrides?: CallOverrides): Promise<string>;

    addToTest(overrides?: CallOverrides): Promise<void>;

    burnFee(overrides?: CallOverrides): Promise<BigNumber>;

    createTask(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createTaskWithPermit(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _deadline: PromiseOrValue<BigNumberish>,
      _v: PromiseOrValue<BigNumberish>,
      _r: PromiseOrValue<BytesLike>,
      _s: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    feeReceiver(overrides?: CallOverrides): Promise<string>;

    initialize(
      _owner: PromiseOrValue<string>,
      _rewardToken: PromiseOrValue<string>,
      _tokenAdmin: PromiseOrValue<string>,
      _feeReceiver: PromiseOrValue<string>,
      _burnFee: PromiseOrValue<BigNumberish>,
      _platformFee: PromiseOrValue<BigNumberish>,
      _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
      _minWithdrawalAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    maxDailyWithdrawal(overrides?: CallOverrides): Promise<BigNumber>;

    minWithdrawalAmount(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    platformFee(overrides?: CallOverrides): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    rewardToken(overrides?: CallOverrides): Promise<string>;

    setBurnFee(
      _burnFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setFeeReceiver(
      _feeReceiver: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxDailyWithdrawal(
      _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setPlatformFee(
      _platformFee: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTokenAdmin(
      _tokenAdmin: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    taskRewards(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    test(overrides?: CallOverrides): Promise<BigNumber>;

    tokenAdmin(overrides?: CallOverrides): Promise<string>;

    topUpTask(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _id: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    topUpTaskWithPermit(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _id: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _deadline: PromiseOrValue<BigNumberish>,
      _v: PromiseOrValue<BigNumberish>,
      _r: PromiseOrValue<BytesLike>,
      _s: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawRewards(
      _identity: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdrawnRewards(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {
    "BurnFeeSet(uint256)"(
      burnFee?: PromiseOrValue<BigNumberish> | null
    ): BurnFeeSetEventFilter;
    BurnFeeSet(
      burnFee?: PromiseOrValue<BigNumberish> | null
    ): BurnFeeSetEventFilter;

    "FeeReceiverSet(address)"(
      feeReceiver?: PromiseOrValue<string> | null
    ): FeeReceiverSetEventFilter;
    FeeReceiverSet(
      feeReceiver?: PromiseOrValue<string> | null
    ): FeeReceiverSetEventFilter;

    "Initialized(uint64)"(version?: null): InitializedEventFilter;
    Initialized(version?: null): InitializedEventFilter;

    "MaxDailyWithdrawalSet(uint256)"(
      maxDailyWithdrawal?: PromiseOrValue<BigNumberish> | null
    ): MaxDailyWithdrawalSetEventFilter;
    MaxDailyWithdrawalSet(
      maxDailyWithdrawal?: PromiseOrValue<BigNumberish> | null
    ): MaxDailyWithdrawalSetEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "PlatformFeeSet(uint256)"(
      platformFee?: PromiseOrValue<BigNumberish> | null
    ): PlatformFeeSetEventFilter;
    PlatformFeeSet(
      platformFee?: PromiseOrValue<BigNumberish> | null
    ): PlatformFeeSetEventFilter;

    "ProcessedFees(uint256,uint256)"(
      platformFee?: PromiseOrValue<BigNumberish> | null,
      burnAmount?: PromiseOrValue<BigNumberish> | null
    ): ProcessedFeesEventFilter;
    ProcessedFees(
      platformFee?: PromiseOrValue<BigNumberish> | null,
      burnAmount?: PromiseOrValue<BigNumberish> | null
    ): ProcessedFeesEventFilter;

    "TaskCreated(uint256,uint256,address)"(
      id?: PromiseOrValue<BigNumberish> | null,
      rewardAmount?: PromiseOrValue<BigNumberish> | null,
      sponsor?: PromiseOrValue<string> | null
    ): TaskCreatedEventFilter;
    TaskCreated(
      id?: PromiseOrValue<BigNumberish> | null,
      rewardAmount?: PromiseOrValue<BigNumberish> | null,
      sponsor?: PromiseOrValue<string> | null
    ): TaskCreatedEventFilter;

    "TaskToppedUp(uint256,uint256,address)"(
      id?: PromiseOrValue<BigNumberish> | null,
      rewardAmount?: PromiseOrValue<BigNumberish> | null,
      sponsor?: PromiseOrValue<string> | null
    ): TaskToppedUpEventFilter;
    TaskToppedUp(
      id?: PromiseOrValue<BigNumberish> | null,
      rewardAmount?: PromiseOrValue<BigNumberish> | null,
      sponsor?: PromiseOrValue<string> | null
    ): TaskToppedUpEventFilter;

    "TokenAdminSet(address)"(
      tokenAdmin?: PromiseOrValue<string> | null
    ): TokenAdminSetEventFilter;
    TokenAdminSet(
      tokenAdmin?: PromiseOrValue<string> | null
    ): TokenAdminSetEventFilter;

    "Upgraded(address)"(
      implementation?: PromiseOrValue<string> | null
    ): UpgradedEventFilter;
    Upgraded(
      implementation?: PromiseOrValue<string> | null
    ): UpgradedEventFilter;

    "WithdrawnRewards(address,uint256)"(
      identity?: PromiseOrValue<string> | null,
      amount?: PromiseOrValue<BigNumberish> | null
    ): WithdrawnRewardsEventFilter;
    WithdrawnRewards(
      identity?: PromiseOrValue<string> | null,
      amount?: PromiseOrValue<BigNumberish> | null
    ): WithdrawnRewardsEventFilter;
  };

  estimateGas: {
    UPGRADE_INTERFACE_VERSION(overrides?: CallOverrides): Promise<BigNumber>;

    addToTest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    burnFee(overrides?: CallOverrides): Promise<BigNumber>;

    createTask(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createTaskWithPermit(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _deadline: PromiseOrValue<BigNumberish>,
      _v: PromiseOrValue<BigNumberish>,
      _r: PromiseOrValue<BytesLike>,
      _s: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    feeReceiver(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _owner: PromiseOrValue<string>,
      _rewardToken: PromiseOrValue<string>,
      _tokenAdmin: PromiseOrValue<string>,
      _feeReceiver: PromiseOrValue<string>,
      _burnFee: PromiseOrValue<BigNumberish>,
      _platformFee: PromiseOrValue<BigNumberish>,
      _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
      _minWithdrawalAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    maxDailyWithdrawal(overrides?: CallOverrides): Promise<BigNumber>;

    minWithdrawalAmount(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    platformFee(overrides?: CallOverrides): Promise<BigNumber>;

    proxiableUUID(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    rewardToken(overrides?: CallOverrides): Promise<BigNumber>;

    setBurnFee(
      _burnFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setFeeReceiver(
      _feeReceiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMaxDailyWithdrawal(
      _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setPlatformFee(
      _platformFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTokenAdmin(
      _tokenAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    taskRewards(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    test(overrides?: CallOverrides): Promise<BigNumber>;

    tokenAdmin(overrides?: CallOverrides): Promise<BigNumber>;

    topUpTask(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _id: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    topUpTaskWithPermit(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _id: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _deadline: PromiseOrValue<BigNumberish>,
      _v: PromiseOrValue<BigNumberish>,
      _r: PromiseOrValue<BytesLike>,
      _s: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawRewards(
      _identity: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdrawnRewards(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    UPGRADE_INTERFACE_VERSION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addToTest(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    burnFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    createTask(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createTaskWithPermit(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _deadline: PromiseOrValue<BigNumberish>,
      _v: PromiseOrValue<BigNumberish>,
      _r: PromiseOrValue<BytesLike>,
      _s: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    feeReceiver(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    initialize(
      _owner: PromiseOrValue<string>,
      _rewardToken: PromiseOrValue<string>,
      _tokenAdmin: PromiseOrValue<string>,
      _feeReceiver: PromiseOrValue<string>,
      _burnFee: PromiseOrValue<BigNumberish>,
      _platformFee: PromiseOrValue<BigNumberish>,
      _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
      _minWithdrawalAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    maxDailyWithdrawal(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    minWithdrawalAmount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    platformFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proxiableUUID(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    rewardToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setBurnFee(
      _burnFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setFeeReceiver(
      _feeReceiver: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMaxDailyWithdrawal(
      _maxDailyWithdrawal: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setPlatformFee(
      _platformFee: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTokenAdmin(
      _tokenAdmin: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    taskRewards(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    test(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenAdmin(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    topUpTask(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _id: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    topUpTaskWithPermit(
      _rewardAmount: PromiseOrValue<BigNumberish>,
      _id: PromiseOrValue<BigNumberish>,
      _sponsor: PromiseOrValue<string>,
      _value: PromiseOrValue<BigNumberish>,
      _deadline: PromiseOrValue<BigNumberish>,
      _v: PromiseOrValue<BigNumberish>,
      _r: PromiseOrValue<BytesLike>,
      _s: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    upgradeToAndCall(
      newImplementation: PromiseOrValue<string>,
      data: PromiseOrValue<BytesLike>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawRewards(
      _identity: PromiseOrValue<string>,
      _amount: PromiseOrValue<BigNumberish>,
      _data: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdrawnRewards(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
