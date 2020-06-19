import * as fixtures from '../__fixtures__';
import { JsonWebKey } from '@transmute/json-web-key-2020';
import { JsonWebSignature2020 } from '..';

// const jsigs = require('jsonld-signatures');

// const {
//   AssertionProofPurpose,
//   // AuthenticationProofPurpose
// } = jsigs.purposes;

const vc = require('vc-js');

const firstKey = fixtures.unlockedDid.publicKey[1];

const { documentLoader } = fixtures;

const key = new JsonWebKey(firstKey);

const suite = new JsonWebSignature2020({
  key,
  date: '2019-12-11T03:50:55Z',
});

let verifiableCredential: any;
let verifiablePresentation: any;

const credential = {
  ...fixtures.credential,
  issuer: { id: fixtures.unlockedDid.id },
  credentialSubject: {
    ...fixtures.credential.credentialSubject,
    id: fixtures.unlockedDid.id,
  },
};

jest.setTimeout(10 * 1000);

describe('vc-js-interop', () => {
  it('issue verifiableCredential', async () => {
    verifiableCredential = await vc.issue({
      credential: { ...credential },
      suite,
      documentLoader,
    });
    // console.log(JSON.stringify(verifiableCredential, null, 2));
    expect(verifiableCredential.proof).toBeDefined();
  });

  it('verify verifiableCredential', async () => {
    const result = await vc.verifyCredential({
      credential: verifiableCredential,
      suite,
      documentLoader,
    });
    // console.log(JSON.stringify(result, null, 2));
    expect(result.verified).toBe(true);
  });

  it('createPresentation & signPresentation', async () => {
    const id = 'ebc6f1c2';
    const holder = fixtures.unlockedDid.id;
    const presentation = vc.createPresentation({
      verifiableCredential,
      id,
      holder,
    });
    expect(presentation.type).toEqual(['VerifiablePresentation']);

    verifiablePresentation = await vc.signPresentation({
      presentation,
      suite,
      challenge: '123',
      documentLoader,
    });
    expect(verifiablePresentation.proof).toBeDefined();
  });

  it('verify verifiablePresentation', async () => {
    const result = await vc.verify({
      presentation: verifiablePresentation,
      challenge: '123',
      suite,
      documentLoader,
    });
    // console.log(JSON.stringify(result, null, 2));
    expect(result.verified).toBe(true);
  });
});
