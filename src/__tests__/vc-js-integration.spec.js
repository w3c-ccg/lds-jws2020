const jsigs = require('jsonld-signatures');
const vc = require('vc-js');
const {
  MyLinkedDataKeyClass2019,
  JoseLinkedDataSignature2020,
} = require('../');
const {
  documentLoader,
  doc,
  credential,
  didDocJwks,
} = require('./__fixtures__');
const { AssertionProofPurpose } = jsigs.purposes;

describe('integration tests', () => {
  let suite;
  let key;

  beforeAll(async () => {
    const privateKeyJwk = didDocJwks.keys[1];
    const did = 'did:example:123';

    key = new MyLinkedDataKeyClass2019({
      id: `${did}#${privateKeyJwk.kid}`,
      type: 'JoseVerificationKey2020',
      controller: did,
      privateKeyJwk,
    });

    suite = new JoseLinkedDataSignature2020({
      LDKeyClass: MyLinkedDataKeyClass2019,
      linkedDataSigantureType: 'JoseLinkedDataSignature2020',
      linkedDataSignatureVerificationKeyType: 'JoseVerificationKey2020',
      key,
    });
  });

  describe('jsigs', () => {
    it('should work as valid signature suite for signing and verifying a document', async () => {
      // We need to do that because jsigs.sign modifies the credential... no bueno
      const signed = await jsigs.sign(
        { ...doc },
        {
          compactProof: false,
          documentLoader: documentLoader,
          purpose: new AssertionProofPurpose(),
          suite,
        },
      );
      expect(signed.proof).toBeDefined();

      const result = await jsigs.verify(signed, {
        compactProof: false,
        documentLoader: documentLoader,
        purpose: new AssertionProofPurpose(),
        suite,
      });
      expect(result.verified).toBeTruthy();
    });
  });

  describe('vc-js', () => {
    it('should work as valid signature suite for issuing and verifying a credential', async () => {
      const signedVC = await vc.issue({
        credential: { ...credential },
        compactProof: false,
        suite,
      });
      expect(signedVC.proof).toBeDefined();

      const result = await vc.verify({
        credential: signedVC,
        compactProof: false,
        documentLoader: documentLoader,
        purpose: new AssertionProofPurpose(),
        suite,
      });
      expect(result.verified).toBeTruthy();
    });
  });
});
