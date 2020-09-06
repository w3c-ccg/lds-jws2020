// import { Ed25519KeyPair } from '@transmute/did-key-ed25519'
import {
  JWK,
  JsonWebKeyPair,
  JsonWebKeyVerificationMethod,
  JsonWebKeyPairGenerateOptions,
} from './types';

import {
  orderJwk,
  didKeyGenerator,
  signWithDetachedJws,
  verifyWithDetachedJws,
} from './utils';

export class JsonWebKey implements JsonWebKeyPair {
  public id: string;
  public type = 'JsonWebKey2020';
  public controller: string;
  public publicKeyJwk: JWK;
  public privateKeyJwk: JWK;

  static async generate(
    options: JsonWebKeyPairGenerateOptions = {
      kty: 'OKP',
      crvOrSize: 'Ed25519',
    }
  ) {
    return new JsonWebKey(
      await didKeyGenerator(options.kty, options.crvOrSize, options.seed)
    );
  }

  static async from(options: JsonWebKeyPair) {
    return new JsonWebKey(options);
  }

  constructor(options: JsonWebKeyPair) {
    this.id = options.id;
    this.controller = options.controller;
    this.publicKeyJwk = options.publicKeyJwk;
    this.privateKeyJwk = options.privateKeyJwk;
  }

  toLinkedDataKeyPair(): JsonWebKeyPair {
    return {
      id: this.id,
      type: this.type,
      controller: this.controller,
      publicKeyJwk: orderJwk(this.publicKeyJwk),
      privateKeyJwk: orderJwk(this.privateKeyJwk),
    };
  }

  toVerificationMethod(): JsonWebKeyVerificationMethod {
    return {
      id: this.id,
      type: this.type,
      controller: this.controller,
      publicKeyJwk: orderJwk(this.publicKeyJwk),
    };
  }

  signer() {
    if (!this.privateKeyJwk) {
      return {
        async sign() {
          throw new Error('No private key to sign with.');
        },
      };
    }
    let privateKeyJwk = this.privateKeyJwk;
    return {
      async sign({ data }: any) {
        return signWithDetachedJws(privateKeyJwk, data);
      },
    };
  }

  verifier() {
    if (!this.publicKeyJwk) {
      return {
        async verify() {
          throw new Error('No public key to verify with.');
        },
      };
    }
    let publicKeyJwk = this.publicKeyJwk;
    return {
      async verify({ data, signature }: any) {
        let verified = false;
        try {
          verified = await verifyWithDetachedJws(publicKeyJwk, signature, data);
        } catch (e) {
          console.error('An error occurred when verifying signature: ', e);
        }
        return verified;
      },
    };
  }
}
