const BankContract = artifacts.require('Bank')
const UserContract = artifacts.require('User')
const demoValues = require('../demoValues/demoValues.json')

module.exports = async function(deployer, network, accounts) {
    const owner = accounts[0]
    deployer.deploy(
        BankContract,
        demoValues.BankContract.name,
        demoValues.BankContract.symbol,
        demoValues.BankContract.decimals,
        owner,
        demoValues.BankContract.noOfTokens,
        {
            from: owner, 
            gas: demoValues.gas
        }
    ).then(function() {
        // console.log('Bank contract address: ********************', BankContract.address)
        return deployer.deploy(
            UserContract, 
            BankContract.address,
            demoValues.FIXED_LIMIT,
            {
                from: owner, 
                gas: demoValues.gas
            }
        )
    })
}