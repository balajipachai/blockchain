/**
 * Created by Balaji on 04/05/2019
 */

const BigNumber = web3.BigNumber
const chai = require('chai').use(require('chai-bignumber')(BigNumber)).use(require('chai-as-promised'))
const assert = chai.assert
const BankContract = artifacts.require('Bank')
const UserContract = artifacts.require('User')
const demoValues = require('../demoValues/demoValues.json')
const totalSupply = 10 ** 25
const zeroAdd = 0x0000000000000000000000000000000000000000

let userContractInstance, bankContractInstance, bankContractInstanceAddress
let txObject, owner, debtAgreementId
let user1, user2, user3


contract('UserContract Test Suite', async(accounts) => {
    describe.only('User [ is Ownable ]', async () => {
        before(async() => {
            owner = accounts[0]
            user1 = accounts[1]
            user2 = accounts[2]
            user3 = accounts[3]
            bankContractInstance = await BankContract.new( 
                demoValues.BankContract.name, 
                demoValues.BankContract.symbol, 
                demoValues.BankContract.decimals, 
                owner, 
                demoValues.BankContract.noOfTokens,
                { 
                    from: owner, 
                    gas: demoValues.gas 
                })

            await bankContractInstance.transfer(bankContractInstance.address, 500000, {from: owner})
            // console.log('Bank contract instance address: ', bankContractInstance.address)
            userContractInstance = await UserContract.new(
                bankContractInstance.address, 
                demoValues.FIXED_LIMIT, 
                { 
                    from: owner,
                    gas: demoValues.gas
                })
        })

        describe('function addUserDetails(string memory _jsonOfUserDetails, address userAddress) public onlyOwner', async() => {
            let userDetails = JSON.stringify(demoValues.UserDetails)
            describe('Negative scenarios', async() => {
                it('Should revert addUserDetails in case of non-owner invocation', async () => {
                    try {
                        txObject = await userContractInstance.addUserDetails(userDetails, user1, {from: user3})   
                    } catch (error) {
                        assert.equal(error.message, "Returned error: VM Exception while processing transaction: revert from Ownable:onlyOwner(). msg.sender is not the owner. -- Reason given: from Ownable:onlyOwner(). msg.sender is not the owner..", "Error message do not match.")
                        // console.log(error.message)
                    }
                })
            })

            describe('Positive scenarios', async () => {
                it('Should addUserDetails in case of invoked by owner account', async () => {
                    txObject = await userContractInstance.addUserDetails(userDetails, user1, {from: owner})
                    assert.equal(txObject.receipt.status, true, 'Error while adding user details.')   
                })
                it('Should check addUserDetails executed as expected', async() => {
                    let userDetailsFromBlockchain = JSON.parse(await userContractInstance.getUserDetails({from: user1}))
                    // console.log('User details from blockchain: ', userDetailsFromBlockchain)
                    assert.deepEqual(userDetailsFromBlockchain, demoValues.UserDetails, "User details do not match.")
                })
            })
        })

        describe('function addMoneyToAccount(uint amount) public pullInMoneyLimit returns (bool)', async () => {
            let amountToAdd = 5000
            let zeroAmount = 0
            describe('Negative scenarios', async() => {
                it('Should revert when msg.sender is address(0)', async() => {
                    try {
                        await userContractInstance.addMoneyToAccount(amountToAdd, {from: zeroAdd})
                    } catch (error) {
                        assert.equal(error, "Error: Returned error: from not found; is required", "Error do not match")
                        // console.log(error)
                    }
                })
                it('Should revert when amount to add is 0', async () => {
                    try {
                        await userContractInstance.addMoneyToAccount(zeroAmount, {from: user1})
                    } catch (error) {
                        assert.equal(error.message, "Returned error: VM Exception while processing transaction: revert reverted from UserContract:addMoneyToAccount(). amount must be greater than 0 -- Reason given: reverted from UserContract:addMoneyToAccount(). amount must be greater than 0.", "Error messages do not match.")
                        // console.log('error in 2: ', error)
                    }
                })
            })

            describe('Psitive scenarios', async() => {
                let balance, bankAddress
                it('Should add 5000$ to user1 account', async () => {
                    bankAddress = await userContractInstance.bankAddress.call()
                    console.log('bankAddress: ', bankAddress);
                    
                    txObject = await userContractInstance.addMoneyToAccount(amountToAdd, {from: user1})
                    assert.equal(txObject.receipt.status, true, "Error while adding money to user account")
                })
                describe('Check addMoneyToAccount() executed successfully', async () => {
                    it('Should check user1\'s balance to be 5000$', async () => {
                        balance = await bankContractInstance.balanceOf.call(user1)
                        assert.equal(balance.toNumber(), 5000, "User1 balances do not match.")
                    })
                    it('Should check user1\'s balance to be 5000 from checkBalance of UserContract.sol', async () => {
                        balance = await userContractInstance.checkBalance.call({from: user1})
                        assert.equal(balance.toNumber(), 5000, "User1 balances do not match.")
                    })
                    it('Should revert addMoneyToAccount for user1 as the pullInMoney limit has reached', async() => {
                        try {
                            await userContractInstance.addMoneyToAccount(5000, {from: user1})
                        } catch (error) {
                            console.log('error: ', error)
                        }
                    })
                })
            })
        })
    })
})