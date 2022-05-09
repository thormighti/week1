const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/

let content = fs.readFileSync("./contracts/HelloWorldVerifier.sol", { encoding: 'utf-8' });
let bumped = content.replace(solidityRegex, 'pragma solidity ^0.8.0');
bumped = bumped.replace(verifierRegex, 'contract HelloWorldVerifier');

fs.writeFileSync("./contracts/HelloWorldVerifier.sol", bumped);

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment

const fs1 = require("fs");
const solidity1Regex = /pragma solidity \^\d+\.\d+\.\d+/

const verifier1Regex = /contract Verifier/

let content1 = fs1.readFileSync("./contracts/Multiplier3Verifier.sol", { encoding: 'utf-8' });
let bumped1 = content.replace(solidity1Regex, 'pragma solidity ^0.8.0');
bumped1 = bumped1.replace(verifier1Regex, 'contract Multiplier3Verifier.sol');

fs1.writeFileSync("./contracts/Multiplier3Verifier.sol", bumped1);