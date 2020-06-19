import { JsonWebKey } from '@transmute/json-web-signature-2020';
const canonicalize = require('canonicalize');
const alice = require('../__fixtures__/alice.json');
const bob = require('../__fixtures__/bob.json');
const charlie = require('../__fixtures__/charlie.json');

it('JsonWebKey encrypt / decrypt', async () => {
  const payload = Buffer.from(canonicalize({ hello: 'world' }));
  const key = await JsonWebKey.from(alice.publicKey[0]);

  const publicKeys = [
    alice.publicKey[0],
    bob.publicKey[0],
    charlie.publicKey[0],
  ];
  // why not offer convenience interface for ECDH-ES+A256KW ...
  // we already have jose as a dependency ...
  const jwe = await key.encrypt(payload, publicKeys);
  // console.log(JSON.stringify(jwe, null, 2));
  expect(jwe.recipients.length).toBe(3);
  const plaintext = await key.decrypt(jwe as any);
  expect(plaintext).toEqual(payload);
});
