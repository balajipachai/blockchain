/**
 * @author Balaji Pachai
 * Date created: 02/12/2019
 * Re-entrancy test cases
 */

const HackToken = artifacts.require('HackToken')
const Reentrancy = artifacts.require('Reentrant')
const ERC20Token = artifacts.require('LakshmiToken')
const demoValues = require('../demoValues/demoValues.json')

contract('HactToken Test Suite', async(accounts) => {
    let hackTokenContractInstance, reEntrancyContractInstance, erc20TokenInstance
    let owner
    let txObject
    let oneEther = 10 ** 18

    before(async() => {
        owner = accounts[0]
        erc20TokenInstance = await ERC20Token.new({from: owner, gas: demoValues.reEntrancy.gas})
        reEntrancyContractInstance = await Reentrancy.new({from: owner, gas: demoValues.reEntrancy.gas})
        // Transfer 10 Ethers to Reentrancy contract
        await erc20TokenInstance.transfer(reEntrancyContractInstance.address, (10 * oneEther),  {from: owner, gas: demoValues.reEntrancy.gas})
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

        it('Should start re-entrancy mechanism', async () => {
            txObject = await hackTokenContractInstance.transfer( {from: owner, gas: demoValues.reEntrancy.gas})
            assert.equal(txObject.receipt.status, true, "Error while performing re-entrancy")
        })

        it('Should check re-entrancy has happened', async () => {
            let balance = await erc20TokenInstance.balanceOf.call(reEntrancyContractInstance.address)
            console.log("Balance of Re-entrant contract: ", balance.toNumber())

            balance = await erc20TokenInstance.balanceOf.call(hackTokenContractInstance.address)
            console.log("Balance of HackToken contract: ", balance.toNumber())
        })
    })
})