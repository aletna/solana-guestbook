import * as anchor from "@project-serum/anchor";

export const WALL_PROGRAM_ID = process.env.NEXT_PUBLIC_PK;

export const WALL_PROGRAM_KEY =
  WALL_PROGRAM_ID && new anchor.web3.PublicKey(WALL_PROGRAM_ID);
