// const base64url = require('base64url');
import jsonld from 'jsonld';
import constants from './constants';
import crypto from 'crypto';

import { JsonWebKey } from '@transmute/json-web-key-2020';

const sha256 = (data: any) => {
  const h = crypto.createHash('sha256');
  h.update(data);
  return h.digest();
};

export interface IJsonWebSignature2020Options {
  key?: any;
  date?: any;
  signer?: any;
}

export class JsonWebSignature2020 {
  public useNativeCanonize: boolean = false;
  public key: any;
  public proof: any;
  public date: any;
  public creator: any;
  public type: string = 'Ed25519Signature2018';
  public signer: any;
  public verifier: any;
  public verificationMethod?: string;
  constructor(options: IJsonWebSignature2020Options = {}) {
    this.signer = options.signer;
    this.date = options.date;
    if (options.key) {
      this.key = options.key;
      const publicKey = this.key.publicNode();
      this.verificationMethod = publicKey.id;

      if (typeof this.key.signer === 'function') {
        this.signer = this.key.signer();
      }
      if (typeof this.key.verifier === 'function') {
        this.verifier = this.key.verifier();
      }
    }
  }

  async canonize(
    input: any,
    { documentLoader, expansionMap, skipExpansion }: any
  ) {
    return jsonld.canonize(input, {
      algorithm: 'URDNA2015',
      format: 'application/n-quads',
      documentLoader,
      expansionMap,
      skipExpansion,
      useNative: this.useNativeCanonize,
    });
  }

  async canonizeProof(proof: any, { documentLoader, expansionMap }: any) {
    // `jws`,`signatureValue`,`proofValue` must not be included in the proof
    // options
    proof = { ...proof };
    delete proof.jws;
    delete proof.signatureValue;
    delete proof.proofValue;
    return this.canonize(proof, {
      documentLoader,
      expansionMap,
      skipExpansion: false,
    });
  }

  async createVerifyData({
    document,
    proof,
    documentLoader,
    expansionMap,
  }: any) {
    // concatenate hash of c14n proof options and hash of c14n document
    const c14nProofOptions = await this.canonizeProof(proof, {
      documentLoader,
      expansionMap,
    });
    const c14nDocument = await this.canonize(document, {
      documentLoader,
      expansionMap,
    });
    return Buffer.concat([sha256(c14nProofOptions), sha256(c14nDocument)]);
  }

  async matchProof({
    proof,
  }: // document,
  // purpose,
  // documentLoader,
  // expansionMap,
  any) {
    // console.log(proof, this.type);
    return proof.type === this.type;
  }

  async updateProof({ proof }: any) {
    // extending classes may do more
    return proof;
  }

  async sign({ verifyData, proof }: any) {
    if (!(this.signer && typeof this.signer.sign === 'function')) {
      throw new Error('A signer API has not been specified.');
    }
    const detachedJws = await this.signer.sign({ data: verifyData });
    proof.jws = detachedJws;
    return proof;
  }

