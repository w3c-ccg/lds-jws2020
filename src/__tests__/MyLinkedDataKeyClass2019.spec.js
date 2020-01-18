const base64url = require("base64url");
const { MyLinkedDataKeyClass2019 } = require("../index");
const { myLdKey } = require("./__fixtures__");

const key = new MyLinkedDataKeyClass2019(myLdKey);
const { sign } = key.signer();
const { verify } = key.verifier();
const data = new Uint8Array([128]);

describe("MyLinkedDataKeyClass2019", () => {
  it("generate", async () => {
    let myLdKey = await MyLinkedDataKeyClass2019.generate("OKP", "Ed25519", {
      id: "test-id",
      type: "test-type",
      controller: "test-controller"
    });

    expect(myLdKey.id).toBe("test-id");
    expect(myLdKey.type).toBe("test-type");
    expect(myLdKey.controller).toBe("test-controller");

    expect(myLdKey.privateKeyJwk).toBeDefined();
    expect(myLdKey.publicKeyJwk).toBeDefined();
  });

  it("sign", async () => {
    expect(typeof sign).toBe("function");
    const signature = await sign({ data });

    const [encodedHeader, encodedSignature] = signature.split("..");
    const header = JSON.parse(base64url.decode(encodedHeader));
    expect(header.b64).toBe(false);
    expect(header.crit).toEqual(["b64"]);
    expect(encodedSignature).toBeDefined();
  });

  it("verify", async () => {
    expect(typeof verify).toBe("function");
    const signature =
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..OOFITVPSJ2gi6LxxpKXsicLIVP3DEL2MuHkwiokCUjDNgk8yBtFV4C1fnJJMzzE4LlXSdpyyCCeisjTufrCFCA";
    const result = await verify({
      data,
      signature
    });
    expect(result).toBe(true);
  });
});
