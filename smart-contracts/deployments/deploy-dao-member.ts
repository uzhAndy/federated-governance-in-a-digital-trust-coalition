import { ethers } from "hardhat";

async function main() {
  const compiledSmartContract = await ethers.getContractFactory(
    "CredentialDAO"
  );
  const deployed = await compiledSmartContract.deploy();
  console.log("Contract Deployed to Address:", deployed.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
