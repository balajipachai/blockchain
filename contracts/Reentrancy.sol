pragma solidity ^0.5.2;


import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
/// @author Balaji Pachai
/// @title Re-entrant contract
contract Reentrant {
    mapping (address=>uint256) public myDeposits;
    uint256 public balance;
    using SafeMath for uint256;

    /// Transfers tokens 
    /// @param noOfTokens the number of tokens to transfer
    /// @notice Function that transfers tokens from msg.sender to this contract
    function transferTokens(uint noOfTokens) public {
        balance = address(this).balance;
        require (balance > 0, "in Reentrancy:transferTokens(). Balance of current contract is <= 0");
        if (!msg.sender.call.value(myDeposits[msg.sender])()) {
            revert();
        }
        //Possibility of re-entrancy
        myDeposits[msg.sender] = 0;
    }

    /// Deposit Tokens
    function depositTokens(uint256 _noOfTokens) public {
        require (_noOfTokens > 0, "in Reentrancy: depositTokens(). Number of tokens should be > 0");
        myDeposits[msg.sender] = _noOfTokens;
    }
}