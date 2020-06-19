// const jsonld = require('jsonld');
const fetch = require('node-fetch');
const unlockedDID = require('./unlockedDID');

const getJson = async (url: string) =>
  fetch(url, {
    headers: {
      Accept: 'application/ld+json',
    },
    method: 'get',
  }).then((data: any) => data.json());

const localOverrides: any = {
  [unlockedDID.id]: unlockedDID,
  'https://w3id.org/did/v0.11': require('./contexts/did-v0.11.json'),
  // note the absence of:
  // https://w3id.org/security/v1
  // https://w3id.org/security/v2
  // they are never called !
  // leave commented out... does not exit...
  // 'https://w3id.org/security/v3': require('./contexts/security-v3.json'),
  'https://www.w3.org/2018/credentials/v1': require('./contexts/credentials-v1.json'),
  // leave commented out... does not exit...
  // 'https://www.w3.org/2018/credentials/v2': require('./contexts/credentials-v2.json'),
  'https://www.w3.org/2018/credentials/examples/v1': require('./contexts/examples-v1.json'),
  'https://www.w3.org/ns/odrl.jsonld': require('./contexts/odrl.json'),
};

export const documentLoader = async (url: string) => {
  // console.log(url);

  const withoutFragment: string = url.split('#')[0];

  if (localOverrides[withoutFragment]) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: localOverrides[withoutFragment], // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }

  if (url.startsWith('did:')) {
    // TODO: use universal resolver when possible
    const baseUrl = 'https://uniresolver.io/1.0/identifiers/';
    const result = await getJson(baseUrl + url);
    const { didDocument } = result;
    return {
      contextUrl: null, // this is for a context via a link header
      document: didDocument, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  }
  // leave commented out... debugging with remote contexts is not recommended.
  // try {
  //   // console.log('downloading...', url);
  //   const res = await jsonld.documentLoader(url);
  //   return res;
  // } catch (e) {
  //   // eslint-disable-next-line
  //   console.error(`No remote context support for ${url}`);
  // }
  throw new Error(`No custom context support for ${url}`);
};
