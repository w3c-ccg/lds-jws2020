import { JsonWebKey } from '@transmute/json-web-signature-2020';

describe('did-documents', () => {
  it('generate a did document with a P-384 JWK', async () => {
    const key = await JsonWebKey.generate({
      kty: 'EC',
      crvOrSize: 'P-384',
    });
    const did = 'did:example:charlie';
    const didDocument = {
      '@context': [
        'https://www.w3.org/ns/did/v1',
        {
          '@base': did,
        },
      ],
      id: did,
      publicKey: [key],
      authentication: [key.id],
      assertionMethod: [key.id],
      capabilityDelegation: [key.id],
      capabilityInvocation: [key.id],
      keyAgreement: [key.id],
    };
    // uncomment to generate another fixture....
    // console.log(JSON.stringify(didDocument, null, 2));
    expect(didDocument.id).toBe(did);
  });
});
