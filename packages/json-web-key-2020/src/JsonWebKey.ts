import * as jose from 'jose';

import base64url from 'base64url';
import R from 'ramda';

import {
  getRecommendedGenerateKeyType,
  getRecommendedSignatureAlgorithm,
  getRecommendedDeriveSecretAlgorithm,
  getRecommendedEncryptionAlgorithm,
} from './restrictions';

const compute_secret = require('jose/lib/jwa/ecdh/compute_secret');

export interface IJsonWebKeyGenerateOptions {
  kty: string;
  crvOrSize: string;
}

export class JsonWebKey {
  public id: string;
  public type: string;
  public controller: string;
  public publicKeyJwk: string;
  public privateKeyJwk: string;
  static fingerprintFromPublicKey({ publicKeyJwk }: any) {
    // never mutate function args
    let _publicKeyJwk = R.clone(publicKeyJwk);
    delete _publicKeyJwk.kid;
    const jwk = jose.JWK.asKey(_publicKeyJwk);
    return jwk.kid;
  }
  static async generate(
    options: IJsonWebKeyGenerateOptions = {
      kty: 'OKP',
      crvOrSize: 'Ed25519',
    }
  ) {
    const jwk = await jose.JWK.generate(
      options.kty as any,
      options.crvOrSize as any
    );

    const publicKeyJwk = jwk.toJWK();
    const privateKeyJwk = jwk.toJWK(true);

    return new JsonWebKey({
      id: '#' + publicKeyJwk.kid,
      controller: '',
      publicKeyJwk,
      privateKeyJwk,
    });
  }
  static fromFingerprint({ fingerprint }: any) {
    throw new Error(
      `Conversion from did:key not currently supported: ` + fingerprint
    );
    // // skip leading `z` that indicates base58 encoding
    // const buffer = bs58.decode(fingerprint.substr(1));
    // // https://github.com/multiformats/multicodec/blob/master/table.csv#L81
    // if (buffer[0] === 0xed && buffer[1] === 0x01) {
    //   const publicKeyJwk = bs58.encode(buffer.slice(2));
    //   const did = `did:key:${JsonWebKey.fingerprintFromPublicKey({
    //     publicKeyJwk,
    //   })}`;
    //   const keyId = `#${JsonWebKey.fingerprintFromPublicKey({
    //     publicKeyJwk,
    //   })}`;
    //   return new JsonWebKey({
    //     id: keyId,
    //     controller: did,
    //     publicKeyJwk,
    //   });
    // }
    // throw new Error(`Unsupported Fingerprint Type: ${fingerprint}`);
  }
  static async from(options: any) {
    let privateKeyJwk = options.privateKeyJwk;
    let publicKeyJwk = options.publicKeyJwk;
    // if (options.privateKeyHex) {
    //   privateKeyJwk = keyUtils.privateKeyJwkFromPrivateKeyHex(
    //     options.privateKeyHex
    //   );
    // }
    // if (options.publicKeyHex) {
    //   publicKeyJwk = keyUtils.publicKeyJwkFromPublicKeyHex(
    //     options.publicKeyHex
    //   );
    // }
    // if (options.privateKeyJwk) {
    //   privateKeyJwk = keyUtils.privateKeyJwkFromPrivateKeyJwk(
    //     options.privateKeyJwk
    //   );
    // }
    // if (options.publicKeyJwk) {
    //   publicKeyJwk = keyUtils.publicKeyJwkFromPublicKeyJwk(
    //     options.publicKeyJwk
    //   );
    // }
    return new JsonWebKey({
      ...options,
      privateKeyJwk,
      publicKeyJwk,
    });
  }
  constructor(options: any = {}) {
    this.type = 'JsonWebKey2020';
    this.id = options.id;
    this.controller = options.controller;
    this.publicKeyJwk = options.publicKeyJwk;
    this.privateKeyJwk = options.privateKeyJwk;
    if (this.controller && !this.id) {
      this.id = `${this.controller}#${this.fingerprint()}`;
    }
    getRecommendedGenerateKeyType(this.publicKeyJwk, 2020);
  }
  get publicKey() {
    return this.publicKeyJwk;
  }
  get privateKey() {
    return this.privateKeyJwk;
  }
  addEncodedPublicKey(publicKeyNode: any) {
    publicKeyNode.publicKeyJwk = this.publicKeyJwk;
    return publicKeyNode;
  }
  publicNode({ controller = this.controller }: any = {}) {
    const publicNode: any = {
      id: this.id,
      type: this.type,
    };
    if (controller) {
      publicNode.controller = controller;
    }

    this.addEncodedPublicKey(publicNode); // Subclass-specific
    return publicNode;
  }
  fingerprint() {
    const { publicKeyJwk } = this;
    return JsonWebKey.fingerprintFromPublicKey({ publicKeyJwk });
  }
  verifyFingerprint(fingerprint: any) {
    return { valid: this.fingerprint() === fingerprint };
  }
  async toJwk(_private: boolean = false) {
    if (_private) {
      return jose.JWK.asKey(this.privateKeyJwk).toJWK(_private);
    }
    return jose.JWK.asKey(this.privateKeyJwk).toJWK();
  }

