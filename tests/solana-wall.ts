import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaWall } from "../target/types/solana_wall";
import { SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("solana-wall", () => {
  const provider = anchor.Provider.local();

  const program = anchor.workspace.SolanaWall as Program<SolanaWall>;

  const wallAccount = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    const msgUtf8Pre = Buffer.from("hello"); // Nodejs buffer here
    const nameUtf8Pre = Buffer.from("dennis"); // Nodejs buffer here

    // TODO: add a test for oversized strings
    // const badNameUtf8Pre = Buffer.from("dennisdennisdennisdennisdennisden"); // Nodejs buffer here

    // const nameBytes = Buffer.byteLength(nameUtf8Pre, "utf-8");
    // console.log(nameBytes);

    try {
      const tx = await program.rpc.initialize(msgUtf8Pre, nameUtf8Pre, {
        accounts: {
          wallAccount: wallAccount.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [wallAccount],
      });
      const account = await program.account.wallAccount.fetch(
        wallAccount.publicKey
      );

      const msgUtf8Post = account.message;
      const nameUtf8Post = account.name;

      // Check it's state was initialized.
      assert.ok(msgUtf8Post.toString() === msgUtf8Pre.toString());
      assert.ok(nameUtf8Post.toString() === nameUtf8Pre.toString());
      console.log("Your transaction signature", tx);
    } catch {}
  });
});
