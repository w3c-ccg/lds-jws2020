import jose from 'jose';
import moment from 'moment';

const alice = require('../__fixtures__/alice.json');
const _credential = require('../__fixtures__/domainLinkCredential.json');

it('VC-JWT sign and verify', () => {
  const { publicKeyJwk, privateKeyJwk } = alice.publicKey[0];
  const credential = {
    ..._credential,
    issuer: alice.id,
    credentialSubject: {
      ..._credential.credentialSubject,
      id: alice.id,
    },
  };
  const paylaod = {
    sub: alice.id,
    iss: alice.id,
    nbf: moment(credential.issuanceDate).unix(),
    exp: moment(credential.expirationDate).unix(),
    // vc is JSON-LD, but is it valid? who cares lets just sign it without checking...
    vc: credential,
  };
  const jwt = jose.JWT.sign(paylaod, jose.JWK.asKey(privateKeyJwk));
  const verified: any = jose.JWT.verify(jwt, jose.JWK.asKey(publicKeyJwk), {
    complete: true,
  });
  // console.log(JSON.stringify(verified, null, 2));
  expect(verified.header.kid).toBe(publicKeyJwk.kid);
  expect(verified.header.alg).toBe('ES384');
  expect(verified.payload.vc.credentialSubject.id).toBe(alice.id);
  expect(verified.payload.vc.credentialSubject.domain).toBe(
    'identity.foundation'
  );
});
