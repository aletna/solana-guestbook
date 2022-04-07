import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import WallClient from "../utils/wallClient";
import wallIdl from "../idl/solana_wall.json";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WALL_PROGRAM_KEY } from "../utils/constants";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Heading from "../components/Heading";
import Posts from "../components/Posts";
import Input from "../components/Input";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { notify_error, notify_success } from "../utils/utils";

const Home: NextPage = () => {
  const connection = useConnection();
  const wallet = useWallet();
  const [posts, setPosts] = useState<
    {
      wallAccount: any;
      message: string;
      name: string;
      author_wallet: string;
      timestamp: string;
      signature: string;
    }[]
  >([]);
  const [client, setClient] = useState<any>();
  const [wallInput, setWallInput] = useState("");
  const [author, setAuthor] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [loadingTxn, setLoadingTxn] = useState(false);

  useEffect(() => {
    if (wallet.wallet && !wallet.publicKey) {
      wallet.connect();
    }
    init();
  }, [wallet, wallet.publicKey]);

  const init = async () => {
    if (!WALL_PROGRAM_KEY) return;

    const _client = new WallClient(
      connection.connection,
      wallet.adapter as any,
      wallIdl as any,
      WALL_PROGRAM_KEY
    );
    setClient(_client);

    // GET LATEST POSTS
    await getLatestPosts(_client);
  };

  const createPost = async (msg: string, name: string) => {
    if (msg.length == 0) {
      // TODO: show popup, also check for length limit in both msg and name
      return;
    }

    setLoadingTxn(true);

    // Airdrop sol if not enough balance
    await handleSolBalance();

    const msgSize = new Blob([msg]).size;
    const nameSize = new Blob([name]).size;

    // make sure message does not exceed 280 bytes and name not 32 bytes
    if (msgSize > 0 && msgSize < 280 && nameSize < 32) {
      if (client && wallet && wallet.publicKey) {
        try {
          await client.initialize(msg, name);
          await getLatestPosts(client);
          closeInput();

          // TODO: handle link to txn
          notify_success("Success! View txn here.");
        } catch {
          notify_error("Ooops something went wrong.");
        } finally {
          setLoadingTxn(false);
        }
      }
    } else {
      notify_error("Please limit your comment to 280 characters.");
      setLoadingTxn(false);
    }
  };

  const getLatestPosts = async (_client: any) => {
    const _posts = await _client.getLastPosts();
    setPosts(_posts);
  };

  const handleSolBalance = async () => {
    const bal = await client.getBalance(wallet.publicKey);
    if (bal / LAMPORTS_PER_SOL < 0.01) {
      try {
        await client.getSol(wallet.publicKey);
      } catch {
        notify_error("Ooops something went wrong.");
      } finally {
        setLoadingTxn(false);
      }
    }
  };

  const handlePostClick = (txn: string) => {
    console.log("txn:", txn);
    window.open(
      `https://explorer.solana.com/tx/${txn}?cluster=devnet`,
      "_blank"
    );
  };

  const handleInputChange = (e: any) => {
    setWallInput(e.target.value);
  };
  const handleAuthorChange = (e: any) => {
    setAuthor(e.target.value);
  };

  const closeInput = () => {
    setWallInput("");
    setAuthor("");
    setShowInput(false);
  };

  return (
    <div>
      <Head>
        <title>guestbook</title>
        <meta name="description" content="dennis guestbook" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-xl mx-auto p-1 md:p-0">
        <Heading
          wallet={wallet}
          setShowInput={setShowInput}
          showInput={showInput}
        />

        {wallet && wallet.publicKey && showInput && (
          <Input
            closeInput={closeInput}
            wallInput={wallInput}
            handleInputChange={handleInputChange}
            author={author}
            handleAuthorChange={handleAuthorChange}
            walletPK={wallet.publicKey}
            createPost={createPost}
            loading={loadingTxn}
          />
        )}
        <Posts posts={posts} handlePostClick={handlePostClick} />
        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
