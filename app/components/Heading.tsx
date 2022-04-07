import { WalletContextState } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { SetStateAction } from "react";
type Props = {
  wallet: WalletContextState;
  setShowInput: (value: SetStateAction<boolean>) => void;
  showInput: boolean;
};
const Heading = ({ wallet, setShowInput, showInput }: Props) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-3xl py-3 text-[#f2e9e4] font-bold ">
        guestbook (devnet)
      </div>
      <div className="hidden md:block">
        {(!wallet || !wallet.publicKey) && (
          <WalletMultiButton
            style={{ backgroundColor: "#f2e9e4 !important" }}
            startIcon={null as any}
          >
            <span
              style={{
                borderRadius: "4px",
              }}
            >
              Connect Wallet
            </span>
          </WalletMultiButton>
        )}
        {wallet && wallet.publicKey && !showInput && (
          <div className="text-right">
            <button
              className="px-6 bg-[#f2e9e4] text-[#22223b] py-3 border-2 border-black --shadow hover:bg-[#c9ada7] transition ease-in-out duration-200 rounded-lg "
              onClick={() => setShowInput(true)}
            >
              leave message
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Heading;
