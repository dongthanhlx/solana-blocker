const web3 = require('@solana/web3.js')
const splToken = require('@solana/spl-token')
const bs58 = require('bs58')
const config = require('../../config')
const connection = new web3.Connection(config.get('SOLANA_RPC'), 'confirmed')

const USDCTokenAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
const USDTTokenAddress = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

module.exports = {
  async render({ownerAddress, currency, secret}) {
    const tokenAddress = eval(`${currency}TokenAddress`);
    const mint = new web3.PublicKey(tokenAddress);
    const owner = new web3.PublicKey(ownerAddress);
    const creator = web3.Keypair.fromSecretKey(bs58.decode(secret))

    const tokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
      connection,
      creator,
      mint,
      owner
    )

    return {
      address: tokenAccount.address,
      private_key: ''
    }
  }
}