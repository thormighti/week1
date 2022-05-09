pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

// template Multiplier3 () {  

//    // Declaration of signals.  
//    signal input a;  
//    signal input b;
//    signal input c;
//    //creating an intermediate signal to hold acceptable expresions.
//    signal temp1;
//    signal temp2;
//    temp1 <== a * b;
//    temp2 <== temp1 * c;
//    signal output d;  
 
//    // Constraints.  
//    d <== temp2 ;  
// }

// component main = Multiplier3();

template Multiplier2(){
     /*Code from the previous example.*/
     signal input a;
   signal input b;
   
   signal output out;
   out<== a * b;
}

//This circuit multiplies in1, in2, and in3.
template Multiplier3 () {
   //Declaration of signals and components.
   signal input a;
   signal input b;
   signal input c;
   signal output out;
   component mult1 = Multiplier2();
   component mult2 = Multiplier2();

   //Statements.
   mult1.a <== a;
   mult1.b <== b;
   mult2.a <== mult1.out;
   mult2.b <== c;
   out <== mult2.out;
}

component main = Multiplier3();