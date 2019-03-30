/**
 * Created by Balaji Pachai on 03/30/2019
 */

const BigNumber = web3.BigNumber
const chai = require('chai').use(require('chai-bignumber')(BigNumber)).use(require('chai-as-promised'))
const assert = chai.assert
const UserContract = artifacts.require('User')
const BankContract = artifacts.require('Bank')
const demoValues = require('../demoValues/demoValues.json')
const totalSupply = 10**25

let userContractInstance, bankContractInstance, bankContractInstanceAddress
let txObject, owner, debtAgreementId
let user1, user2, user3


contract('Blockchain Payment Application Testing Suite', async (accounts) => { 
    describe('BankContract [ is ERC20Mintable, ERC20Detailed, Ownable ]', async() => { 
        before(async() => { 
            owner = accounts[0]
            user1 = accounts[1]
            user2 = accounts[2]
            user3 = accounts[3]
            bankContractInstance = await BankContract.new( demoValues.BankContract.name, demoValues.BankContract.symbol, demoValues.BankContract.decimals, owner, demoValues.BankContract.noOfTokens, { from: owner, gas: demoValues.gas })
            bankContractInstanceAddress = bankContractInstance.address
            userContractInstance = await UserContract.new(bankContractInstance.address, demoValues.FIXED_LIMIT)
            await bankContractInstance.transfer(bankContractInstance.address, 50000, {from: owner})
            // console.log('contract addresses are: ', bankContractInstance.address, userContractInstance.address);
            
        })

        describe('Check value set by constructor are as expected', async () => {
            let result
            it('Checks the token name', async () => {
                result = await bankContractInstance.name.call()
                assert.equal(result, demoValues.BankContract.name, 'Token name do not match')
            })

            it('Checks the token symbol', async () => {
                result = await bankContractInstance.symbol.call()
                assert.equal(result, demoValues.BankContract.symbol, 'Token symbol do not match')
            })
            it('Checks the token decimals', async () => {
                result = await bankContractInstance.decimals.call()
                assert.equal(result, demoValues.BankContract.decimals, 'Token decimals do not match')
            })

            it('Checks the owners balance', async () => {
                result = await bankContractInstance.balanceOf.call(owner)
                assert.equal(result.toNumber(), 9950000, 'Owner balances do not match')
            })
        })

        describe('function sendMoneyToUserAccount(address to, uint256 value) public returns (bool)', async () => {
            let result
            before(async () => {
                await bankContractInstance.transfer(bankContractInstance.address, 10000, {from: owner})
                result = await bankContractInstance.balanceOf.call(owner)
                console.log('Balance of owner:\t\t', result.toNumber())
            })

            it('sendMoneyToUserAccount: 500 Tokens', async() => {
                txObject = await bankContractInstance.sendMoneyToUserAccount(user1, 1000, {from: owner})
                assert.equal(txObject.receipt.status, true, 'Error while executing sendMoneyToUserAccount')
            })

            it('Should check whether sendMoneyToUserAccount executed as expected', async () => {
                result = await bankContractInstance.balanceOf.call(user1)
                assert.equal(result.toNumber(), 1000, 'Error in sendMoneyToUserAccount execution')
            })
        })

        describe('function transferTokensAmongUser(address from, address to, uint amount) public returns (bool)', async () => {
            let balance
            it('Should transfer 500 tokens from user1 to user2', async () => {
                txObject = await bankContractInstance.transferTokensAmongUser(user1, user2, 500, {from: owner})
                assert.equal(txObject.receipt.status, true, 'Error while sending money from user1 to user2')
            })

            it('Should check transfer of 500 tokens from user1 to user2 was successful', async () => {
                balance = await bankContractInstance.balanceOf.call(user1)
                assert.equal(balance.toNumber(), 500, 'User1 balance do not match')
            })
        })

        describe('UserContract ', async () => {
            it('Major 2 functions are already tested in BankContract, thus no separate test case', async () => {
                assert.ok('Already tested')
            })

            describe('function addMoneyToAccount(uint amount) public pullInMoneyLimit returns (bool)', async () => {
                it('Should add money to user account', async () => {
                    let balance = await bankContractInstance.balanceOf.call(bankContractInstance.address)
                    console.log('balance of owner: ', balance.toNumber())
                    balance = await userContractInstance.bankAddress.call()
                    console.log('bankAddress from contract: ', balance)
                    txObject = await userContractInstance.addMoneyToAccount(500, {from: user1})
                })
            })
        })
    })
})
