# Linked Data Signatures for JWS

![Integration Tests](https://github.com/transmute-industries/lds-jws2020/workflows/Integration%20Tests/badge.svg) [![codecov](https://codecov.io/gh/transmute-industries/lds-jws2020/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/lds-jws2020)

[View On Github](https://github.com/transmute-industries/lds-jws2020)

- [View Linked Data Signature Suite Vocabulary](https://lds.jsld.org/contexts/)
- [View Linked Data Signature Suite Context](https://lds.jsld.org/contexts/lds-jws2020-v0.0.jsonld)


## Security Considerations

You should be aware that some of these curves are not considered safe:

- https://safecurves.cr.yp.to/

If you will only ever need to support Ed25519 or only Secp256k1, you should consider using a restricted Linked Data Signature Suite like:

- [Ed25519Signature2018](https://github.com/digitalbazaar/jsonld-signatures/blob/master/lib/suites/Ed25519Signature2018.js)

- [EcdsaSecp256k1Signature2019](https://github.com/decentralized-identity/lds-ecdsa-secp256k1-2019.js)


## Getting Started

```
npm i
npm run test
npm run coverage
npm run docs
```

## Supported JWS Algs

The expected alg will be determined by the following table.

| kty | crvOrSize | alg    |
| --- | --------- | ------ |
| OKP | Ed25519   | EdDSA  |
| EC  | secp256k1 | ES256K |
| RSA | 2048      | PS256  |
| EC  | P-256     | ES256  |
| EC  | P-384     | ES384  |
| EC  | P-521     | ES512  |

Anything else will result in an unsupported alg error.

### Suite Details

Per [ld-signatures](https://w3c-dvcg.github.io/ld-signatures/#signature-suites), this Signature Suite defines the following:

```json
{
  "id": "https://lds.jsld.org/contexts/#JsonWebSignature2020",
  "type": "SignatureSuite",
  "canonicalizationAlgorithm": "https://w3id.org/security#URDNA2015",
  "digestAlgorithm": "https://www.ietf.org/assignments/jwa-parameters#SHA256",
  "signatureAlgorithm": "https://tools.ietf.org/html/rfc7518"
}
```

See the [Linked Data Signature Suite Vocabulary](https://lds.jsld.org/contexts/).

#### Example Data

- [example keystore](https://lds.jsld.org/example/didDocJwks.json).
- [example did document](https://lds.jsld.org/example/didDoc.json)

## Credits and Support

Works with:

- [jose](https://github.com/panva/jose)
- [universal-resolver](https://github.com/decentralized-identity/universal-resolver)
- [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures)
- [vc-js](https://github.com/digitalbazaar/vc-js)
