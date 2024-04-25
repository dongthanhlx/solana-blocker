const web3 = require('@solana/web3.js')
const bs58 = require('bs58')
const config = require('../../config')
const connection = new web3.Connection(config.get('SOLANA_RPC'), 'confirmed')

module.exports = {
    async build({amount, sendTo, fromKey}) {
        const sender = web3.Keypair.fromSecretKey(bs58.decode(fromKey))
        const receiver = new web3.PublicKey(sendTo)
        
        const computePriceIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 100000,
        });

        const computeLimitIx = web3.ComputeBudgetProgram.setComputeUnitLimit({
            units: 500,
        });
        
        const transferTx = web3.SystemProgram.transfer({
            fromPubkey: sender.publicKey,
            toPubkey: receiver,
            lamports: parseInt(web3.LAMPORTS_PER_SOL * amount)
        })

        const transaction = new web3.Transaction().add(
            computePriceIx,
            computeLimitIx,
            transferTx
        );

        transaction.recentBlockhash = (
            await connection.getLatestBlockhash()
        ).blockhash;
        
        transaction.sign(sender);

        try {
            return await web3.sendAndConfirmTransaction(
                connection, 
                transaction, 
                [
                    sender,
                ]
            );
        } catch (e) {
            console.error("Failed to send transaction:", e);
            return null;
        }

        // const transaction = new web3.Transaction()
        //     .add(
        //         web3.SystemProgram.transfer({
        //             fromPubkey: sender.publicKey,
        //             toPubkey: receiver,
        //             lamports: parseInt(web3.LAMPORTS_PER_SOL * amount)
        //         })
        //     )
    
        // return await web3.sendAndConfirmTransaction(connection, transaction, [sender])
    }
}
