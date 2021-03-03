const { JsonWebKey, JsonWebSignature } = require('../dist');

const vcjs = require('@transmute/vc.js').ld;

const documentLoader = uri => {
  if (uri === 'https://www.w3.org/ns/did/v1') {
    return {
      documentUrl: uri,
      document: require('../src/__fixtures__/contexts/did-v1.json'),
    };
  }
  if (uri === 'https://www.w3.org/2018/credentials/v1') {
    return {
      documentUrl: uri,
      document: require('../src/__fixtures__/contexts/cred-v1.json'),
    };
  }
  if (
    uri === 'https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v1.json'
  ) {
    return {
      documentUrl: uri,
      document: require('../src/__fixtures__/contexts/lds-jws2020-v1.json'),
    };
  }
  if (uri === 'https://w3id.org/security/v2') {
    return {
      documentUrl: uri,
      document: require('../src/__fixtures__/contexts/sec-v2.json'),
    };
  }
  if (uri === 'https://w3id.org/security/v1') {
    return {
      documentUrl: uri,
      document: require('../src/__fixtures__/contexts/sec-v1.json'),
    };
  }

  console.log(uri);
  throw new Error('unsupported context');
};

(async () => {
  const vc = await vcjs.issue({
    credential: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v1.json',
      ],
      id: 'http://example.gov/credentials/3732',
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      issuer: {
        id: 'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
      },
      issuanceDate: '2020-03-10T04:24:12.164Z',
      credentialSubject: {
        id: 'did:example:456',
      },
    },
    suite: new JsonWebSignature({
      key: await JsonWebKey.from({
        id:
          'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35#z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
        type: 'JsonWebKey2020',
        controller: 'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
        publicKeyJwk: {
          crv: 'Ed25519',
          x: 'fnwl8GAH_K2uHFjQLxQmKq826Mg-DznY4Wmex-LFhYA',
          kty: 'OKP',
        },
        privateKeyJwk: {
          crv: 'Ed25519',
          d: 'gJE_1hJ0MimxW7I0hqZoIuOg37KnQkkJex_zl1VlrIY',
          x: 'fnwl8GAH_K2uHFjQLxQmKq826Mg-DznY4Wmex-LFhYA',
          kty: 'OKP',
        },
      }),
    }),
    documentLoader,
  });

  const verification = await vcjs.verifyCredential({
    credential: vc,
    suite: new JsonWebSignature(),
    documentLoader: uri => {
      if (
        uri.includes('did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35')
      ) {
        return {
          documentUrl: uri,
          document: {
            '@context': [
              'https://www.w3.org/ns/did/v1',
              'https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v1.json',
              {
                '@base':
                  'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
              },
            ],
            id: 'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
            publicKey: [
              {
                id:
                  'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35#z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
                type: 'JsonWebKey2020',
                controller:
                  'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
                publicKeyJwk: {
                  crv: 'Ed25519',
                  x: 'fnwl8GAH_K2uHFjQLxQmKq826Mg-DznY4Wmex-LFhYA',
                  kty: 'OKP',
                },
              },
            ],
            assertionMethod: [
              'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35#z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
            ],
            authentication: [
              'did:key:z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35#z6Mkny1DHkp7ySQVeR1omUY8NTWsFf77bSc1TbEV2KTZBX35',
            ],
          },
        };
      }
      return documentLoader(uri);
    },
  });
  console.log(verification);
})();
