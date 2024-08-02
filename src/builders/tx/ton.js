const TonWeb = require('tonweb')
const TonWebMnemonic = require('tonweb-mnemonic')
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey: 'c03b3181d84ea8d0e36cdac64ec9ab99936d4c8a757be669befc4f5965254836'
}))

const BN = TonWeb.utils.BN;

module.exports = {
    async build({ amount, sendTo, fromKey, message = '' }) {
        let tonAmount = TonWeb.utils.toNano(amount);
        const seed = await TonWebMnemonic.mnemonicToSeed(fromKey.split(' '));
        // const seed = TonWeb.utils.hexToBytes(fromKey)

        const keyPair = TonWeb.utils.keyPairFromSeed(seed);

        const WalletClass = tonweb.wallet.all.v4R2;
        const wallet = new WalletClass(tonweb.provider, {
            publicKey: keyPair.publicKey
        });
        
        // const walletAddress = (await wallet.getAddress()).toString(true, true, true);

        let balance = new BN(await tonweb.provider.getBalance((await wallet.getAddress()).toString(true, true, true)));

        if (tonAmount.gte(balance)) {
            console.log('there is not enough balance to process the withdrawal: ton');
            return null;
        }

        const seqno = await wallet.methods.seqno().call() || 0;

        const info = await tonweb.provider.getAddressInfo(sendTo);
        if (info.state !== 'active') {
            sendTo = new TonWeb.utils.Address(sendTo).toString(true, true, false);
        }

        try {
            await wallet.methods.transfer({
                secretKey: keyPair.secretKey,
                toAddress: sendTo,
                amount: tonAmount,
                seqno: seqno,
                payload: message,
                sendMode: 3
            }).send();

            let accountId = new TonWeb.utils.Address(sendTo).toString(false, false, false);

            return `${seqno}|${accountId}`;
        } catch (e) {
            console.error('Failed to build transaction ton: ', e)
            return null;
        }
    }
}
