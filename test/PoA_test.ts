// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

// import { solidity } from "ethereum-waffle";
import { ProofofAccess } from "../typechain-types";

// chai.use(solidity);

describe("SigTest", () => {
  let poaContract: ProofofAccess;

  beforeEach(async () => {
    // Get eth signers
    const signers = await ethers.getSigners();
    // prepare the contract for deployment
    const counterFactory = await ethers.getContractFactory(
      "ProofofAccess",
      signers[0]
    );

    // DEPLOY
    poaContract = (await counterFactory.deploy()) as ProofofAccess;
    await poaContract.deployed();
  });

  describe("test", async () => {
    it("should request and attest", async () => {
      const [requestor, attestor] = await ethers.getSigners();

      await expect(poaContract.connect(requestor).request(attestor.address))
        .to.emit(poaContract, "Requested")
        .withArgs(requestor.address, attestor.address, 1);
      await expect(poaContract.connect(attestor).attest(requestor.address))
        .to.emit(poaContract, "Attested")
        .withArgs(
          requestor.address,
          attestor.address,
          1,
          (await (await ethers.provider.getBlock("latest")).timestamp) + 1
        );
    });
  });
});
