const base64url = require("base64url");
const signed = require("./__fixtures__/data/example.signed.json");

const {
  MyLinkedDataKeyClass2019,
  JoseLinkedDataSignature2020
} = require("../index");

const { myLdKey, documentLoader, doc } = require("./__fixtures__");

const jsigs = require("jsonld-signatures");
const { AssertionProofPurpose } = jsigs.purposes;

describe("alg-inference", () => {
  it("given a lds, can we determine the alg", async () => {
    const key = new MyLinkedDataKeyClass2019({
      ...myLdKey,
      id: "did:example:123#" + myLdKey.id,
      controller: "did:example:123"
    });
    const res = await jsigs.verify(signed, {
      suite: new JoseLinkedDataSignature2020({
        LDKeyClass: MyLinkedDataKeyClass2019,
        linkedDataSigantureType: "JoseLinkedDataSignature2020",
        linkedDataSignatureVerificationKeyType: "JoseVerificationKey2020",
        alg: JoseLinkedDataSignature2020.inferAlg(signed),
        key
      }),
      purpose: new AssertionProofPurpose(),
      documentLoader: documentLoader,
      compactProof: false
    });
    expect(res.verified).toBe(true);
  });
});
