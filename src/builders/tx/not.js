const TonWeb = require('tonweb');
const TonWebMnemonic = require('tonweb-mnemonic')
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {
    apiKey: 'c03b3181d84ea8d0e36cdac64ec9ab99936d4c8a757be669befc4f5965254836'
}))

const jettonAddress = 'EQAHPLVqJiZQXbR30nouivoEmrhfhp_MAv8PNReCYoHtjGam'
const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {address: jettonAddress});

const BN = TonWeb.utils.BN;

module.exports = {
    async build({ amount, sendFrom, sendTo, fromKey, message = '' }) {
        const seed = await TonWebMnemonic.mnemonicToSeed(fromKey.split(' '));
        const keyPair = TonWeb.utils.keyPairFromSeed(seed);

        const WalletClass = tonweb.wallet.all.v4R2;
        const wallet = new WalletClass(tonweb.provider, {
            publicKey: keyPair.publicKey,
            wc: 0
        });

        const jettonAmount = TonWeb.utils.toNano(amount.toString());
        let jettonWalletData = await jettonWallet.getData();

        if (jettonAmount.gte(jettonWalletData.balance)) {
            console.error('there is not enough balance to process the withdrawal notcoin');
            return null;
        }

        const walletAddress = await wallet.getAddress();

        const seqno = (await wallet.methods.seqno().call()) || 0;

        try {
            await wallet.methods.transfer({
                secretKey: keyPair.secretKey,
                toAddress: jettonAddress,
                amount: TonWeb.utils.toNano('0.1'),
                seqno: seqno,
                payload: await jettonWallet.createTransferBody({
                    jettonAmount: jettonAmount,
                    toAddress: new TonWeb.utils.Address(sendTo),
                    forwardAmount: TonWeb.utils.toNano('0.000000001'),
                    forwardPayload: new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode(message)]),
                    responseAddress: walletAddress
                }),
                sendMode: 3,
            }).send()

            let accountId = new TonWeb.utils.Address(sendTo).toString(false, false, false);

            return `${seqno}|${sendFrom}|${accountId}`;
        } catch (e) {
            console.error('Failed to build notcoin transaction: ', e)
            return null;
        }
    }
}