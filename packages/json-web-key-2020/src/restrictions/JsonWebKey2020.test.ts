import { JsonWebKey } from '../JsonWebKey';

const message = Buffer.from('hello');

const recommended: any = [
  { kty: 'OKP', crvOrSize: 'Ed25519' },
  { kty: 'OKP', crvOrSize: 'X25519' },
  { kty: 'EC', crvOrSize: 'secp256k1' },
  { kty: 'EC', crvOrSize: 'P-256' },
  { kty: 'EC', crvOrSize: 'P-384' },
  { kty: 'RSA', crvOrSize: 2048 },
  { kty: 'EC', crvOrSize: 'P-521' }, // negative test / not supported at all.
];

recommended.forEach((generateOptions: any) => {
  describe(`${generateOptions.kty} ${generateOptions.crvOrSize}`, () => {
    let key1: JsonWebKey;
    let key2: JsonWebKey;
    it('generate', async () => {
      try {
        key1 = await JsonWebKey.generate(generateOptions);
        key2 = await JsonWebKey.generate(generateOptions);
        expect(key1).toBeDefined();
        expect(key2).toBeDefined();
      } catch (e) {
        if (generateOptions.crvOrSize === 'P-521') {
          return expect(e.message).toBe(
            'No recommended generate alg for 2020, EC, P-521'
          );
        }
        throw e;
      }
    });

    it('sign / verify', async () => {
      try {
        const signature1 = await key1.signer().sign({ data: message });
        const signature2 = await key2.signer().sign({ data: message });
        let verified1 = await key1
          .verifier()
          .verify({ data: message, signature: signature1 });
        let verified2 = await key2
          .verifier()
          .verify({ data: message, signature: signature2 });
        expect(verified1).toBe(true);
        expect(verified2).toBe(true);

        verified1 = await key1
          .verifier()
          .verify({ data: message, signature: signature2 });
        verified2 = await key2
          .verifier()
          .verify({ data: message, signature: signature1 });

        expect(verified1).toBe(false);
        expect(verified2).toBe(false);
      } catch (e) {
        if (generateOptions.crvOrSize === 'X25519') {
          return expect(e.message).toBe(
            'No recommended sign alg for 2020, OKP, X25519'
          );
        }
        // because key generation will fail for forbidden crv
        if (generateOptions.crvOrSize === 'P-521') {
          return expect(e.message).toBe(
            "Cannot read property 'signer' of undefined"
          );
        }
        throw e;
      }
    });

    it('deriveSecret', async () => {
      try {
        const secret = await key1.deriveSecret({
          publicKey: key2,
        });
        expect(secret.toString('hex').length).toBeDefined();
      } catch (e) {
        if (generateOptions.crvOrSize === 'Ed25519') {
          return expect(e.message).toBe(
            'No recommended deriveSecret alg for 2020, OKP, Ed25519'
          );
        }
        if (generateOptions.kty === 'RSA') {
          return expect(e.message).toBe(
            'No recommended deriveSecret alg for 2020, RSA, 2048'
          );
        }
        // because key generation will fail for forbidden crv
        if (generateOptions.crvOrSize === 'P-521') {
          return expect(e.message).toBe(
            "Cannot read property 'deriveSecret' of undefined"
          );
        }
        throw e;
      }
    });

    it('encrypt / decrypt', async () => {
      try {
        const publicKeys = [key1, key2];
        const jwe: any = await key1.encrypt(message, publicKeys);
        expect(jwe.recipients.length).toBe(2);
        // expect(jwe.recipients[0].header.alg).toBe('ECDH-ES+A256KW');
        const plaintext = await key1.decrypt(jwe as any);
        expect(plaintext).toEqual(message);
      } catch (e) {
        if (generateOptions.crvOrSize === 'Ed25519') {
          return expect(e.message).toBe(
            'No recommended encrypt alg for 2020, OKP, Ed25519'
          );
        }
        if (generateOptions.crvOrSize === 'secp256k1') {
          return expect(e.message).toBe(
            'No recommended encrypt alg for 2020, EC, secp256k1'
          );
        }
        // because key generation will fail for forbidden crv
        if (generateOptions.crvOrSize === 'P-521') {
          return expect(e.message).toBe(
            "Cannot read property 'encrypt' of undefined"
          );
        }

        throw e;
      }
    });
  });
});
