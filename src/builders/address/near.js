const { KeyPair } = require("near-api-js");
const bs58 = require('bs58')

module.exports = {
    render() {
        const keyPair = KeyPair.fromRandom('ed25519');
        let publicKey = keyPair.publicKey.toString().replace('ed25519:', '');

        return {
            address: Buffer.from(bs58.decode(publicKey)).toString('hex'),
            private_key: keyPair.secretKey
        }
    }
}
