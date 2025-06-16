import {test,expect} from "bun:test";
import { LiteSVM } from "litesvm";
import {
	PublicKey,
	Transaction,
	SystemProgram,
	Keypair,
	LAMPORTS_PER_SOL,
    TransactionInstruction,
} from "@solana/web3.js";

test("one transfer", () => {
	const svm = new LiteSVM();
	const payer = new Keypair();
    const programId = Keypair.generate();
    //loading our contract to local svm
    svm.addProgramFromFile(programId.publicKey,"../target/deploy/cpi_in_solana.so")
	svm.airdrop(payer.publicKey, BigInt(LAMPORTS_PER_SOL));
	const dataAccount = new Keypair;
	let blockhash = svm.latestBlockhash();
    // creating a new dataAccount
	const ixs = [
		SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: dataAccount.publicKey,
            lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
            space: 4,
            programId: programId.publicKey,
        })
	];
	const tx = new Transaction();
	tx.recentBlockhash = blockhash;
	tx.add(...ixs);
    tx.feePayer=payer.publicKey;
	tx.sign(payer,dataAccount);
	svm.sendTransaction(tx);
	
    function doubleIt(){
            const ix2 = new TransactionInstruction({
                keys:[{pubkey: dataAccount.publicKey, isSigner:true,isWritable:true}],
                programId:programId.publicKey,
                data: Buffer.from(""),
            });
            const tx2 = new Transaction();
            blockhash = svm.latestBlockhash();
            tx2.recentBlockhash = blockhash;
            tx2.add(ix2);
            tx2.feePayer=payer.publicKey;
            tx2.sign(payer,dataAccount);
            svm.sendTransaction(tx2);
            svm.expireBlockhash();
        }
    doubleIt();
    doubleIt();
    doubleIt();
    doubleIt();
    const newDataAccount = svm.getAccount(dataAccount.publicKey);
    console.log(newDataAccount?.data);
        expect(newDataAccount?.data[0]).toBe(8);
        expect(newDataAccount?.data[1]).toBe(0);
        expect(newDataAccount?.data[2]).toBe(0);
        expect(newDataAccount?.data[3]).toBe(0);


});