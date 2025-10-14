export function Button({ children, iconOnly = false, className = "", bg = true, ...props }) {
  return (
    <button
      {...props}
      className={`
        flex items-center justify-center rounded-md transition
        focus:outline-none focus:ring-2 focus:ring-blue-400
        ${iconOnly ? "w-8 h-8 p-0 text-gray-600 hover:text-gray-800" : ""}
        ${bg && !iconOnly ? "px-4 py-1 bg-blue-600 text-white hover:bg-blue-700 shadow-sm" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
