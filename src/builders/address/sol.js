const {Keypair} = require('@solana/web3.js')
const bs58 = require('bs58')

module.exports = {
    render() {
        let account = Keypair.generate();
        
        return {
            address: account.publicKey,
            private_key: bs58.encode(account.secretKey)
        }
    }
}