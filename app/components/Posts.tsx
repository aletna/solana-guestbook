import { shortenAddress } from "../utils/utils";

type Props = {
  posts: {
    wallAccount: any;
    message: string;
    name: string;
    author_wallet: string;
    timestamp: string;
    signature: string;
  }[];
  handlePostClick: (txn: string) => void;
};

const Posts = ({ posts, handlePostClick }: Props) => {
  return (
    <>
      {posts.map((post, key) => (
        <div
          key={key}
          onClick={() => handlePostClick(post.signature)}
          className="my-4 cursor-pointer rounded-lg --box  p-8 --engraved-div"
        >
          <div>{post.message}</div>
          <div className="pt-4 font-bold text-right">
            {post.name ? post.name : shortenAddress(post.author_wallet)}
          </div>
          <div className="pt-4 text-xs italic text-right">{post.timestamp}</div>
        </div>
      ))}
    </>
  );
};

export default Posts;
