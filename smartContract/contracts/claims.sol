// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

//This code has been developed in a rush, but it works. It can definitely be improved.
contract claims is Ownable {
    address _addressInsuranceContract;
//    address _USDC = 0xF14f9596430931E177469715c591513308244e8F;  //Fake USDC but this token works in AAVE: Polygon
    address _USDC = 0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D;  //Fake USDC but this token works in AAVE: Scroll Sepolia

    //Paramaters for the parametric insurance. It will be changed by oracles
    //Also the idea is that every user has a different set of parameters by interacting with an API off-chain
    uint256 alpha = 100;
    uint256 beta = 800;
    uint256 th = 700;
    uint256 profit100 = 2;

    mapping(address => bool) public ensured;
    mapping(address => uint256) public redeemAmount;

    constructor() {}

    function computePremium(uint256 quantity) public view returns (uint256) {
        uint256 expectedLoss = Math.mulDiv( alpha, quantity, alpha + beta );
        return ( expectedLoss * ( 100 + profit100 ) ) / 100;
    }

    function addCoverage( uint256 amount, address account ) external onlyInsurance {
        uint256 requiredAmount = computePremium( amount );
        IERC20(_USDC).transferFrom(_addressInsuranceContract, address(this), requiredAmount );
        ensured[account] = true;
        redeemAmount[account] += amount;
    }

    function reduceCoverage( uint256 amount, address account ) external onlyInsurance {
        redeemAmount[account] -= amount;
        if (amount == 0) {
            ensured[account] = false;
        }
    }

    //the protocol fluctuations will also be fed by oracle, here just for testing is an argument
    function claimPayment(uint256 protocolFluctuation) public {
        require( ensured[msg.sender], "User not ensured" );
        require( protocolFluctuation > th, "No reason for payment" );
        uint256 amount = redeemAmount[msg.sender];
        if ( amount > IERC20(_USDC).balanceOf( address(this) ) ) {
            amount = IERC20(_USDC).balanceOf( address(this) );
        }
        ensured[msg.sender] = false;
        redeemAmount[msg.sender] = 0;
        IERC20(_USDC).transfer( msg.sender, amount );
    }

    //the protocol fluctuations will also be fed by oracle, here just for testing is an argument.
    function checkPayment(uint256 protocolFluctuation) public view returns (bool) {
        return protocolFluctuation > th;
    }

    function changeParameters(uint256 newAlpha, uint256 newBeta, uint256 newTh) public onlyOwner {
        require( newAlpha > 0 && newBeta > 0 && newTh > 0 );
        alpha = newAlpha;
        beta = newBeta;
        th = newTh;
    }

    //This will be change by a DAO in the future.
    function changeAddressInsuranceContract(address newAddress) public onlyOwner {
        _addressInsuranceContract = newAddress;
    }

    modifier onlyInsurance {
        require( msg.sender == _addressInsuranceContract, "Not authorized" );
        _;
    }

}
