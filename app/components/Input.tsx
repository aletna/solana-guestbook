import { WalletContextState } from "@solana/wallet-adapter-react";
import { shortenAddress } from "../utils/utils";
import Loading from "./Loading";

type Props = {
  closeInput: () => void;
  wallInput: string;
  handleInputChange: (e: any) => void;
  author: string;
  handleAuthorChange: (e: any) => void;
  wallet: WalletContextState;
  createPost: (msg: string, name: string) => Promise<void>;
  loading: boolean;
};

const Input = ({
  closeInput,
  wallInput,
  handleInputChange,
  author,
  handleAuthorChange,
  wallet,
  createPost,
  loading,
}: Props) => {
  return (
    <div className="mt-4 mb-16 --shaodow rounded-lg relative --box p-8 border-2 border-black">
      <div
        onClick={closeInput}
        className="mb-4 absolute top-2 right-4 text-right cursor-pointer font-bold"
      >
        x
      </div>
      <textarea
        value={wallInput}
        onChange={handleInputChange}
        className="border-2 border-black w-full rounded-lg outline-none mt-4 p-4"
        placeholder="message"
      ></textarea>
      <input
        value={author}
        onChange={handleAuthorChange}
        placeholder="name (optional)"
        className="border-2 border-black w-full rounded-lg outline-none mt-4 p-4"
      />
      <div className="flex justify-between items-center mt-4">
        <div className="font-bold">
          Your Wallet:{" "}
          {
            // @ts-ignore
            shortenAddress(wallet.publicKey.toString())
          }
        </div>
        {!loading ? (
          <button
            onClick={() => createPost(wallInput, author)}
            className="px-6 bg-black py-3 text-white rounded-lg "
          >
            sned it
          </button>
        ) : (
          <div className="py-3 px-6 ">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
