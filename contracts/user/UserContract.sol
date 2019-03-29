pragma solidity ^0.5.0;
import "../bank/BankContract.sol";
import "../openZeppelin/contracts/math/SafeMath.sol";

contract User {
    using SafeMath for uint256;
    mapping (address => UserAccountDetails) public userAccDetails;
    uint constant FIXED_LIMIT = 5000;

    Bank public bankAddress;
    event LogMoneyAdded(address who, uint amount, uint timestamp);
    event LogMoneySent(address sender, address receiver, uint amount, uint timestamp);

    modifier pullInMoneyLimit() {
        require(userAccDetails[msg.sender].balance <= FIXED_LIMIT, "reverted from UserContract:pullInMoneyLimit()");
        _;
    }

    struct UserAccountDetails {
        uint balance;
        address accountAddress;
    }

    constructor (Bank _address) public {
        bankAddress = _address;
    }

    function addMoneyToAccount(uint amount) public pullInMoneyLimit returns (bool) {
        bool status = false;
        require(msg.sender != address(0), "reverted from UserContract:addMoneyToAccount(). msg.sender cannot be address(0)");
        require(amount > 0, "reverted from UserContract:addMoneyToAccount(). amount must be greater than 0");
        if (userAccDetails[msg.sender].balance <= FIXED_LIMIT) {
            status = Bank(bankAddress).sendMoneyToUserAccount(msg.sender, amount);
            if (status) {
                userAccDetails[msg.sender].balance.add(amount);
                emit LogMoneyAdded(msg.sender, amount, block.timestamp);
            }
        }
        return status;
    }

    function sendMoneyToUser(address receiver, uint amount) public {
        require(receiver != address(0), "reverted from UserContract:sendMoney(). receiver cannot be address(0)");
        require(amount > 0, "reverted from UserContract:sendMoney(). amount must be greater than 0");
        userAccDetails[receiver].balance.add(amount);
        userAccDetails[msg.sender].balance.sub(amount);
        Bank(bankAddress).transferTokensAmongUser(msg.sender, receiver, amount);
        emit LogMoneySent(msg.sender, receiver, amount, block.timestamp);
    }

    function sendMoneyToBank(uint amount) public {
        require(msg.sender != address(0), "reverted from UserContract:withdrawMoney(). msg.sender cannot be address(0)");
        require(amount > 0, "reverted from UserContract:withdrawMoney(). amount must be greater than 0");
        Bank(bankAddress).transferTokensAmongUser(msg.sender,  address(bankAddress), amount);
        emit LogMoneySent(msg.sender,  address(bankAddress), amount, block.timestamp);
    }

    function checkBalance() public view returns (uint256) {
        return userAccDetails[msg.sender].balance;
    }
}