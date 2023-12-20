const EthscriptionsClass = require('./utils/EthscriptionsClass.js');
const {getRandomNumber, sleep} = require("./utils/common");
const pattern = /xxxxxx/g;

const DATA = 'data:,{"p":"grc-20","op":"mint","tick":"geths","amt":"1000"} '
// const PROVIDER_URL = 'https://eth-goerli.g.alchemy.com/v2/Qv5QpxAM-a2HqGvBxv3rAnXAhGu3_3n1'
const PROVIDER_URL = 'https://ethereum-goerli.publicnode.com'

const SLEEP = 3

const instance = new EthscriptionsClass(PROVIDER_URL);

async function sendTransaction() {
    let startNone = await instance.getNonce();

    for (let j = 1; j <= 2500; j++) {
        const randomNumber = await getRandomNumber(1, 21000);
        console.log('===================================================')
        const modifyData = DATA.replace(pattern, `${randomNumber}`);
        console.log(`Start Mint Data  = ${modifyData}`);
        const buffer = Buffer.from(modifyData, 'utf8');
        const hexData = buffer.toString('hex');

        await instance.sendTransaction(hexData, startNone)
        startNone++
        await sleep(SLEEP)
    }
}

(async () => {
    await sendTransaction()
})();
