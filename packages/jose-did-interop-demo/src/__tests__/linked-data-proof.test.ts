import {
  JsonWebKey,
  JsonWebSignature2020,
} from '@transmute/json-web-signature-2020';

import { documentLoader } from '../documentLoader';
const alice = require('../__fixtures__/alice.json');
const _credential = require('../__fixtures__/domainLinkCredential.json');
const vc = require('vc-js');
const firstKey = alice.publicKey[0];

// here we MUST make sure the key is actually a URI...
// to that verificationMethod is populated correctly
// since, unlike JOSE, key lookup is handled by Linked Data Proofs.
const key = new JsonWebKey({ ...firstKey, id: alice.id + firstKey.id });
const suite = new JsonWebSignature2020({
  key,
  date: '2019-12-11T03:50:55Z',
});

it('Linked Data Proof Issue and Verify ', async () => {
  const credential = {
    ..._credential,
    issuer: alice.id,
    credentialSubject: {
      ..._credential.credentialSubject,
      id: alice.id,
    },
  };
  const verifiableCredential = await vc.issue({
    credential: { ...credential },
    suite,
    documentLoader,
  });

  const result = await vc.verifyCredential({
    credential: verifiableCredential,
    suite,
    documentLoader,
  });

  expect(result.verified).toBe(true);
});
