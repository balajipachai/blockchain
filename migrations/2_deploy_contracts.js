const Reentrancy = artifacts.require('Reentrant')
const HackToken = artifacts.require('HackToken')
const ERC20Token = artifacts.require('LakshmiToken')
const demoValues = require('../demoValues/demoValues.json')

module.exports = async function(deployer, network, accounts) {
    const owner = accounts[0]
    deployer.deploy(
        Reentrancy, {from: owner, gas: demoValues.reEntrancy.gas}
        ).then(function() {
            return HackToken.new(Reentrancy.address, {from: owner, gas: demoValues.reEntrancy.gas})
        }).then(function(){
            return ERC20Token.new({from: owner, gas: demoValues.reEntrancy.gas})
        })
}