import { SystemProgram, Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction, clusterApiUrl, LAMPORTS_PER_SOL, TransactionInstruction } from "@solana/web3.js"
import fs from "fs"
import Dotenv from 'Dotenv'
Dotenv.config()
//const { PRIVATE_KEY_xSM, PRIVATE_KEY_R3W } = process.env

async function main() {

    const secret = JSON.parse(process.env.PRIVATE_KEY_R3W ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const ownerKeypair = Keypair.fromSecretKey(secretKey)
    const publicKey = ownerKeypair.publicKey
    console.log("My address: " + publicKey.toBase58())

    const transaction = new Transaction()

    const recipient = new PublicKey("ENTER_RECIPIENT_ADDRESS_HERE")

    // ----------------------------
    // Method 1: Use the SystemProgram.transfer instruction

   /* const sendSolInstruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports: LAMPORTS_PER_SOL * 0.01
    }) */

    //transaction.add(sendSolInstruction)

    // ----------------------------


    // ----------------------------
    // Method 2: Use a custom instruction

    const lamports = BigInt(LAMPORTS_PER_SOL * 0.1)
    const instructionData : Buffer = Buffer.alloc(4+8)
    instructionData.writeUInt32LE(2, 0)
    instructionData.writeBigUInt64LE(lamports, 4)
    const manualInstruction = new TransactionInstruction({
        keys: [
            {
                pubkey: ownerKeypair.publicKey,
                isSigner: true,
                isWritable: true
            },
            {
                pubkey: recipient,
                isSigner: false,
                isWritable: true
            },
        ],
        programId: SystemProgram.programId,
        data: instructionData
    })

    transaction.add(manualInstruction)

    // ----------------------------


    const connection = new Connection(clusterApiUrl('devnet'));

    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [ownerKeypair]
    )
    console.log('signature', signature)
}

main()