// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

//This code has been developed in a rush, but it works. It can definitely be improved.

contract bioERC20 is ERC20, ERC20Burnable {
    uint256 initTokens = 100 ether;
    uint256 public counter = 0;
    mapping(address => bool) private firstStart;
    mapping(address => uint256[]) private timeList;
    mapping(address => string[]) private coordinates;
    mapping(address => uint256[]) private costList;

    constructor() ERC20("Ecosystem Token", "EKOX") {}

    function isFirstTime(address accountId) public view returns (bool) {
        return firstStart[accountId];
    }

    //Cost would be nice to pass it via oracle setting a satellite feed
    function buyLand(string memory coord, uint256 cost) public {
        require(balanceOf(msg.sender) >= cost, "Insufficient balance");
        _burn(msg.sender, cost);
        coordinates[msg.sender].push(coord);
        costList[msg.sender].push(cost);
        timeList[msg.sender].push(block.timestamp);
        counter += 1; //This needs to be fixed against overflow
    }

    //Cost would be nice to pass it via oracle setting a satellite feed
    //Verification to the size of the arrays needs to be implemented
    //This is highly unsecured, but could not fix a bug on the front end.
    function claimYield(uint256 amount) public {
        require( amount > 0 );
        if (amount > 0) {
            _mint(msg.sender, amount);
        }
    }

    function claimStartingTokens() public {
        require(firstStart[msg.sender] == false, "Already Initialized");
        firstStart[msg.sender] = true;
        _mint(msg.sender, initTokens);
    }

    function getCoordinates(address accountId, uint256 index) public view returns (string memory) {
        uint256 size = costList[accountId].length;
        require(index < size, "Index out of boundaries");
        return coordinates[accountId][index];
    }

    function getCostList(address accountId) public view returns (uint256[] memory) {
        return costList[accountId];
    }

    function getTimeList(address accountId) public view returns (uint256[] memory) {
        return timeList[accountId];
    }

}
