import { JsonWebKey } from '../JsonWebKey';
import { seed_0, keypair_0, message_0, signature_0 } from '../__fixtures__';

const generatorArgs = {
  kty: 'OKP',
  crvOrSize: 'Ed25519',
};

it('can generate', async () => {
  const keypair = await JsonWebKey.generate();
  expect(keypair.type).toBe('JsonWebKey2020');
});

it('can generate from seed', async () => {
  const keypair = await JsonWebKey.generate({
    ...generatorArgs,
    seed: new Uint8Array(Buffer.from(seed_0, 'hex')),
  });
  expect(keypair.toLinkedDataKeyPair()).toEqual(keypair_0);
});

it('can use from', async () => {
  const keypair = await JsonWebKey.from(keypair_0);
  let vm: any = { ...keypair_0 };
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
  expect(_signature).toEqual(signature_0);
});

it('can verify', async () => {
  const keypair = await JsonWebKey.generate({
    ...generatorArgs,
    seed: new Uint8Array(Buffer.from(seed_0, 'hex')),
  });
  const verifier = keypair.verifier();
  const _verified = await verifier.verify({
    data: Buffer.from(message_0),
    signature: signature_0,
  });
  expect(_verified).toBe(true);
});
