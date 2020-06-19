import * as fixtures from '../__fixtures__';

const jsigs = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');
const vc = require('vc-js');

const { Ed25519Signature2018 } = jsigs.suites;

const firstKey = fixtures.unlockedDid.publicKey[0];

const { documentLoader } = fixtures;

const key = new Ed25519KeyPair(firstKey);

const suite = new Ed25519Signature2018({
  key,
  date: '2019-12-11T03:50:55Z',
});

let verifiableCredential: any;
let verifiablePresentation: any;

const credential = {
  ...fixtures.credential,
  issuer: fixtures.unlockedDid.id,
  credentialSubject: {
    ...fixtures.credential.credentialSubject,
    id: fixtures.unlockedDid.id,
  },
};

jest.setTimeout(20 * 1000);

describe('vc-js-sanity', () => {
  it('issue verifiableCredential', async () => {
    verifiableCredential = await vc.issue({
      credential: { ...credential },
      suite,
      documentLoader,
    });
    expect(verifiableCredential.proof).toBeDefined();
  });

  it('verify verifiableCredential', async () => {
    const result = await vc.verifyCredential({
      credential: verifiableCredential,
      suite,
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });

  it('createPresentation & signPresentation', async () => {
    const id = 'ebc6f1c2';
    const holder = 'did:ex:12345';
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
    expect(result.verified).toBe(true);
  });
});
