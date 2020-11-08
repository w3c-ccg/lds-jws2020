import {
  documentLoaderFactory,
  contexts,
} from "@transmute/jsonld-document-loader";

import { driver as ed25519Driver} from '@transmute/did-key-ed25519'
import { driver as secp256k1Driver} from '@transmute/did-key-secp256k1'
import { driver as webCryptoDriver} from '@transmute/did-key-web-crypto'

const golem = documentLoaderFactory.pluginFactory.build({
  contexts: {
    ...contexts.W3C_Decentralized_Identifiers,
    ...contexts.W3C_Verifiable_Credentials,
    ...contexts.W3ID_Security_Vocabulary,
  },
});

golem.addContext({
  "https://w3c-ccg.github.io/lds-jws2020/contexts/lds-jws2020-v1.json": require("./contexts/lds-jws2020-v1.json"),
});

golem.addResolver({
  'did:key:': {
    resolve: async (uri) => {
      const { didDocument } = await webCryptoDriver.resolve(uri, {
        accept: 'application/did+json',
      });
      return didDocument;
    },
  },
  'did:key:z6': {
    resolve: async (uri) => {
      const { didDocument } = await ed25519Driver.resolve(uri, {
        accept: 'application/did+json',
      });
      return didDocument;
    },
  },
  'did:key:zQ': {
    resolve: async (uri) => {
      const { didDocument } = await secp256k1Driver.resolve(uri, {
        accept: 'application/did+json',
      });
      return didDocument;
    },
  },
})

const documentLoader = golem.buildDocumentLoader();

export { documentLoader };
