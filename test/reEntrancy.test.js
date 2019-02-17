/**
 * @author Balaji Pachai
 * Date created: 02/12/2019
 * Re-entrancy test cases
 */

const HackToken = artifacts.require('HackToken')
const Reentrancy = artifacts.require('Reentrant')
const ERC20Token = artifacts.require('LakshmiToken')
const demoValues = require('../demoValues/demoValues.json')
const bigNumber = require('bignumber.js')

contract('HactToken Test Suite', async(accounts) => {
    let hackTokenContractInstance, reEntrancyContractInstance, erc20TokenInstance
    let owner
    let txObject
    let oneEther = 10 ** 18
    let tenEther = new bigNumber(10 * oneEther)

    before(async() => {
        owner = accounts[0]
        erc20TokenInstance = await ERC20Token.new({from: owner, gas: demoValues.reEntrancy.gas})
        reEntrancyContractInstance = await Reentrancy.new(erc20TokenInstance.address, {from: owner, gas: demoValues.reEntrancy.gas})
        // Transfer 10 Ethers to Reentrancy contract
        await erc20TokenInstance.transfer(reEntrancyContractInstance.address, tenEther,  {from: owner, gas: demoValues.reEntrancy.gas})
        hackTokenContractInstance = await HackToken.new(reEntrancyContractInstance.address, {from: owner, gas: demoValues.reEntrancy.gas})
    })

    describe('function deposit(uint256 noOfTokens) public', async () => {
        it('Should deposit tokens into re-entrancy', async () => {
            txObject = await hackTokenContractInstance.deposit(demoValues.reEntrancy.numberOfTokens, {from: owner, gas: demoValues.reEntrancy.gas})
            assert.equal(txObject.receipt.status, true, "Error while depositing tokens into Reentrancy via HactToken")
        })

        it('Should check deposit has executed as expected',  async () => {
            let depositedTokens = await reEntrancyContractInstance.myDeposits.call(hackTokenContractInstance.address)
            assert.equal(depositedTokens.toNumber(), demoValues.reEntrancy.numberOfTokens, "Token deposited values do not match")
        })
    })

    describe('Check balances before hacking', async () => {
        let tenEther = 10 * (10 ** 18)
        let balance
        it('Should check balance of Re-entrancy contract to be 10 ether', async () => {
            balance = new bigNumber (await erc20TokenInstance.balanceOf.call(reEntrancyContractInstance.address))
            assert.equal(balance.toNumber(), tenEther, "Re-entrany contract balances do not match")
            console.log("\t\tBalance of Re-entrant contract before hacking: ", balance.toNumber())
        })

        it('Should check balance of HackToken contract to be 0 ether', async () => {
            balance = new bigNumber (await erc20TokenInstance.balanceOf.call(hackTokenContractInstance.address))
            assert.equal(balance.toNumber(), 0, "HackToken contract balances do not match")
            console.log("\t\tBalance of HackToken contract before hacking: ", balance.toNumber())
        })
    })

    describe('Start Re-entrancy', async () => {
        it('Should check the reentrancy address has been set or not', async () => {
            let reEntrancyAdd = await hackTokenContractInstance.rentrancyAddress.call()
            assert.equal(reEntrancyAdd, reEntrancyContractInstance.address, "Re-entrant contract addresses do not match")
        })

        it('Should start re-entrancy mechanism', async () => {
            let depositedTokens = await reEntrancyContractInstance.myDeposits.call(hackTokenContractInstance.address)
            console.log("\t\tDeposited tokens of msg.sender before re-entrancy: ", depositedTokens.toNumber())
            txObject = await hackTokenContractInstance.transfer( {from: owner, gas: demoValues.reEntrancy.gas})
            assert.equal(txObject.receipt.status, true, "Error while performing re-entrancy")
        })
    })

    describe('Check balances after hacking', async () => {
        let tenEther = 10 * (10 ** 18)
        let balance
        it('Should check balance of Re-entrancy contract to be 0 ether', async () => {
            balance = new bigNumber (await erc20TokenInstance.balanceOf.call(reEntrancyContractInstance.address))
            assert.equal(balance.toNumber(), 0, "Re-entrany contract balances do not match")
            console.log("\t\tBalance of Re-entrant contract after hacking: ", balance.toNumber())
        })

        it('Should check balance of HackToken contract to be 10 ether', async () => {
            balance = new bigNumber (await erc20TokenInstance.balanceOf.call(hackTokenContractInstance.address))
            assert.equal(balance.toNumber(), tenEther, "HackToken contract balances do not match")
            console.log("\t\tBalance of HackToken contract after hacking: ", balance.toNumber())
        })
    })
})