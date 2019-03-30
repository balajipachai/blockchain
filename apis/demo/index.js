const blockchainPaymentInterface = require('../blockchainPayment/index')
const demoValues = require('../../demoValues/demoValues')

let accounts = {}
let contractAddresses = {}
let user1, user2, user3

function initialSetup() {
    console.log('\x1b[36m%s\x1b[0m','\nInvoked setNetwork() & setInstances() from demo:')
    blockchainPaymentInterface.setNetwork()
    blockchainPaymentInterface.setInstances()
}

function getEthAccounts() {
    return new Promise(async(resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked getAllEthAccounts() from demo:')
        let response = await blockchainPaymentInterface.getAllEthAccounts()
        if (response.status === 'success') {
            accounts = response.data
            resolve({
                status: response.status,
                message: response.message,
                data: response.data
            })
        } else {
            reject(response)
        }
    })
}

function getContractAddrsAndInitialArgs() {
    console.log('\x1b[36m%s\x1b[0m','\nInvoked getContractAddresses() from demo:')
    contractAddresses = blockchainPaymentInterface.getContractAddresses()
}

function setSystemWideSettings() {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked systemWideSettings() from demo:')
        let systemWideResponse = await blockchainPaymentInterface.systemWideSettings()
        if (systemWideResponse.status === 'success') {
            resolve(systemWideResponse)
        } else {
            reject(systemWideResponse)
        }
    })
}

function invokePrintActors() {
    console.log('\x1b[36m%s\x1b[0m','\nInvoked printActors() from demo:')
    blockchainPaymentInterface.printActors({
        user1: accounts.acc1,
        user2: accounts.acc2,
        user3: accounts.acc3,
        bankContract: contractAddresses.bankContractAddress,
        userContract: contractAddresses.userContractAddress
    })
}

function invokeAddUserDetails(userDetails) {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked addUserDetails() from demo:')
        let response = await blockchainPaymentInterface.addUserDetails(userDetails)
        if (response.status === 'success') {
            resolve(response)
        } else {
            reject(response)
        }
    })
}

function invokeAddBankDetails(bankDetails) {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked addBankDetails() from demo:')
        let response = await blockchainPaymentInterface.addBankDetails(bankDetails)
        if (response.status === 'success') {
            resolve(response)
        } else {
            reject(response)
        }
    })
}

function invokeUserAddMoneyToAccount(amount) {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked userAddMoneyToAccount() from demo:')
        let response = await blockchainPaymentInterface.userAddMoneyToAccount(amount)
        if (response.status === 'success') {
            resolve(response)
        } else {
            reject(response)
        }
    })
}

function invokeUserSendMoneyToOtherUser(receiver, amount) {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked userSendMoneyToOtherUser() from demo:')
        let response = await blockchainPaymentInterface.userSendMoneyToOtherUser(receiver, amount)
        if (response.status === 'success') {
            resolve(response)
        } else {
            reject(response)
        }
    })
}


function invokeUserSendMoneyToBank(amount) {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked userSendMoneyToBank() from demo:')
        let response = await blockchainPaymentInterface.userSendMoneyToBank(amount)
        if (response.status === 'success') {
            resolve(response)
        } else {
            reject(response)
        }
    })
}

function invokeGetBalances(addresses) {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked getBalances() from demo:')
        let response = await blockchainPaymentInterface.getBalances(addresses)
        if (response.status === 'success') {
            resolve(response)
        } else {
            reject(response)
        }
    })
}

function invokeGetAddedBankDetails() {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked getAddedBankDetails() from demo:')
        let response = await blockchainPaymentInterface.getAddedBankDetails()
        if (response.status === 'success') {
            resolve(response)
        } else {
            reject(response)
        }
    })
}

function invokeGetAddedUserDetails() {
    return new Promise(async (resolve, reject) => {
        console.log('\x1b[36m%s\x1b[0m','\nInvoked getAddedUserDetails() from demo:')
        let response = await blockchainPaymentInterface.getAddedUserDetails()
        if (response.status === 'success') {
            resolve(response)
        } else {
            reject(response)
        }
    })
}

async function invokeCommandLineDemo() {
    initialSetup()
    await getEthAccounts()
    getContractAddrsAndInitialArgs()
    await setSystemWideSettings()
    invokePrintActors()

    await invokeAddUserDetails(JSON.stringify(demoValues.UserDetails))

    await invokeAddBankDetails(JSON.stringify(demoValues.BankDetails))

    await invokeGetBalances([
        accounts.acc1,
        accounts.acc2,
        accounts.acc3,
        contractAddresses.bankContractAddress,
        contractAddresses.userContractAddress
    ])
    
    await invokeUserAddMoneyToAccount(demoValues.AMOUNT_TO_ADD)
    
    await invokeGetBalances([
        accounts.acc1,
        accounts.acc2,
        accounts.acc3,
        contractAddresses.bankContractAddress,
        contractAddresses.userContractAddress
    ])

    await invokeUserSendMoneyToOtherUser(accounts.acc3, 1000)

    await invokeGetBalances([
        accounts.acc1,
        accounts.acc2,
        accounts.acc3,
        contractAddresses.bankContractAddress,
        contractAddresses.userContractAddress
    ])

    await invokeUserSendMoneyToBank(1000)

    await invokeGetBalances([
        accounts.acc1,
        accounts.acc2,
        accounts.acc3,
        contractAddresses.bankContractAddress,
        contractAddresses.userContractAddress
    ])

    await invokeGetAddedBankDetails()

    await invokeGetAddedUserDetails()

}

invokeCommandLineDemo()
