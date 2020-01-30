const jsigs = require('jsonld-signatures');
const vc = require('vc-js');
const {
  MyLinkedDataKeyClass2019,
  JoseLinkedDataSignature2020,
} = require('../');
const {
  documentLoader,
  doc,
  didDocJwks,
} = require("./__fixtures__");
const { AssertionProofPurpose } = jsigs.purposes;

describe('vc-js', () => {
  let suite;

  beforeAll(async () => {
    const privateKeyJwk = didDocJwks.keys[1];
    const did = 'did:example:123';

    const key = new MyLinkedDataKeyClass2019({
      id: `${did}#${privateKeyJwk.kid}`,
      type: "JoseVerificationKey2020",
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

  it('should work as valid signature suite for signing and verifying a document', async () => {
    const signed = await jsigs.sign(doc, {
      compactProof: false,
      documentLoader: documentLoader,
      purpose: new AssertionProofPurpose(),
      suite,
    });
    expect(signed.proof).toBeDefined();

    const verified = await jsigs.verify(signed, {
      compactProof: false,
      documentLoader: documentLoader,
      purpose: new AssertionProofPurpose(),
      suite,
    });
    expect(verified.verified).toBeTruthy();
  });
});
