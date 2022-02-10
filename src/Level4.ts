import { ethers } from 'hardhat';
import { deploy } from './utils';

async function solve() {
  const addr = await deploy('Level4');
  const contract = await ethers.getContractAt('Level4', addr, (await ethers.getSigners())[0]);
  await (await contract.attack({ gasLimit: 100000 })).wait();
}

solve();
