const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');
const { Transaction } = require('@mysten/sui/transactions')

module.exports = {
    async build({amount, sendTo, fromKey}) {
        const client = new SuiClient({
            url: getFullnodeUrl('mainnet')
        })
        const tx = new Transaction();
        const keypair = Ed25519Keypair.fromSecretKey(fromKey)

        const [coin] = tx.splitCoins(tx.gas, [amount * 1000000000]);

        tx.transferObjects([coin], sendTo);

        let result = await client.signAndExecuteTransaction({
            signer: keypair, transaction: tx
        })

        let {digest} = await client.waitForTransaction({ digest: result.digest });

        return digest;
    }
}

