const didDocJwks = require("../../docs/example/didDocJwks.json");

const {
  JoseLinkedDataKeyClass2020,
  JsonWebSignature2020
} = require("../index");

const { documentLoader, doc } = require("./__fixtures__");

const jsigs = require("jsonld-signatures");
const { AssertionProofPurpose } = jsigs.purposes;

const testJwk = async privateKeyJwk => {
  const key = new JoseLinkedDataKeyClass2020({
    id: "did:example:123#" + privateKeyJwk.kid,
    type: "JwsVerificationKey2020",
    controller: "did:example:123",
    privateKeyJwk: privateKeyJwk
    // will be inferred
    // alg: "...",
  });

  const signed = await jsigs.sign(
    { ...doc },
    {
      suite: new JsonWebSignature2020({
        LDKeyClass: JoseLinkedDataKeyClass2020,
        linkedDataSigantureType: "JsonWebSignature2020",
        linkedDataSignatureVerificationKeyType: "JwsVerificationKey2020",
        // will be inferred
        // alg: "...",
        key
      }),
      purpose: new AssertionProofPurpose(),
      documentLoader: documentLoader,
      compactProof: false
    }
  );

  const res = await jsigs.verify(signed, {
    suite: new JsonWebSignature2020({
      LDKeyClass: JoseLinkedDataKeyClass2020,
      linkedDataSigantureType: "JsonWebSignature2020",
      linkedDataSignatureVerificationKeyType: "JwsVerificationKey2020",
      alg: JsonWebSignature2020.inferAlg(signed),
      key
    }),
    purpose: new AssertionProofPurpose(),
    documentLoader: documentLoader,
    compactProof: false
  });
  // Leave for development purposes
  if (!res.verified) {
    console.log(res);
  }
  return expect(res.verified).toBe(true);
};

describe("test supported key types", () => {
  it("should be able to create a verify ", async () => {
    await Promise.all(didDocJwks.keys.map(testJwk));
  });
});
