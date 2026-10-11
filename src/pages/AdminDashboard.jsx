import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "🥛 Dairy & Breakfast",
  "🍎 Fruits & Vegetables",
  "🍿 Snacks & Munchies",
  "🥤 Cold Drinks & Juices",
  "🍞 Bakery & Biscuits",
  "🍗 Meat & Fish",
  "🍬 Sweets & Chocolate",
  "🧴 Soap & Body Care",
  "👕 Fashion & Clothing",
  "🧴 Personal Care",
  "🧹 Home & Cleaning",
  "🧂 Masala & Oil",
  "🍚 Atta, Rice & Dal",
  "🍼 Baby Care",
  "🐾 Pet Care",
  "📦 Other",
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  category: "",
  image: "",
  stock: "",
  unit: "1 pc",
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [tab, setTab] = useState("products");
  const [saving, setSaving] = useState(false);

  const headers = { Authorization: `Bearer ${user.token}` };

  const loadProducts = () =>
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => setProducts(res.data));

  const loadOrders = () =>
    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/all`, { headers })
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp || form.price),
      stock: Number(form.stock),
    };

    try {
      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/products/${editingId}`,
          payload,
          { headers }
        );
        alert("✅ Product updated!");
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/products`, payload, {
          headers,
        });
        alert("✅ Product added!");
      }
      setForm(emptyForm);
      setEditingId(null);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
    setSaving(false);
  };

  const editProduct = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      mrp: p.mrp,
      category: p.category,
      image: p.image,
      stock: p.stock,
      unit: p.unit,
    });
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`, {
      headers,
    });
    loadProducts();
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/orders/${id}/status`,
      { status },
      { headers }
    );
    loadOrders();
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>👑 Admin Dashboard</h1>
        <p>Manage products and orders</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-num">{products.length}</span>
          <span className="stat-label">Products</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{orders.length}</span>
          <span className="stat-label">Orders</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">
            ₹{orders.reduce((s, o) => s + o.totalAmount, 0)}
          </span>
          <span className="stat-label">Revenue</span>
        </div>
      </div>

      <div className="tabs">
        <button
          className={tab === "products" ? "tab active" : "tab"}
          onClick={() => setTab("products")}
        >
          📦 Products
        </button>
        <button
          className={tab === "orders" ? "tab active" : "tab"}
          onClick={() => setTab("orders")}
        >
          🧾 Orders
        </button>
      </div>

      {tab === "products" && (
        <>
          <form className="product-form" onSubmit={submit}>
            <h3>{editingId ? "✏️ Edit Product" : "➕ Add New Product"}</h3>
            <div className="form-grid">
              <input
                placeholder="Product Name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              >
                <option value="">-- Select Category --</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Selling Price ₹ *"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="MRP ₹ (optional)"
                value={form.mrp}
                onChange={(e) => setForm({ ...form, mrp: e.target.value })}
              />
              <input
                type="number"
                placeholder="Stock Quantity *"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
              <input
                placeholder="Unit (500g, 1kg, 1 pc)"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              />
              <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
            />
            <div className="form-actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="cancel"
                  onClick={() => {
                    setForm(emptyForm);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <h3 className="section-title">All Products ({products.length})</h3>
          <div className="admin-products">
            {products.length === 0 && <p>No products yet. Add one above.</p>}
            {products.map((p) => (
              <div key={p._id} className="admin-row">
                <img src={p.image || "https://via.placeholder.com/50"} alt="" />
                <div className="info">
                  <strong>{p.name}</strong>
                  <span className="cat-tag">{p.category}</span>
                </div>
                <span className="price-tag">₹{p.price}</span>
                <span
                  className={p.stock > 0 ? "stock-tag ok" : "stock-tag low"}
                >
                  Stock: {p.stock}
                </span>
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => editProduct(p)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="del-btn"
                    onClick={() => deleteProduct(p._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "orders" && (
        <div className="orders-list">
          {orders.length === 0 && <p>No orders yet.</p>}
          {orders.map((o) => (
            <div key={o._id} className="order-card admin-order">
              <div className="order-head">
                <span className="order-id">
                  #{o._id.slice(-6).toUpperCase()}
                </span>
                <span className={`status ${o.status}`}>{o.status}</span>
              </div>
              <div className="order-customer">
                <span>👤 {o.user?.name}</span>
                <span>📞 {o.phone}</span>
              </div>
              <p className="order-addr">📍 {o.address}</p>
              <div className="order-items">
                {o.items.map((it, i) => (
                  <div key={i} className="order-item">
                    <span>
                      {it.name} × {it.qty}
                    </span>
                    <span>₹{it.price * it.qty}</span>
                  </div>
                ))}
              </div>
              <div className="order-foot">
                <span className="order-total">Total: ₹{o.totalAmount}</span>
              </div>
              <div className="status-actions">
                <button
                  className="s-confirmed"
                  onClick={() => updateStatus(o._id, "confirmed")}
                >
                  ✅ Confirm
                </button>
                <button
                  className="s-delivered"
                  onClick={() => updateStatus(o._id, "delivered")}
                >
                  📦 Delivered
                </button>
                <button
                  className="s-cancelled"
                  onClick={() => updateStatus(o._id, "cancelled")}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}