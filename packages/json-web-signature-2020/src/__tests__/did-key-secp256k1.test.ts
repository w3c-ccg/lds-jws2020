import { JsonWebKey } from '../JsonWebKey';
import { seed_0, keypair_1, message_0, signature_1 } from '../__fixtures__';

const generatorArgs = {
  kty: 'EC',
  crvOrSize: 'secp256k1',
};

it('can generate from seed', async () => {
  const keypair = await JsonWebKey.generate({
    ...generatorArgs,
    seed: new Uint8Array(Buffer.from(seed_0, 'hex')),
  });
  expect(keypair.toLinkedDataKeyPair()).toEqual(keypair_1);
});

it('can use from', async () => {
  const keypair = await JsonWebKey.from(keypair_1);
  let vm: any = { ...keypair_1 };
  delete vm.privateKeyJwk;
  expect(keypair.toVerificationMethod()).toEqual(vm);
});

it('can sign', async () => {
  const keypair = await JsonWebKey.generate({
    ...generatorArgs,
    seed: new Uint8Array(Buffer.from(seed_0, 'hex')),
  });
  const signer = keypair.signer();
  const _signature = await signer.sign({
    data: Buffer.from(message_0),
  });
  expect(_signature).toEqual(signature_1);
});

it('can verify', async () => {
  const keypair = await JsonWebKey.generate({
    ...generatorArgs,
    seed: new Uint8Array(Buffer.from(seed_0, 'hex')),
  });
  const verifier = keypair.verifier();
  const _verified = await verifier.verify({
    data: Buffer.from(message_0),
    signature: signature_1,
  });
  expect(_verified).toBe(true);
});
