import { JsonWebKeyPair, VcTemplate, Vc, Issuer } from '../types';
import { documentLoader } from './documentLoader';
import seed_fixtures from './seed.json';
import keypair_fixtures from './keypair.json';
import message_fixtures from './message.json';
import signature_fixtures from './signature.json';
import credential_fixtures from './credential.json';
import issuer_fixtures from './issuer.json';

const seed_0 = seed_fixtures.seed_0 as string;

const keypair_0 = keypair_fixtures.keypair_0 as JsonWebKeyPair;
const keypair_1 = keypair_fixtures.keypair_1 as JsonWebKeyPair;
const keypair_2 = keypair_fixtures.keypair_2 as JsonWebKeyPair;

const message_0 = message_fixtures.message_0 as string;

const signature_0 = signature_fixtures.signature_0 as string;
const signature_1 = signature_fixtures.signature_1 as string;

const vc_template_0 = credential_fixtures.vc_template_0 as VcTemplate;
const vc_0 = credential_fixtures.vc_0 as Vc;
const issuer_0 = issuer_fixtures.issuer_0 as Issuer;

export {
  seed_0,
  keypair_0,
  keypair_1,
  keypair_2,
  message_0,
  signature_0,
  signature_1,
  vc_template_0,
  vc_0,
  issuer_0,
  documentLoader,
};
