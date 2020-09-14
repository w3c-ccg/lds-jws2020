# Linked Data Signatures for JWS

![json-web-signature-2020](https://github.com/w3c-ccg/lds-jws2020/workflows/json-web-signature-2020/badge.svg)

[View On Github](https://github.com/w3c-ccg/lds-jws2020)

- [View Linked Data Signature Suite Vocabulary](https://w3c-ccg.github.io/lds-jws2020/)
- [View Linked Data Signature Suite Context](https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v1.json)

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

## Usage

Install:

```
npm i @transmute/json-web-signature-2020 --save
```

Use with vc-js:

```ts
import {
  JsonWebKey,
  JsonWebSignature2020,
} from "@transmute/json-web-signature-2020";

// You will need a custom document loader to do pretty much anything
// with LD Proofs, especially to work with DIDs
// Search this repo for "documentLoader" to learn more.
import { documentLoader } from "../somwhere...";

const key = new JsonWebKey({
  type: "JsonWebKey2020",
  id: "did:example:123#DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o",
  controller: "did:example:123",
  publicKeyJwk: {
    crv: "Ed25519",
    x: "fJ-HI45g-LjZI6poTa122g5u6hRYzPRyJCY5pq9dfSQ",
    kty: "OKP",
    kid: "DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o",
  },
  privateKeyJwk: {
    crv: "Ed25519",
    x: "fJ-HI45g-LjZI6poTa122g5u6hRYzPRyJCY5pq9dfSQ",
    d: "94-6uUZUPMUuAXzJykpTrGIjKfvAXp6ocKz8ipBYkg4",
    kty: "OKP",
    kid: "DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o",
  },
});

const suite = new JsonWebSignature2020({
  key,
  date: "2019-12-11T03:50:55Z",
});

const verifiableCredential = await vc.issue({
  credential: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
    ],
    id: "http://example.gov/credentials/3732",
    type: ["VerifiableCredential", "UniversityDegreeCredential"],
    issuer: { id: "did:example:123" },
    issuanceDate: "2020-03-10T04:24:12.164Z",
    credentialSubject: {
      id: "did:example:456",
      degree: {
        type: "BachelorDegree",
        name: "Bachelor of Science and Arts",
      },
    },
  },
  suite,
});

const result = await vc.verify({
  credential: {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.w3.org/2018/credentials/examples/v1",
    ],
    id: "http://example.gov/credentials/3732",
    type: ["VerifiableCredential", "UniversityDegreeCredential"],
    issuer: {
      id: "did:key:z6MkpP568Jfkc1n51vdEut2EebtvhFXkod7S6LMZTVPGsZiZ",
    },
    issuanceDate: "2020-03-10T04:24:12.164Z",
    credentialSubject: {
      id: "did:key:z6MkpP568Jfkc1n51vdEut2EebtvhFXkod7S6LMZTVPGsZiZ",
      degree: {
        type: "BachelorDegree",
        name: "Bachelor of Science and Arts",
      },
    },
    proof: {
      // Not that /JsonWebSignature2020 !== JsonWebSignature2020
      // This issue will persist as long as vc-js does not support JsonWebSignature2020
      // See https://github.com/digitalbazaar/vc-js/issues/80
      type: "/JsonWebSignature2020",
      "dct:created": {
        type: "xsd:dateTime",
        "@value": "2019-12-11T03:50:55Z",
      },
      "https://w3id.org/security#jws":
        "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..i2zKj2p9Ek_LyTmZRD--AjqbKCDo863BLR5TAcwiUBJO7XS9e-C2LrgQOS4iBz_zuLqMgYTBYPqibER3Rr0iCw",
      "https://w3id.org/security#proofPurpose": {
        id: "https://w3id.org/security#assertionMethod",
      },
      "https://w3id.org/security#verificationMethod": {
        id:
          "did:key:z6MkpP568Jfkc1n51vdEut2EebtvhFXkod7S6LMZTVPGsZiZ#DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o",
      },
    },
  },
  documentLoader: documentLoader,
  suite,
});
```

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

#### Example Data

- [example keystore](https://w3c-ccg.github.io/lds-jws2020/example/didDocJwks.json).
- [example did document](https://w3c-ccg.github.io/lds-jws2020/example/didDoc.json)

## Credits and Support

Works with:

- [jose](https://github.com/panva/jose)
- [universal-resolver](https://github.com/decentralized-identity/universal-resolver)
- [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures)
- [vc-js](https://github.com/digitalbazaar/vc-js)
