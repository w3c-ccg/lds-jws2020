import { JsonWebKey } from '../JsonWebKey';
import { message_0, keypair_2 } from '../__fixtures__';

const generatorArgs = {
  kty: 'EC',
  crvOrSize: 'P-384',
};

it('can generate from seed', async () => {
  const keypair = await JsonWebKey.generate({
    ...generatorArgs,
  });
  expect(keypair.toLinkedDataKeyPair().type).toBe('JsonWebKey2020');
});

it('can use from', async () => {
  const keypair = await JsonWebKey.from(keypair_2);
  let vm: any = { ...keypair_2 };
  delete vm.privateKeyJwk;
  expect(keypair.toVerificationMethod()).toEqual(vm);
});

it('can sign and verify', async () => {
  const keypair = await JsonWebKey.generate({
    ...generatorArgs,
  });
  const signer = keypair.signer();
  const _signature = await signer.sign({
    data: Buffer.from(message_0),
  });
  const verifier = keypair.verifier();
  const _verified = await verifier.verify({
    data: Buffer.from(message_0),
    signature: _signature,
  });
  expect(_verified).toBe(true);
});
