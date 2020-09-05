# @transmute/json-web-signature

This module is a work in progress, browser friendly version of the Json Web Signature 2020 Linked Data Signature Suite.

This suite requires you be able to overwrite

`https://w3id.org/security/v2`

Not all JSON-LD tooling allows you to do this... see [documentLoader.ts](./src/__fixtures__/documentLoader.ts)

Recommend using https://github.com/transmute-industries/vc.js with this library until other tools migrate to:

`https://w3id.org/security/v3`.

If you do not overwrite the security context, you will see:

`Could not verify any proofs; no proofs matched the required suite and purpose.`
