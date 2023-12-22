const {Keypair, PublicKey} = require('@solana/web3.js')
const bs58 = require('bs58')

module.exports = {
    render() {
        let account = Keypair.generate();
        
        return {
            address: account.publicKey,
            private_key: bs58.encode(account.secretKey)
        }
    },

    mustSol(address) {
        try {
            return PublicKey.isOnCurve(new PublicKey(address))
        } catch (e) {
            return false;
        }
    }
}