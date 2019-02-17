const Reentrancy = artifacts.require('Reentrant')
const HackToken = artifacts.require('HackToken')
const ERC20Token = artifacts.require('LakshmiToken')
const demoValues = require('../demoValues/demoValues.json')

module.exports = async function(deployer, network, accounts) {
    const owner = accounts[0]
    // await deployer.deploy(ERC20Token.new({from: owner, gas: demoValues.reEntrancy.gas}))
    // await deployer.deploy(Reentrancy.new(ERC20Token.address, {from: owner, gas: demoValues.reEntrancy.gas}))
    // await deployer.deploy(HackToken.new(Reentrancy.address, {from: owner, gas: demoValues.reEntrancy.gas}))
    deployer.deploy(
        ERC20Token, {from: owner, gas: demoValues.reEntrancy.gas}
        ).then(function() {
            // console.log('address in then: 1', ERC20Token.address)
            return deployer.deploy(Reentrancy, ERC20Token.address, {from: owner, gas: demoValues.reEntrancy.gas})
        }).then(function(){
            // console.log('address in then: 2', Reentrancy.address)
            return deployer.deploy(HackToken, Reentrancy.address, {from: owner, gas: demoValues.reEntrancy.gas})
        })
}