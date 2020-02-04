const fs = require("fs");
const path = require("path");
const jose = require("jose");

const { JoseLinkedDataKeyClass2020 } = require("../index");
const didDoc = {
  "@context": "https://w3id.org/did/v1",
  id: "did:example:123",
  publicKey: [],
  authentication: [],
  assertionMethod: [],
  capabilityDelegation: [],
  capabilityInvocation: []
};

const supportedKeyTypes = [
  {
    kty: "OKP",
    crvOrSize: "Ed25519",
    alg: "EdDSA"
  },
  {
    kty: "EC",
    crvOrSize: "secp256k1",
    alg: "ES256K"
  },
  {
    kty: "RSA",
    crvOrSize: 4096,
    alg: "RS256"
  },
  {
    kty: "EC",
    crvOrSize: "P-256",
    alg: "ES256"
  }
];

const jwks = new jose.JWKS.KeyStore();

const addKey = async ({ kty, crvOrSize, alg }) => {
  let key = await JoseLinkedDataKeyClass2020.generate(kty, crvOrSize, {
    // when ommited, will be generated from controller and fingerprint.
    // id: "test-id",
    type: "JoseVerificationKey2020",
    controller: "did:example:123",
    alg
  });

  jwks.add(jose.JWK.asKey(key.privateKeyJwk));

  const publicKey = { ...key };
  delete publicKey.privateKeyJwk;
  delete publicKey.alg;
  didDoc.publicKey.push(publicKey);
  didDoc.authentication.push(publicKey.id);
  didDoc.assertionMethod.push(publicKey.id);
  didDoc.capabilityDelegation.push(publicKey.id);
  didDoc.capabilityInvocation.push(publicKey.id);
  return key;
};

describe.skip("generate example did document", () => {
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
  });
});
