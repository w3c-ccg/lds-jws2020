const localOverrides: any = {
  'https://www.w3.org/ns/did/v1': require('./__fixtures__/contexts/did-v1.json'),
  'https://www.w3.org/2018/credentials/v1': require('./__fixtures__/contexts/credentials-v1.json'),
  'https://identity.foundation/.well-known/contexts/did-configuration-v0.0.jsonld': require('./__fixtures__/contexts/did-configuration-v0.json'),
  'did:example:alice': require('./__fixtures__/alice.json'),
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

  throw new Error(`No custom context support for ${url}`);
};
