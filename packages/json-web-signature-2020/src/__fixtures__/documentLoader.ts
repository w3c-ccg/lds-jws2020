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
  'https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v1.json': require('./contexts/lds-jws2020-v1.json'),
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
