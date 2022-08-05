
# This repo is now deprecated.

## This work has moved to the W3C VCWG, you can open issues, comment on PRs or engage on the latest version here:

- [https://github.com/w3c/vc-jws-2020](https://github.com/w3c/vc-jws-2020)

See the [W3C Verifiable Credentials Working Group](https://www.w3.org/2017/vc/WG/).


### Linked Data Signatures for JWS

[View On Github](https://github.com/w3c-ccg/lds-jws2020)

- [View Linked Data Signature Suite Vocabulary](https://w3c-ccg.github.io/lds-jws2020/)
- [View Linked Data Signature Suite Context](https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v1.json)

## Interop Test Suite

- See [JWS-Test-Suite](https://github.com/decentralized-identity/JWS-Test-Suite).

See the repo above for links to implementations in Java, Rust and TypeScript.

## Security Considerations

You should be aware that some of these curves are not considered safe:

- https://safecurves.cr.yp.to/

If you will only ever need to support Ed25519 or only Secp256k1, you should consider using a restricted Linked Data Signature Suite like:

- [Ed25519Signature2018](https://github.com/digitalbazaar/jsonld-signatures/blob/master/lib/suites/Ed25519Signature2018.js)

- [EcdsaSecp256k1Signature2019](https://github.com/decentralized-identity/lds-ecdsa-secp256k1-2019.js)

## Supported JOSE Algorithms

The expected alg will be determined by the following table.

| kty | crvOrSize | signature | keyAgreement | encryption     |
| --- | --------- | --------- | ------------ | -------------- |
| OKP | Ed25519   | EdDSA     |              |                |
| OKP | X25519    |           | ECDH         | ECDH-ES+A256KW |
| EC  | secp256k1 | ES256K    | ECDH         |                |
| RSA | 2048      | PS256     |              | RSA-OAEP       |
| EC  | P-256     | ES256     | ECDH         | ECDH-ES+A256KW |
| EC  | P-384     | ES384     | ECDH         | ECDH-ES+A256KW |

Anything else will result in an unsupported alg error.

### Suite Details

Per [ld-signatures](https://w3c-ccg.github.io/ld-signatures/#signature-suites), this Signature Suite defines the following:

```json
{
  "id": "https://w3c-ccg.github.io/lds-jws2020/contexts/#JsonWebSignature2020",
  "type": "SignatureSuite",
  "canonicalizationAlgorithm": "https://w3id.org/security#URDNA2015",
  "digestAlgorithm": "https://tools.ietf.org/html/rfc4634#section-4.2.2",
  "signatureAlgorithm": "https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms"
}
```

See the [Linked Data Signature Suite Vocabulary](https://w3c-ccg.github.io/lds-jws2020/contexts/).

## Credits and Support

Works with:

- [jose](https://github.com/panva/jose)
- [universal-resolver](https://github.com/decentralized-identity/universal-resolver)
- [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures)
- [@digitalbazaar/vc](https://github.com/digitalbazaar/vc-js)
- [@transmute/json-web-signature](https://github.com/transmute-industries/verifiable-data/tree/main/packages/json-web-signature)
- [@transmute/vc.js](https://github.com/transmute-industries/verifiable-data/tree/main/packages/vc.js)
- [ssi](https://github.com/spruceid/ssi)
- [DIDKit](https://github.com/spruceid/didkit)
