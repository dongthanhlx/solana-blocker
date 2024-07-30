const { KeyPair, keyStores, connect, utils } = require("near-api-js");
const networkId = 'mainnet';

module.exports = {
    async build({amount, sendTo, fromKey, sender}) {
        const keyPair = KeyPair.fromString(fromKey);
        const keyStore = new keyStores.InMemoryKeyStore();

        await keyStore.setKey(networkId, sender, keyPair);

        const config = {
            networkId,
            keyStore,
            nodeUrl: `https://rpc.${networkId}.near.org`,
            walletUrl: `https://wallet.${networkId}.near.org`,
            helperUrl: `https://helper.${networkId}.near.org`,
            explorerUrl: `https://explorer.${networkId}.near.org`
        };

        const near = await connect(config);
        const senderAccount = await near.account(sender)

        try {
            const result = await senderAccount.sendMoney(sendTo, utils.format.parseNearAmount(amount.toString()));


            return result.transaction.hash;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}