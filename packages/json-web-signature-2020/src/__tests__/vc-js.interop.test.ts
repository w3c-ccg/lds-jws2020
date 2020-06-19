import * as fixtures from '../__fixtures__';
import { JsonWebKey } from '@transmute/json-web-key-2020';
import { JsonWebSignature2020 } from '..';
import { runTests } from './vc-js-tester';

const firstKey = fixtures.unlockedDid.publicKey[1];
const key = new JsonWebKey(firstKey);
const suite = new JsonWebSignature2020({
  key,
  date: '2019-12-11T03:50:55Z',
});

jest.setTimeout(10 * 1000);

describe('JsonWebSignature2020', () => {
  runTests(suite);
});
