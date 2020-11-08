import React from "react";

import * as vcjs from "@transmute/vc.js";

import {
  JsonWebKey,
  JsonWebSignature,
} from "@transmute/json-web-signature-2020";

import { documentLoader } from "./documentLoader";

import { vc_template_0 } from "./credential.json";

import {keys} from './keys'

function App() {
  const [state, setState] = React.useState({results: []})
  React.useEffect(() => {
    (async () => {
      const results = [];
      await Promise.all(keys.map(async(key)=>{
        const keypair = await JsonWebKey.from(key);

      keypair.id = keypair.controller + keypair.id

      const suite = new JsonWebSignature({
        key: keypair,
        date: vc_template_0.issuanceDate,
      });

      const verifiableCredential = await vcjs.ld.issue({
        credential: {
          ...vc_template_0,
          issuer: {
            ...vc_template_0.issuer,
            id: keypair.controller,
          },
        },
        suite,
        documentLoader: async (uri) => {
          const res = await documentLoader(uri);
          // uncomment to debug
          // console.log(res);
          return res;
        },
      });
      const verification = await vcjs.ld.verifyCredential({
        credential: { ...verifiableCredential },
        suite: new JsonWebSignature(),
        documentLoader: async (uri) => {
          const res = await documentLoader(uri);
          // uncomment to debug
          // console.log(res);
          return res;
        },
      });
      results.push({
        key, verifiableCredential, verification
      })
      }));
      setState({results})
      console.log('results: ', results)

    })();
  }, []);
  return (
    <div className="App">
      See console.
      {
        state.results.map((result)=>{
          return (<div key={result.key.publicKeyJwk.kty}>
            <h3>{result.key.publicKeyJwk.crv} {result.key.publicKeyJwk.kty}, Verified: {JSON.stringify(result.verification.verified)}</h3>
            <pre>{JSON.stringify(result.verifiableCredential, null, 2)}</pre>
          </div>)
        })
      }
    </div>
  );
}

export default App;
