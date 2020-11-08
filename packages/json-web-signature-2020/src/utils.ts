import crypto from 'crypto';
import { Jws } from '@transmute/did-key-common';
import { Ed25519KeyPair, EdDSA, keyUtils } from '@transmute/did-key-ed25519';
import { Secp256k1KeyPair, ES256K } from '@transmute/did-key-secp256k1';
import {
  KeyPair,
  privateKeyToSigner,
  publicKeyToVerifier,
  createDetachedJws,
} from '@transmute/did-key-web-crypto';

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

export const didKeyToJsonWebKey = (
  didKeyPair: Ed25519KeyPair | Secp256k1KeyPair | KeyPair
): JsonWebKeyPair => {
  const json = didKeyPair.toJsonWebKeyPair(true);
  const { publicKeyJwk, privateKeyJwk } = json;

  delete publicKeyJwk.kid;
  delete privateKeyJwk.kid;
  return {
    id: `#${keyUtils.getKid(publicKeyJwk)}`,
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

  if (kty === 'EC' && crvOrSize === 'P-256') {
    if (seed) {
      throw new Error('P-256 does not support deterministic seed.');
    }
    return didKeyToJsonWebKey(
      await KeyPair.generate({
        kty,
        crvOrSize,
      })
    );
  }

  if (kty === 'EC' && crvOrSize === 'P-384') {
    if (seed) {
      throw new Error('P-384 does not support deterministic seed.');
    }
    return didKeyToJsonWebKey(
      await KeyPair.generate({
        kty,
        crvOrSize,
      })
    );
  }

  if (kty === 'EC' && crvOrSize === 'P-521') {
    if (seed) {
      throw new Error('P-256 does not support deterministic seed.');
    }
    return didKeyToJsonWebKey(
      await KeyPair.generate({
        kty,
        crvOrSize,
      })
    );
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
  if (privateKeyJwk.crv === 'P-256') {
    const signer = await privateKeyToSigner(privateKeyJwk);
    return createDetachedJws(signer, message, {
      alg: 'ES256',
      b64: false,
      crit: ['b64'],
    });
  }
  if (privateKeyJwk.crv === 'P-384') {
    const signer = await privateKeyToSigner(privateKeyJwk);
    return createDetachedJws(signer, message, {
      alg: 'ES384',
      b64: false,
      crit: ['b64'],
    });
  }
  if (privateKeyJwk.crv === 'P-521') {
    const signer = await privateKeyToSigner(privateKeyJwk);
    return createDetachedJws(signer, message, {
      alg: 'ES521',
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
  if (publicKeyJwk.crv === 'P-256') {
    const verifier = await publicKeyToVerifier(publicKeyJwk);
    return Jws.verifyDetachedJws(verifier, message, jws);
  }
  if (publicKeyJwk.crv === 'P-384') {
    const verifier = await publicKeyToVerifier(publicKeyJwk);
    return Jws.verifyDetachedJws(verifier, message, jws);
  }
  if (publicKeyJwk.crv === 'P-521') {
    const verifier = await publicKeyToVerifier(publicKeyJwk);
    return Jws.verifyDetachedJws(verifier, message, jws);
  }
  throw new Error(
    `JsonWebKey2020 does not support verify with ${publicKeyJwk.crv}`
  );
};
