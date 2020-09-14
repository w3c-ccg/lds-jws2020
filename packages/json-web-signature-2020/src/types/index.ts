export interface JWK {
  kty: string;
  crv: string;
  x: string;
  y: string;
  d?: string;
  kid?: string;
}

export interface JsonWebKeyPair {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk: JWK;
  privateKeyJwk: JWK;
}

export interface JsonWebKeyVerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk: JWK;
}

export interface JsonWebKeyPairGenerateOptions {
  kty: string;
  crvOrSize: string;
  seed?: Uint8Array;
}

export interface VcTemplate {
  '@context': string[];
  id: string;
  type: string[];
  issuer: {
    id: string;
  };
  issuanceDate: string;
  credentialSubject: {
    id: string;
    degree: {
      type: string;
      name: string;
    };
  };
}

export interface Vc {
  '@context': string[];
  id: string;
  type: string[];
  issuer: {
    id: string;
  };
  issuanceDate: string;
  credentialSubject: {
    id: string;
    degree: {
      type: string;
      name: string;
    };
  };
  proof: {
    type: string;
    created: string;
    jws: string;
    proofPurpose: string;
    verificationMethod: string;
  };
}

export interface Issuer {
  '@context': string[];
  id: string;
  publicKey?: any[];
  assertionMethod?: any[];
  authentication?: any[];
}
