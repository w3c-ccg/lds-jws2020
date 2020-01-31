const fs = require("fs");
const path = require("path");
const jsonld = require("jsonld");

const contexts = {
  "https://w3id.org/did/v1": require("./contexts/did-v0.11.json"),
  "https://transmute-industries.github.io/lds-jose2020/contexts/lds-jose2020-v0.0.jsonld": JSON.parse(
    fs
      .readFileSync(
        path.resolve(
          __dirname,
          "../../../docs/contexts/lds-jose2020-v0.0.jsonld"
        )
      )
      .toString()
  )
};

const customLoader = url => {
  const context = contexts[url];

  if (context) {
    return {
      contextUrl: null, // this is for a context via a link header
      document: context, // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }

  if (url === "did:example:123") {
    return {
      contextUrl: null, // this is for a context via a link header
      document: require("../../../docs/example/didDoc.json"), // this is the actual document that was loaded
      documentUrl: url // this is the actual context URL after redirects
    };
  }
  return jsonld.documentLoaders.node()(url);
};

module.exports = customLoader;
