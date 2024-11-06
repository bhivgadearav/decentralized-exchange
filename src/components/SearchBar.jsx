export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tokens"
        className="w-full bg-white text-black rounded-2xl px-4 py-3 pl-10 outline-none"
      />
      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    </div>
  );
}