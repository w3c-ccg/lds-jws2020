# lds-jws2020

This package is deprecated, please use `@transmute/json-web-signature-2020` instead.

#### Deprecated Examples

This is an example of a JwsVerificationKey2020 which remains defined in the context for backwards-compatibility, but shouldn't be used by new implementations.

```js
const key = new JsonWebKeyLinkedDataKeyClass2020({
  id: `did:example:123#_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A`,
  type: "JwsVerificationKey2020",
  controller: "did:example:123",
  privateKeyJwk: {
    crv: "Ed25519",
    x: "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ",
    d: "tP7VWE16yMQWUO2G250yvoevfbfxY25GjHglTP3ZOyU",
    kty: "OKP",
    kid: "_Qq0UL2Fq651Q0Fjd6TvnYE-faHiOpRlPVQcY_-tA4A",
  },
});
```
