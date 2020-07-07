import * as fixtures from '../__fixtures__';
const vc = require('vc-js');

const { documentLoader } = fixtures;

const credential = {
  ...fixtures.credential,
  issuer: { id: fixtures.unlockedDid.id },
  credentialSubject: {
    ...fixtures.credential.credentialSubject,
    id: fixtures.unlockedDid.id,
  },
};

export const runTests = (suite: any) => {
  let verifiableCredential: any;
  // let verifiablePresentation: any;

  it('issue verifiableCredential', async () => {
    verifiableCredential = await vc.issue({
      credential: { ...credential },
      suite,
      compactProof: false,
      documentLoader,
    });
    expect(verifiableCredential.proof).toBeDefined();
    console.log(JSON.stringify(verifiableCredential, null, 2));
  });

  it('verify verifiableCredential', async () => {
    const result = await vc.verifyCredential({
      credential: verifiableCredential,
      suite,
      compactProof: false,
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });

  // it('createPresentation & signPresentation', async () => {
  //   const id = 'ebc6f1c2';
  //   const holder = 'did:ex:12345';
  //   const presentation = vc.createPresentation({
  //     verifiableCredential,
  //     id,
  //     holder,
  //   });
  //   expect(presentation.type).toEqual(['VerifiablePresentation']);
  //   verifiablePresentation = await vc.signPresentation({
  //     presentation,
  //     suite,
  //     challenge: '123',
  //     documentLoader,
  //   });
  //   expect(verifiablePresentation.proof).toBeDefined();
  // });

  // it('verify verifiablePresentation', async () => {
  //   const result = await vc.verify({
  //     presentation: verifiablePresentation,
  //     challenge: '123',
  //     suite,
  //     documentLoader,
  //   });
  //   expect(result.verified).toBe(true);
  // });
};
