const {
  MyLinkedDataKeyClass2019,
  JoseLinkedDataSignature2020
} = require("../index");

const { myLdKey, documentLoader, doc } = require("./__fixtures__");

const jsigs = require("jsonld-signatures");
const { AssertionProofPurpose } = jsigs.purposes;

describe("JoseLinkedDataSignature2020", () => {
  it("constructor works", async () => {
    const s = new JoseLinkedDataSignature2020({
      linkedDataSigantureType: "JoseLinkedDataSignature2020",
      linkedDataSignatureVerificationKeyType: "JoseVerificationKey2020"
    });
    expect(s.type).toBe("JoseLinkedDataSignature2020");
    expect(s.requiredKeyType).toBe("JoseVerificationKey2020");
  });

  it("JoseLinkedDataSignature2020", async () => {
    const key = new MyLinkedDataKeyClass2019({
      ...myLdKey,
      id: "did:example:123#" + myLdKey.id,
      controller: "did:example:123"
    });

    const signed = await jsigs.sign(doc, {
      suite: new JoseLinkedDataSignature2020({
        LDKeyClass: MyLinkedDataKeyClass2019,
        linkedDataSigantureType: "JoseLinkedDataSignature2020",
        linkedDataSignatureVerificationKeyType: "JoseVerificationKey2020",
        alg: "EdDSA",
        key
      }),
      purpose: new AssertionProofPurpose(),
      documentLoader: documentLoader,
      compactProof: false
    });

    expect(signed.proof).toBeDefined();

    const res = await jsigs.verify(signed, {
      suite: new JoseLinkedDataSignature2020({
        LDKeyClass: MyLinkedDataKeyClass2019,
        linkedDataSigantureType: "JoseLinkedDataSignature2020",
        linkedDataSignatureVerificationKeyType: "JoseVerificationKey2020",
        alg: "EdDSA",
        key
      }),
      purpose: new AssertionProofPurpose(),
      documentLoader: documentLoader,
      compactProof: false
    });

    const { verified } = res;

    expect(verified).toBe(true);
  });
});
