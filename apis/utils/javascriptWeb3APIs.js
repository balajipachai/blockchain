const config = require('../../truffle-config.js')
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(config.networks.development.protocol + '://' + config.networks.development.host + ':' + config.networks.development.port));

const contract = require('truffle-contract')
const BankContractJson = require('../../build/contracts/Bank')
const BankContract = contract(BankContractJson)

// const SQLite = require('./sqlite')
const ENVIRONMENT = config.networks.development.name

function getEthAccounts() {
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts(function (error, ethAccounts) {
            if (error) {
                reject({
                    status: 'failure',
                    message: error.message,
                    data: []
                })
            } else {
               owner = ethAccounts[0]
               resolve({
                   status: 'success',
                   message: 'Fetched ethereum accounts are: ',
                   data: ethAccounts
               })
            }
        })
    })
}


const getContractInstance = function (contract){
        return (web3.eth.contract(contract.abi).at(contract.address))
}

const getBalances = async function (addresses){
    let balance
    let accountsBalArray = []
    //Get the BCToken instance
    BankContract.setNetwork(getNetworkId(ENVIRONMENT))
    let tokenInstance = getContractInstance(BankContract)
    addresses.forEach((element) => {
        balance = tokenInstance.balanceOf.call(element)
        // console.log('Balance of [',element,'] = ', balance.toString())
        accountsBalArray.push({
            address: element,
            balance: balance.toNumber()
        })
    })
    return accountsBalArray
}


const getNetworkId = function(environment){
    return config.networks[environment].network_id
}

const getProvider = function(environment){
    return (config.networks[environment].protocol + '://' + config.networks[environment].host + ':' + config.networks[environment].port)
}

// async function getLogsAndInsertInSQLite(params) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let filterOptions = {
//                 fromBlock: '0',
//                 toBlock: 'latest'
//             }
//             const myEvent = await params.contractInstance[params.eventName](filterOptions);
//             myEvent.watch(async (err, logs) => {
//                 let response = await insertIntoEventBlock(logs)
//                 if (response.status === 'success') {
//                     await insertAsPerTableDetail(logs)
//                     resolve({
//                         status: 'success',
//                         message: 'Event Watched successfully',
//                         data: []
//                     })
//                 }
//             })
//         } catch (error) {
//             reject({
//                 status: 'failure',
//                 message: error.message,
//                 data: []
//             })
//         }
//     })

// }

/**
 * Function that inserts as per table
 * */
// async function insertAsPerTableDetail(logs) {
//     return new Promise(async (resolve, reject) => {
//         let response = await SQLite.insert(getTableDetailsJson(logs))
//         if (response.status === 'success') {
//             resolve(response)
//         } else {
//             reject(response)
//         }
//     })
// }

// async function insertIntoEventBlock(logs) {
//     return new Promise(async (resolve, reject) => {
//         let response = await SQLite.insert({
//             event: 'EventBlock',
//             params: [
//                 logs.address,
//                 logs.blockHash,
//                 logs.blockNumber,
//                 logs.event,
//                 logs.logIndex,
//                 logs.transactionHash,
//                 logs.transactionIndex
//             ]
//         })
//         if (response.status === 'success') {
//             resolve(response)
//         } else {
//             reject(response)
//         }
//     })
// }

// function openDBConnection() {
//     return new Promise(async (resolve, reject) => {
//         try {
//             resolve(await SQLite.openDBConnection())
//         } catch (error) {
//             reject({
//                 status: 'failure',
//                 message: error.message,
//                 data: []
//             })
//         }
//     })
// }

// function createAllSQLiteTables() {
//     return new Promise(async (resolve, reject) => {
//         let createAllTableResponse = await SQLite.createAll()
//         if (createAllTableResponse.status === 'success') {
//             resolve(createAllTableResponse)
//         } else {
//             reject(createAllTableResponse)
//         }
//     })
// }

// function getTableDetailsJson(logDetails) {
//     switch (logDetails.event) {
//         case 'Agreement':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args._agreementId,
//                     logDetails.args._lender,
//                     logDetails.args._borrower,
//                     logDetails.args._timestamp.toNumber(),
//                     logDetails.blockHash,
//                     logDetails.logIndex
//                 ]
//             }

