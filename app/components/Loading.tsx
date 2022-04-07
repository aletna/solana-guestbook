type Props = {
  light?: boolean;
};

const Loading = ({ light }: Props) => {
  return (
    <div className="flex items-center justify-center space-x-2 animate-pulse">
      <div
        className={`w-4 h-4 ${
          light ? " bg-white" : "bg-[#22223b] "
        } rounded-full`}
      ></div>
      <div
        className={`w-4 h-4 ${
          light ? " bg-white" : "bg-[#22223b] "
        } rounded-full`}
      ></div>
      <div
        className={`w-4 h-4 ${
          light ? " bg-white" : "bg-[#22223b] "
        } rounded-full`}
      ></div>
    </div>
  );
};

export default Loading;
