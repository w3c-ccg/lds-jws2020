import crypto from 'crypto';

import { Ed25519KeyPair, EdDSA } from '@transmute/did-key-ed25519';
import { Secp256k1KeyPair, ES256K } from '@transmute/did-key-secp256k1';
import { P384KeyPair, ES384 } from '@transmute/did-key-p384';

import { JWK, JsonWebKeyPair } from './types';

export const orderJwk = (jwk: JWK): JWK => {
  let _jwk: any = {};
  if (jwk.kty) {
    _jwk.kty = jwk.kty;
  }
  if (jwk.crv) {
    _jwk.crv = jwk.crv;
  }
  if (jwk.x) {
    _jwk.x = jwk.x;
  }
  if (jwk.y) {
    _jwk.y = jwk.y;
  }
  if (jwk.d) {
    _jwk.d = jwk.d;
  }
  return _jwk;
};

export const didKeyToJsonWebKey = async (
  didKeyPair: Ed25519KeyPair | Secp256k1KeyPair | P384KeyPair
): Promise<JsonWebKeyPair> => {
  const publicKeyJwk = (await didKeyPair.toJwk()) as JWK;
  const privateKeyJwk = (await didKeyPair.toJwk(true)) as JWK;
  const id = '#' + publicKeyJwk.kid;
  delete publicKeyJwk.kid;
  delete privateKeyJwk.kid;
  return {
    id,
    type: 'JsonWebKey2020',
    controller: didKeyPair.controller,
    publicKeyJwk: orderJwk(publicKeyJwk),
    privateKeyJwk: orderJwk(privateKeyJwk),
  };
};

export const didKeyGenerator = async (
  kty: string,
  crvOrSize: string,
  seed?: Uint8Array
) => {
  if (kty === 'OKP' && crvOrSize === 'Ed25519') {
    return didKeyToJsonWebKey(
      await Ed25519KeyPair.generate({
        secureRandom: () => {
          return seed || crypto.randomBytes(32);
        },
      })
    );
  }
  if (kty === 'EC' && crvOrSize === 'secp256k1') {
    return didKeyToJsonWebKey(
      await Secp256k1KeyPair.generate({
        secureRandom: () => {
          return seed || crypto.randomBytes(32);
        },
      })
    );
  }
  if (kty === 'EC' && crvOrSize === 'P-384') {
    if (seed) {
      throw new Error('P-384 does not support deterministic seed.');
    }
    return didKeyToJsonWebKey(await P384KeyPair.generate());
  }

  throw new Error(`JsonWebKey2020 does not support ${kty} and ${crvOrSize}`);
};

export const signWithDetachedJws = async (
  privateKeyJwk: JWK,
  message: Buffer
) => {
  if (privateKeyJwk.crv === 'Ed25519') {
    return EdDSA.signDetached(message, privateKeyJwk, {
      alg: 'EdDSA',
      b64: false,
      crit: ['b64'],
    });
  }
  if (privateKeyJwk.crv === 'secp256k1') {
    return ES256K.signDetached(message, privateKeyJwk as any, {
      alg: 'ES256K',
      b64: false,
      crit: ['b64'],
    });
  }
  if (privateKeyJwk.crv === 'P-384') {
    return ES384.signDetached(privateKeyJwk as any, message, {
      alg: 'ES384',
      b64: false,
      crit: ['b64'],
    });
  }
  throw new Error(
    `JsonWebKey2020 does not support sign with ${privateKeyJwk.crv}`
  );
};

export const verifyWithDetachedJws = async (
  publicKeyJwk: JWK,
  jws: string,
  message: Buffer
) => {
  if (publicKeyJwk.crv === 'Ed25519') {
    return EdDSA.verifyDetached(jws, message, publicKeyJwk);
  }
  if (publicKeyJwk.crv === 'secp256k1') {
    return ES256K.verifyDetached(jws, message, publicKeyJwk as any);
  }
  if (publicKeyJwk.crv === 'P-384') {
    return ES384.verifyDetached(publicKeyJwk as any, jws, message as any);
  }
  throw new Error(
    `JsonWebKey2020 does not support verify with ${publicKeyJwk.crv}`
  );
};
