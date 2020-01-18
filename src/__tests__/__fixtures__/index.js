const documentLoader = require("./customDocumentLoader");

// let myLdKey = await MyLinkedDataKeyClass2019.generate("OKP", "Ed25519", {
//   id: "test-id",
//   type: "test-type",
//   controller: "test-controller"
// });
const myLdKey = {
  id: "test-id",
  type: "test-type",
  controller: "test-controller",
  alg: "EdDSA",
  privateKeyJwk: {
    crv: "Ed25519",
    x: "FXEu1TAoxz7upMtTKCUiX5EH2mYCuUEHf7DLuBw9-fo",
    d: "CzVNg-sNU2ugK14oDESwwNE6NP2o0mGKrGHV5WM4pl8",
    kty: "OKP",
    kid: "5Z9WRl3Zd9wG2PJ8NJL2uu1oHyyUK3s15ugbbQ25Sqw"
  },
  publicKeyJwk: {
    crv: "Ed25519",
    x: "FXEu1TAoxz7upMtTKCUiX5EH2mYCuUEHf7DLuBw9-fo",
    kty: "OKP",
    kid: "5Z9WRl3Zd9wG2PJ8NJL2uu1oHyyUK3s15ugbbQ25Sqw"
  }
};

const doc = {
  "@context": [
    "https://transmute-industries.github.io/lds-jose2020/contexts/lds-jose2020-v0.0.jsonld",
    {
      schema: "http://schema.org/",
      name: "schema:name",
      homepage: "schema:url",
      image: "schema:image"
    }
  ],
  name: "Manu Sporny",
  homepage: "https://manu.sporny.org/",
  image: "https://manu.sporny.org/images/manu.png"
};

const authenticateMeActionDoc = {
  "@context": [
    "https://w3id.org/did/v1",
    {
      schema: "http://schema.org/",
      action: "schema:action"
    }
  ],
  action: "AuthenticateMe"
};

const didKeypair = {
  passphrase: null,
  id: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
  controller: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
  type: "Ed25519VerificationKey2018",
  privateKeyBase58:
    "55dKnusKVZjGK9rtTQgT3usTnALuChkzQpoksz4jES5G7AKMCpQCBt3azfko5oTMQD11gPxQ1bFRAYWSwcYSPdPV",
  publicKeyBase58: "25C16YaTbD96wAvdokKnTmD8ruWvYARDkc6nfNEA3L71"
};

const didKeyDoc = {
  "@context": "https://w3id.org/did/v1",
  id: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
  publicKey: [
    {
      id: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
      type: "Ed25519VerificationKey2018",
      controller: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
      publicKeyBase58: "25C16YaTbD96wAvdokKnTmD8ruWvYARDkc6nfNEA3L71"
    }
  ],
  authentication: ["did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"],
  assertionMethod: ["did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"],
  capabilityDelegation: [
    "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"
  ],
  capabilityInvocation: [
    "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"
  ],
  keyAgreement: [
    {
      id:
        "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP#zCDHgu3FAkC7ugAMPB7UMjMssNx6XXFnWFJXF6FYU98CLH",
      type: "X25519KeyAgreementKey2019",
      controller: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
      publicKeyBase58: "DnyBg4MYpNdF4JQihynmCiC5hpiZh5tkQdx4QTfk1xE5"
    }
  ]
};

const didKeyDoc2 = {
  "@context": "https://w3id.org/did/v1",
  id: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
  publicKey: [
    {
      id: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
      type: "Ed25519VerificationKey2018",
      controller: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
      publicKeyJwk: {
        crv: "Ed25519",
        x: "D-5zI9uCYOAk_bN_QWD2XAQ_gIyHUh-6OY7nVk-Rg0g",
        kty: "OKP",
        kid: "my-kid"
      }
    }
  ],
  authentication: ["did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"],
  assertionMethod: ["did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"],
  capabilityDelegation: [
    "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"
  ],
  capabilityInvocation: [
    "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP"
  ],
  keyAgreement: [
    {
      id:
        "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP#zCDHgu3FAkC7ugAMPB7UMjMssNx6XXFnWFJXF6FYU98CLH",
      type: "X25519KeyAgreementKey2019",
      controller: "did:key:z6MkfXT3gnptvkda3fmLVKHdJrm8gUnmx3faSd1iVeCAxYtP",
      publicKeyBase58: "DnyBg4MYpNdF4JQihynmCiC5hpiZh5tkQdx4QTfk1xE5"
    }
  ]
};

module.exports = {
  doc,
  myLdKey,
  didKeyDoc,
  didKeyDoc2,
  didKeypair,
  authenticateMeActionDoc,
  documentLoader
};
