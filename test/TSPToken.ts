import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { assert } from "chai";
import { ethers } from "hardhat";
import { TSPToken } from "../typechain-types";

describe("TSPToken Contract", () => {
  const TSPTokenFixture = async () => {
    const [owner] = await ethers.getSigners();
    const TSPTokenFactory = await ethers.getContractFactory("TSPToken");
    const TSPContract: TSPToken = await TSPTokenFactory.deploy();
    await TSPContract.deployed();
  const recipient = "0xe66904a5318f27880bf1d20D77Ffa8FBdaC5E5E7"


    return { TSPContract, owner, recipient };
  };

  describe("mint", () => {
    it("Should mint total supply to signer", async () => {
      const { TSPContract, owner } = await loadFixture(
        TSPTokenFixture
      );
      const ownerBalance = await TSPContract.balanceOf(owner.address);
      assert.equal(Number(ethers.utils.formatEther(ownerBalance)), 1000000);
    })
  })

  describe("send tokens", () => {
    it("Should send tokens to recipient", async () => {
      const { TSPContract, owner, recipient } = await loadFixture(
        TSPTokenFixture
      );
      const amountOut = ethers.utils.parseEther("500000")
      await TSPContract.connect(owner).transfer(recipient, amountOut)
      const ownerBalance = await TSPContract.balanceOf(owner.address);
      assert.equal(Number(ethers.utils.formatEther(ownerBalance)), 500000);
    })
  })

  describe("receive tokens", () => {
    it("Should receive tokens from sender", async () => {
      const { TSPContract, owner, recipient } = await loadFixture(
        TSPTokenFixture
      );
      const amountOut = ethers.utils.parseEther("500000")
      await TSPContract.connect(owner).transfer(recipient, amountOut)
      const recipientBalance = ethers.utils.formatEther(await TSPContract.connect(recipient).balanceOf(recipient));
      assert.equal(Number(recipientBalance), 500000);
    })
  })
})