import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as vcjs from "@transmute/vc.js";

import {
  JsonWebKey,
  JsonWebSignature,
} from "@transmute/json-web-signature-2020";

import { documentLoader } from "./documentLoader";
import { issuer_0 } from "./issuer.json";
import { vc_template_0 } from "./credential.json";

function App() {
  React.useEffect(() => {
    (async () => {
      console.log("BEGIN SMOKE TEST");
      const seed =
        "9b937b81322d816cfab9d5a3baacc9b2a5febe4b149f126b3630f93a29527017";
      const keyArgs = [
        {
          kty: "OKP",
          crvOrSize: "Ed25519",
          seed: new Uint8Array(Buffer.from(seed, "hex")),
        },
        {
          kty: "EC",
          crvOrSize: "secp256k1",
          seed: new Uint8Array(Buffer.from(seed, "hex")),
        },
        {
          kty: "EC",
          crvOrSize: "P-384",
        },
      ];

      let keypairs = await Promise.all(
        keyArgs.map(async (arg) => {
          const keypair = await JsonWebKey.generate(arg);
          console.log({ keypair });
          return keypair;
        })
      );

      const key = keypairs[0];
      key.id = issuer_0.id + issuer_0.publicKey[0].id;

      const suite = new JsonWebSignature({
        key: key,
        date: vc_template_0.issuanceDate,
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
        documentLoader: async (uri) => {
          const res = await documentLoader(uri);
          // uncomment to debug
          // console.log(res);
          return res;
        },
      });
      console.log({ verifiableCredential });

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
      console.log({ verification });
    })();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.... see console.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
