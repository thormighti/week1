const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");
const { plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");//Prooving the circuit.

        console.log('1x2 =',publicSignals[0]); //output the result of the proof

        const editedPublicSignals = unstringifyBigInts(publicSignals);//convert from string to large integers
        const editedProof = unstringifyBigInts(proof);//convert from string to big integers
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);//converting the editedproof and editedpublicsignals into arguments of the verifyProof function.
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString()); //changing the arrays of value in call data into big integers.
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]]; // values in call data to be proven
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true; //  retuns true if the proof and the inputs are valid
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifiergroth16;
    let verifiergroth16;
    beforeEach(async function () {
    
        //[assignment] insert your script here
         
        Verifiergroth16 = await ethers.getContractFactory("Multiplier3Verifier");
        verifiergroth16 = await Verifiergroth16.deploy();
        await verifiergroth16.deployed();
    
    });

  
        it("Should return true for correct proof", async function () {
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"5"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");

        console.log('1x2x5 =',publicSignals[0]);

        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
    
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const d = [argv[8]];
        const Input = argv.slice(9);

        expect(await verifiergroth16.verifyProof(a, b, c,d, Input)).to.be.true;
    });
    
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
         let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0];
        //let e =[0];
        expect(await verifiergroth16.verifyProof(a, b, c, d)).to.be.false;
    
    });
});


describe("Multiplier3 with PLONK", function () {

  
    let Verifierplonk;
    let verifierplonk;
    beforeEach(async function () {
    
        //[assignment] insert your script here
         
        Verifierplonk = await ethers.getContractFactory("_plonkMultiplier3");
        verifierplonk = await Verifierplonk.deploy();
        await verifierplonk.deployed();
    
    });

  
        it("Should return true for correct proof", async function () {
        const { proof, publicSignals } = await plonk.fullProve({"a":"7","b":"10","c":"2"}, "contracts/circuits/_plonkMultiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/_plonkMultiplier3/circuit_final.zkey");

        console.log('7x10x2 =',publicSignals[0]);

         
        var callText = fs.readFileSync("contracts/circuits/_plonkMultiplier3/call.txt", 'utf-8');
        var calldata = callText.split(',');
        //console.log(calldata);
        expect(await verifierplonk.verifyProof(calldata[0], JSON.parse(calldata[1]))).to.be.true;

    
      
        //console.log(calldata);

       // expect(await verifierplonk.verifyProof(calldata[0], JSON.parse(calldata[1]))).to.be.true;
    });
    
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = '0x00';
        let b = ['0'];
        //let e =[0];
        expect(await verifierplonk.verifyProof(a, b )).to.be.false;
    
    });
});