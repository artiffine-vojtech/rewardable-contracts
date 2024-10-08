/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IOAppMsgInspector,
  IOAppMsgInspectorInterface,
} from "../../../../../../@layerzerolabs/oapp-evm/contracts/oapp/interfaces/IOAppMsgInspector";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "message",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "options",
        type: "bytes",
      },
    ],
    name: "InspectionFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "_options",
        type: "bytes",
      },
    ],
    name: "inspect",
    outputs: [
      {
        internalType: "bool",
        name: "valid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IOAppMsgInspector__factory {
  static readonly abi = _abi;
  static createInterface(): IOAppMsgInspectorInterface {
    return new utils.Interface(_abi) as IOAppMsgInspectorInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IOAppMsgInspector {
    return new Contract(address, _abi, signerOrProvider) as IOAppMsgInspector;
  }
}