  //   async toHex(_private: boolean = false) {
  //     if (_private) {
  //       return keyUtils.privateKeyHexFromprivateKeyJwk(this.privateKeyJwk);
  //     }
  //     return keyUtils.publicKeyHexFrompublicKeyJwk(this.publicKeyJwk);
  //   }

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
        const header = {
          alg: getRecommendedSignatureAlgorithm(privateKeyJwk, 2020),
          b64: false,
          crit: ['b64'],
        };
        const toBeSigned = Buffer.from(
          data.buffer,
          data.byteOffset,
          data.length
        );
        const flattened = jose.JWS.sign.flattened(
          toBeSigned,
          jose.JWK.asKey(privateKeyJwk),
          header
        );
        return flattened.protected + '..' + flattened.signature;
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
        const alg = getRecommendedSignatureAlgorithm(publicKeyJwk, 2020); // Ex: "EdDSA";
        const type = 'JsonWebKey2020'; //Ex: "Ed25519Signature2018";
        const [encodedHeader, encodedSignature] = signature.split('..');
        let header;

        try {
          header = JSON.parse(base64url.decode(encodedHeader));
        } catch (e) {
          throw new Error('Could not parse JWS header; ' + e);
        }

        if (!(header && typeof header === 'object')) {
          throw new Error('Invalid JWS header.');
        }

        if (header.alg !== alg) {
          throw new Error(
            `Invalid JWS header, expected ${header.alg} === ${alg}.`
          );
        }
        // confirm header matches all expectations
        if (
          !(
            header.alg === alg &&
            header.b64 === false &&
            Array.isArray(header.crit) &&
            header.crit.length === 1 &&
            header.crit[0] === 'b64'
          ) &&
          Object.keys(header).length === 3
        ) {
          throw new Error(
            `Invalid JWS header parameters ${JSON.stringify(
              header
            )} for ${type}.`
          );
        }

        let verified = false;
        const detached = {
          protected: encodedHeader,
          signature: encodedSignature,
        };
        const payload = Buffer.from(data.buffer, data.byteOffset, data.length);
        try {
          jose.JWS.verify(
            { ...detached, payload } as any,
            jose.JWK.asKey(publicKeyJwk),
            {
              crit: ['b64'],
            }
          );
          verified = true;
        } catch (e) {
          // console.error('An error occurred when verifying signature: ', e);
        }
        return verified;
      },
    };
  }

  deriveSecret({ publicKey }: any) {
    try {
      getRecommendedDeriveSecretAlgorithm(this.publicKeyJwk, 2020);
    } catch (e) {
      throw e;
    }
    const ourPrivateKey = jose.JWK.asKey(this.privateKeyJwk);
    const theirPublicKey = jose.JWK.asKey(publicKey.publicKeyJwk);
    const secret = compute_secret(ourPrivateKey, theirPublicKey);
    return secret;
  }

  encrypt(message: Buffer, publicKeys: any[]) {
    const alg = getRecommendedEncryptionAlgorithm(this.privateKey, 2020);
    const encrypt = new jose.JWE.Encrypt(message);
    publicKeys.forEach(publicKey => {
      const options = {
        alg,
      };
      const jwk = jose.JWK.asKey(publicKey.publicKeyJwk);
      // uncomment to see supported algs
      // console.log(jwk.algorithms());
      encrypt.recipient(jwk, options);
    });
    const jwe = encrypt.encrypt('general');
    return jwe;
  }

  decrypt(jwe: string) {
    const plaintext = jose.JWE.decrypt(jwe, jose.JWK.asKey(this.privateKeyJwk));
    return plaintext;
  }
}
