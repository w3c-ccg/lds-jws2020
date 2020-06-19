import jose from 'jose';
const alice = require('../__fixtures__/alice.json');
const bob = require('../__fixtures__/bob.json');
const charlie = require('../__fixtures__/charlie.json');

it('vanilla JWE encrypt / decrypt', () => {
  //  JSON.stringify is stable accross languages right?
  const payload = Buffer.from(JSON.stringify({ hello: 'world' }));
  const encrypt = new jose.JWE.Encrypt(payload);
  encrypt.recipient(jose.JWK.asKey(alice.publicKey[0].publicKeyJwk));
  encrypt.recipient(jose.JWK.asKey(bob.publicKey[0].publicKeyJwk));
  encrypt.recipient(jose.JWK.asKey(charlie.publicKey[0].publicKeyJwk));
  const jwe = encrypt.encrypt('general');
  expect(jwe.recipients.length).toBe(3);
  const plaintext = jose.JWE.decrypt(
    jwe,
    jose.JWK.asKey(charlie.publicKey[0].privateKeyJwk)
  );
  expect(plaintext).toEqual(payload);
});
