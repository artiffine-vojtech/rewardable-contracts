/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  RewardDistributorMock,
  RewardDistributorMockInterface,
} from "../../../contracts/mocks/RewardDistributorMock";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
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
    name: "ECDSAInvalidSignature",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "ECDSAInvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "ECDSAInvalidSignatureS",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
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
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "UUPSUnauthorizedCallContext",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
    ],
    name: "UUPSUnsupportedProxiableUUID",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "burnFee",
        type: "uint256",
      },
    ],
    name: "BurnFeeSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "feeReceiver",
        type: "address",
      },
    ],
    name: "FeeReceiverSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "maxDailyWithdrawal",
        type: "uint256",
      },
    ],
    name: "MaxDailyWithdrawalSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "platformFee",
        type: "uint256",
      },
    ],
    name: "PlatformFeeSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "platformFee",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "burnAmount",
        type: "uint256",
      },
    ],
    name: "ProcessedFees",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sponsor",
        type: "address",
      },
    ],
    name: "TaskCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "rewardAmount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sponsor",
        type: "address",
      },
    ],
    name: "TaskToppedUp",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAdmin",
        type: "address",
      },
    ],
    name: "TokenAdminSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "identity",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "WithdrawnRewards",
    type: "event",
  },
  {
    inputs: [],
    name: "UPGRADE_INTERFACE_VERSION",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "addToTest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "burnFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_sponsor",
        type: "address",
      },
    ],
    name: "createTask",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_sponsor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "_r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_s",
        type: "bytes32",
      },
    ],
    name: "createTaskWithPermit",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "feeReceiver",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAdmin",
        type: "address",
      },
      {
        internalType: "address",
        name: "_feeReceiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_burnFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_platformFee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxDailyWithdrawal",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minWithdrawalAmount",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxDailyWithdrawal",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minWithdrawalAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_burnFee",
        type: "uint256",
      },
    ],
    name: "setBurnFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_feeReceiver",
        type: "address",
      },
    ],
    name: "setFeeReceiver",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxDailyWithdrawal",
        type: "uint256",
      },
    ],
    name: "setMaxDailyWithdrawal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_platformFee",
        type: "uint256",
      },
    ],
    name: "setPlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_tokenAdmin",
        type: "address",
      },
    ],
    name: "setTokenAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "taskRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "test",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tokenAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_sponsor",
        type: "address",
      },
    ],
    name: "topUpTask",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rewardAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_sponsor",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "_r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_s",
        type: "bytes32",
      },
    ],
    name: "topUpTaskWithPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_identity",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "withdrawRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "withdrawnRewards",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60a06040523060805234801561001457600080fd5b5061001d610022565b6100d4565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a00805468010000000000000000900460ff16156100725760405163f92ee8a960e01b815260040160405180910390fd5b80546001600160401b03908116146100d15780546001600160401b0319166001600160401b0390811782556040519081527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50565b6080516120ac620000fe600039600081816111af015281816111d8015261131e01526120ac6000f3fe6080604052600436106101b75760003560e01c8063a26194c7116100ec578063dd6624e41161008a578063f745759411610064578063f7457594146104e1578063f7c618c114610501578063f8a8fd6d14610521578063fce589d81461053757600080fd5b8063dd6624e414610474578063efdcd974146104a1578063f2fde38b146104c157600080fd5b8063b7e1917c116100c6578063b7e1917c146103fe578063b87d1bc51461041e578063c383888d14610434578063c843e81c1461045457600080fd5b8063a26194c714610380578063ad3cb1cc146103a0578063b3f00674146103de57600080fd5b80638312f149116101595780639285c94b116101335780639285c94b1461030b5780639bb13a241461032b5780639cbd686e1461034b5780639d54c9fe1461036057600080fd5b80638312f149146102845780638da5cb5b1461029a5780638ffff615146102eb57600080fd5b80634f1ef286116101955780634f1ef2861461022757806352d1902d1461023a578063715018a61461024f578063774512291461026457600080fd5b806312e8e2c3146101bc57806326232a2e146101de5780634bf2c7c914610207575b600080fd5b3480156101c857600080fd5b506101dc6101d7366004611ace565b61054d565b005b3480156101ea57600080fd5b506101f460045481565b6040519081526020015b60405180910390f35b34801561021357600080fd5b506101dc610222366004611ace565b6105b3565b6101dc610235366004611ba6565b610610565b34801561024657600080fd5b506101f461062f565b34801561025b57600080fd5b506101dc61064c565b34801561027057600080fd5b506101f461027f366004611bf4565b610660565b34801561029057600080fd5b506101f460065481565b3480156102a657600080fd5b507f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b03165b6040516001600160a01b0390911681526020016101fe565b3480156102f757600080fd5b506101dc610306366004611ace565b61074e565b34801561031757600080fd5b506101f4610326366004611ace565b6107ab565b34801561033757600080fd5b506101dc610346366004611c31565b6107cc565b34801561035757600080fd5b506101dc610849565b34801561036c57600080fd5b506101f461037b366004611c9e565b61086b565b34801561038c57600080fd5b506101dc61039b366004611d01565b6108ea565b3480156103ac57600080fd5b506103d1604051806040016040528060058152602001640352e302e360dc1b81525081565b6040516101fe9190611dac565b3480156103ea57600080fd5b506002546102d3906001600160a01b031681565b34801561040a57600080fd5b506001546102d3906001600160a01b031681565b34801561042a57600080fd5b506101f460055481565b34801561044057600080fd5b506101dc61044f366004611ddf565b610c8a565b34801561046057600080fd5b506101dc61046f366004611e14565b610dab565b34801561048057600080fd5b506101f461048f366004611e8c565b60076020526000908152604090205481565b3480156104ad57600080fd5b506101dc6104bc366004611e8c565b611011565b3480156104cd57600080fd5b506101dc6104dc366004611e8c565b611063565b3480156104ed57600080fd5b506101dc6104fc366004611e8c565b6110a1565b34801561050d57600080fd5b506000546102d3906001600160a01b031681565b34801561052d57600080fd5b506101f4600b5481565b34801561054357600080fd5b506101f460035481565b610555611149565b6127108111156105805760405162461bcd60e51b815260040161057790611ea7565b60405180910390fd5b600481905560405181907fdc4e4be378c228e1b7b13787e1d0620609304c2f71ed3a6ee69e4aae99d58cd990600090a250565b6105bb611149565b6127108111156105dd5760405162461bcd60e51b815260040161057790611ea7565b600381905560405181907f6aa481ed384822c7b3e905d64ce6b44fb715f13e387c50fab2d68e387540094d90600090a250565b6106186111a4565b61062182611249565b61062b8282611251565b5050565b6000610639611313565b5060008051602061205783398151915290565b610654611149565b61065e600061135c565b565b60008083116106a55760405162461bcd60e51b815260206004820152601160248201527005f726577617264416d6f756e74203d203607c1b6044820152606401610577565b6000546106bd906001600160a01b03168330866113cd565b60006106c88461143a565b600880546001818101835560008390527ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3909101839055905491925061070d91611ee3565b9150826001600160a01b031681837f608625ab6f77a46173f4140d5795b7128dc6e75d7ae867d32b5e49ae02cde65260405160405180910390a45092915050565b610756611149565b6127108111156107785760405162461bcd60e51b815260040161057790611ea7565b600581905560405181907fea80352023ddced572abff82545e0aff74f2b39aa08e21e5f185a25806523dd290600090a250565b600881815481106107bb57600080fd5b600091825260209091200154905081565b60005460405163d505accf60e01b81526001600160a01b039091169063d505accf9061080890899030908a908a908a908a908a90600401611ef6565b600060405180830381600087803b15801561082257600080fd5b505af1925050508015610833575060015b5061083f888888610c8a565b5050505050505050565b610851611149565b6001600b60008282546108649190611f37565b9091555050565b6000805460405163d505accf60e01b81526001600160a01b039091169063d505accf906108a8908a9030908b908b908b908b908b90600401611ef6565b600060405180830381600087803b1580156108c257600080fd5b505af19250505080156108d3575060015b506108de8888610660565b98975050505050505050565b600080806108fa84860186611f4a565b6040517f19457468657265756d205369676e6564204d6573736167653a0a35320000000060208201526bffffffffffffffffffffffff1960608c901b16603c8201526050810184905292955090935091506000906070016040516020818303038152906040528051906020012090508083146109b85760405162461bcd60e51b815260206004820152601860248201527f496e76616c69642070726f6f66206f66207265776172647300000000000000006044820152606401610577565b6001546001600160a01b03166109ce8484611550565b6001600160a01b031614610a1b5760405162461bcd60e51b815260206004820152601460248201527324b73b30b634b210383937b7b31039b4b3b732b960611b6044820152606401610577565b600654871015610a6d5760405162461bcd60e51b815260206004820152601e60248201527f416d6f756e74203c206d696e207769746864726177616c20616d6f756e7400006044820152606401610577565b6001600160a01b0388166000908152600760205260409020548490610a93908990611f37565b1115610ae15760405162461bcd60e51b815260206004820152601e60248201527f416d6f756e742065786365656473206d617820746f20776974686472617700006044820152606401610577565b6000610af06201518042611f9a565b9050600954811115610b075760098190556000600a555b600080546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa158015610b50573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b749190611fbc565b905061271060055482610b879190611fd5565b610b919190611f9a565b89600a54610b9f9190611f37565b1115610bed5760405162461bcd60e51b815260206004820152601f60248201527f4461696c79207769746864726177616c206c696d6974206578636565646564006044820152606401610577565b88600a6000828254610bff9190611f37565b90915550506001600160a01b038a16600090815260076020526040812080548b9290610c2c908490611f37565b9091555050600054610c48906001600160a01b03168b8b61157c565b60405189906001600160a01b038c16907fbd1ea9966f82ccb966523d3922a6e4ad4bf3ea70e9201bd7a106de847cc5e61690600090a350505050505050505050565b60008311610ccf5760405162461bcd60e51b81526020600482015260126024820152710546f7020757020616d6f756e7420697320360741b6044820152606401610577565b6008548210610d165760405162461bcd60e51b815260206004820152601360248201527215185cdac8191bd95cc81b9bdd08195e1a5cdd606a1b6044820152606401610577565b600054610d2e906001600160a01b03168230866113cd565b6000610d398461143a565b90508060088481548110610d4f57610d4f611fec565b906000526020600020016000828254610d689190611f37565b90915550506040516001600160a01b03831690829085907f0e7f6cfbe321f0be58866f990b36df8caa522f059103cbbeff3372afccbb0a6b90600090a450505050565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a008054600160401b810460ff16159067ffffffffffffffff16600081158015610df15750825b905060008267ffffffffffffffff166001148015610e0e5750303b155b905081158015610e1c575080155b15610e3a5760405163f92ee8a960e01b815260040160405180910390fd5b845467ffffffffffffffff191660011785558315610e6457845460ff60401b1916600160401b1785555b612710891115610ea75760405162461bcd60e51b815260206004820152600e60248201526d17d89d5c9b919959480f880c594d60921b6044820152606401610577565b612710881115610eee5760405162461bcd60e51b815260206004820152601260248201527117dc1b185d199bdc9b519959480f880c594d60721b6044820152606401610577565b612710871115610f405760405162461bcd60e51b815260206004820152601960248201527f5f6d61784461696c795769746864726177616c203e20316534000000000000006044820152606401610577565b610f498d6115ad565b600080546001600160a01b03808f166001600160a01b031992831617909255600180548e841690831617905560028054928d16929091169190911790556003899055600488905560058790556006869055610fa76201518042611f9a565b6009556000600a55610fb9888a611f37565b600b55831561100257845460ff60401b19168555604051600181527fc7f505b2f371ae2175ee4913f4499e1f2633a7b5936321eed1cdaeb6115181d29060200160405180910390a15b50505050505050505050505050565b611019611149565b600280546001600160a01b0319166001600160a01b0383169081179091556040517fbdf37c276f641820b141429d245add2552b4118c0866e5a78638e3de5ef18d9d90600090a250565b61106b611149565b6001600160a01b03811661109557604051631e4fbdf760e01b815260006004820152602401610577565b61109e8161135c565b50565b6110a9611149565b6001600160a01b0381166110ff5760405162461bcd60e51b815260206004820152601960248201527f546f6b656e2061646d696e2069732061646472657373283029000000000000006044820152606401610577565b600180546001600160a01b0319166001600160a01b0383169081179091556040517fd5f4c713589e8a5f8772f81c9a5189b03f01a579e559d0a3c9f6306a26d1eb3390600090a250565b3361117b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c199300546001600160a01b031690565b6001600160a01b03161461065e5760405163118cdaa760e01b8152336004820152602401610577565b306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148061122b57507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661121f600080516020612057833981519152546001600160a01b031690565b6001600160a01b031614155b1561065e5760405163703e46dd60e11b815260040160405180910390fd5b61109e611149565b816001600160a01b03166352d1902d6040518163ffffffff1660e01b8152600401602060405180830381865afa9250505080156112ab575060408051601f3d908101601f191682019092526112a891810190611fbc565b60015b6112d357604051634c9c8ce360e01b81526001600160a01b0383166004820152602401610577565b600080516020612057833981519152811461130457604051632a87526960e21b815260048101829052602401610577565b61130e83836115be565b505050565b306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461065e5760405163703e46dd60e11b815260040160405180910390fd5b7f9016d09d72d40fdae2fd8ceac6b6234c7706214fd39c1cd1e609a0528c19930080546001600160a01b031981166001600160a01b03848116918217845560405192169182907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3505050565b6040516001600160a01b0384811660248301528381166044830152606482018390526114349186918216906323b872dd906084015b604051602081830303815290604052915060e01b6020820180516001600160e01b038381831617835250505050611614565b50505050565b6000806127106004548461144e9190611fd5565b6114589190611f9a565b90506114648184611ee3565b91506000612710600354836114799190611fd5565b6114839190611f9a565b905080156114ea57600054604051630852cd8d60e31b8152600481018390526001600160a01b03909116906342966c6890602401600060405180830381600087803b1580156114d157600080fd5b505af11580156114e5573d6000803e3d6000fd5b505050505b60006114f68284611ee3565b9050801561151b5760025460005461151b916001600160a01b0391821691168361157c565b604051829082907f4b7c5767553757dfec49c7e7837541bdd95d2748daf4db5ac95772215b51d6d390600090a3505050919050565b6000806000806115608686611677565b92509250925061157082826116c4565b50909150505b92915050565b6040516001600160a01b0383811660248301526044820183905261130e91859182169063a9059cbb90606401611402565b6115b561177d565b61109e816117c6565b6115c7826117ce565b6040516001600160a01b038316907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a280511561160c5761130e8282611833565b61062b6118a9565b60006116296001600160a01b038416836118c8565b9050805160001415801561164e57508080602001905181019061164c9190612002565b155b1561130e57604051635274afe760e01b81526001600160a01b0384166004820152602401610577565b600080600083516041036116b15760208401516040850151606086015160001a6116a3888285856118dd565b9550955095505050506116bd565b50508151600091506002905b9250925092565b60008260038111156116d8576116d8612024565b036116e1575050565b60018260038111156116f5576116f5612024565b036117135760405163f645eedf60e01b815260040160405180910390fd5b600282600381111561172757611727612024565b036117485760405163fce698f760e01b815260048101829052602401610577565b600382600381111561175c5761175c612024565b0361062b576040516335e2f38360e21b815260048101829052602401610577565b7ff0c57e16840df040f15088dc2f81fe391c3923bec73e23a9662efc9c229c6a0054600160401b900460ff1661065e57604051631afcd79f60e31b815260040160405180910390fd5b61106b61177d565b806001600160a01b03163b60000361180457604051634c9c8ce360e01b81526001600160a01b0382166004820152602401610577565b60008051602061205783398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b6060600080846001600160a01b031684604051611850919061203a565b600060405180830381855af49150503d806000811461188b576040519150601f19603f3d011682016040523d82523d6000602084013e611890565b606091505b50915091506118a08583836119ac565b95945050505050565b341561065e5760405163b398979f60e01b815260040160405180910390fd5b60606118d683836000611a08565b9392505050565b600080807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a084111561191857506000915060039050826119a2565b604080516000808252602082018084528a905260ff891692820192909252606081018790526080810186905260019060a0016020604051602081039080840390855afa15801561196c573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611998575060009250600191508290506119a2565b9250600091508190505b9450945094915050565b6060826119c1576119bc82611aa5565b6118d6565b81511580156119d857506001600160a01b0384163b155b15611a0157604051639996b31560e01b81526001600160a01b0385166004820152602401610577565b5092915050565b606081471015611a2d5760405163cd78605960e01b8152306004820152602401610577565b600080856001600160a01b03168486604051611a49919061203a565b60006040518083038185875af1925050503d8060008114611a86576040519150601f19603f3d011682016040523d82523d6000602084013e611a8b565b606091505b5091509150611a9b8683836119ac565b9695505050505050565b805115611ab55780518082602001fd5b604051630a12f52160e11b815260040160405180910390fd5b600060208284031215611ae057600080fd5b5035919050565b80356001600160a01b0381168114611afe57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112611b2a57600080fd5b813567ffffffffffffffff80821115611b4557611b45611b03565b604051601f8301601f19908116603f01168101908282118183101715611b6d57611b6d611b03565b81604052838152866020858801011115611b8657600080fd5b836020870160208301376000602085830101528094505050505092915050565b60008060408385031215611bb957600080fd5b611bc283611ae7565b9150602083013567ffffffffffffffff811115611bde57600080fd5b611bea85828601611b19565b9150509250929050565b60008060408385031215611c0757600080fd5b82359150611c1760208401611ae7565b90509250929050565b803560ff81168114611afe57600080fd5b600080600080600080600080610100898b031215611c4e57600080fd5b8835975060208901359650611c6560408a01611ae7565b95506060890135945060808901359350611c8160a08a01611c20565b925060c0890135915060e089013590509295985092959890939650565b600080600080600080600060e0888a031215611cb957600080fd5b87359650611cc960208901611ae7565b95506040880135945060608801359350611ce560808901611c20565b925060a0880135915060c0880135905092959891949750929550565b60008060008060608587031215611d1757600080fd5b611d2085611ae7565b935060208501359250604085013567ffffffffffffffff80821115611d4457600080fd5b818701915087601f830112611d5857600080fd5b813581811115611d6757600080fd5b886020828501011115611d7957600080fd5b95989497505060200194505050565b60005b83811015611da3578181015183820152602001611d8b565b50506000910152565b6020815260008251806020840152611dcb816040850160208701611d88565b601f01601f19169190910160400192915050565b600080600060608486031215611df457600080fd5b8335925060208401359150611e0b60408501611ae7565b90509250925092565b600080600080600080600080610100898b031215611e3157600080fd5b611e3a89611ae7565b9750611e4860208a01611ae7565b9650611e5660408a01611ae7565b9550611e6460608a01611ae7565b979a969950949760808101359660a0820135965060c0820135955060e0909101359350915050565b600060208284031215611e9e57600080fd5b6118d682611ae7565b6020808252600c908201526b45786365656473203130302560a01b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b8181038181111561157657611576611ecd565b6001600160a01b0397881681529590961660208601526040850193909352606084019190915260ff16608083015260a082015260c081019190915260e00190565b8082018082111561157657611576611ecd565b600080600060608486031215611f5f57600080fd5b8335925060208401359150604084013567ffffffffffffffff811115611f8457600080fd5b611f9086828701611b19565b9150509250925092565b600082611fb757634e487b7160e01b600052601260045260246000fd5b500490565b600060208284031215611fce57600080fd5b5051919050565b808202811582820484141761157657611576611ecd565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561201457600080fd5b815180151581146118d657600080fd5b634e487b7160e01b600052602160045260246000fd5b6000825161204c818460208701611d88565b919091019291505056fe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbca2646970667358221220d607e213a99d5720abdc71e4f360390952718d9b22eb5c3b4974ec57ac8827e664736f6c63430008180033";

type RewardDistributorMockConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RewardDistributorMockConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RewardDistributorMock__factory extends ContractFactory {
  constructor(...args: RewardDistributorMockConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<RewardDistributorMock> {
    return super.deploy(overrides || {}) as Promise<RewardDistributorMock>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): RewardDistributorMock {
    return super.attach(address) as RewardDistributorMock;
  }
  override connect(signer: Signer): RewardDistributorMock__factory {
    return super.connect(signer) as RewardDistributorMock__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RewardDistributorMockInterface {
    return new utils.Interface(_abi) as RewardDistributorMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RewardDistributorMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as RewardDistributorMock;
  }
}
