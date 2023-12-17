const TronWeb = require('tronweb');
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.trongrid.io");
const solidityNode = new HttpProvider("https://api.trongrid.io");
const eventServer = new HttpProvider("https://api.trongrid.io");
const privateKey = "ce2ff5c2971c378b8af50c7fffe04b9143430dcb170fb401950bea804a8f9a99";
const {getRandomNumber, sleep} = require("./utils/common");
const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

const blackHole = "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";  //black hole address

// const memo = 'data:,6868.trxmap';

async function main(i) {
    let memo = `data:,${i}.trxmap`;
    console.log('start mint = ' + memo)
    const unSignedTxn = await tronWeb.transactionBuilder.sendTrx(blackHole, 1); //0.000001 TRX is the minimum transfer amount.
    const unSignedTxnWithNote = await tronWeb.transactionBuilder.addUpdateData(unSignedTxn, memo, 'utf8');
    const signedTxn = await tronWeb.trx.sign(unSignedTxnWithNote);
    // console.log("signed =>", signedTxn);
    const ret = await tronWeb.trx.sendRawTransaction(signedTxn);
    // console.log("broadcast =>", ret);
    console.log("txid =>", ret.txid);
}

const runMainMultipleTimes = async (times) => {
    try {
        for (let i = 100; i < times; i++) {
            const randomNumber = await getRandomNumber(999, 99999);
            await main(randomNumber)
            const milliseconds = 3000;
            await new Promise(resolve => setTimeout(resolve, milliseconds))
        }
    } catch (err) {
        console.error("Error during execution:", err);
    }
};

// Run main() 50 times
runMainMultipleTimes(130);
