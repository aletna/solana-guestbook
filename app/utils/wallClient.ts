import * as anchor from "@project-serum/anchor";
import { Idl, Program, Provider, Wallet } from "@project-serum/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { AccountUtils } from "./account-utils";
import { SolanaWall } from "../types/solana_wall";
import { WALL_PROGRAM_ID, WALL_PROGRAM_KEY } from "./constants";

const { SystemProgram } = anchor.web3; // Added to initialize account

export default class WallClient extends AccountUtils {
  wallet: Wallet;
  provider!: Provider;
  wallProgram!: Program<SolanaWall>;
  idl!: Idl;
  programId!: PublicKey;

  constructor(
    conn: Connection,
    wallet: anchor.Wallet,
    idl: Idl,
    programId: PublicKey
  ) {
    super(conn);
    this.wallet = wallet;
    this.setProvider();
    this.setWallProgram(idl, programId);
  }

  setProvider = () => {
    this.provider = new Provider(
      this.conn,
      this.wallet,
      Provider.defaultOptions()
    );
    anchor.setProvider(this.provider);
  };

  setWallProgram = (idl: Idl, programId: PublicKey) => {
    // instantiating program
    if (idl && programId) {
      this.wallProgram = new Program<SolanaWall>(
        idl as any,
        programId,
        this.provider
      );
    }
  };

  async initialize(message: string, name: string) {
    let wallAccount = Keypair.generate();
    const utf8encodedMessage = Buffer.from(message);
    const utf8encodedName = Buffer.from(name);

    // Execute the RPC call
    const tx = await this.wallProgram.rpc.initialize(
      utf8encodedMessage,
      utf8encodedName,
      {
        accounts: {
          wallAccount: wallAccount.publicKey,
          authority: this.provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [wallAccount],
      }
    );

    console.log(
      `Successfully intialized wall post: ${wallAccount.publicKey} for wallet ${this.provider.wallet.publicKey}`
    );
    return wallAccount;
  }

  async readMessage(publicKey: PublicKey) {
    const account = await this.wallProgram.account.wallAccount.fetch(publicKey);
    console.log(account);
    
    return account;
  }

  getTransactionForAddress = async (publicKey: PublicKey, limit = 1000) => {
    const confirmedSignatureInfo = await this.conn.getSignaturesForAddress(
      new anchor.web3.PublicKey(publicKey),
      { limit }
    );

    const transactionSignatures = confirmedSignatureInfo.map(
      (sigInfo) => sigInfo.signature
    );
    const parsedConfirmedTransactions =
      await this.conn.getParsedConfirmedTransactions(transactionSignatures);
    return parsedConfirmedTransactions;
  };

  getWallAccounts = async (
    publicKey: PublicKey,
    programId: PublicKey,
    limit = 100
  ) => {
    // 1) Find all Tx for this PublicKey
    // 2) Filter to Tx that have programId == our ProgramId
    // 3) Get addresses (pubkeys) for that Tx, separate them into A) Payer, Program, and BlogAccount
    // 4) List the different accounts
    const parsedConfirmedTransactions = await this.getTransactionForAddress(
      publicKey,
      limit
    );

    let wallAccounts: any = [];

    // filter these tx where there are some programIds as pubkey
    parsedConfirmedTransactions.forEach((tx) => {
      // look for Create Account instructions and find the "new Address" from the blogger ID address
      // @ts-ignore
      let instr = tx?.meta?.innerInstructions[0]?.instructions[0]?.parsed;
      if (
        !instr ||
        !(
          instr.type === "createAccount" &&
          instr.info.owner == programId.toString()
        )
      ) {
        return;
      }
      wallAccounts.push(instr.info.newAccount);

      return;
    });

    return wallAccounts;
  };

  getLastPosts = async (limit: number = 100) => {
    const parsedConfirmedTransactions = await this.getTransactionForAddress(
      // @ts-ignore
      WALL_PROGRAM_KEY,
      limit
    );

    const filtered = parsedConfirmedTransactions.filter((tx) =>
      // @ts-ignore
      tx.meta.logMessages.some((msg) => msg.startsWith("Program log:"))
    );

    const postDetails = await Promise.all(
      filtered.map(async (tx) => {
        // @ts-ignore
        let instr = tx?.meta?.innerInstructions[0]?.instructions[0]?.parsed;
        const author_wallet = instr.info.source;
        let wallAccount;
        if (
          instr &&
          instr.type === "createAccount" &&
          instr.info.owner == WALL_PROGRAM_ID
        ) {
          wallAccount = instr.info.newAccount;
        }

        // @ts-ignore
        const timestamp = new Date(tx.blockTime * 1000).toString();
        const account_data: any = await this.readMessage(wallAccount);
        return {
          wallAccount,
          message: account_data.message.toString(),
          name: account_data.name.toString(),
          author_wallet,
          timestamp,
          // @ts-ignore
          signature: tx.transaction.signatures[0],
        };
      })
    );

    return postDetails;
  };
}
