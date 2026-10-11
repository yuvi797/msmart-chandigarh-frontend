export default function CategoryBar({ categories, active, onSelect }) {
  return (
    <div className="category-bar">
      <button
        className={active === "All" ? "cat-item active" : "cat-item"}
        onClick={() => onSelect("All")}
      >
        <div className="cat-icon">🛍️</div>
        <span>All</span>
      </button>
      {categories.map((c) => (
        <button
          key={c}
          className={active === c ? "cat-item active" : "cat-item"}
          onClick={() => onSelect(c)}
        >
          <div className="cat-icon">{getEmoji(c)}</div>
          <span>{c}</span>
        </button>
      ))}
    </div>
  );
}

function getEmoji(cat) {
  const map = {
    dairy: "🥛",
    fruits: "🍎",
    vegetables: "🥕",
    snacks: "🍿",
    drinks: "🥤",
    bakery: "🍞",
    meat: "🍗",
    grocery: "🛒",
    sweets: "🍬",
    icecream: "🍦",
  };
  return map[cat.toLowerCase()] || "📦";
}