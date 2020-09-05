import {
  contexts,
  documentLoaderFactory,
} from '@transmute/jsonld-document-loader';

import { issuer_0 } from './issuer.json';

const golem = documentLoaderFactory.pluginFactory.build({
  contexts: {
    ...contexts.W3C_Decentralized_Identifiers,
    ...contexts.W3C_Verifiable_Credentials,
    ...contexts.W3ID_Security_Vocabulary,
  },
});

golem.addContext({
  'https://example.org/jose/v1': require('./jose-context-v1.json'),
});

golem.addContext({
  'https://w3id.org/security/v2': require('./hack-sec-v2.json'),
});

golem.addResolver({
  [issuer_0.id]: {
    resolve: async (_did: string) => {
      return issuer_0;
    },
  },
});

const documentLoader = golem.buildDocumentLoader();

export { documentLoader };