//         case 'LogDebtOrderFilled':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args._principal.toNumber(),
//                     logDetails.args._principalToken,
//                     logDetails.args._underwriter,
//                     logDetails.args._underwriterFee.toNumber(),
//                     logDetails.args._relayer,
//                     logDetails.args._relayerFee.toNumber(),
//                     logDetails.args._agreementId,
//                     logDetails.blockHash,
//                     logDetails.logIndex
//                 ]
//             }

//         case 'LogSimpleInterestTermStart':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args.principalToken,
//                     logDetails.args.principalAmount.toNumber(),
//                     logDetails.args.interestRate.toNumber(),
//                     logDetails.args.amortizationUnitType.toNumber(),
//                     logDetails.args.termLengthInAmortizationUnits.toNumber(),
//                     logDetails.args.agreementId,
//                     logDetails.blockHash,
//                     logDetails.logIndex
//                 ]
//             }

//         case 'LogRegisterRepayment':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args.payer,
//                     logDetails.args.beneficiary,
//                     logDetails.args.unitsOfRepayment.toNumber(),
//                     logDetails.args.tokenAddress,
//                     logDetails.args.agreementId,
//                     logDetails.blockHash,
//                     logDetails.logIndex,
//                     logDetails.args.timestamp.toNumber()
//                 ]
//             }

//         case 'Deposited':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args.payee,
//                     logDetails.args.tokenAmount.toNumber(),
//                     logDetails.args.timestamp.toNumber(),
//                     logDetails.args.escrow,
//                     logDetails.blockHash,
//                     logDetails.logIndex
//                 ]
//             }

//         case 'Withdrawn':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args.payee,
//                     logDetails.args.tokenAmount.toNumber(),
//                     logDetails.args.timestamp.toNumber(),
//                     logDetails.args.escrow,
//                     logDetails.blockHash,
//                     logDetails.logIndex
//                 ]
//             }

//         case 'CollateralLocked':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args.agreementID,
//                     "N/A",
//                     "N/A",
//                     logDetails.args.token,
//                     logDetails.args.amount.toNumber(),
//                     logDetails.args.timestamp.toNumber(),
//                     logDetails.logIndex
//                 ]
//             }

//         case 'CollateralReturned':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args.agreementID,
//                     logDetails.args.collateralizer,
//                     "N/A",
//                     logDetails.args.token,
//                     logDetails.args.amount.toNumber(),
//                     logDetails.args.timestamp.toNumber(),
//                     logDetails.logIndex
//                 ]
//             }

//         case 'CollateralSeized':
//             return {
//                 event: logDetails.event,
//                 params: [
//                     logDetails.args.agreementID,
//                     "N/A",
//                     logDetails.args.beneficiary,
//                     logDetails.args.token,
//                     logDetails.args.amount.toNumber(),
//                     logDetails.args.timestamp.toNumber(),
//                     logDetails.logIndex
//                 ]
//             }
//         default: throw new Error('No Case matched in getTableDetailsJson')
//     }
// }

// function closeDBConnection() {
//     return new Promise(async (resolve, reject) => {
//         try {
//             resolve(await SQLite.closeDBConnection())
//         } catch (error) {
//             reject({
//                 status: 'failure',
//                 message: error.message,
//                 data: []
//             })
//         }
//     })
// }

// async function selectByQuery(query) {
//     return new Promise(async (resolve, reject) => {
//         try{
//             resolve(await SQLite.selectAsPerQuery(query))
//         } catch (error) {
//             reject({
//                 status: 'failure',
//                 message: error.message,
//                 data: []
//             })
//         }
//     })
// }

module.exports = {
    getEthAccounts,
    getContractInstance,
    getBalances,
    getNetworkId,
    getProvider
    // getSignaturesRSV,
    // getSoliditySha3,
    // fastForwardGanache,
    // bytes32ToUint,
    // isContract,
    // getLatestBlockTimestamp,
    // createAllSQLiteTables,
    // getLogsAndInsertInSQLite,
    // selectByQuery,
    // closeDBConnection,
    // openDBConnection

}