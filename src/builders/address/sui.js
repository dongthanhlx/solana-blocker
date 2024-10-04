const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');

module.exports = {
    render() {
        const keyPair = new Ed25519Keypair();

        return {
            address: keyPair.toSuiAddress(),
            private_key: keyPair.getSecretKey()
        }
    }
}

