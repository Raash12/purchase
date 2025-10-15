export function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition ${className}`}
    />
  );
}
