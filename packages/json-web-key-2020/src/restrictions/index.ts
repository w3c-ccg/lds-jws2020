import * as JsonWebKey2020 from './JsonWebKey2020';

const mapper: any = {
  2020: JsonWebKey2020,
};

const checkMapper = (type: any, year: any, kty: any, crv: any) => {
  let crvOrSize = crv;
  if (kty === 'RSA') {
    crvOrSize = 2048;
  }
  const map = mapper[year][type];
  if (map[`${kty} ${crvOrSize}`]) {
    return map[`${kty} ${crvOrSize}`];
  }
  throw new Error(
    `No recommended ${type} alg for ${year}, ${kty}, ${crvOrSize}`
  );
};

export const getRecommendedGenerateKeyType = (
  { kty, crv }: any,
  year: number
) => {
  return checkMapper('generate', year, kty, crv);
};

export const getRecommendedSignatureAlgorithm = (
  { kty, crv }: any,
  year: number
) => {
  return checkMapper('sign', year, kty, crv);
};

export const getRecommendedDeriveSecretAlgorithm = (
  { kty, crv }: any,
  year: number
) => {
  return checkMapper('deriveSecret', year, kty, crv);
};

export const getRecommendedEncryptionAlgorithm = (
  { kty, crv }: any,
  year: number
) => {
  return checkMapper('encrypt', year, kty, crv);
};
