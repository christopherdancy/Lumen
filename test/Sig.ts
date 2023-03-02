// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// import { expect } from "chai";
// import chai from "chai";
// import { ethers } from "hardhat";

// import {solidity} from "ethereum-waffle";
// import {SigTest} from "../typechain/SigTest";

// chai.use(solidity);

// describe("SigTest", () => {
//     let sigTest: SigTest;

//     beforeEach(async () => {
//         // Get eth signers
//         const signers = await ethers.getSigners();
//         // prepare the contract for deployment
//         const counterFactory = await ethers.getContractFactory(
//             "SigTest",
//             signers[0]
//         );

//         // DEPLOY
//         sigTest = (await counterFactory.deploy()) as SigTest;
//         await sigTest.deployed();
//     });

//     describe("test", async () => {
//         it("test basic signing from client", async () => {
//             const [adminWallet, userWallet] = await ethers.getSigners();
//             const timestamp = Date.now();

//             // STEP 1:
//             // building hash has to come from system address
//             // 32 bytes of data
//             let messageHash = ethers.utils.solidityKeccak256(
//                 ["address", "uint"],
//                 [adminWallet.address, timestamp]
//             );

//             // STEP 2: 32 bytes of data in Uint8Array
//             let messageHashBinary = ethers.utils.arrayify(messageHash);

//             // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
//             let signature = await adminWallet.signMessage(messageHashBinary);

//             // STEP 4: Fire off the transaction with the adminWallet signed data
//             await sigTest.connect(adminWallet).isDataValid(timestamp, signature);
//         });
//     });
// });
