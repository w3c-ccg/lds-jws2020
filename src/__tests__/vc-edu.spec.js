const jsigs = require("jsonld-signatures");
const vc = require("vc-js");
const {
  JsonWebKeyLinkedDataKeyClass2020,
  JsonWebSignature2020
} = require("../");
const {
  documentLoader,
  credentials,
  didDocJwks
} = require("./__fixtures__");
const { AssertionProofPurpose } = jsigs.purposes;

describe("credential integration tests", () => {
  let suite;
  let key;
  let keyDeprecated;
  let suiteDeprecated;

  beforeAll(async () => {
    const privateKeyJwk = didDocJwks.keys[1];
    const did = "did:example:123";

    key = new JsonWebKeyLinkedDataKeyClass2020({
      id: `${did}#${privateKeyJwk.kid}`,
      type: "JsonWebKey2020",
      controller: did,
      privateKeyJwk
    });

    suite = new JsonWebSignature2020({
      LDKeyClass: JsonWebKeyLinkedDataKeyClass2020,
      linkedDataSigantureType: "JsonWebSignature2020",
      linkedDataSignatureVerificationKeyType: "JsonWebKey2020",
      key
    });

    keyDeprecated = new JsonWebKeyLinkedDataKeyClass2020({
      id: `${did}#${privateKeyJwk.kid}`,
      type: "JwsVerificationKey2020",
      controller: did,
      privateKeyJwk
    });

    suiteDeprecated = new JsonWebSignature2020({
      LDKeyClass: JsonWebKeyLinkedDataKeyClass2020,
      linkedDataSigantureType: "JsonWebSignature2020",
      linkedDataSignatureVerificationKeyType: "JwsVerificationKey2020",
      key: keyDeprecated
    });
  });

  describe("vc-js", () => {
    it("should work as valid signature suite for issuing and verifying a credential", async () => {
      const signedVC = await vc.issue({
        credential: { ...credentials.edu.vcBindingModel },
        compactProof: false,
        suite
      });

      expect(signedVC.proof).toBeDefined();
      const result = await vc.verifyCredential({
        credential: signedVC,
        compactProof: false,
        documentLoader: documentLoader,
        purpose: new AssertionProofPurpose(),
        suite
      });
      expect(result.verified).toBeTruthy();
    });
  });

  it("should work as valid signature suite for issuing and verifying a credential with deprecated KeyType", async () => {
    const signedVC = await vc.issue({
      credential: { ...credentials.edu.vcBindingModel },
      compactProof: false,
      suite: suiteDeprecated
    });

    expect(signedVC.proof).toBeDefined();
    const result = await vc.verifyCredential({
      credential: signedVC,
      compactProof: false,
      documentLoader: documentLoader,
      purpose: new AssertionProofPurpose(),
      suite: suiteDeprecated
    });
    expect(result.verified).toBeTruthy();
  });
});
