pragma solidity ^0.5.2;


import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
/// @author Balaji Pachai
/// @title LakshmiToken
/// @dev A simple ERC20 compliant token
contract LakshmiToken is ERC20Mintable {
    string public constant name = "LakshmiToken";
    string public constant symbol = "LTK";
    uint8 public constant decimals = 18;
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

    /// @notice Constructor function that sets the initial supply and assigns all the balance to the msg.sender
    constructor () public {
        mint(msg.sender, INITIAL_SUPPLY);
    }
}