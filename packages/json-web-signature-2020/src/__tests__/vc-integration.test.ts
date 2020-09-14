import * as vcjs from '@transmute/vc.js';

import { JsonWebKey } from '../JsonWebKey';
import { JsonWebSignature } from '../JsonWebSignature';

import {
  keypair_0,
  vc_template_0,
  issuer_0,
  vc_0,
  documentLoader,
} from '../__fixtures__';

it('can issue', async () => {
  const keypair = await JsonWebKey.from({
    ...keypair_0,
    id: issuer_0.id + keypair_0.id,
  });
  const suite = new JsonWebSignature({
    key: keypair,
    date: '2019-12-11T03:50:55Z',
  });
  const verifiableCredential = await vcjs.ld.issue({
    credential: {
      ...vc_template_0,
      issuer: {
        ...vc_template_0.issuer,
        id: issuer_0.id,
      },
    },
    suite,
    documentLoader: async (uri: string) => {
      const res = await documentLoader(uri);
      // uncomment to debug
      // console.log(res)
      return res;
    },
  });
  expect(verifiableCredential).toEqual(vc_0);
});

it('can verify', async () => {
  const verification = await vcjs.ld.verifyCredential({
    credential: { ...vc_0 },
    suite: new JsonWebSignature(),
    documentLoader: async (uri: string) => {
      const res = await documentLoader(uri);
      // uncomment to debug
      // console.log(res)
      return res;
    },
  });
  // uncomment to debug
  // console.log(JSON.stringify(verification, null, 2));
  expect(verification.verified).toBe(true);
});