  async createProof({
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: any) {
    // build proof (currently known as `signature options` in spec)
    let proof;
    if (this.proof) {
      // use proof JSON-LD document passed to API
      proof = await jsonld.compact(this.proof, constants.SECURITY_CONTEXT_URL, {
        documentLoader,
        expansionMap,
        compactToRelative: false,
      });
    } else {
      // create proof JSON-LD document
      proof = { '@context': constants.SECURITY_CONTEXT_URL };
    }

    // ensure proof type is set
    proof.type = this.type;

    // set default `now` date if not given in `proof` or `options`
    let date = this.date;
    if (proof.created === undefined && date === undefined) {
      date = new Date();
    }

    // ensure date is in string format
    if (date !== undefined && typeof date !== 'string') {
      date = new Date(date).toISOString();
    }

    // add API overrides
    if (date !== undefined) {
      proof.created = date;
    }
    // `verificationMethod` is for newer suites, `creator` for legacy
    if (this.verificationMethod !== undefined) {
      proof.verificationMethod = this.verificationMethod;
    }
    if (this.creator !== undefined) {
      proof.creator = this.creator;
    }

    // add any extensions to proof (mostly for legacy support)
    proof = await this.updateProof({
      document,
      proof,
      purpose,
      documentLoader,
      expansionMap,
      compactProof,
    });

    // allow purpose to update the proof; the `proof` is in the
    // SECURITY_CONTEXT_URL `@context` -- therefore the `purpose` must
    // ensure any added fields are also represented in that same `@context`
    proof = await purpose.update(proof, {
      document,
      suite: this,
      documentLoader,
      expansionMap,
    });

    // create data to sign
    const verifyData = await this.createVerifyData({
      document,
      proof,
      documentLoader,
      expansionMap,
      compactProof,
    });

    // sign data
    proof = await this.sign({
      verifyData,
      document,
      proof,
      documentLoader,
      expansionMap,
    });

    return proof;
  }

  async getVerificationMethod({ proof, documentLoader }: any) {
    let { verificationMethod } = proof;

    if (!verificationMethod) {
      // backwards compatibility support for `creator`
      const { creator } = proof;
      verificationMethod = creator;
    }

    if (typeof verificationMethod === 'object') {
      verificationMethod = verificationMethod.id;
    }

    if (!verificationMethod) {
      throw new Error('No "verificationMethod" or "creator" found in proof.');
    }

    // Note: `expansionMap` is intentionally not passed; we can safely drop
    // properties here and must allow for it
    const framed = await jsonld.frame(
      verificationMethod,
      {
        // '@context': constants.SECURITY_CONTEXT_URL,
        '@context': constants.SECURITY_CONTEXT_URL,
        '@embed': '@always',
        id: verificationMethod,
      },
      { documentLoader, compactToRelative: false }
    );

    if (!framed) {
      throw new Error(`Verification method ${verificationMethod} not found.`);
    }

    // ensure verification method has not been revoked
    if (framed.revoked !== undefined) {
      throw new Error('The verification method has been revoked.');
    }

    return framed;
  }

  async verifySignature({ verifyData, verificationMethod, proof }: any) {
    let { verifier } = this;
    if (!verifier) {
      const key = await JsonWebKey.from(verificationMethod);
      verifier = key.verifier();
    }
    return verifier.verify({ data: verifyData, signature: proof.jws });
  }

  async verifyProof({
    proof,
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: any) {
    try {
      // create data to verify
      const verifyData = await this.createVerifyData({
        document,
        proof,
        documentLoader,
        expansionMap,
        compactProof,
      });

      // fetch verification method
      const verificationMethod = await this.getVerificationMethod({
        proof,
        document,
        documentLoader,
        expansionMap,
      });

      // verify signature on data
      const verified = await this.verifySignature({
        verifyData,
        verificationMethod,
        document,
        proof,
        documentLoader,
        expansionMap,
      });
      if (!verified) {
        throw new Error('Invalid signature.');
      }

      // ensure proof was performed for a valid purpose
      const purposeResult = await purpose.validate(proof, {
        document,
        suite: this,
        verificationMethod,
        documentLoader,
        expansionMap,
      });

      // console.log(purposeResult);

      if (!purposeResult.valid) {
        throw purposeResult.error;
      }

      return { verified: true, purposeResult };
    } catch (error) {
      return { verified: false, error };
    }
  }

  // /**
  //  * @param linkedDataSigantureType {string} The name of the signature suite.
  //  * @param linkedDataSignatureVerificationKeyType {string} The name verification key type for the signature suite.
  //  *
  //  * @param alg {string} JWS alg provided by subclass.
  //  * @param [LDKeyClass] {LDKeyClass} provided by subclass or subclass
  //  *   overrides `getVerificationMethod`.
  //  *
  //  *
  //  * This parameter is required for signing:
  //  *
  //  * @param [signer] {function} an optional signer.
  //  *
  //  * @param [proofSignatureKey] {string} the property in the proof that will contain the signature.
  //  * @param [date] {string|Date} signing date to use if not passed.
  //  * @param [key] {LDKeyPair} an optional crypto-ld KeyPair.
  //  * @param [useNativeCanonize] {boolean} true to use a native canonize
  //  *   algorithm.
  //  */
  // constructor({
  //   linkedDataSigantureType,
  //   linkedDataSignatureVerificationKeyType,
  //   alg,
  //   LDKeyClass,
  //   signer,
  //   key,
  //   proofSignatureKey,
  //   date,
  //   useNativeCanonize
  // } = {}) {
  //   super({
  //     type: linkedDataSigantureType,
  //     LDKeyClass,
  //     alg,
  //     date,
  //     useNativeCanonize
  //   });
  //   this.alg = alg;
  //   this.LDKeyClass = LDKeyClass;
  //   this.signer = signer;
  //   this.requiredKeyType = linkedDataSignatureVerificationKeyType;
  //   this.proofSignatureKey = proofSignatureKey || "jws";

  //   if (key) {
  //     const publicKey = key.publicNode();
  //     this.verificationMethod = publicKey.id;
  //     this.key = key;
  //     if (typeof key.signer === "function") {
  //       this.signer = key.signer();
  //     }
  //     if (typeof key.verifier === "function") {
  //       this.verifier = key.verifier(key, this.alg, this.type);
  //     }
  //   }

  //   if (this.alg === undefined) {
  //     this.alg = getRecomendedAlg(key.publicKeyJwk);
  //   }
  // }

  // /**
  //  * @param verifyData {Uint8Array}.
  //  * @param proof {object}
  //  *
  //  * @returns {Promise<{object}>} the proof containing the signature value.
  //  */
  // async sign({ verifyData, proof }) {
  //   if (!(this.signer && typeof this.signer.sign === "function")) {
  //     throw new Error("A signer API has not been specified.");
  //   }

  //   proof[this.proofSignatureKey] = await this.signer.sign({
  //     data: verifyData
  //   });
  //   return proof;
  // }

  // /**
  //  * @param verifyData {Uint8Array}.
  //  * @param verificationMethod {object}.
  //  * @param document {object} the document the proof applies to.
  //  * @param proof {object} the proof to be verified.
  //  * @param purpose {ProofPurpose}
  //  * @param documentLoader {function}
  //  * @param expansionMap {function}
  //  *
  //  * @returns {Promise<{boolean}>} Resolves with the verification result.
  //  */
  // async verifySignature({ verifyData, verificationMethod, proof }) {
  //   let { verifier } = this;

  //   if (!verifier) {
  //     const key = await this.LDKeyClass.from(verificationMethod);
  //     verifier = key.verifier(key, this.alg, this.type);
  //   }
  //   return await verifier.verify({
  //     data: Buffer.from(verifyData),
  //     signature: proof[this.proofSignatureKey]
  //   });
  // }

  // async assertVerificationMethod({ verificationMethod }) {
  //   if (!jsonld.hasValue(verificationMethod, "type", this.requiredKeyType)) {
  //     throw new Error(
  //       `Invalid key type. Key type must be "${this.requiredKeyType}".`
  //     );
  //   }
  // }

  // async getVerificationMethod({ proof, documentLoader }) {
  //   if (this.key) {
  //     return this.key.publicNode();
  //   }

  //   const verificationMethod = await super.getVerificationMethod({
  //     proof,
  //     documentLoader
  //   });
  //   await this.assertVerificationMethod({ verificationMethod });
  //   return verificationMethod;
  // }

  // async matchProof({ proof, document, purpose, documentLoader, expansionMap }) {
  //   if (
  //     !(await super.matchProof({
  //       proof,
  //       document,
  //       purpose,
  //       documentLoader,
  //       expansionMap
  //     }))
  //   ) {
  //     return false;
  //   }
  //   if (!this.key) {
  //     // no key specified, so assume this suite matches and it can be retrieved
  //     return true;
  //   }

  //   let { verificationMethod } = proof;
  //   if (!verificationMethod) {
  //     verificationMethod = proof.creator;
  //   }
  //   // only match if the key specified matches the one in the proof
  //   if (typeof verificationMethod === "object") {
  //     return verificationMethod.id === this.key.id;
  //   }
  //   return verificationMethod === this.key.id;
  // }
}
