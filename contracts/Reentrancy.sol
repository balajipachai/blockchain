pragma solidity ^0.5.2;


import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./LakshmiToken.sol";
/// @author Balaji Pachai
/// @title Re-entrant contract
contract Reentrant {
    mapping (address=>uint256) public myDeposits;
    uint256 public balance;
    using SafeMath for uint256;
    LakshmiToken public myERC20Token;
    bool public success = false;

    ///@dev Constructor that sets the LakshmiToken (My ERC20 Token address)
    constructor (address _erc20TokenAddress) public {
        myERC20Token = LakshmiToken(_erc20TokenAddress);
    }

    /// Transfers tokens 
    /// @param noOfTokens the number of tokens to transfer
    /// @notice Function that transfers tokens from msg.sender to this contract
    function transferTokens(uint noOfTokens) public {
        balance = myERC20Token.balanceOf(address(this));
        // address(this).balance;
        require (balance > 0, "in Reentrancy:transferTokens(). Balance of current contract is <= 0");
        myERC20Token.transfer(msg.sender, noOfTokens);
        if (myDeposits[msg.sender] > 0) {
            (success, ) = msg.sender.call("");
            //Possibility of re-entrancy
            myDeposits[msg.sender] = 0;
        }
    }

    /// Deposit Tokens
    function depositTokens(uint256 _noOfTokens) public {
        require (_noOfTokens > 0, "in Reentrancy: depositTokens(). Number of tokens should be > 0");
        myDeposits[msg.sender] = _noOfTokens;
    }
}