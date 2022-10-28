import { ethers } from "hardhat";

async function main() {

  const TSPTokenFactory = await ethers.getContractFactory("TSPToken");
  const TSPToken = await TSPTokenFactory.deploy();
  await TSPToken.deployed();
  const [signer] = await ethers.getSigners()
  const recipient = "0xe66904a5318f27880bf1d20D77Ffa8FBdaC5E5E7"
  const amountOut = ethers.utils.parseEther("500000")

  // console.log(`The Startup Place Token Contract Address: ${TSPToken.address}`);
  // console.log(`Signer: ${signer.address}`);
  // console.log(`Balance of sender before transfer: ${ ethers.utils.formatEther(await TSPToken.balanceOf(signer.address))}`);
  // console.log(`Transferring ${ethers.utils.formatEther(amountOut)} to ${recipient}...`);
  await TSPToken.connect(signer).transfer(recipient, amountOut)
  
  // console.log(`Balance of sender after transfer: ${ethers.utils.formatEther(await TSPToken.connect(signer).balanceOf(signer.address))}`);
  // console.log(`Balance of receiver after transfer: ${ethers.utils.formatEther(await TSPToken.connect(recipient).balanceOf(recipient))}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
