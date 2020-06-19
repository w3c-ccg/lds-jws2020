export const generate = {
  'OKP X25519': 'allowed',
  'OKP Ed25519': 'allowed',
  'EC secp256k1': 'allowed',
  'EC P-256': 'allowed',
  'EC P-384': 'allowed',
  'RSA 2048': 'allowed',
};

export const sign: any = {
  'OKP Ed25519': 'EdDSA',
  'EC secp256k1': 'ES256K',
  'EC P-256': 'ES256',
  'EC P-384': 'ES384',
  'RSA 2048': 'PS256',
};

export const deriveSecret: any = {
  // 'RSA 2048': '????',
  'OKP X25519': 'ECDH',
  'EC secp256k1': 'ECDH',
  'EC P-384': 'ECDH',
  'EC P-256': 'ECDH',
};

export const encrypt: any = {
  'OKP X25519': 'ECDH-ES+A256KW',
  // 'EC secp256k1': 'ECDH-ES+A256KW', not supported by jose currently
  'EC P-384': 'ECDH-ES+A256KW',
  'EC P-256': 'ECDH-ES+A256KW',
  'RSA 2048': 'RSA-OAEP',
};
