// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import { IERC20 } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";

//Get APY locally:
//Mumbai deployment: 0x12CB9c0e8ef735f0D5e4F5E3D395D7C32242CfD3
//Sepolia deployment: 0xDd02E3b2480473E1758a1c80F700348aB45216d2
//Arbitrum deployment: 0xDd02E3b2480473E1758a1c80F700348aB45216d2

//This contract is deployes in Arbitrum: 0x2440CEdAA7b162f53eC462EA8013ec2c392F7fe5
interface IClaims {
    function getAPY() external view returns (uint128);
}

contract yieldSeeker is AxelarExecutable {
    string public value;
    string public sourceChain;
    string public sourceAddress;
    IAxelarGasService public immutable gasService;
    address _getValueArbitrum = 0xDd02E3b2480473E1758a1c80F700348aB45216d2;

//  Polygon:
//    address _gateway = 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B;
//    address _gasReceiver = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6;

//  Arbitrum
    address _gateway = 0xe432150cce91c13a887f7D836923d5597adD8E31;
    address _gasReceiver = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6;

    constructor() AxelarExecutable(_gateway) {
        gasService = IAxelarGasService(_gasReceiver);
    }

    // Call this function to update the value of this contract along with all its siblings".
    function setAPYValue(
        string calldata destinationChain,
        string calldata destinationAddress
    ) external payable {
        require(msg.value > 0, "Gas payment is required");

        uint128 valueAPY = IClaims(_getValueArbitrum).getAPY();

        bytes memory payload = abi.encode("setAPY(uint, string, uint128)", 1, "arbitrum", valueAPY);
        gasService.payNativeGasForContractCall{ value: msg.value }(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

}


//Successful hash in Arbitrum: 0x186aa2bebb2f9514ebb89a4a7bafebe754315a94db0641e07a020d6f20f8d2bc
