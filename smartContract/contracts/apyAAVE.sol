// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

//Mumbai deployment: 0x12CB9c0e8ef735f0D5e4F5E3D395D7C32242CfD3
//Sepolia deployment: 0xDd02E3b2480473E1758a1c80F700348aB45216d2
//Arbitrum deployment: 0xDd02E3b2480473E1758a1c80F700348aB45216d2

contract apyAAVE {
    using SafeMath for uint256;
    address aaveAddress;
    IPool poolAave;
    IPoolAddressesProvider private immutable poolAddressProvider;
//    address _USDC = 0xF14f9596430931E177469715c591513308244e8F;  //Fake USDC Polygon
//    address _USDC = 0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8;  //Fake USDC Sepolia
    address _USDC = 0xd513E4537510C75E24f941f159B7CAFA74E7B3B9;  //Fake USDC Arbitrum

    struct apyListStruct {
        uint id;
        string name;
        uint128 apy;
    }

    apyListStruct[2] apyList;

    constructor() {
//        poolAddressProvider = IPoolAddressesProvider(0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F); //Polygon
//        poolAddressProvider = IPoolAddressesProvider(0x012bAC54348C0E635dCAc9D5FB99f06F24136C9A); //Sepolia
        poolAddressProvider = IPoolAddressesProvider(0xD64dDe119f11C88850FD596BE11CE398CC5893e6); //Arbitrum
        aaveAddress = poolAddressProvider.getPool();
        poolAave = IPool(aaveAddress);
    }

    function getAPY() public view returns (uint128) {
        uint128 supplyAPY = (poolAave.getReserveData(_USDC)).currentLiquidityRate;
        return supplyAPY;
    }

    function setAPY(uint id, string memory iName, uint128 iApy) public {
        require( id < apyList.length, "Index out of bounds" );
        apyList[id].id = id;
        apyList[id].name = iName;
        apyList[id].apy = iApy;
    }

    function getListApy() public view returns (apyListStruct[2] memory) {
        return apyList;
    }

}
