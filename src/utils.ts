import { ethers } from 'hardhat';

export async function deploy(contractName: string) {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy();
  console.log('Contract address:', contract.address);
  return contract.address;
}
