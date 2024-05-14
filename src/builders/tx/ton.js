const TonWeb = require('tonweb')
const TonWebMnemonic = require('tonweb-mnemonic')
const config = require('../../config')
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey: '97b2749d3b3fba53f55a7b9108d305ffa4df5d9ea1e170360631d090206577a0'
}))

const BN = TonWeb.utils.BN;

module.exports = {
    async build({ amount, sendTo, fromKey, memo = '' }) {
        amount = TonWeb.utils.toNano(amount);
        const seed = await TonWebMnemonic.mnemonicToSeed(fromKey.split(' '));
        // const seed = TonWeb.utils.hexToBytes(fromKey)

        const keyPair = TonWeb.utils.keyPairFromSeed(seed);

        const WalletClass = tonweb.wallet.all.v4R2;
        const wallet = new WalletClass(tonweb.provider, {
            publicKey: keyPair.publicKey
        });
        
        // const walletAddress = (await wallet.getAddress()).toString(true, true, true);

        let balance = new BN(await tonweb.provider.getBalance((await wallet.getAddress()).toString(true, true, true)));

        if (amount.gte(balance)) {
            console.error('there is not enough balance to process the withdrawal');
            return false;
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
                amount: amount,
                seqno: seqno,
                payload: memo,
                sendMode: 3
            }).send();

            return seqno;
        } catch (e) {
            console.error('Failed to build transaction ton: ', e)
            return null;
        }
    }
}
