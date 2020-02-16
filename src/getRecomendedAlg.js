const mapper = {
  "OKP Ed25519": "EdDSA",
  "EC secp256k1": "ES256K",
  "EC P-256": "ES256",
  "EC P-384": "ES384",
  "EC P-521": "ES512"
};

const getRecomendedAlg = ({ kty, crv }) => {
  if (kty === "RSA") {
    return "PS256";
  }

  if (mapper[`${kty} ${crv}`]) {
    return mapper[`${kty} ${crv}`];
  }

  throw new Error("No prefferd alg found for" + kty + " " + crv);
};

module.exports = getRecomendedAlg;
