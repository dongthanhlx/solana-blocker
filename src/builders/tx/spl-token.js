const splToken = require('@solana/spl-token');
const web3 = require('@solana/web3.js')
const bs58 = require('bs58');
const splTokenBuilder = require('../address/spl-token');
const config = require('../../config')
const connection = new web3.Connection(config.get('SOLANA_RPC'), 'confirmed')
const USDCTokenAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDTTokenAddress = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

module.exports = {
    async build({currency, amount, sendTo, fromKey}) {
        const sender = web3.Keypair.fromSecretKey(bs58.decode(fromKey))
        const tokenAddress = eval(`${currency}TokenAddress`);
        const mint = new web3.PublicKey(tokenAddress);
        
        const fromAddress = await splTokenBuilder.render({
            ownerAddress: sender.publicKey,
            currency,
            secret: fromKey
        })
        
        const toAddress = await splTokenBuilder.render({
            ownerAddress: sendTo,
            currency,
            secret: fromKey
        })

        const computePriceIx = web3.ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: 100000,
        });

        const computeLimitIx = web3.ComputeBudgetProgram.setComputeUnitLimit({
            units: 200000,
        });

        const transferTx = splToken.createTransferInstruction(
            fromAddress.address,
            toAddress.address,
            sender.publicKey,
            amount * web3.LAMPORTS_PER_SOL / 1000,
            [],
            splToken.TOKEN_PROGRAM_ID
        )

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

        // return await splToken.transferChecked(
        //     connection,
        //     sender,
        //     fromAddress.address,
        //     mint,
        //     toAddress.address,
        //     sender.publicKey,
        //     amount * web3.LAMPORTS_PER_SOL / 1000,
        //     6
        // )
    }
}

