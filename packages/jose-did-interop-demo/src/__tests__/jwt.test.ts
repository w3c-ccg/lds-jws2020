import jose from 'jose';
const alice = require('../__fixtures__/alice.json');

it('vanilla JWT sign and verify', () => {
  const { publicKeyJwk, privateKeyJwk } = alice.publicKey[0];
  const paylaod = {
    sub: alice.id,
    iss: alice.id,
    boring_vanilla_claim: 'with no semantic or cannonicalization support...',
  };
  const jwt = jose.JWT.sign(paylaod, jose.JWK.asKey(privateKeyJwk));
  const verified: any = jose.JWT.verify(jwt, jose.JWK.asKey(publicKeyJwk), {
    complete: true,
  });
  // console.log(JSON.stringify(verified, null, 2));
  expect(verified.header.kid).toBe(publicKeyJwk.kid);
  expect(verified.header.alg).toBe('ES384');
  expect(verified.payload.boring_vanilla_claim).toBe(
    paylaod.boring_vanilla_claim
  );
});
