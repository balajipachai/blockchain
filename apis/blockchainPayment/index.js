const javascriptWeb3APIs = require('../utils/javascriptWeb3APIs')
const contract = require('truffle-contract')
const isMined = require('../utils/isMined')
const prettyJson = require('../utils/prettyJsonOutput')
const config = require('../../truffle-config')
const async = require('async');
const demoValues = require('../../demoValues/demoValues')

const bankContractJson = require('../../build/contracts/Bank')
const BankContract = contract(bankContractJson)

const userContractJson = require('../../build/contracts/User')
const UserContract = contract(userContractJson)

const ENVIRONMENT = config.networks.development.name

let userContractInstance, bankContractInstance
let owner
let user1, user2, user3

function setNetwork() {
    try{
        BankContract.setNetwork(javascriptWeb3APIs.getNetworkId(ENVIRONMENT))
        UserContract.setNetwork(javascriptWeb3APIs.getNetworkId(ENVIRONMENT))
        prettyJson.prettyPrint([{message: 'Network setup successful'}])
        return 0
    }catch(e){
        return prettyJson.getResponseObject({number: null}, 'failure', e.message, [])
    }
}

function setInstances() {
    bankContractInstance = javascriptWeb3APIs.getContractInstance(BankContract)
    userContractInstance = javascriptWeb3APIs.getContractInstance(UserContract)
    prettyJson.prettyPrint([{message: 'Instances setup successful'}])
    return 0
}

function  getAllEthAccounts() {
    return new Promise(async(resolve, reject) => {
        let accountsObj = {}
        let response = await javascriptWeb3APIs.getEthAccounts()
        if (response.status === 'success') {
            accounts = response.data
            owner = accounts[0]
            user1 = accounts[1]
            user2 = accounts[2]
            let i = 1
            accounts.forEach((acc) => {
                accountsObj['acc' + i++ ] = acc
            })
            prettyJson.prettyPrint([accountsObj])
            resolve({
                status: response.status,
                message: response.message,
                data: accountsObj
            })
        } else {
            reject(response)
        }
    })
}

function getContractAddresses() {
    let contractAddresses = {
        bankContractAddress: bankContractInstance.address,
        userContractAddress: userContractInstance.address
    }
    prettyJson.prettyPrint([contractAddresses])
    return contractAddresses
}

function printActors(actors) {
    prettyJson.prettyPrint([actors])
}

function systemWideSettings() {
    return new Promise(async (resolve, reject) => {
        try {
            await isMined.checkMining( await bankContractInstance.transfer(bankContractInstance.address, 50000, {from: owner, gas: 3000000}))
            await isMined.checkMining( await bankContractInstance.transfer(user1, 1000, {from: owner, gas: 3000000}))
            await isMined.checkMining( await bankContractInstance.transfer(user2, 1000, {from: owner, gas: 3000000}))
            prettyJson.prettyPrint([{message: 'System wide settings is successful'}])
            resolve({
                status: 'success',
                message: 'System Wide settings is successful',
                data: []
            })
        } catch (error) {
            console.log('error in systemWideSettings: ', error)
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}

function addUserDetails(userDetails) {
    return new Promise(async (resolve, reject) => {
        try {
            await isMined.checkMining( await userContractInstance.addUserDetails(userDetails, user1, {from: owner, gas: 3000000}))
            prettyJson.prettyPrint([{message: 'Added user details successful'}])
            resolve({
                status: 'success',
                message: 'Added user details successful',
                data: []
            })
        } catch (error) {
            console.log('error in addUserDetails: ', error)
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}


function addBankDetails(bankDetails) {
    return new Promise(async (resolve, reject) => {
        try {
            await isMined.checkMining( await bankContractInstance.addBankDetails(bankDetails, {from: owner, gas: 3000000}))
            prettyJson.prettyPrint([{message: 'Added bank details successful'}])
            resolve({
                status: 'success',
                message: 'Added bank details successful',
                data: []
            })
        } catch (error) {
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}

function userAddMoneyToAccount(amount) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('user1: ', user1, 'amount: ', amount)
            await isMined.checkMining( await userContractInstance.addMoneyToAccount(amount, {from: user1, gas: 3000000}))
            prettyJson.prettyPrint([{message: 'Added money successful'}])
            resolve({
                status: 'success',
                message: 'Added money successful',
                data: []
            })
        } catch (error) {
            console.log('error in userAddMoneyToAccount: ', error)
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}


function userSendMoneyToOtherUser(receiver, amount) {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log(receiver, amount)
            await isMined.checkMining( await userContractInstance.sendMoneyToUser(receiver, amount, {from: user1, gas: 3000000}))
            prettyJson.prettyPrint([{message: 'Transferred money between users successful'}])
            resolve({
                status: 'success',
                message: 'Transferred money between users successful',
                data: []
            })
        } catch (error) {
            console.log('error in userSendMoneyToOtherUser: ', error)
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}

function userSendMoneyToBank(amount) {
    return new Promise(async (resolve, reject) => {
        try {
            await isMined.checkMining( await userContractInstance.sendMoneyToBank(amount, {from: user1, gas: 3000000}))
            prettyJson.prettyPrint([{message: 'Transferred money to bank successful'}])
            resolve({
                status: 'success',
                message: 'Transferred money to bank successful',
                data: []
            })
        } catch (error) {
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}

function getBalances(addresses) {
    return new Promise(async (resolve, reject) => {
        try {
            prettyJson.prettyPrint(await javascriptWeb3APIs.getBalances(addresses))
            resolve({
                status: 'success',
                message: 'Displaying account balances',
                data: []
            })
        } catch (error) {
            console.log('error in getBalances: ', error)
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}


function getAddedBankDetails(addresses) {
    return new Promise(async (resolve, reject) => {
        try {
            let bankDetails = await bankContractInstance.getBankDetails.call()
            prettyJson.prettyPrint([JSON.parse(bankDetails)])
            resolve({
                status: 'success',
                message: 'Displaying bank details',
                data: []
            })
        } catch (error) {
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}

function getAddedUserDetails() {
    return new Promise(async (resolve, reject) => {
        try {
            let userDetails = await userContractInstance.getUserDetails.call(user1)
            prettyJson.prettyPrint([JSON.parse(userDetails)])
            resolve({
                status: 'success',
                message: 'Displaying user details',
                data: []
            })
        } catch (error) {
            reject({
                status: 'failure',
                message: error.message,
                data: []
            })
        }
    })
}


module.exports = {
    setNetwork,
    setInstances,
    getAllEthAccounts,
    getContractAddresses,
    systemWideSettings,
    printActors,
    addUserDetails,
    addBankDetails,
    userSendMoneyToOtherUser,
    userSendMoneyToBank,
    getBalances,
    getAddedBankDetails,
    getAddedUserDetails,
    userAddMoneyToAccount
}
