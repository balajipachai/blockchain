pragma solidity ^0.5.0;
import "../openZeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "../openZeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "../openZeppelin/contracts/ownership/Ownable.sol";

contract Bank is ERC20Mintable, ERC20Detailed, Ownable {

    mapping (address => string) public bankDetails;
    event LogBankDetailsAdd(address bankAddress, uint timestamp);

    constructor (
        string memory name, 
        string memory symbol, 
        uint8 decimals,
        address to,
        uint256 noOfTokens
        ) public 
        ERC20Detailed(name, symbol, decimals) {
        super.mint(to, noOfTokens);
    }

    function sendMoneyToUserAccount(address to, uint256 value) public returns (bool) {
        return transfer(to, value);
    }

    function transferTokensAmongUser(address from, address to, uint amount) public returns (bool) {
        super._transfer(from, to, amount);
        return true;
    }

     function addBankDetails(string memory _jsonOfBankDetails) public onlyOwner {
        bankDetails[address(this)] = _jsonOfBankDetails;
        emit LogBankDetailsAdd(address(this), block.timestamp);
    }

    function getBankDetails() public view returns (string memory) {
        return bankDetails[address(this)];
    }
}