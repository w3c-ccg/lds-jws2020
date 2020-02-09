const fs = require("fs");
const path = require("path");
const jose = require("jose");

const jsigs = require("jsonld-signatures");

const base64url = require("base64url");

let ddo;

const {
  JsonWebKeyLinkedDataKeyClass2020,
  JsonWebSignature2020
} = require("../");
const { documentLoader } = require("./__fixtures__");
const supportedKeyTypes = require("./__fixtures__/supportedKeyTypes");

const { AssertionProofPurpose } = jsigs.purposes;

const didDoc = {
  "@context": "https://www.w3.org/ns/did/v1",
  id: "did:example:123",
  publicKey: [],
  authentication: [],
  assertionMethod: [],
  capabilityDelegation: [],
  capabilityInvocation: []
};

const jwks = new jose.JWKS.KeyStore();

const addKey = async ({ kty, crvOrSize }) => {
  let key = await JsonWebKeyLinkedDataKeyClass2020.generate(kty, crvOrSize, {
    // when ommited, will be generated from controller and fingerprint.
    // id: "test-id",
    type: "JwsVerificationKey2020",
    controller: "did:example:123"
  });

  let suite = new JsonWebSignature2020({
    LDKeyClass: JsonWebKeyLinkedDataKeyClass2020,
    linkedDataSigantureType: "JsonWebSignature2020",
    linkedDataSignatureVerificationKeyType: "JwsVerificationKey2020",
    key
  });

  await jsigs.sign(didDoc, {
    compactProof: false,
    documentLoader: documentLoader,
    purpose: new AssertionProofPurpose(),
    suite
  });

  jwks.add(jose.JWK.asKey(key.privateKeyJwk));

  const publicKey = { ...key };
  delete publicKey.privateKeyJwk;
  didDoc.publicKey.push(publicKey);
  didDoc.authentication.push(publicKey.id);
  didDoc.assertionMethod.push(publicKey.id);
  didDoc.capabilityDelegation.push(publicKey.id);
  didDoc.capabilityInvocation.push(publicKey.id);
  return key;
};

describe("generate example did document", () => {
  it("should add all supported key types", async () => {
    await Promise.all(supportedKeyTypes.map(addKey));
    fs.writeFileSync(
      path.resolve(__dirname, "../../docs/example/didDoc.json"),
      JSON.stringify(didDoc, null, 2)
    );
    fs.writeFileSync(
      path.resolve(__dirname, "../../docs/example/didDocJwks.json"),
      JSON.stringify(jwks.toJWKS(true), null, 2)
    );
    ddo = didDoc;
  });

  it("generate supported key table from ddo", async () => {
    //   console.log("yol", ddo);

    let tableMarkdown = `
| kty | crvOrSize | alg    |
| --- | --------- | ------ |
`;
    const tableJson = [];

    await Promise.all(
      ddo.proof.map(async proof => {
        const { alg } = JSON.parse(
          base64url.decode(proof.jws.split("..").shift())
        );

        const publicKey = ddo.publicKey.find(k => {
          return k.id === proof.verificationMethod;
        });
        const kty = publicKey.publicKeyJwk.kty;
        let crvOrSize;
        if (publicKey.publicKeyJwk.crv) {
          crvOrSize = publicKey.publicKeyJwk.crv;
        } else {
          //assume RSA
          crvOrSize = 4096;
        }

        tableJson.push({
          kty,
          crvOrSize,
          alg
        });
      })
    );

    tableJson.forEach(row => {
      tableMarkdown += `| ${row.kty} | ${row.crvOrSize}   | ${row.alg}  |\n`;
    });

    fs.writeFileSync(
      path.resolve(__dirname, "../../docs/example/supportedTable.json"),
      JSON.stringify(tableJson, null, 2)
    );
    fs.writeFileSync(
      path.resolve(__dirname, "../../docs/example/supportedTable.md"),
      tableMarkdown
    );
  });
});
