const supportedKeyTypes = [
  {
    kty: "OKP",
    crvOrSize: "Ed25519"
  },
  {
    kty: "EC",
    crvOrSize: "secp256k1"
  },
  {
    kty: "RSA",
    crvOrSize: 2048
  },
  {
    kty: "EC",
    crvOrSize: "P-256"
  }
];

module.exports = supportedKeyTypes;
