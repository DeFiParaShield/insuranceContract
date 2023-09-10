// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

interface IClaims {
    function computePremium(uint256 quantity) external view returns (uint256);
    function addCoverage( uint256 amount, address account ) external;
    function reduceCoverage( uint256 amount, address account ) external;
}

contract insurance is Ownable {
    using SafeMath for uint256;
    address aaveAddress;
    IPool poolAave;
    IPoolAddressesProvider private immutable poolAddressProvider;
    uint256 totalSharesLoansPerAsset = 0;
    address _addressClaimContract;

//    address _USDC = 0xF14f9596430931E177469715c591513308244e8F;  //Fake USDC but this token works in AAVE: Polygon
    address _USDC = 0x2C9678042D52B97D27f2bD2947F7111d93F3dD0D; //Fake USDC but this works in AAVE: Scroll Sepolia
    mapping(address => uint256) private assets;
    mapping(address => uint256) private sharesLoans;

    constructor() {
//        poolAddressProvider = IPoolAddressesProvider(0xeb7A892BB04A8f836bDEeBbf60897A7Af1Bf5d7F); //Polygon
        poolAddressProvider = IPoolAddressesProvider(0x52A27dC690F8652288194Dd2bc523863eBdEa236); //Scroll Sepolia
        aaveAddress = poolAddressProvider.getPool();
        poolAave = IPool(aaveAddress);
    }

    function depositAsset(uint256 amount) public {
        IERC20(_USDC).transferFrom(msg.sender, address(this), amount );
        uint256 discount = IClaims(_addressClaimContract).computePremium( amount );
        amount -= discount;
        IERC20(_USDC).approve(_addressClaimContract, discount);
        IClaims(_addressClaimContract).addCoverage( amount, msg.sender );
        assets[msg.sender] += amount;
        supplyLendToken( msg.sender, amount );
    }

    function withdrawAsset(uint256 percentage) public {
        uint256 finalAmount = withdrawLendToken( msg.sender, percentage );
        IClaims(_addressClaimContract).reduceCoverage( finalAmount, msg.sender );
        assets[msg.sender] -= finalAmount;
        IERC20(_USDC).transfer( msg.sender, finalAmount );
    }

    function supplyLendToken(address account, uint256 amount) private {
        require( IERC20(_USDC).approve(aaveAddress, amount), "This contract has not enough tokens" );
        poolAave.supply(_USDC, amount, address(this), 0);

        if ( totalSharesLoansPerAsset == 0 ) {
            sharesLoans[account] += amount;
            totalSharesLoansPerAsset += amount;
        } else {
            address aTokenAddress = (poolAave.getReserveData(_USDC)).aTokenAddress;
            uint256 currentBalance = IERC20(aTokenAddress).balanceOf( address(this) );
            uint256 amountShares = Math.mulDiv( amount, totalSharesLoansPerAsset, currentBalance );
            sharesLoans[account] += amountShares;
            totalSharesLoansPerAsset += amountShares;
        }

    }

    function withdrawLendToken(address account, uint256 percentage) private returns (uint256){
        require(sharesLoans[account] > 0, "User has not provided this token for lending");

        uint256 amountSharesUser = sharesLoans[account];
        address aTokenAddress = (poolAave.getReserveData(_USDC)).aTokenAddress;
        uint256 currentBalance = IERC20(aTokenAddress).balanceOf(address(this));

        uint256 amountAsset = Math.mulDiv( amountSharesUser * percentage, currentBalance, totalSharesLoansPerAsset * 1000);
        uint256 amountShares = Math.mulDiv( amountSharesUser, percentage, 1000);

        poolAave.withdraw(_USDC, amountAsset, address(this));
        sharesLoans[account] -= amountShares;
        totalSharesLoansPerAsset -= amountShares;

        return amountAsset;
    }

    function assetsOf(address account) public view returns (uint256) {
        uint256 amountSharesUser = sharesLoans[account];
        address aTokenAddress = (poolAave.getReserveData(_USDC)).aTokenAddress;
        uint256 currentBalance = IERC20(aTokenAddress).balanceOf(address(this));
        uint256 amountAsset = 0;
        if ( totalSharesLoansPerAsset > 0 ) {
            amountAsset = Math.mulDiv( amountSharesUser, currentBalance, totalSharesLoansPerAsset );
        }
        return amountAsset;
    }

    function sharesLoansOf(address account) public view returns (uint256) {
        return sharesLoans[account];
    }

    function getATokenAddress() public view returns (address) {
        return poolAave.getReserveData(_USDC).aTokenAddress;
    }

    //This will be change by a DAO in the future.
    function changeAddressClaimContract(address newAddress) public onlyOwner {
        _addressClaimContract = newAddress;
    }

    receive() external payable {}
}
