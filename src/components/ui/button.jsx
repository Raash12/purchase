export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
    >
      {children}
    </button>
  );
}
