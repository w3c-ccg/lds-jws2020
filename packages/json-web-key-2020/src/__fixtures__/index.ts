export const ed25519_keypair = {
  type: 'JsonWebKey2020',
  id: '#_QGEny3zkUVYPNlfjejfjf1sLQTI_BF_Af5mvQJwnt8',
  controller: '',
  publicKeyJwk: {
    crv: 'Ed25519',
    x: '0sdyo5nI9_rW-ZwASjJO62IRNzFkjUkU7HyBnHOrpfQ',
    kty: 'OKP',
    kid: '_QGEny3zkUVYPNlfjejfjf1sLQTI_BF_Af5mvQJwnt8',
  },
  privateKeyJwk: {
    crv: 'Ed25519',
    x: '0sdyo5nI9_rW-ZwASjJO62IRNzFkjUkU7HyBnHOrpfQ',
    d: 'pYZJv0llP8cw4CptUe83cV8OB4r8KqZUwEIO84uMnXI',
    kty: 'OKP',
    kid: '_QGEny3zkUVYPNlfjejfjf1sLQTI_BF_Af5mvQJwnt8',
  },
};

export const ed25519_keypair2 = {
  type: 'JsonWebKey2020',
  id: '#DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o',
  controller: '',
  publicKeyJwk: {
    crv: 'Ed25519',
    x: 'fJ-HI45g-LjZI6poTa122g5u6hRYzPRyJCY5pq9dfSQ',
    kty: 'OKP',
    kid: 'DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o',
  },
  privateKeyJwk: {
    crv: 'Ed25519',
    x: 'fJ-HI45g-LjZI6poTa122g5u6hRYzPRyJCY5pq9dfSQ',
    d: '94-6uUZUPMUuAXzJykpTrGIjKfvAXp6ocKz8ipBYkg4',
    kty: 'OKP',
    kid: 'DTXI1UCGeLHx3B6GmZtMQuR8b3KDdaayEYPJN8iME6o',
  },
};

export const message = Buffer.from('hello world');
export const signature =
  'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..ebhcpMPaE2VNyEA975rny4eWYU3At1_FUPVsWolJJ0vEuErndn3RhEXWDzSi0mjOoWs8sCEa-82K4KSA2A_1Bg';

export const p_384_keypair = {
  type: 'JsonWebKey2020',
  id: '#Ytp2UcPc6kSLcbXN-4wF-JsJtY-tlt18M-u6AkJdta8',
  controller: '',
  publicKeyJwk: {
    crv: 'P-384',
    x: 'C-CY3y0Ph3yw9rNbgfs6SYrT2r_Nae6U6PtX-8hK-URV_F6tFxuJkm-S31OEKBw7',
    y: 'gQuPHoK1gLjIFR3EEphPKmplojdy-LT6YuxWwZD77hzv9lUu8NNYtWzoS2hhwPnv',
    kty: 'EC',
    kid: 'Ytp2UcPc6kSLcbXN-4wF-JsJtY-tlt18M-u6AkJdta8',
  },
  privateKeyJwk: {
    crv: 'P-384',
    x: 'C-CY3y0Ph3yw9rNbgfs6SYrT2r_Nae6U6PtX-8hK-URV_F6tFxuJkm-S31OEKBw7',
    y: 'gQuPHoK1gLjIFR3EEphPKmplojdy-LT6YuxWwZD77hzv9lUu8NNYtWzoS2hhwPnv',
    d: '37IZ9rQRG950c-conOboM6066w43S1LMVHcWkjWcD14BaPusCFZsZhsbrdblL8NM',
    kty: 'EC',
    kid: 'Ytp2UcPc6kSLcbXN-4wF-JsJtY-tlt18M-u6AkJdta8',
  },
};

export const p_384_keypair2 = {
  type: 'JsonWebKey2020',
  id: '#j3k7usPJq1C73Dt4tMaedVjbfV4Dd9n9EpRCvHVA3as',
  controller: '',
  publicKeyJwk: {
    crv: 'P-384',
    x: 'x1_e618IJHBf8EcjWxfEyZgPwUs-2SIZnnArinev_CAtgvFZchBubsUAeqtkkxH9',
    y: 'FI6bMaEQVDttPqfY05wPZOfL18S6_MFPxLTozKJ10UPdK2OCkGoSbYHLxFPeewBN',
    kty: 'EC',
    kid: 'j3k7usPJq1C73Dt4tMaedVjbfV4Dd9n9EpRCvHVA3as',
  },
  privateKeyJwk: {
    crv: 'P-384',
    x: 'x1_e618IJHBf8EcjWxfEyZgPwUs-2SIZnnArinev_CAtgvFZchBubsUAeqtkkxH9',
    y: 'FI6bMaEQVDttPqfY05wPZOfL18S6_MFPxLTozKJ10UPdK2OCkGoSbYHLxFPeewBN',
    d: 'rLqa_o1Yh2fTQsTA5B0gyGFWqLtPZQm11LQAHRwTIMqKKmksYfXjkGa13dhjuf9d',
    kty: 'EC',
    kid: 'j3k7usPJq1C73Dt4tMaedVjbfV4Dd9n9EpRCvHVA3as',
  },
};

export const p_384_secret =
  '6046bf7b97787c5b3c20dc3e8706483b196a590dc35fc735ce3d4d575b53bf6813fbafbda37c73d1f6bf94340ac70da1';
