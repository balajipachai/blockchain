const Web3 = require('web3');
const config = require('../../truffle-config')
const web3 = new Web3(new Web3.providers.HttpProvider(config.networks.development.protocol + '://' + config.networks.development.host + ':' + config.networks.development.port));

const checkMining = async function (txhash) {
    return new Promise((resolve) => {
        const filter = web3.eth.filter('latest');
        let isResolved = false;
        // waiting for mining
        filter.watch(function () {
            let receipt = web3.eth.getTransactionReceipt(txhash);
            setTimeout(function () {
                if (!isResolved) {
                    filter.stopWatching();
                    return resolve({'result': 'Data is not mined yet'});
                }
            }, 5000);
            if (receipt && receipt.transactionHash === txhash) {
                if (web3.eth.getTransaction(txhash).blockNumber) {
                    isResolved = true;
                    filter.stopWatching();
                    resolve(web3.eth.getBlock(web3.eth.getTransaction(txhash).blockNumber));
                } else {
                    filter.stopWatching();
                    isResolved = true;
                }
            }
        });
    })
}

module.exports = {
    checkMining
};