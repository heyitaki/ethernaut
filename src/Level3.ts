import { ethers } from 'hardhat';

async function solve() {
  const addr = '0x6AA5a3f7929cA92FeF5f293cE14811214bb84d92';
  const contract = await ethers.getContractAt('Level3', addr, (await ethers.getSigners())[0]);
  for (let i = 0; i < 10; i++) {
    await (await contract.flip({ gasLimit: 100000 })).wait();
  }
}

solve();
