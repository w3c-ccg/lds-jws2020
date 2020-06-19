# @transmute/json-web-signature-2020

![json-web-signature-2020](https://github.com/w3c-ccg/lds-jws2020/workflows/json-web-signature-2020/badge.svg)

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
} from '@transmute/json-web-signature-2020';

// You will need a custom document loader to do pretty much anything
// with LD Proofs, especially to work with DIDs
// Search this repo for "documentLoader" to learn more.
import { documentLoader } from '../somwhere...';

const key = new JsonWebKey({
  type: 'JsonWebKey2020',
  id: 'did:example:123#DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o',
  controller: 'did:example:123',
  publicKeyJwk: {
    crv: 'Ed25519',
    x: 'fJ-HI45g-LjZI6poTa122g5u6hRYzPRyJCY5pq9dfSQ',
    kty: 'OKP',
    kid: 'DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o',
  },
  privateKeyJwk: {
    crv: 'Ed25519',
    x: 'fJ-HI45g-LjZI6poTa122g5u6hRYzPRyJCY5pq9dfSQ',
    d: '94-6uUZUPMUuAXzJykpTrGIjKfvAXp6ocKz8ipBYkg4',
    kty: 'OKP',
    kid: 'DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o',
  },
});

const suite = new JsonWebSignature2020({
  key,
  date: '2019-12-11T03:50:55Z',
});

const verifiableCredential = await vc.issue({
  credential: {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    id: 'http://example.gov/credentials/3732',
    type: ['VerifiableCredential', 'UniversityDegreeCredential'],
    issuer: { id: 'did:example:123' },
    issuanceDate: '2020-03-10T04:24:12.164Z',
    credentialSubject: {
      id: 'did:example:456',
      degree: {
        type: 'BachelorDegree',
        name: 'Bachelor of Science and Arts',
      },
    },
  },
  suite,
});

const result = await vc.verify({
  credential: {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1',
    ],
    id: 'http://example.gov/credentials/3732',
    type: ['VerifiableCredential', 'UniversityDegreeCredential'],
    issuer: {
      id: 'did:key:z6MkpP568Jfkc1n51vdEut2EebtvhFXkod7S6LMZTVPGsZiZ',
    },
    issuanceDate: '2020-03-10T04:24:12.164Z',
    credentialSubject: {
      id: 'did:key:z6MkpP568Jfkc1n51vdEut2EebtvhFXkod7S6LMZTVPGsZiZ',
      degree: {
        type: 'BachelorDegree',
        name: 'Bachelor of Science and Arts',
      },
    },
    proof: {
      // Not that /JsonWebSignature2020 !== JsonWebSignature2020
      // This issue will persist as long as vc-js does not support JsonWebSignature2020
      // See https://github.com/digitalbazaar/vc-js/issues/80
      type: '/JsonWebSignature2020',
      'dct:created': {
        type: 'xsd:dateTime',
        '@value': '2019-12-11T03:50:55Z',
      },
      'https://w3id.org/security#jws':
        'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..i2zKj2p9Ek_LyTmZRD--AjqbKCDo863BLR5TAcwiUBJO7XS9e-C2LrgQOS4iBz_zuLqMgYTBYPqibER3Rr0iCw',
      'https://w3id.org/security#proofPurpose': {
        id: 'https://w3id.org/security#assertionMethod',
      },
      'https://w3id.org/security#verificationMethod': {
        id:
          'did:key:z6MkpP568Jfkc1n51vdEut2EebtvhFXkod7S6LMZTVPGsZiZ#DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o',
      },
    },
  },
  documentLoader: documentLoader,
  suite,
});
```
