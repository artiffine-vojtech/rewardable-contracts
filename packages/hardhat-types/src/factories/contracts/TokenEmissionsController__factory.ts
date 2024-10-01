/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  TokenEmissionsController,
  TokenEmissionsControllerInterface,
} from "../../contracts/TokenEmissionsController";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_stakingToken",
        type: "address",
      },
      {
        internalType: "contract INFTWithLevel",
        name: "_boosterNFT",
        type: "address",
      },
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address",
      },
      {
        internalType: "address",
        name: "_withdrawingAdmin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminAlreadyExists",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminDoesNotExist",
    type: "error",
  },
  {
    inputs: [],
    name: "AdminIsAddressZero",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "CallerIsNotTheAdmin",
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "AdminRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "scaled",
        type: "uint256",
      },
    ],
    name: "Deposited",
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
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "rewardsToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reward",
        type: "uint256",
      },
    ],
    name: "RewardPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "scaled",
        type: "uint256",
      },
    ],
    name: "Withdrawn",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "addAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardToken",
        type: "address",
      },
    ],
    name: "addReward",
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
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "staked",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lockScaled",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "scaled",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "boosted",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "lockBoost",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "boosterNFT",
    outputs: [
      {
        internalType: "contract INFTWithLevel",
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
        name: "_account",
        type: "address",
      },
    ],
    name: "claimableRewards",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct ITokenControllerCommons.RewardData[]",
        name: "claimable",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "currentEmissionsIndex",
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
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_onBehalfOf",
        type: "address",
      },
      {
        internalType: "enum ITokenControllerCommons.LockTime",
        name: "_lock",
        type: "uint8",
      },
    ],
    name: "deposit",
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
    name: "emissions",
    outputs: [
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "emissionsStart",
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
        internalType: "address[]",
        name: "_rewardTokens",
        type: "address[]",
      },
    ],
    name: "getReward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "isAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_rewardsToken",
        type: "address",
      },
    ],
    name: "lastTimeRewardApplicable",
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
        internalType: "address[]",
        name: "_rewardTokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "_rewardsDuration",
        type: "uint256",
      },
    ],
    name: "notifyReward",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "_admin",
        type: "address",
      },
    ],
    name: "removeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "rewardData",
    outputs: [
      {
        internalType: "uint256",
        name: "periodFinish",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdateTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "rewardPerTokenStored",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "balance",
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
        name: "",
        type: "uint256",
      },
    ],
    name: "rewardTokens",
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
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "rewards",
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
    name: "rewardsDuration",
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
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "stakeNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingToken",
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
        components: [
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        internalType: "struct ITokenControllerCommons.EmissionPoint[]",
        name: "_emissions",
        type: "tuple[]",
      },
    ],
    name: "startEmissions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalScaled",
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
    inputs: [],
    name: "unstakeNFT",
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
    name: "userLockTime",
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
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_onBehalfOf",
        type: "address",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawingAdmin",
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
] as const;

