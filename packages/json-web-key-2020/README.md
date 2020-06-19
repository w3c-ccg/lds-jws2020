# @transmute/json-web-key-ld

![json-web-key-2020](https://github.com/w3c-ccg/lds-jws2020/workflows/json-web-key-2020/badge.svg)

## JsonWebKey2020 Recomended Algorithms

| kty | crvOrSize | signature | keyAgreement | encryption     |
| --- | --------- | --------- | ------------ | -------------- |
| OKP | Ed25519   | EdDSA     |              |                |
| OKP | X25519    |           | ECDH         | ECDH-ES+A256KW |
| EC  | secp256k1 | ES256K    | ECDH         |                |
| RSA | 2048      | PS256     |              | RSA-OAEP       |
| EC  | P-256     | ES256     | ECDH         | ECDH-ES+A256KW |
| EC  | P-384     | ES384     | ECDH         | ECDH-ES+A256KW |

P-521 is used to test unsupported crvOrSize.
