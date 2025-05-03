const Loader = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-5 w-5",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-indigo-700 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default Loader;
