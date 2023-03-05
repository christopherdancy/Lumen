// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

// import { solidity } from "ethereum-waffle";
import { AttestationStation, ProofofAccess } from "../typechain-types";

// chai.use(solidity);

describe("SigTest", () => {
  let poaContract: ProofofAccess;
  let attestContract: AttestationStation;

  beforeEach(async () => {
    // Get eth signers
    const signers = await ethers.getSigners();
    // prepare the contract for deployment
    const attestationFactory = await ethers.getContractFactory(
      "AttestationStation",
      signers[0]
    );
    const counterFactory = await ethers.getContractFactory(
      "ProofofAccess",
      signers[0]
    );

    // DEPLOY
    attestContract = (await attestationFactory.deploy()) as AttestationStation;
    poaContract = (await counterFactory.deploy(
      attestContract.address
    )) as ProofofAccess;
    await attestContract.deployed();
    await poaContract.deployed();
  });

  describe("test", async () => {
    it("should request and attest", async () => {
      const [requestor, attestor] = await ethers.getSigners();

      await expect(poaContract.connect(requestor).request(attestor.address))
        .to.emit(poaContract, "Requested")
        .withArgs(requestor.address, attestor.address, 1);
      await expect(
        poaContract.connect(attestor).attest(requestor.address, [
          {
            about: attestor.address,
            key: ethers.utils.formatBytes32String("test"),
            val: ethers.utils.formatBytes32String("test"),
          },
        ])
      )
        .to.emit(poaContract, "Attested")
        .withArgs(
          requestor.address,
          attestor.address,
          1,
          (await (await ethers.provider.getBlock("latest")).timestamp) + 1
        );
      // self attestation
      await expect(
        poaContract.connect(attestor).attest(attestor.address, [
          {
            about: attestor.address,
            key: ethers.utils.formatBytes32String("test"),
            val: ethers.utils.formatBytes32String("test"),
          },
        ])
      )
        .to.emit(poaContract, "Attested")
        .withArgs(
          attestor.address,
          attestor.address,
          2,
          (await (await ethers.provider.getBlock("latest")).timestamp) + 1
        );
    });
  });
});
