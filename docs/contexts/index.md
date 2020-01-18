#### [View on GitHub](https://github.com/transmute-industries/lds-jose2020)

> JSON-LD 1.1 is being formally specified in the W3C JSON-LD Working Group. To participate in this work, please join the W3C and then [join the Working Group](https://www.w3.org/2018/json-ld-wg/).

You can use this repo as a guide for extending contexts, and ensuring that your JSON-LD is functioning as expected and fully documented. This should help you make the case that your extensions should be included, or eliminate the need for them to be included.

- [Latest JSON-LD Context](./contexts/lds-jose2020-v0.0.jsonld)

### Terminology

<h4 id="publicKeyJwk"><a href="#publicKeyJwk">publicKeyJwk</a></h4>

A public key in JWK format. A JSON Web Key (JWK) is a JavaScript Object Notation (JSON) data structure that represents a cryptographic key. Read [RFC7517](https://tools.ietf.org/html/rfc7517).

#### Example:

```json
{
  "@context": "https://transmute-industries.github.io/lds-jose2020/contexts/lds-jose2020-v0.0.jsonld",
  "id": "did:example:123#JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw",
  "type": "JoseVerificationKey2020",
  "publicKeyJwk": {
    "kid": "JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw",
    "kty": "OKP",
    "crv": "Ed25519",
    "d": "nWGxne_9WmC6hEr0kuwsxERJxWl7MmkZcDusAxyuf2A",
    "x": "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo"
  }
}
```

<h4 id="JoseVerificationKey2020"><a href="#JoseVerificationKey2020">JoseVerificationKey2020</a></h4>

The verification key type for `JoseLinkedDataSignature2020`. The key must have a property `publicKeyJwk` and its value must be a valid JWK.

#### Example:

```json
[
  {
    "@context": "https://transmute-industries.github.io/lds-jose2020/contexts/lds-jose2020-v0.0.jsonld",
    "id": "did:example:123#JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw",
    "type": "JoseVerificationKey2020",
    "publicKeyJwk": {
      "kid": "JUvpllMEYUZ2joO59UNui_XYDqxVqiFLLAJ8klWuPBw",
      "kty": "OKP",
      "crv": "Ed25519",
      "d": "nWGxne_9WmC6hEr0kuwsxERJxWl7MmkZcDusAxyuf2A",
      "x": "11qYAYKxCrfVS_7TyWQHOg7hcvPapiMlrwIaaPcHURo"
    }
  }
]
```

<h4 id="JoseLinkedDataSignature2020"><a href="#JoseLinkedDataSignature2020">JoseLinkedDataSignature2020</a></h4>

A JSON-LD Document has been signed with JoseLinkedDataSignature2020,
when it contains a proof field with type `JoseLinkedDataSignature2020`. The proof must contain a key `jws` with value defined by the signing algorithm described here.

#### Example:

```json
{
  "@context": "https://w3id.org/security/v2",
  "http://schema.org/action": "AuthenticateMe",
  "proof": {
    "challenge": "abc",
    "created": "2019-01-16T20:13:10Z",
    "domain": "example.com",
    "proofPurpose": "authentication",
    "verificationMethod": "https://example.com/i/alice/keys/2",
    "type": "JoseLinkedDataSignature2020",
    "jws": "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..QgbRWT8w1LJet_KFofNfz_TVs27z4pwdPwUHhXYUaFlKicBQp6U1H5Kx-mST6uFvIyOqrYTJifDijZbtAfi0MA"
  }
}
```
