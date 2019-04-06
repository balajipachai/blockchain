/**
 * Created by Balaji on 04/05/2019
 */

 const BigNumber = web3.BigNumber
 const chai = require('chai').use(require('chai-bignumber')(BigNumber)).use(require('chai-as-promised'))
 const assert = chai.assert
 const BankContract = artifacts.require('Bank')
 const demoValues = require('../demoValues/demoValues.json')
 const totalSupply = 10 ** 25

 let bankContractInstance
let txObject, owner
let user1, user2, user3

contract('BankContract Test Suite', async(accounts) => {
    describe.only('BankContract [ is ERC20Mintable, ERC20Detailed, Ownable ]', async() => { 
        before(async() => { 
            owner = accounts[0]
            user1 = accounts[1]
            user2 = accounts[2]
            user3 = accounts[3]
            bankContractInstance = await BankContract.new( demoValues.BankContract.name, demoValues.BankContract.symbol, demoValues.BankContract.decimals, owner, demoValues.BankContract.noOfTokens, { from: owner, gas: demoValues.gas })
            await bankContractInstance.transfer(bankContractInstance.address, 500000, {from: owner})
        })

        describe('function sendMoneyToUserAccount(address to, uint256 value) public returns (bool)', async () => {
            let amountToSend = 1000, balance
            it('Should send 1000$ to user1 account', async () => {
                txObject = await bankContractInstance.sendMoneyToUserAccount(user1, amountToSend, {from: owner})
                assert.equal(txObject.receipt.status, true, 'Error while sending money to user')
            })
            it('Should check user1\'s balance to equal 1000$', async () => {
                balance = await bankContractInstance.balanceOf.call(user1)
                assert.equal(balance.toNumber(), amountToSend, 'Error in balance tallying')
            })
        })

        describe('function transferTokensAmongUser(address from, address to, uint amount) public returns (bool)', async () => {
            let amountToSendAmongstUser = 500
            it('Should transfer 500$ from user1 to user2', async () => {
                txObject = await bankContractInstance.transferTokensAmongUser(user1, user2, amountToSendAmongstUser, {from: owner})
                assert.equal(txObject.receipt.status, true, 'Error while sending money amongst user')
            })
            it('Should check user1\'s balance to equal 500$', async () => {
                balance = await bankContractInstance.balanceOf.call(user1)
                assert.equal(balance.toNumber(), amountToSendAmongstUser, 'Error in balance tallying')
            })
            it('Should check user2\'s balance to equal 500$', async () => {
                balance = await bankContractInstance.balanceOf.call(user1)
                assert.equal(balance.toNumber(), amountToSendAmongstUser, 'Error in balance tallying')
            })
            
        })

        describe('function addBankDetails(string memory _jsonOfBankDetails) public onlyOwner', async() => {
            let bankDetails = JSON.stringify(demoValues.BankDetails)
            describe('Negative scenarios', async() => {
                it('Should revert addBankDetails in case of non-owner invocation', async () => {
                    try {
                        txObject = await bankContractInstance.addBankDetails(bankDetails, {from:user3})    
                    } catch (error) {
                        assert.equal(error, 'Error: Returned error: VM Exception while processing transaction: revert from Ownable:onlyOwner(). msg.sender is not the owner. -- Reason given: from Ownable:onlyOwner(). msg.sender is not the owner..',"Error message do not match.")
                    }
                })
            })

            describe('Positive scenarios', async () => {
                it('Should add the bank details when invoked by the owner account', async() => {
                    txObject = await bankContractInstance.addBankDetails(bankDetails, {from:owner})
                    assert.equal(txObject.receipt.status, true, 'Error while adding bank details')
                })

                it('Should check the bank details are set as expected', async () => {
                    let storedBankDetails = JSON.parse(await bankContractInstance.getBankDetails.call())
                    // console.log('Bank details from the blockchain: ', storedBankDetails)
                    assert.deepStrictEqual(storedBankDetails, demoValues.BankDetails, 'Stored and retrieved bank details do not match')

                })
            })
        })
    })

})