pragma solidity ^0.5.0;
import "../openZeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "../openZeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract Bank is ERC20Mintable, ERC20Detailed {
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
        super.transfer(to, value);
        return true;
    }

    function transferTokensAmongUser(address from, address to, uint amount) public returns (bool) {
        super._transfer(from, to, amount);
        return true;
    }
}