const _bytecode =
  "0x60e06040523480156200001157600080fd5b506040516200288d3803806200288d8339810160408190526200003491620001f5565b33806200005c57604051631e4fbdf760e01b8152600060048201526024015b60405180910390fd5b62000067816200009c565b506001600160a01b03808516608052831660c0526200008682620000ec565b6001600160a01b031660a052506200025d915050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6080516001600160a01b0316816001600160a01b031603620001515760405162461bcd60e51b815260206004820152601b60248201527f5374616b696e6720746f6b656e206973206e6f74207265776172640000000000604482015260640162000053565b6001600160a01b038116600090815260086020526040902060020154156200017857600080fd5b600a8054600181019091557fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a80180546001600160a01b039092166001600160a01b031990921682179055600090815260086020526040902042600282018190559055565b6001600160a01b0381168114620001f257600080fd5b50565b600080600080608085870312156200020c57600080fd5b84516200021981620001dc565b60208601519094506200022c81620001dc565b60408601519093506200023f81620001dc565b60608601519092506200025281620001dc565b939692955090935050565b60805160a05160c0516125d6620002b760003960008181610405015261193701526000818161042c0152818161054401526110fd015260008181610397015281816108090152818161131b0152611caf01526125d66000f3fe608060405234801561001057600080fd5b50600436106101ce5760003560e01c806373feac2a11610104578063a36cfb6d116100a2578063e0a747fe11610071578063e0a747fe146101e6578063e5acbe21146104e0578063e70b9e27146104e9578063f2fde38b1461051457600080fd5b8063a36cfb6d14610472578063b7ec8d4b14610485578063cb6da67014610498578063dc01f60d146104c057600080fd5b8063821c4043116100de578063821c4043146104005780638d2a876a146104275780638da5cb5b1461044e5780639c9b2e211461045f57600080fd5b806373feac2a146103d15780637bb7bed1146103da5780637fd7d062146103ed57600080fd5b806348e5d9f8116101715780636eb604e01161014b5780636eb604e0146103665780637048027514610377578063715018a61461038a57806372f702f31461039257600080fd5b806348e5d9f8146102ce5780635a9a93fc14610333578063638634ee1461035357600080fd5b80631785f53c116101ad5780631785f53c1461021757806324d7806c1461022a57806327e235e31461024d578063386a9525146102c557600080fd5b8062f714ce146101d35780630a3136d0146101e85780630b3562dc14610204575b600080fd5b6101e66101e13660046120de565b610527565b005b6101f160035481565b6040519081526020015b60405180910390f35b6101e661021236600461217a565b61087a565b6101e661022536600461223c565b610b5f565b61023d61023836600461223c565b610c1b565b60405190151581526020016101fb565b61029661025b36600461223c565b600960205260009081526040902080546001820154600283015460038401546004850154600590950154939492939192909160ff9091169086565b6040805196875260208701959095529385019290925260608401521515608083015260a082015260c0016101fb565b6101f160065481565b61030b6102dc36600461223c565b600860205260009081526040902080546001820154600283015460038401546004909401549293919290919085565b604080519586526020860194909452928401919091526060830152608082015260a0016101fb565b6101f161034136600461223c565b60056020526000908152604090205481565b6101f161036136600461223c565b610c55565b6101e6610374366004612257565b50565b6101e661038536600461223c565b610c84565b6101e6610d47565b6103b97f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020016101fb565b6101f160045481565b6103b96103e8366004612257565b610d5b565b6101e66103fb3660046122bc565b610d85565b6103b97f000000000000000000000000000000000000000000000000000000000000000081565b6103b97f000000000000000000000000000000000000000000000000000000000000000081565b6000546001600160a01b03166103b9565b6101e661046d36600461223c565b610e4a565b6101e66104803660046122fe565b610e5c565b6101e6610493366004612372565b6110e0565b6104ab6104a6366004612257565b61138e565b604080519283526020830191909152016101fb565b6104d36104ce36600461223c565b6113bc565b6040516101fb91906123b6565b6101f1600b5481565b6101f16104f736600461240e565b600760209081526000928352604080842090915290825290205481565b6101e661052236600461223c565b611552565b336001600160a01b03821614806105665750336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016145b6105af5760405162461bcd60e51b81526020600482015260156024820152742737ba103bb4ba34323930bbb4b7339030b236b4b760591b60448201526064015b60405180910390fd5b6001600160a01b0381166000908152600560205260409020544210156106005760405162461bcd60e51b8152602060048201526006602482015265131bd8dad95960d21b60448201526064016105a6565b6001600160a01b038116600090815260096020526040902080548311156106695760405162461bcd60e51b815260206004820152601a60248201527f416d6f756e742067726561746572207468616e207374616b656400000000000060448201526064016105a6565b6106cd82600a8054806020026020016040519081016040528092919081815260200182805480156106c357602002820191906000526020600020905b81546001600160a01b031681526001909101906020018083116106a5575b505050505061158d565b6001600160a01b038216330361074057610740600a80548060200260200160405190810160405280929190818152602001828054801561073657602002820191906000526020600020905b81546001600160a01b03168152600190910190602001808311610718575b50505050506117d8565b6000610764600a61075e8460050154876118fc90919063ffffffff16565b90611908565b600483015490915060ff16156107985760006107838360030154611914565b9050610794600a61075e84846118fc565b9150505b815484036107ae57506002810154600060058301555b81546107ba9085611a37565b80835560058301546107d391600a9161075e91906118fc565b600183015560028201546107e79082611a37565b6002830155600b546107f99082611a37565b600b556108306001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000163386611a43565b60408051858152602081018390526001600160a01b038516917f92ccf450a286a957af52509bc1c9939d1a6a481783e142e41e2499f0bb66ebc6910160405180910390a250505050565b600254156108ca5760405162461bcd60e51b815260206004820152601960248201527f456d697373696f6e7320616c726561647920737461727465640000000000000060448201526064016105a6565b600081511161090a5760405162461bcd60e51b815260206004820152600c60248201526b4e6f20656d697373696f6e7360a01b60448201526064016105a6565b80516000805b82811015610a1657600084828151811061092c5761092c612438565b6020026020010151600001511180156109625750600084828151811061095457610954612438565b602002602001015160200151115b6109a15760405162461bcd60e51b815260206004820152601060248201526f24b73b30b634b21032b6b4b9b9b4b7b760811b60448201526064016105a6565b8381815181106109b3576109b3612438565b602002602001015160200151826109ca9190612464565b915060028482815181106109e0576109e0612438565b60209081029190910181015182546001818101855560009485529383902082516002909202019081559101519082015501610910565b5042600481905550610a55333083600a600081548110610a3857610a38612438565b6000918252602090912001546001600160a01b0316929190611aa6565b610a84600260035481548110610a6d57610a6d612438565b906000526020600020906002020160000154611ade565b600060086000600a600081548110610a9e57610a9e612438565b60009182526020808320909101546001600160a01b03168352820192909252604001902060035460028054929350918110610adb57610adb612438565b9060005260206000209060020201600101548160040181905550610b59600a600081548110610b0c57610b0c612438565b9060005260206000200160009054906101000a90046001600160a01b0316600260035481548110610b3f57610b3f612438565b906000526020600020906002020160010154600654611b26565b50505050565b610b67611bd0565b6001600160a01b038116610b8e5760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff16610bd257604051630ed580c760e41b81526001600160a01b03821660048201526024016105a6565b6001600160a01b038116600081815260016020526040808220805460ff19169055517fa3b62bc36326052d97ea62d63c3d60308ed4c3ea8ac079dd8499f1e9c4f80c0f9190a250565b6001600160a01b03811660009081526001602052604081205460ff1680610c4f57506000546001600160a01b038381169116145b92915050565b6001600160a01b038116600090815260086020526040812054428111610c7b5780610c7d565b425b9392505050565b610c8c611bd0565b6001600160a01b038116610cb35760405163274338ef60e11b815260040160405180910390fd5b6001600160a01b03811660009081526001602052604090205460ff1615610cf85760405163f646f2cd60e01b81526001600160a01b03821660048201526024016105a6565b6001600160a01b0381166000818152600160208190526040808320805460ff1916909217909155517f44d6d25963f097ad14f29f06854a01f575648a1ef82f30e562ccd3889717e3399190a250565b610d4f611bd0565b610d596000611bfd565b565b600a8181548110610d6b57600080fd5b6000918252602090912001546001600160a01b0316905081565b33600090815260056020526040902054421015610dcd5760405162461bcd60e51b8152602060048201526006602482015265131bd8dad95960d21b60448201526064016105a6565b610e0a3383838080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525061158d92505050565b610e468282808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152506117d892505050565b5050565b610e5333611c4d565b61037481611cad565b610e6533611c4d565b60008111610ea85760405162461bcd60e51b815260206004820152601060248201526f4475726174696f6e206973207a65726f60801b60448201526064016105a6565b838214610ee75760405162461bcd60e51b815260206004820152600d60248201526c125b9d985b1a59081a5b9c1d5d609a1b60448201526064016105a6565b610f243086868080602002602001604051908101604052809392919081815260200183836020028082843760009201919091525061158d92505050565b8360005b818110156110d7576000878783818110610f4457610f44612438565b9050602002016020810190610f59919061223c565b9050600a600081548110610f6f57610f6f612438565b6000918252602090912001546001600160a01b0390811690821603610f9457506110cf565b6001600160a01b03811660009081526008602052604090208054610ff15760405162461bcd60e51b81526020600482015260146024820152732ab735b737bbb7103932bbb0b932103a37b5b2b760611b60448201526064016105a6565b611029333089898781811061100857611008612438565b90506020020135856001600160a01b0316611aa6909392919063ffffffff16565b6004808201546040516370a0823160e01b815230928101929092526000916110a791906001600160a01b038616906370a0823190602401602060405180830381865afa15801561107d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110a19190612477565b90611a37565b90506110b4838288611b26565b60048201546110c39082611db8565b82600401819055505050505b600101610f28565b50505050505050565b336001600160a01b038316148061111f5750336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016145b6111635760405162461bcd60e51b81526020600482015260156024820152742737ba103bb4ba34323930bbb4b7339030b236b4b760591b60448201526064016105a6565b600083116111a45760405162461bcd60e51b815260206004820152600e60248201526d416d6f756e74206973207a65726f60901b60448201526064016105a6565b61120682600a8054806020026020016040519081016040528092919081815260200182805480156106c3576020028201919060005260206000209081546001600160a01b031681526001909101906020018083116106a557505050505061158d565b6001600160a01b0382166000908152600960205260409020805461122a9085611db8565b8155611254600a61124e600585600281111561124857611248612490565b906118fc565b90611db8565b60058201819055815461126d91600a9161075e916118fc565b60018201819055600482015460ff16156112a55760006112908360030154611914565b90506112a1600a61075e84846118fc565b9150505b6112c28161124e8460020154600b54611a3790919063ffffffff16565b600b5560028083018290556112f8906112eb9062278d0090869081111561124857611248612490565b61124e42624f1a00611db8565b6001600160a01b03808616600090815260056020526040902091909155611343907f000000000000000000000000000000000000000000000000000000000000000016333088611aa6565b60408051868152602081018390526001600160a01b038616917f73a19dd210f1a7f902193214c0ee91dd35ee5b4d920cba8d519eca65a7b488ca910160405180910390a25050505050565b6002818154811061139e57600080fd5b60009182526020909120600290910201805460019091015490915082565b600a5460609067ffffffffffffffff8111156113da576113da61210a565b60405190808252806020026020018201604052801561141f57816020015b60408051808201909152600080825260208201528152602001906001900390816113f85790505b50905060005b815181101561154c57600a818154811061144157611441612438565b9060005260206000200160009054906101000a90046001600160a01b031682828151811061147157611471612438565b6020026020010151600001906001600160a01b031690816001600160a01b03168152505061152464e8d4a5100061075e858585815181106114b4576114b4612438565b60200260200101516000015160096000896001600160a01b03166001600160a01b031681526020019081526020016000206002015461151f600a88815481106114ff576114ff612438565b600091825260209091200154600b546001600160a01b0390911690611dc4565b611e5c565b82828151811061153657611536612438565b6020908102919091018101510152600101611425565b50919050565b61155a611bd0565b6001600160a01b03811661158457604051631e4fbdf760e01b8152600060048201526024016105a6565b61037481611bfd565b805160005b81811015610b595760008382815181106115ae576115ae612438565b6020908102919091018101516001600160a01b03811660009081526008909252604090912080549192509061161c5760405162461bcd60e51b81526020600482015260146024820152732ab735b737bbb7103932bbb0b932103a37b5b2b760611b60448201526064016105a6565b600061162a83600b54611dc4565b60038301819055905061163c83610c55565b60028301556001600160a01b03871630146116bc576001600160a01b03871660009081526009602052604090206002015461167b908890859084611e5c565b6001600160a01b03808916600081815260076020908152604080832094891680845294825280832095909555918152600c8252838120928152919052208190555b600a6000815481106116d0576116d0612438565b6000918252602090912001546001600160a01b0384811691161480156116f7575060025415155b156117cd57600060026003548154811061171357611713612438565b9060005260206000209060020201905061173c8160000154600454611db890919063ffffffff16565b42106117cb5760038054906000611752836124a6565b909155505060025460035410156117cb5760026003548154811061177857611778612438565b90600052602060002090600202019050426004819055506117aa81600101548460040154611db890919063ffffffff16565b600484015580546117ba90611ade565b6117cb848260010154600654611b26565b505b505050600101611592565b805160005b818110156118f75760008382815181106117f9576117f9612438565b6020908102919091018101513360009081526007835260408082206001600160a01b0384168352909352918220549092506118399064e8d4a51000611908565b6001600160a01b03831660009081526008602052604090206004810154919250906118649083611a37565b6004820155600082900361187a575050506118ef565b3360008181526007602090815260408083206001600160a01b03881680855292528220919091556118ab9184611a43565b6040518281526001600160a01b0384169033907f540798df468d7b23d11f156fdb954cb19ad414d150722a7b6d55ba369dea792e9060200160405180910390a35050505b6001016117dd565b505050565b6000610c7d82846124bf565b6000610c7d82846124d6565b604051630284a7a560e51b81526004810182905260009081906001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001690635094f4a090602401602060405180830381865afa15801561197e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119a29190612477565b9050806000036119b55750600f92915050565b806001036119c65750600e92915050565b806002036119d75750600d92915050565b806003036119e85750600c92915050565b806004036119f95750600b92915050565b60405162461bcd60e51b8152602060048201526013602482015272125b9d985b1a59081d1bdad95b881b195d995b606a1b60448201526064016105a6565b6000610c7d82846124f8565b6040516001600160a01b0383166024820152604481018290526118f790849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152611ecd565b6040516001600160a01b0380851660248301528316604482015260648101829052610b599085906323b872dd60e01b90608401611a6f565b60008111611b215760405162461bcd60e51b815260206004820152601060248201526f4475726174696f6e206973207a65726f60801b60448201526064016105a6565b600655565b6001600160a01b038316600090815260086020526040902080544210611b6357611b598261075e8564e8d4a510006118fc565b6001820155611bb7565b8054600090611b729042611a37565b90506000611b9664e8d4a5100061075e8560010154856118fc90919063ffffffff16565b9050611baf8461075e64e8d4a510006112488986611db8565b600184015550505b4260028201819055611bc99083611db8565b9055505050565b6000546001600160a01b03163314610d595760405163118cdaa760e01b81523360048201526024016105a6565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811660009081526001602052604090205460ff16158015611c8457506000546001600160a01b03828116911614155b1561037457604051636d3f049f60e01b81526001600160a01b03821660048201526024016105a6565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316816001600160a01b031603611d2e5760405162461bcd60e51b815260206004820152601b60248201527f5374616b696e6720746f6b656e206973206e6f7420726577617264000000000060448201526064016105a6565b6001600160a01b03811660009081526008602052604090206002015415611d5457600080fd5b600a8054600181019091557fc65a7bb8d6351c1cf70c95a316cc6a92839c986682d98bc35f958f4883f9d2a80180546001600160a01b039092166001600160a01b031990921682179055600090815260086020526040902042600282018190559055565b6000610c7d8284612464565b600081600003611df057506001600160a01b038216600090815260086020526040902060030154610c4f565b6001600160a01b03831660009081526008602052604090206001810154600290910154610c7d91611e3a91859161075e91670de0b6b3a7640000916112489182906110a18c610c55565b6001600160a01b03851660009081526008602052604090206003015490611db8565b6001600160a01b03808516600081815260076020908152604080832094881680845294825280832054938352600c825280832094835293905291822054611ec2919061124e90670de0b6b3a76400009061075e90611ebb908890611a37565b88906118fc565b90505b949350505050565b6000611f22826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316611f9f9092919063ffffffff16565b8051909150156118f75780806020019051810190611f40919061250b565b6118f75760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016105a6565b6060611ec5848460008585600080866001600160a01b03168587604051611fc69190612551565b60006040518083038185875af1925050503d8060008114612003576040519150601f19603f3d011682016040523d82523d6000602084013e612008565b606091505b509150915061201987838387612024565b979650505050505050565b6060831561209357825160000361208c576001600160a01b0385163b61208c5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016105a6565b5081611ec5565b611ec583838151156120a85781518083602001fd5b8060405162461bcd60e51b81526004016105a6919061256d565b80356001600160a01b03811681146120d957600080fd5b919050565b600080604083850312156120f157600080fd5b82359150612101602084016120c2565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b6040805190810167ffffffffffffffff811182821017156121435761214361210a565b60405290565b604051601f8201601f1916810167ffffffffffffffff811182821017156121725761217261210a565b604052919050565b6000602080838503121561218d57600080fd5b823567ffffffffffffffff808211156121a557600080fd5b818501915085601f8301126121b957600080fd5b8135818111156121cb576121cb61210a565b6121d9848260051b01612149565b818152848101925060069190911b8301840190878211156121f957600080fd5b928401925b8184101561201957604084890312156122175760008081fd5b61221f612120565b8435815285850135868201528352604090930192918401916121fe565b60006020828403121561224e57600080fd5b610c7d826120c2565b60006020828403121561226957600080fd5b5035919050565b60008083601f84011261228257600080fd5b50813567ffffffffffffffff81111561229a57600080fd5b6020830191508360208260051b85010111156122b557600080fd5b9250929050565b600080602083850312156122cf57600080fd5b823567ffffffffffffffff8111156122e657600080fd5b6122f285828601612270565b90969095509350505050565b60008060008060006060868803121561231657600080fd5b853567ffffffffffffffff8082111561232e57600080fd5b61233a89838a01612270565b9097509550602088013591508082111561235357600080fd5b5061236088828901612270565b96999598509660400135949350505050565b60008060006060848603121561238757600080fd5b83359250612397602085016120c2565b91506040840135600381106123ab57600080fd5b809150509250925092565b602080825282518282018190526000919060409081850190868401855b8281101561240157815180516001600160a01b031685528601518685015292840192908501906001016123d3565b5091979650505050505050565b6000806040838503121561242157600080fd5b61242a836120c2565b9150612101602084016120c2565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b80820180821115610c4f57610c4f61244e565b60006020828403121561248957600080fd5b5051919050565b634e487b7160e01b600052602160045260246000fd5b6000600182016124b8576124b861244e565b5060010190565b8082028115828204841417610c4f57610c4f61244e565b6000826124f357634e487b7160e01b600052601260045260246000fd5b500490565b81810381811115610c4f57610c4f61244e565b60006020828403121561251d57600080fd5b81518015158114610c7d57600080fd5b60005b83811015612548578181015183820152602001612530565b50506000910152565b6000825161256381846020870161252d565b9190910192915050565b602081526000825180602084015261258c81604085016020870161252d565b601f01601f1916919091016040019291505056fea264697066735822122073ecf0528c5dda249f76c7301500be8a27db75d238ddbd9d25d97ed1a17835a464736f6c63430008180033";

type TokenEmissionsControllerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TokenEmissionsControllerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TokenEmissionsController__factory extends ContractFactory {
  constructor(...args: TokenEmissionsControllerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _stakingToken: PromiseOrValue<string>,
    _boosterNFT: PromiseOrValue<string>,
    _rewardToken: PromiseOrValue<string>,
    _withdrawingAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TokenEmissionsController> {
    return super.deploy(
      _stakingToken,
      _boosterNFT,
      _rewardToken,
      _withdrawingAdmin,
      overrides || {}
    ) as Promise<TokenEmissionsController>;
  }
  override getDeployTransaction(
    _stakingToken: PromiseOrValue<string>,
    _boosterNFT: PromiseOrValue<string>,
    _rewardToken: PromiseOrValue<string>,
    _withdrawingAdmin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      _stakingToken,
      _boosterNFT,
      _rewardToken,
      _withdrawingAdmin,
      overrides || {}
    );
  }
  override attach(address: string): TokenEmissionsController {
    return super.attach(address) as TokenEmissionsController;
  }
  override connect(signer: Signer): TokenEmissionsController__factory {
    return super.connect(signer) as TokenEmissionsController__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TokenEmissionsControllerInterface {
    return new utils.Interface(_abi) as TokenEmissionsControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TokenEmissionsController {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as TokenEmissionsController;
  }
}
