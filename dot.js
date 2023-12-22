const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');

function getNowTime() {
    var d = new Date(),
        str = '[';
    str += d.getHours() + ':';
    str += d.getMinutes() + ':';
    str += d.getSeconds() + ':';
    str += d.getMilliseconds();
    str += "] ";
    return str;
}

const main = async () => {
  const keyring = new Keyring({ type: 'sr25519' });
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  const PHRASE = '';
  const wallet = keyring.addFromUri(PHRASE);
  keyring.setSS58Format(0);

  console.log(getNowTime() + "Địa chỉ ví đã tải:" + wallet.address);

  const txs = [
    api.tx.balances.transferKeepAlive(wallet.address, 0),
    api.tx.system.remark('{"p":"dot-20","op":"mint","tick":"DOTA"}'),
  ];
  var count = 0;

  function run() {
    api.tx.utility
      .batchAll(txs)
      .signAndSend(wallet, async ({ status }) => {
        if (status.isInBlock) {
          console.log(getNowTime() + `Giao dịch đã được gửi và đưa vào khối ${status.asInBlock}`);
        } else if (status.isFinalized) {
          console.log(getNowTime() + `Giao dịch đã hoàn tất trong khối ${status.asFinalized}!`);
          count += 1;
          console.log(getNowTime() + "Số lần thành công hiện tại: " + count);
        }
      })
      .catch(err => {
        console.log('err_message = ' + err.message);
      });
  }

  setInterval(run, 15000);
};

// Gọi hàm main để bắt đầu chương trình
main();


