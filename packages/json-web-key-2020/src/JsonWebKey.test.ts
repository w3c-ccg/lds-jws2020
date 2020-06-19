import { JsonWebKey } from './JsonWebKey';

import * as fixtures from './__fixtures__';

describe('generate', () => {
  it('default is ed25519', async () => {
    const key = await JsonWebKey.generate();
    expect((key.publicKeyJwk as any).kty).toBe('OKP');
    expect((key.publicKeyJwk as any).crv).toBe('Ed25519');
    // console.log(JSON.stringify(key));
  });

  it('supports P-384', async () => {
    const key = await JsonWebKey.generate({
      kty: 'EC',
      crvOrSize: 'P-384',
    });
    expect((key.publicKeyJwk as any).kty).toBe('EC');
    expect((key.publicKeyJwk as any).crv).toBe('P-384');
  });
});

describe('from', () => {
  it('jwk', async () => {
    const key = await JsonWebKey.from(fixtures.ed25519_keypair);
    expect((key.publicKeyJwk as any).kty).toBe('OKP');
    expect((key.publicKeyJwk as any).crv).toBe('Ed25519');
  });
});

it('fingerprintFromPublicKey', async () => {
  const fingerprint = await JsonWebKey.fingerprintFromPublicKey(
    fixtures.ed25519_keypair
  );
  expect(fingerprint).toBe('_QGEny3zkUVYPNlfjejfjf1sLQTI_BF_Af5mvQJwnt8');
});

it('verifyFingerprint', async () => {
  const key = await JsonWebKey.from(fixtures.ed25519_keypair);
  const result = key.verifyFingerprint(
    '_QGEny3zkUVYPNlfjejfjf1sLQTI_BF_Af5mvQJwnt8'
  );
  expect(result).toEqual({ valid: true });
});

it('toJwk', async () => {
  const key = await JsonWebKey.from(fixtures.ed25519_keypair);
  const _jwk1 = await key.toJwk();
  expect(_jwk1).toEqual(fixtures.ed25519_keypair.publicKeyJwk);
  const _jwk2 = await key.toJwk(true);
  expect(_jwk2).toEqual(fixtures.ed25519_keypair.privateKeyJwk);
});

it('sign', async () => {
  const key = await JsonWebKey.from(fixtures.ed25519_keypair);
  const signer = key.signer();
  const signature = await signer.sign({ data: fixtures.message });
  expect(signature).toBe(fixtures.signature);
});

it('verify', async () => {
  const key = await JsonWebKey.from(fixtures.ed25519_keypair);
  const verifier = key.verifier();
  const result = await verifier.verify({
    data: fixtures.message,
    signature: fixtures.signature,
  });
  expect(result).toBe(true);
});

it('deriveSecret', async () => {
  const key = await JsonWebKey.from(fixtures.p_384_keypair);
  const secret = await key.deriveSecret({
    publicKey: fixtures.p_384_keypair2,
  });
  expect(secret.toString('hex')).toEqual(fixtures.p_384_secret);
});

it('encrypt / decrypt', async () => {
  const key = await JsonWebKey.from(fixtures.p_384_keypair);
  const publicKeys = [fixtures.p_384_keypair, fixtures.p_384_keypair2];
  const jwe = await key.encrypt(fixtures.message, publicKeys);
  expect(jwe.recipients.length).toBe(2);
  // console.log(jwe.recipients[0]);
  const plaintext = await key.decrypt(jwe as any);
  expect(plaintext).toEqual(fixtures.message);
});
