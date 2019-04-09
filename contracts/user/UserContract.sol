pragma solidity ^0.5.0;
import "../bank/BankContract.sol";
import "../openZeppelin/contracts/math/SafeMath.sol";
import "../openZeppelin/contracts/ownership/Ownable.sol";

contract User is Ownable {
    using SafeMath for uint256;
    mapping (address => UserAccountDetails) public userAccDetails;
    uint public FIXED_LIMIT;
    mapping (address => string) public userDetails;

    Bank public bankAddress;
    event LogMoneyAdded(address who, uint amount, uint timestamp);
    event LogMoneySent(address sender, address receiver, uint amount, uint timestamp);
    event LogAddUserDetails(address user, string userDetails, uint timestamp);

    modifier pullInMoneyLimit() {
        require(userAccDetails[msg.sender].balance <= FIXED_LIMIT, "reverted from UserContract:pullInMoneyLimit()");
        _;
    }

    struct UserAccountDetails {
        uint balance;
        address accountAddress;
    }

    constructor (address _address, uint _limit) public {
        bankAddress = Bank(_address);
        FIXED_LIMIT = _limit;
    }

    //Assumption: Owner is the trusted authority or Admin who adds user details
    function addUserDetails(string memory _jsonOfUserDetails, address userAddress) public onlyOwner {
        require(userAddress != address(0), "reverted from UserContract:addUserDetails(). userAddress cannot be address(0)");
        userDetails[userAddress] = _jsonOfUserDetails;
        emit LogAddUserDetails(userAddress, _jsonOfUserDetails, block.timestamp);
    }

    function getUserDetails() public view returns (string memory) {
        return userDetails[msg.sender];
    }


    function addMoneyToAccount(uint amount) public pullInMoneyLimit returns (bool) {
        require(msg.sender != address(0), "reverted from UserContract:addMoneyToAccount(). msg.sender cannot be address(0)");
        require(amount > 0, "reverted from UserContract:addMoneyToAccount(). amount must be greater than 0");
        if (sendMoneyThroughBank(msg.sender, amount) == true) {
            // userAccDetails[msg.sender].balance.add(amount);
            emit LogMoneyAdded(msg.sender, amount, block.timestamp);
            return true;
        }
        return false;
    }

    function sendMoneyToUser(address receiver, uint amount) public {
        require(receiver != address(0), "reverted from UserContract:sendMoney(). receiver cannot be address(0)");
        require(amount > 0, "reverted from UserContract:sendMoney(). amount must be greater than 0");
        userAccDetails[receiver].balance.add(amount);
        userAccDetails[msg.sender].balance.sub(amount);
        bankAddress.transferTokensAmongUser(msg.sender, receiver, amount);
        emit LogMoneySent(msg.sender, receiver, amount, block.timestamp);
    }

    function sendMoneyToBank(uint amount) public {
        require(msg.sender != address(0), "reverted from UserContract:withdrawMoney(). msg.sender cannot be address(0)");
        require(amount > 0, "reverted from UserContract:withdrawMoney(). amount must be greater than 0");
        bankAddress.transferTokensAmongUser(msg.sender,  address(bankAddress), amount);
        emit LogMoneySent(msg.sender,  address(bankAddress), amount, block.timestamp);
    }

    function checkBalance() public view returns (uint256) {
        return userAccDetails[msg.sender].balance;
    }

    function sendMoneyThroughBank(address _to, uint256 _amount) internal returns (bool) {
        return bankAddress.sendMoneyToUserAccount(_to, _amount);
    }
}