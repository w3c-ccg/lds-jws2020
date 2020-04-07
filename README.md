# Linked Data Signatures for JWS

![Integration Tests](https://github.com/w3c-ccg/lds-jws2020/workflows/Integration%20Tests/badge.svg) [![codecov](https://codecov.io/gh/transmute-industries/lds-jws2020/branch/master/graph/badge.svg)](https://codecov.io/gh/transmute-industries/lds-jws2020)

[View On Github](https://github.com/w3c-ccg/lds-jws2020)

- [View Linked Data Signature Suite Vocabulary](https://w3c-ccg.github.io/lds-jws2020/contexts/)
- [View Linked Data Signature Suite Context](https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v0.0.jsonld)


## Security Considerations

You should be aware that some of these curves are not considered safe:

- https://safecurves.cr.yp.to/

If you will only ever need to support Ed25519 or only Secp256k1, you should consider using a restricted Linked Data Signature Suite like:

- [Ed25519Signature2018](https://github.com/digitalbazaar/jsonld-signatures/blob/master/lib/suites/Ed25519Signature2018.js)

- [EcdsaSecp256k1Signature2019](https://github.com/decentralized-identity/lds-ecdsa-secp256k1-2019.js)

## Usage


Install:

```
npm i lds-jws2020 --save
```

Use with vc-js:

```js
const key = new JsonWebKeyLinkedDataKeyClass2020({
  id: `did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A`,
  type: "JwsVerificationKey2020",
  controller: 'did:example:123',
  privateKeyJwk: {
    "crv": "Ed25519",
    "x": "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ",
    "d": "tP7VWE16yMQWUO2G250yvoevfbfxY25GjHglTP3ZOyU",
    "kty": "OKP",
    "kid": "_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A"
  }
});

const suite = new JsonWebSignature2020({
  LDKeyClass: JsonWebKeyLinkedDataKeyClass2020,
  linkedDataSigantureType: "JsonWebSignature2020",
  linkedDataSignatureVerificationKeyType: "JwsVerificationKey2020",
  key
});

const vc = await vc.issue({
  credential: { ...credential },
  compactProof: false,
  suite
});

const result = await vc.verify({
  credential: vc,
  compactProof: false,
  documentLoader: documentLoader,
  purpose: new AssertionProofPurpose(),
  suite
});
```

## Developer Getting Started

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
  "id": "https://w3c-ccg.github.io/lds-jws2020/contexts/#JsonWebSignature2020",
  "type": "SignatureSuite",
  "canonicalizationAlgorithm": "https://w3id.org/security#URDNA2015",
  "digestAlgorithm": "https://tools.ietf.org/html/rfc4634#section-4.2.2",
  "signatureAlgorithm": "https://www.iana.org/assignments/jose/jose.xhtml#web-signature-encryption-algorithms"
}
```

See the [Linked Data Signature Suite Vocabulary](https://w3c-ccg.github.io/lds-jws2020/contexts/).

#### Example Data

- [example keystore](https://w3c-ccg.github.io/lds-jws2020/example/didDocJwks.json).
- [example did document](https://w3c-ccg.github.io/lds-jws2020/example/didDoc.json)

## Credits and Support

Works with:

- [jose](https://github.com/panva/jose)
- [universal-resolver](https://github.com/decentralized-identity/universal-resolver)
- [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures)
- [vc-js](https://github.com/digitalbazaar/vc-js)
