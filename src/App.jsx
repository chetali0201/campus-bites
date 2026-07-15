import { useState, useEffect, useContext, createContext, useRef, useCallback } from "react";

// ─── CONTEXTS ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const CartContext = createContext(null);
const NotifContext = createContext(null);
const OrdersContext = createContext(null);
const FoodsContext = createContext(null);

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const OG = "#FF5722";
const OG2 = "#FF8A65";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const validateEmail = (e) => EMAIL_REGEX.test(e) && e.includes(".com");

const CATS = [
  { id: "chinese", label: "Chinese", emoji: "🥢", color: "#FF5722", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&q=80" },
  { id: "south_indian", label: "South Indian", emoji: "🫓", color: "#F59E0B", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300&q=80" },
  { id: "snacks", label: "Snacks", emoji: "🍟", color: "#EF4444", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80" },
  { id: "drinks", label: "Drinks", emoji: "🧋", color: "#8B5CF6", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&q=80" },
  { id: "maggi", label: "Maggi", emoji: "🍝", color: "#F97316", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80" },
  { id: "sandwiches", label: "Sandwiches", emoji: "🥪", color: "#06B6D4", img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=300&q=80" },
  { id: "pizza", label: "Pizza", emoji: "🍕", color: "#DC2626", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80" },
  { id: "combos", label: "Combos", emoji: "🎁", color: "#EC4899", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80" },
];

const INIT_FOODS = [
  { id: 1, name: "Classic Burger", cat: "snacks", desc: "Juicy beef patty, lettuce, tomato & secret sauce in a brioche bun", price: 89, rating: 4.5, tag: "popular", veg: false, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
  { id: 2, name: "Margherita Pizza", cat: "pizza", desc: "Classic tomato base, fresh mozzarella & garden-fresh basil", price: 149, rating: 4.4, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80" },
  { id: 3, name: "Veg Manchurian", cat: "chinese", desc: "Crispy veggie balls in tangy manchurian gravy with spring onions", price: 79, rating: 4.4, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=500&q=80" },
  { id: 4, name: "Fried Rice", cat: "chinese", desc: "Wok-tossed rice with fresh vegetables & soy sauce, egg optional", price: 89, rating: 4.2, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80" },
  { id: 5, name: "Hakka Noodles", cat: "chinese", desc: "Stir-fried noodles with crunchy bell peppers & sweet soy sauce", price: 79, rating: 4.3, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&q=80" },
  { id: 6, name: "Paneer Chilli", cat: "chinese", desc: "Crispy paneer cubes tossed in spicy chilli-garlic sauce", price: 99, rating: 4.6, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80" },
  { id: 7, name: "Masala Dosa", cat: "south_indian", desc: "Crispy paper-thin dosa with spiced potato filling, sambar & 2 chutneys", price: 69, rating: 4.7, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80" },
  { id: 8, name: "Idli Sambar", cat: "south_indian", desc: "Fluffy steamed rice cakes with hot sambar & coconut chutney", price: 49, rating: 4.5, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&q=80" },
  { id: 9, name: "French Fries", cat: "snacks", desc: "Golden crispy fries seasoned with sea salt & herbs", price: 59, rating: 4.3, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80" },
  { id: 10, name: "Veg Sandwich", cat: "sandwiches", desc: "Fresh garden veggies & cheese in herb-butter toasted bread", price: 59, rating: 4.2, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&q=80" },
  { id: 11, name: "Club Sandwich", cat: "sandwiches", desc: "Triple-layer toasted sandwich with egg, cheese, lettuce & tomato", price: 89, rating: 4.5, tag: "popular", veg: false, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80" },
  { id: 12, name: "Steamed Momos", cat: "snacks", desc: "Pillowy soft dumplings stuffed with spiced vegetables & herbs", price: 69, rating: 4.6, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&q=80" },
  { id: 13, name: "Maggi Noodles", cat: "maggi", desc: "The iconic 2-minute masala noodles, a campus staple", price: 39, rating: 4.1, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80" },
  { id: 14, name: "Masala Maggi", cat: "maggi", desc: "Maggi loaded with onions, tomatoes, veggies & extra masala", price: 49, rating: 4.3, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80" },
  { id: 15, name: "Hot Coffee", cat: "drinks", desc: "Freshly brewed dark roast coffee with microfoam milk art", price: 39, rating: 4.5, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80" },
  { id: 16, name: "Cold Coffee", cat: "drinks", desc: "Chilled blended espresso with rich cream & chocolate drizzle", price: 59, rating: 4.7, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80" },
  { id: 17, name: "Fresh Lime Soda", cat: "drinks", desc: "Freshly squeezed lime with mint, soda & a hint of chaat masala", price: 29, rating: 4.2, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&q=80" },
  { id: 18, name: "Mango Lassi", cat: "drinks", desc: "Thick yogurt smoothie blended with Alphonso mango pulp", price: 49, rating: 4.6, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=500&q=80" },
  { id: 19, name: "Chicken Burger", cat: "snacks", desc: "Crunchy fried chicken thigh with sriracha mayo & pickled slaw", price: 109, rating: 4.6, tag: "trending", veg: false, img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80" },
  { id: 20, name: "Cappuccino", cat: "drinks", desc: "Velvety espresso with perfectly steamed milk & latte art", price: 69, rating: 4.8, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=500&q=80" },
  { id: 21, name: "Burger + Fries Combo", cat: "combos", desc: "Classic burger with golden fries — the unbeatable campus duo", price: 129, rating: 4.7, tag: "popular", veg: false, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
  { id: 22, name: "Noodles + Drink Combo", cat: "combos", desc: "Hakka noodles with your choice of cold coffee or lime soda", price: 109, rating: 4.5, tag: "trending", veg: true, img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&q=80" },
  { id: 23, name: "Paneer Pizza", cat: "pizza", desc: "Spiced paneer tikka on a garlic base with mozzarella & capsicum", price: 169, rating: 4.5, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80" },
  { id: 24, name: "Aloo Paratha", cat: "snacks", desc: "Crispy golden flatbread stuffed with spiced potato & served with curd", price: 59, rating: 4.4, tag: "popular", veg: true, img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&q=80" },
];

const INIT_ORDERS = [
  { id: "CB104291", user: "Rahul S.", items: [{ name: "Classic Burger", qty: 1, price: 89, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" }, { name: "Cold Coffee", qty: 2, price: 59, img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80" }], total: 207, status: "Preparing", time: "10:32 AM", mins: 8 },
  { id: "CB104290", user: "Priya M.", items: [{ name: "Masala Dosa", qty: 2, price: 69, img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80" }], total: 138, status: "Placed", time: "10:28 AM", mins: 12 },
  { id: "CB104289", user: "Arjun K.", items: [{ name: "Paneer Chilli", qty: 1, price: 99, img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80" }], total: 196, status: "Ready", time: "10:15 AM", mins: 0 },
  { id: "CB104288", user: "Sneha R.", items: [{ name: "Cappuccino", qty: 1, price: 69, img: "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=400&q=80" }], total: 69, status: "Completed", time: "10:05 AM", mins: 0 },
];

const STATUS_COLORS = {
  Placed: { bg: "#FFF3E0", color: "#F57C00" },
  Accepted: { bg: "#E3F2FD", color: "#1565C0" },
  Preparing: { bg: "#FFF8E1", color: "#F9A825" },
  Ready: { bg: "#E8F5E9", color: "#2E7D32" },
  Completed: { bg: "#F3E5F5", color: "#6A1B9A" },
};
const STATUS_FLOW = { Placed: "Accepted", Accepted: "Preparing", Preparing: "Ready", Ready: "Completed" };

// ─── GLOBAL CSS ────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Syne:wght@700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
::-webkit-scrollbar{display:none;}
body{background:#111;font-family:'Plus Jakarta Sans',sans-serif;}
@keyframes toastIn{from{opacity:0;transform:translateY(-20px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{0%{transform:scale(0)}70%{transform:scale(1.18)}100%{transform:scale(1)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.45}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes glow{0%,100%{box-shadow:0 0 12px rgba(34,197,94,.5),0 0 24px rgba(34,197,94,.2)}50%{box-shadow:0 0 24px rgba(34,197,94,.8),0 0 48px rgba(34,197,94,.4)}}
@keyframes glowOrange{0%,100%{box-shadow:0 0 12px rgba(255,87,34,.4)}50%{box-shadow:0 0 28px rgba(255,87,34,.8)}}
@keyframes ripple{to{transform:scale(5);opacity:0}}
@keyframes slideIn{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
@keyframes confetti{0%{transform:translateY(0) rotate(0) scale(1);opacity:1}100%{transform:translateY(-180px) rotate(720deg) scale(0.5);opacity:0}}
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
@keyframes float{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-16px) rotate(3deg)}}
@keyframes ring{0%,100%{transform:rotate(0) scale(1)}25%{transform:rotate(-20deg) scale(1.1)}75%{transform:rotate(20deg) scale(1.1)}}
@keyframes successTick{0%{stroke-dashoffset:60}100%{stroke-dashoffset:0}}
.shimmer{background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:400px 100%;animation:shimmer 1.6s infinite;}
.card-lift{transition:transform .22s cubic-bezier(.34,1.56,.64,1),box-shadow .22s;cursor:pointer;}
.card-lift:hover{transform:translateY(-4px) scale(1.015);}
.btn-press:active{transform:scale(0.96)!important;}
`;

// ─── PROVIDERS ─────────────────────────────────────────────────────────────────
function NotifProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);
  return (
    <NotifContext.Provider value={{ push }}>
      {children}
      <ToastContainer toasts={toasts} />
    </NotifContext.Provider>
  );
}

function ToastContainer({ toasts }) {
  const icons = { success: "✅", warn: "⚠️", info: "🔔", error: "❌" };
  const bgs = { success: "linear-gradient(135deg,#22c55e,#16a34a)", warn: "linear-gradient(135deg,#f59e0b,#d97706)", info: "linear-gradient(135deg,#FF5722,#FF8A65)", error: "linear-gradient(135deg,#ef4444,#dc2626)" };
  return (
    <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 390, width: "92%", pointerEvents: "none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ background: bgs[t.type] || bgs.info, color: "#fff", borderRadius: 16, padding: "13px 18px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 13, boxShadow: "0 12px 32px rgba(0,0,0,0.25)", animation: "toastIn .4s cubic-bezier(.34,1.56,.64,1) both", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>{icons[t.type] || icons.info}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("cb_user") || "null"); } catch { return null; } });
  const login = u => { setUser(u); localStorage.setItem("cb_user", JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem("cb_user"); };
  const update = u => { setUser(u); localStorage.setItem("cb_user", JSON.stringify(u)); };
  return <AuthContext.Provider value={{ user, login, logout, update }}>{children}</AuthContext.Provider>;
}

function CartProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem("cb_cart") || "[]"); } catch { return []; } });
  const sync = next => { setItems(next); localStorage.setItem("cb_cart", JSON.stringify(next)); };
  const add = food => setItems(prev => { const ex = prev.find(i => i.id === food.id); const n = ex ? prev.map(i => i.id === food.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...food, qty: 1 }]; localStorage.setItem("cb_cart", JSON.stringify(n)); return n; });
  const remove = id => sync(items.filter(i => i.id !== id));
  const update = (id, qty) => { if (qty <= 0) return remove(id); sync(items.map(i => i.id === id ? { ...i, qty } : i)); };
  const clear = () => sync([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return <CartContext.Provider value={{ items, add, remove, update, clear, total, count }}>{children}</CartContext.Provider>;
}

function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => { try { return JSON.parse(localStorage.getItem("cb_orders") || "null") || INIT_ORDERS; } catch { return INIT_ORDERS; } });
  const saveOrders = o => { setOrders(o); localStorage.setItem("cb_orders", JSON.stringify(o)); };
  const addOrder = o => { const next = [o, ...orders]; saveOrders(next); };
  const updateStatus = (id, status) => saveOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  return <OrdersContext.Provider value={{ orders, addOrder, updateStatus }}>{children}</OrdersContext.Provider>;
}

function FoodsProvider({ children }) {
  const [foods, setFoods] = useState(() => { try { return JSON.parse(localStorage.getItem("cb_foods") || "null") || INIT_FOODS; } catch { return INIT_FOODS; } });
  const saveFoods = f => { setFoods(f); localStorage.setItem("cb_foods", JSON.stringify(f)); };
  const addFood = f => saveFoods([...foods, { ...f, id: Date.now() }]);
  const editFood = f => saveFoods(foods.map(x => x.id === f.id ? f : x));
  const deleteFood = id => saveFoods(foods.filter(x => x.id !== id));
  return <FoodsContext.Provider value={{ foods, addFood, editFood, deleteFood }}>{children}</FoodsContext.Provider>;
}

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Btn({ children, onClick, style, outline, danger, sm, disabled }) {
  const [ripples, setRipples] = useState([]);
  const handleClick = e => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const r = { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples(p => [...p, r]);
    setTimeout(() => setRipples(p => p.filter(x => x.id !== r.id)), 700);
    onClick && onClick(e);
  };
  const base = {
    position: "relative", overflow: "hidden", cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, border: "none",
    transition: "transform .12s, opacity .12s, box-shadow .2s", borderRadius: sm ? 10 : 16,
    fontSize: sm ? 12 : 15, padding: sm ? "7px 16px" : "14px 0", width: sm ? "auto" : "100%",
    background: disabled ? "#ccc" : outline ? "rgba(255,87,34,.08)" : danger ? "#fee2e2" : `linear-gradient(135deg,${OG},${OG2})`,
    color: outline ? OG : danger ? "#dc2626" : "#fff",
    border: outline ? `1.5px solid ${OG}` : "none",
    boxShadow: (!outline && !danger && !disabled) ? `0 4px 18px rgba(255,87,34,.35)` : "none",
    opacity: disabled ? 0.6 : 1,
  };
  return (
    <button className="btn-press" style={{ ...base, ...style }} onClick={handleClick}>
      {children}
      {ripples.map(r => <span key={r.id} style={{ position: "absolute", left: r.x - 12, top: r.y - 12, width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.35)", animation: "ripple .7s ease-out both", pointerEvents: "none" }} />)}
    </button>
  );
}

function Skeleton({ h = 16, w = "100%", r = 10, style }) {
  return <div className="shimmer" style={{ height: h, width: w, borderRadius: r, ...style }} />;
}

function ImgCard({ src, alt, style }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "relative", overflow: "hidden", ...style }}>
      {!loaded && <div className="shimmer" style={{ position: "absolute", inset: 0, borderRadius: "inherit" }} />}
      <img src={src} alt={alt} onLoad={() => setLoaded(true)} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit", opacity: loaded ? 1 : 0, transition: "opacity .4s ease" }} />
    </div>
  );
}

// ─── EMAIL INPUT WITH VALIDATION ───────────────────────────────────────────────
function EmailInput({ value, onChange, style }) {
  const isValid = value.length > 0 && validateEmail(value);
  const isInvalid = value.length > 3 && !validateEmail(value);
  return (
    <div style={{ position: "relative" }}>
      <input
        value={value} onChange={onChange} placeholder="you@example.com" type="email"
        style={{
          ...INPUT_STYLE, ...style,
          borderColor: isValid ? "#22c55e" : isInvalid ? "#ef4444" : "#ffe0d0",
          background: isValid ? "#f0fdf4" : isInvalid ? "#fef2f2" : "#fffaf8",
          paddingRight: 44,
          transition: "border-color .3s, background .3s",
        }}
      />
      {isValid && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#22c55e", fontSize: 18 }}>✓</span>}
      {isInvalid && <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#ef4444", fontSize: 18 }}>✗</span>}
      {isInvalid && (
        <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 700, marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
          ⚠️ Please enter a valid email address (e.g. you@gmail.com)
        </div>
      )}
    </div>
  );
}

const INPUT_STYLE = { width: "100%", padding: "13px 16px", borderRadius: 14, border: "1.5px solid #ffe0d0", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fffaf8", color: "#1a1a1a" };

// ─── BOTTOM NAV ────────────────────────────────────────────────────────────────
function BottomNav({ page, go }) {
  const { count } = useContext(CartContext);
  const tabs = [["home","🏠","Home"],["menu","🍱","Menu"],["cart","🛒","Cart"],["orders","📦","Orders"],["profile","👤","Me"]];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 -1px 0 rgba(0,0,0,0.06),0 -12px 40px rgba(0,0,0,0.1)", display: "flex", zIndex: 200, borderRadius: "24px 24px 0 0" }}>
      {tabs.map(([id, ic, lb]) => (
        <button key={id} onClick={() => go(id)} style={{ flex: 1, background: "none", border: "none", padding: "10px 0 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, position: "relative", transition: "opacity .2s" }}>
          <div style={{ width: 44, height: 38, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14, background: page === id ? "linear-gradient(135deg,#FFF0EA,#FFE5D8)" : "transparent", transition: "background .2s" }}>
            <span style={{ fontSize: 20, transition: "transform .2s", transform: page === id ? "scale(1.15)" : "scale(1)", filter: page === id ? "none" : "grayscale(.4) opacity(.65)" }}>{ic}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 800, color: page === id ? OG : "#bbb", transition: "color .2s", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{lb}</span>
          {id === "cart" && count > 0 && <span style={{ position: "absolute", top: 6, right: "calc(50% - 22px)", background: `linear-gradient(135deg,${OG},${OG2})`, color: "#fff", borderRadius: 999, fontSize: 9, fontWeight: 900, minWidth: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", boxShadow: "0 2px 8px rgba(255,87,34,.4)" }}>{count}</span>}
          {page === id && <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 20, height: 3, background: `linear-gradient(90deg,${OG},${OG2})`, borderRadius: "3px 3px 0 0" }} />}
        </button>
      ))}
    </div>
  );
}

// ─── FOOD CARD ─────────────────────────────────────────────────────────────────
function FoodCard({ food, compact }) {
  const { add, items } = useContext(CartContext);
  const { push } = useContext(NotifContext);
  const inCart = items.find(i => i.id === food.id);
  const [added, setAdded] = useState(false);
  const [fav, setFav] = useState(false);
  const handleAdd = () => { add(food); setAdded(true); push(`${food.name} added! 🛒`, "success"); setTimeout(() => setAdded(false), 1200); };

  if (compact) return (
    <div className="card-lift" style={{ minWidth: 152, maxWidth: 156, flexShrink: 0, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.09)", border: "1px solid rgba(255,87,34,0.06)" }}>
      <div style={{ position: "relative" }}>
        <ImgCard src={food.img} alt={food.name} style={{ height: 108, borderRadius: 0 }} />
        <button onClick={(e) => { e.stopPropagation(); setFav(!fav); }} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 999, background: "rgba(255,255,255,.9)", border: "none", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{fav ? "❤️" : "🤍"}</button>
        {food.tag === "trending" && <span style={{ position: "absolute", top: 8, left: 8, background: OG, color: "#fff", borderRadius: 6, fontSize: 9, fontWeight: 800, padding: "3px 7px" }}>🔥 HOT</span>}
      </div>
      <div style={{ padding: "10px 10px 12px" }}>
        <div style={{ fontWeight: 800, fontSize: 12, color: "#1a1a1a", lineHeight: 1.3 }}>{food.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5, justifyContent: "space-between" }}>
          <span style={{ fontWeight: 900, color: OG, fontSize: 14 }}>₹{food.price}</span>
          <button onClick={handleAdd} style={{ background: added ? "#22c55e" : `linear-gradient(135deg,${OG},${OG2})`, color: "#fff", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 800, cursor: "pointer", transition: "background .3s" }}>{added ? "✓" : "+"}</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
          <span style={{ fontSize: 9, background: "#FFF0EA", color: OG, borderRadius: 5, padding: "2px 6px", fontWeight: 700 }}>⭐ {food.rating}</span>
          <span style={{ fontSize: 9, background: food.veg ? "#dcfce7" : "#fee2e2", color: food.veg ? "#16a34a" : "#dc2626", borderRadius: 5, padding: "2px 6px", fontWeight: 700 }}>{food.veg ? "🟢" : "🔴"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card-lift" style={{ background: "#fff", borderRadius: 22, marginBottom: 14, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex", border: "1px solid rgba(255,87,34,0.06)", animation: "fadeUp .4s ease both" }}>
      <div style={{ position: "relative", width: 116, flexShrink: 0 }}>
        <ImgCard src={food.img} alt={food.name} style={{ width: 116, height: 116, borderRadius: 0 }} />
        <button onClick={() => setFav(!fav)} style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: 999, background: "rgba(255,255,255,.9)", border: "none", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{fav ? "❤️" : "🤍"}</button>
      </div>
      <div style={{ padding: "13px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
            <span style={{ fontSize: 10, background: food.veg ? "#dcfce7" : "#fee2e2", color: food.veg ? "#16a34a" : "#dc2626", borderRadius: 6, padding: "2px 7px", fontWeight: 700 }}>{food.veg ? "🟢 Veg" : "🔴 Non-Veg"}</span>
            {food.tag === "trending" && <span style={{ fontSize: 10, background: "#FFF0EA", color: OG, borderRadius: 6, padding: "2px 7px", fontWeight: 700 }}>🔥 Hot</span>}
          </div>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a", lineHeight: 1.3 }}>{food.name}</div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 4, lineHeight: 1.5 }}>{food.desc}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <div>
            <span style={{ fontWeight: 900, fontSize: 17, color: OG }}>₹{food.price}</span>
            <span style={{ fontSize: 11, color: "#bbb", marginLeft: 8 }}>⭐ {food.rating}</span>
          </div>
          <Btn sm onClick={handleAdd} style={{ background: added ? "#22c55e" : `linear-gradient(135deg,${OG},${OG2})`, transition: "background .3s", boxShadow: added ? "0 3px 12px rgba(34,197,94,.4)" : `0 3px 12px rgba(255,87,34,.35)` }}>
            {inCart ? `✓ ${items.find(i => i.id === food.id)?.qty}` : "+ Add"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ─── SPLASH SCREEN ─────────────────────────────────────────────────────────────
function SplashScreen({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,#1a0800 0%,${OG} 60%,${OG2} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%,rgba(255,255,255,0.07) 0%,transparent 60%)" }} />
      {["🍕","🍟","☕","🥪","🍜","🥟","🍔","🧋"].map((e, i) => (
        <span key={i} style={{ position: "absolute", fontSize: 28 + (i % 3) * 8, opacity: 0.12 + (i % 4) * 0.04, left: `${8 + i * 11}%`, top: `${10 + (i % 5) * 15}%`, animation: `float ${2 + i * .3}s ease-in-out infinite`, animationDelay: `${i * .2}s` }}>{e}</span>
      ))}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <div style={{ fontSize: 96, animation: "bob 1.8s ease-in-out infinite, popIn .6s ease both" }}>🍔</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 42, color: "#fff", marginTop: 16, letterSpacing: -1, animation: "fadeUp .7s ease .2s both" }}>Campus Bites</div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,.75)", marginTop: 6, fontWeight: 500, animation: "fadeUp .7s ease .4s both", letterSpacing: .5 }}>Smart Canteen Pre-Order</div>
        <div style={{ display: "flex", gap: 12, marginTop: 44, justifyContent: "center", animation: "fadeUp .7s ease .6s both" }}>
          {["🍕","🍟","☕","🥪","🍜","🥟"].map((e, i) => <span key={i} style={{ fontSize: 26, opacity: .9 }}>{e}</span>)}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 48, display: "flex", gap: 6, animation: "fadeUp .7s ease .8s both" }}>
        <div style={{ width: 8, height: 8, borderRadius: 999, background: "rgba(255,255,255,.35)" }} />
        <div style={{ width: 28, height: 8, borderRadius: 999, background: "#fff" }} />
        <div style={{ width: 8, height: 8, borderRadius: 999, background: "rgba(255,255,255,.35)" }} />
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────────
function LoginScreen({ onDone }) {
  const { login } = useContext(AuthContext);
  const { push } = useContext(NotifContext);
  const [role, setRole] = useState("user");
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", pw: "", pw2: "", adminId: "", adminPw: "" });
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 600); };

  const handle = async () => {
    setErr("");
    if (role === "admin") {
      if (!form.adminId || !form.adminPw) { setErr("Please fill all fields."); triggerShake(); return; }
      if (form.adminId !== "admin" || form.adminPw !== "admin123") { setErr("Invalid admin credentials."); triggerShake(); return; }
      setLoading(true);
      await new Promise(r => setTimeout(r, 900));
      login({ name: "Admin", email: "admin@campus.edu", role: "admin", avatar: "" });
      push("Welcome back, Admin! 👋", "success");
      onDone("admin");
      return;
    }
    if (!form.email) { setErr("Email is required."); triggerShake(); return; }
    if (!validateEmail(form.email)) { setErr("Please enter a valid email address (e.g. you@gmail.com)"); triggerShake(); return; }
    if (!form.pw) { setErr("Password is required."); triggerShake(); return; }
    if (mode === "signup") {
      if (!form.name) { setErr("Full name is required."); triggerShake(); return; }
      if (form.pw !== form.pw2) { setErr("Passwords don't match."); triggerShake(); return; }
      if (form.pw.length < 6) { setErr("Password must be at least 6 characters."); triggerShake(); return; }
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    login({ name: form.name || form.email.split("@")[0], email: form.email, phone: form.phone || "", avatar: "", role: "user" });
    push("Welcome to Campus Bites! 🍔", "success");
    onDone("user");
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Plus Jakarta Sans',sans-serif", overflowY: "auto", background: "#fff8f5" }}>
      <div style={{ background: `linear-gradient(150deg,#1a0800,${OG},${OG2})`, padding: "52px 24px 84px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, fontSize: 120, opacity: 0.1, transform: "rotate(20deg)" }}>🍔</div>
        <div style={{ position: "absolute", bottom: -20, left: -20, fontSize: 90, opacity: 0.08, transform: "rotate(-15deg)" }}>🍕</div>
        <div style={{ position: "absolute", top: 40, left: 44, fontSize: 50, opacity: 0.12, animation: "float 3s ease-in-out infinite" }}>🥪</div>
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 56, animation: "bob 2s ease-in-out infinite" }}>🍔</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", marginTop: 8, letterSpacing: -1 }}>Campus Bites</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", marginTop: 5, fontWeight: 500 }}>Your smart canteen companion</div>
        </div>
      </div>

      <div style={{ margin: "-44px 16px 32px", background: "#fff", borderRadius: 28, padding: "24px 22px 28px", boxShadow: "0 16px 60px rgba(0,0,0,0.14)", position: "relative", zIndex: 2, animation: shake ? "shake .5s ease" : "fadeUp .5s ease both" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {[["user","👤 Student"],["admin","🔐 Admin"]].map(([r, l]) => (
            <button key={r} onClick={() => { setRole(r); setErr(""); }} style={{ flex: 1, padding: "11px 0", background: role === r ? (r === "admin" ? "#111" : `linear-gradient(135deg,${OG},${OG2})`) : "#f8f8f8", border: "none", borderRadius: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 13, color: role === r ? "#fff" : "#999", cursor: "pointer", transition: "all .2s", boxShadow: role === r ? "0 4px 14px rgba(0,0,0,0.2)" : "none" }}>{l}</button>
          ))}
        </div>

        {role === "admin" ? (
          <>
            <div style={{ background: "#111", borderRadius: 16, padding: "16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 32 }}>🔐</span>
              <div><div style={{ fontWeight: 800, color: "#fff", fontSize: 14 }}>Admin Panel Access</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>ID: admin · Password: admin123</div></div>
            </div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>Admin ID</label>
            <input value={form.adminId} onChange={f("adminId")} placeholder="admin" style={INPUT_STYLE} />
            <label style={{ fontSize: 12, fontWeight: 700, color: "#888", display: "block", marginBottom: 6, marginTop: 14 }}>Password</label>
            <input value={form.adminPw} onChange={f("adminPw")} placeholder="admin123" type="password" style={INPUT_STYLE} />
            {err && <ErrBox msg={err} />}
            <div style={{ marginTop: 18 }}><Btn onClick={handle} style={{ background: "#111", boxShadow: "0 4px 18px rgba(0,0,0,.25)" }}>{loading ? "Signing in…" : "Enter Admin Panel →"}</Btn></div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", background: "#FFF0EA", borderRadius: 16, padding: 4, marginBottom: 22 }}>
              {[["login","Log In"],["signup","Sign Up"]].map(([m, l]) => (
                <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{ flex: 1, padding: "12px 0", background: mode === m ? `linear-gradient(135deg,${OG},${OG2})` : "transparent", border: "none", borderRadius: 13, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 14, color: mode === m ? "#fff" : OG, cursor: "pointer", transition: "all .2s", boxShadow: mode === m ? "0 4px 14px rgba(255,87,34,.3)" : "none" }}>{l}</button>
              ))}
            </div>

            {mode === "signup" && (
              <>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>Full Name *</label>
                <input value={form.name} onChange={f("name")} placeholder="John Doe" style={{ ...INPUT_STYLE, marginBottom: 14 }} />
                <label style={{ fontSize: 12, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>Phone Number</label>
                <input value={form.phone} onChange={f("phone")} placeholder="+91 9876543210" type="tel" style={{ ...INPUT_STYLE, marginBottom: 14 }} />
              </>
            )}

            <label style={{ fontSize: 12, fontWeight: 700, color: "#888", display: "block", marginBottom: 6, marginTop: mode === "signup" ? 0 : 0 }}>Email Address *</label>
            <div style={{ marginBottom: 14 }}>
              <EmailInput value={form.email} onChange={f("email")} />
            </div>

            <label style={{ fontSize: 12, fontWeight: 700, color: "#888", display: "block", marginBottom: 6 }}>Password *</label>
            <div style={{ position: "relative", marginBottom: 4 }}>
              <input value={form.pw} onChange={f("pw")} placeholder="••••••••" type={showPw ? "text" : "password"} style={{ ...INPUT_STYLE, paddingRight: 50 }} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>{showPw ? "🙈" : "👁"}</button>
            </div>

            {mode === "signup" && (
              <>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#888", display: "block", marginBottom: 6, marginTop: 14 }}>Confirm Password *</label>
                <input value={form.pw2} onChange={f("pw2")} placeholder="••••••••" type="password" style={INPUT_STYLE} />
              </>
            )}

            {mode === "login" && <div style={{ textAlign: "right", marginTop: 8, marginBottom: 4 }}><span style={{ fontSize: 13, color: OG, fontWeight: 700, cursor: "pointer" }}>Forgot password?</span></div>}

            {err && <ErrBox msg={err} />}

            <div style={{ marginTop: 18 }}>
              <Btn onClick={handle} disabled={loading} style={{ opacity: loading ? .7 : 1, fontSize: 16 }}>{loading ? "Please wait…" : mode === "login" ? "Log In →" : "Create Account →"}</Btn>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0 14px" }}>
              <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} /><span style={{ fontSize: 12, color: "#ccc", fontWeight: 600 }}>or continue with</span><div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {[["🔵","Google"],["⚫","GitHub"]].map(([ic, lb]) => (
                <button key={lb} style={{ flex: 1, padding: "12px 0", background: "#f8f9fa", border: "1.5px solid #eee", borderRadius: 14, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#333" }}>{ic} {lb}</button>
              ))}
            </div>
            <p style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 14, fontWeight: 600 }}>Any valid email + password works for demo ✓</p>
          </>
        )}
      </div>
    </div>
  );
}

function ErrBox({ msg }) {
  return <div style={{ color: "#dc2626", fontSize: 12, fontWeight: 700, marginTop: 12, background: "#fef2f2", borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #fee2e2" }}>⚠️ {msg}</div>;
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────────
function Section({ title, children, onMore }) {
  return (
    <div style={{ padding: "20px 16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, color: "#1a1a1a" }}>{title}</div>
        {onMore && <span onClick={onMore} style={{ fontSize: 12, color: OG, fontWeight: 700, cursor: "pointer" }}>See all →</span>}
      </div>
      {children}
    </div>
  );
}

function HomePage({ go, setCat, activeOrder }) {
  const { user } = useContext(AuthContext);
  const { foods } = useContext(FoodsContext);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good Morning ☀️" : hour < 17 ? "Good Afternoon 🌤️" : "Good Evening 🌙";
  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);
  const filtered = search ? foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.cat.includes(search.toLowerCase())) : [];

  return (
    <div style={{ paddingBottom: 90, minHeight: "100vh", background: "#fff8f5" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${OG},${OG2})`, padding: "48px 20px 28px", borderRadius: "0 0 36px 36px", boxShadow: `0 12px 40px rgba(255,87,34,.3)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, fontSize: 140, opacity: 0.07, animation: "float 4s ease-in-out infinite" }}>🍔</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>📍 Campus Canteen</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: "#fff", marginTop: 3 }}>{greet}, {user?.name?.split(" ")[0] || "Foodie"}!</div>
          </div>
          <div style={{ width: 46, height: 46, borderRadius: 16, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, backdropFilter: "blur(8px)" }}>🔔</div>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food, category…" style={{ ...INPUT_STYLE, paddingLeft: 46, borderColor: "transparent", boxShadow: "0 6px 24px rgba(0,0,0,.14)", borderRadius: 16, background: "#fff" }} />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#aaa" }}>×</button>}
        </div>
      </div>

      {/* Active order banner */}
      {activeOrder && (
        <div onClick={() => go("tracking")} style={{ margin: "14px 16px 0", background: "linear-gradient(120deg,#22c55e,#16a34a)", borderRadius: 20, padding: "15px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", animation: "glow 2s ease-in-out infinite", boxShadow: "0 8px 24px rgba(34,197,94,.3)" }}>
          <span style={{ fontSize: 32, animation: "ring 1.5s ease-in-out infinite" }}>🔔</span>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 800, fontSize: 14, color: "#fff" }}>Order #{activeOrder.id} is being prepared!</div><div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", marginTop: 2 }}>Tap to track your order →</div></div>
          <span style={{ background: "#fff", color: "#16a34a", borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 900, animation: "pulse 1.5s ease infinite" }}>LIVE</span>
        </div>
      )}

      {/* Search results */}
      {search && (
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#222", marginBottom: 12 }}>Results ({filtered.length})</div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#ccc" }}>
              <div style={{ fontSize: 52 }}>😕</div>
              <div style={{ marginTop: 10, fontWeight: 700 }}>Nothing found for "{search}"</div>
            </div>
          ) : filtered.map(f => <FoodCard key={f.id} food={f} />)}
        </div>
      )}

      {!search && <>
        {/* AI banner */}
        <div style={{ margin: "16px 16px 0", background: `linear-gradient(125deg,#1a0800,${OG})`, borderRadius: 24, padding: "20px 22px", display: "flex", alignItems: "center", gap: 14, overflow: "hidden", position: "relative", boxShadow: `0 10px 32px rgba(255,87,34,.32)` }}>
          <div style={{ position: "absolute", right: -16, top: -16, fontSize: 110, opacity: 0.12, animation: "float 3s ease-in-out infinite" }}>🤖</div>
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.7)", textTransform: "uppercase", letterSpacing: 2 }}>🤖 AI Powered</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "#fff", lineHeight: 1.15, marginTop: 5 }}>Order within<br />seconds!</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", marginTop: 5 }}>Smart picks based on time & trends</div>
            <Btn onClick={() => go("menu")} sm style={{ marginTop: 14, background: "rgba(255,255,255,.18)", color: "#fff", border: "1px solid rgba(255,255,255,.3)", boxShadow: "none", padding: "9px 18px", fontSize: 12 }}>Explore Menu →</Btn>
          </div>
          <div style={{ fontSize: 80, animation: "bob 2s ease-in-out infinite", opacity: .9 }}>🍔</div>
        </div>

        {/* Coupon banner */}
        <div style={{ margin: "12px 16px 0", background: "linear-gradient(120deg,#6d28d9,#8b5cf6)", borderRadius: 18, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div><div style={{ fontWeight: 900, fontSize: 17, color: "#fff" }}>🎉 Use BITES20</div><div style={{ fontSize: 12, color: "rgba(255,255,255,.85)", marginTop: 2 }}>₹20 off on orders above ₹99</div></div>
          <div style={{ background: "rgba(255,255,255,.2)", borderRadius: 12, padding: "8px 16px", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", backdropFilter: "blur(4px)" }}>Copy</div>
        </div>

        <Section title="🔥 Trending Now" onMore={() => go("menu")}>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
            {loading ? [0,1,2].map(i => <div key={i} style={{ minWidth: 152 }}><Skeleton h={108} r={16} /><Skeleton h={12} r={6} style={{ marginTop: 8, width: "80%" }} /></div>) : foods.filter(f => f.tag === "trending").slice(0, 8).map(f => <FoodCard key={f.id} food={f} compact />)}
          </div>
        </Section>

        <Section title="📂 Browse by Category">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {CATS.map(c => (
              <button key={c.id} onClick={() => { setCat(c.id); go("menu"); }} className="card-lift" style={{ background: "#fff", border: "none", borderRadius: 18, overflow: "hidden", boxShadow: "0 3px 14px rgba(0,0,0,.07)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 6px 10px" }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: c.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{c.emoji}</div>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: "#555", textAlign: "center", lineHeight: 1.3, marginTop: 6 }}>{c.label}</span>
              </button>
            ))}
          </div>
        </Section>

        <Section title="⭐ Fan Favourites" onMore={() => go("menu")}>
          {loading ? [0,1,2].map(i => <div key={i} style={{ background: "#fff", borderRadius: 22, marginBottom: 14, display: "flex", overflow: "hidden" }}><Skeleton h={116} w={116} r={0} /><div style={{ flex: 1, padding: 14 }}><Skeleton h={14} r={6} w="70%" /><Skeleton h={11} r={6} w="90%" style={{ marginTop: 8 }} /></div></div>) : foods.filter(f => f.tag === "popular").slice(0, 5).map(f => <FoodCard key={f.id} food={f} />)}
        </Section>

        <Section title="🎁 Combo Deals">
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 }}>
            {foods.filter(f => f.cat === "combos").map(f => <FoodCard key={f.id} food={f} compact />)}
          </div>
        </Section>

        {/* Flash sale */}
        <div style={{ margin: "20px 16px 0", background: "linear-gradient(120deg,#1a1a1a,#2d2d2d)", borderRadius: 22, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 13, color: OG, textTransform: "uppercase", letterSpacing: 1.5 }}>⚡ Flash Sale</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", marginTop: 4 }}>Up to 30% Off</div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>On selected items · Today only</div>
          </div>
          <Btn sm onClick={() => go("menu")} style={{ padding: "10px 18px", fontSize: 12 }}>Shop Now</Btn>
        </div>
      </>}
    </div>
  );
}

// ─── MENU PAGE ─────────────────────────────────────────────────────────────────
function MenuPage({ catFilter, setCat }) {
  const { foods } = useContext(FoodsContext);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(catFilter || "all");
  const [sort, setSort] = useState("none");
  useEffect(() => { if (catFilter) setFilter(catFilter); }, [catFilter]);
  let items = [...foods];
  if (filter !== "all") items = items.filter(f => f.cat === filter || f.tag === filter || (filter === "veg" && f.veg) || (filter === "nonveg" && !f.veg));
  if (search) items = items.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === "pa") items.sort((a, b) => a.price - b.price);
  if (sort === "pd") items.sort((a, b) => b.price - a.price);
  if (sort === "r") items.sort((a, b) => b.rating - a.rating);
  const filterOpts = [["all","All"],["popular","🔥 Popular"],["trending","📈 Trending"],["veg","🟢 Veg"],["nonveg","🔴 Non-Veg"],...CATS.map(c => [c.id, c.emoji + " " + c.label])];
  return (
    <div style={{ paddingBottom: 90, minHeight: "100vh", background: "#fff8f5" }}>
      <div style={{ background: "#fff", padding: "48px 16px 14px", boxShadow: "0 2px 20px rgba(0,0,0,.06)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: OG, marginBottom: 12 }}>🍱 Full Menu</div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search food…" style={{ ...INPUT_STYLE, paddingLeft: 42 }} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", marginTop: 10, paddingBottom: 2 }}>
          {filterOpts.map(([v, l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ background: filter === v ? `linear-gradient(135deg,${OG},${OG2})` : "#FFF0EA", color: filter === v ? "#fff" : OG, border: "none", borderRadius: 22, padding: "6px 14px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s", boxShadow: filter === v ? `0 3px 12px rgba(255,87,34,.35)` : "none" }}>{l}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          {[["none","Sort"],["pa","₹↑"],["pd","₹↓"],["r","⭐"]].map(([v, l]) => (
            <button key={v} onClick={() => setSort(v)} style={{ background: sort === v ? "#1a1a1a" : "#f5f5f5", color: sort === v ? "#fff" : "#666", border: "none", borderRadius: 22, padding: "5px 12px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, cursor: "pointer", transition: "all .2s" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12, fontWeight: 600 }}>{items.length} items found</div>
        {items.length === 0 ? <div style={{ textAlign: "center", padding: "48px 0", color: "#ccc" }}><div style={{ fontSize: 52 }}>🍽️</div><div style={{ marginTop: 10, fontWeight: 700 }}>No items found</div></div> : items.map(f => <FoodCard key={f.id} food={f} />)}
      </div>
    </div>
  );
}

// ─── CART PAGE ─────────────────────────────────────────────────────────────────
function CartPage({ go }) {
  const { items, remove, update, total, clear } = useContext(CartContext);
  const { push } = useContext(NotifContext);
  const [coupon, setCoupon] = useState("");
  const [disc, setDisc] = useState(0);
  const [msg, setMsg] = useState("");
  const [mode, setMode] = useState("pickup");
  const applyCoupon = () => {
    const codes = { CAMPUS10: 10, BITES20: 20, FREE50: 50, NEWUSER: 30 };
    const d = codes[coupon.toUpperCase()];
    if (d) { setDisc(d); setMsg(`✅ ₹${d} off applied!`); push(`Coupon applied! ₹${d} saved`, "success"); }
    else { setDisc(0); setMsg("❌ Invalid coupon code"); }
  };

  if (items.length === 0) return (
    <div style={{ paddingBottom: 90, minHeight: "100vh", background: "#fff8f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 32px 90px" }}>
      <div style={{ fontSize: 96, animation: "bob 2s ease-in-out infinite" }}>🛒</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "#1a1a1a", marginTop: 16 }}>Your cart is empty</div>
      <div style={{ fontSize: 14, color: "#aaa", marginTop: 8 }}>Add your favourite food to get started!</div>
      <Btn onClick={() => go("menu")} style={{ width: "auto", padding: "13px 40px", marginTop: 24 }}>Browse Menu →</Btn>
    </div>
  );

  const gst = Math.round(total * 0.05);
  const finalTotal = Math.max(0, total - disc) + gst;
  return (
    <div style={{ paddingBottom: 90, minHeight: "100vh", background: "#fff8f5" }}>
      <div style={{ background: "#fff", padding: "48px 16px 14px", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: OG }}>🛒 My Cart</div>
          <button onClick={() => { clear(); push("Cart cleared", "info"); }} style={{ background: "#fee2e2", border: "none", color: "#dc2626", padding: "7px 14px", borderRadius: 12, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Clear All</button>
        </div>
        <div style={{ fontSize: 13, color: "#aaa", marginTop: 3, fontWeight: 600 }}>{items.length} item{items.length !== 1 ? "s" : ""} · Est. 15 mins prep time ⏱️</div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {[["pickup","🧑‍🍳 Pickup"],["dine","🪑 Dine-In"]].map(([v, l]) => (
            <button key={v} onClick={() => setMode(v)} style={{ padding: "8px 18px", background: mode === v ? `linear-gradient(135deg,${OG},${OG2})` : "#f5f5f5", color: mode === v ? "#fff" : "#666", border: "none", borderRadius: 22, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all .2s", boxShadow: mode === v ? `0 3px 12px rgba(255,87,34,.35)` : "none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {items.map(item => (
          <div key={item.id} style={{ background: "#fff", borderRadius: 22, marginBottom: 12, overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,.07)", display: "flex", alignItems: "center", animation: "slideIn .3s ease" }}>
            <ImgCard src={item.img} alt={item.name} style={{ width: 90, height: 82, borderRadius: 0, flexShrink: 0 }} />
            <div style={{ padding: "10px 12px", flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a" }}>{item.name}</div>
              <div style={{ fontSize: 12, color: OG, fontWeight: 700, marginTop: 2 }}>₹{item.price} × {item.qty} = <span style={{ color: "#1a1a1a" }}>₹{item.price * item.qty}</span></div>
            </div>
            <div style={{ padding: "0 14px 0 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FFF0EA", borderRadius: 24, padding: "5px 8px" }}>
                <button onClick={() => update(item.id, item.qty - 1)} style={{ width: 28, height: 28, borderRadius: 999, background: `linear-gradient(135deg,${OG},${OG2})`, border: "none", color: "#fff", fontWeight: 900, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontWeight: 800, fontSize: 15, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => update(item.id, item.qty + 1)} style={{ width: 28, height: 28, borderRadius: 999, background: `linear-gradient(135deg,${OG},${OG2})`, border: "none", color: "#fff", fontWeight: 900, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
              <button onClick={() => { remove(item.id); push(`${item.name} removed`, "info"); }} style={{ background: "none", border: "none", color: "#dc2626", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>🗑 Remove</button>
            </div>
          </div>
        ))}

        <div style={{ background: "#fff", borderRadius: 22, padding: "16px", marginBottom: 12, boxShadow: "0 2px 14px rgba(0,0,0,.06)" }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a", marginBottom: 10 }}>🎟️ Coupon Code</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Try CAMPUS10, BITES20…" style={{ ...INPUT_STYLE, flex: 1 }} />
            <Btn sm onClick={applyCoupon} style={{ padding: "10px 18px", flexShrink: 0 }}>Apply</Btn>
          </div>
          {msg && <div style={{ fontSize: 12, marginTop: 8, fontWeight: 600, color: msg.startsWith("✅") ? "#16a34a" : "#dc2626", background: msg.startsWith("✅") ? "#dcfce7" : "#fee2e2", borderRadius: 10, padding: "7px 12px" }}>{msg}</div>}
        </div>

        <div style={{ background: "#fff", borderRadius: 22, padding: "18px", marginBottom: 18, boxShadow: "0 2px 14px rgba(0,0,0,.06)" }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#1a1a1a", marginBottom: 14 }}>🧾 Bill Summary</div>
          {[["Item Total", `₹${total}`], ["GST (5%)", `₹${gst}`], disc > 0 ? ["Coupon Discount", `− ₹${disc}`] : null, [`${mode === "pickup" ? "🧑‍🍳 Pickup" : "🪑 Dine-In"}`, "Free"], ["Est. Prep Time", "~15 mins"]].filter(Boolean).map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, color: "#666" }}>
              <span>{l}</span>
              <span style={{ fontWeight: 700, color: l.includes("Discount") ? "#16a34a" : "#1a1a1a" }}>{v}</span>
            </div>
          ))}
          <div style={{ borderTop: "2px dashed #ffe0d0", paddingTop: 14, display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 19, color: OG }}>
            <span>Total Payable</span><span>₹{finalTotal}</span>
          </div>
        </div>

        <Btn onClick={() => go("payment")} style={{ fontSize: 16, padding: "16px 0" }}>Proceed to Pay ₹{finalTotal} 🔒</Btn>
      </div>
    </div>
  );
}

// ─── PAYMENT PAGE ──────────────────────────────────────────────────────────────
const PAY_METHODS = [
  { id: "gpay", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png", label: "Google Pay", sub: "Fastest UPI · Instant cashback", color: "#4285F4", emoji: "🔵" },
  { id: "phonepe", icon: null, label: "PhonePe", sub: "Trusted by 300M+ users", color: "#5F259F", emoji: "💜" },
  { id: "paytm", icon: null, label: "Paytm", sub: "Pay with Paytm Wallet or UPI", color: "#00BAF2", emoji: "💙" },
  { id: "upi", icon: null, label: "Other UPI", sub: "BHIM · BharatPe · Any UPI app", color: "#FF6B35", emoji: "📱" },
  { id: "card", icon: null, label: "Debit / Credit Card", sub: "Visa · Mastercard · RuPay", color: "#1a1a1a", emoji: "💳" },
  { id: "cash", icon: null, label: "Cash at Counter", sub: "Pay when you collect your order", color: "#22c55e", emoji: "💵" },
];

function PaymentPage({ go, onOrderPlaced }) {
  const { items, total, clear } = useContext(CartContext);
  const { addOrder } = useContext(OrdersContext);
  const { user } = useContext(AuthContext);
  const { push } = useContext(NotifContext);
  const [method, setMethod] = useState("gpay");
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const gst = Math.round(total * 0.05);
  const grand = total + gst;

  const pay = async () => {
    setLoading(true);
    push("🔒 Processing payment…", "info");
    await new Promise(r => setTimeout(r, 2000));
    const orderId = "CB" + Math.floor(100000 + Math.random() * 900000);
    const order = { id: orderId, user: user?.name || "Guest", items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price, img: i.img })), total: grand, status: "Placed", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), mins: 15 };
    addOrder(order);
    clear();
    push("Payment successful! 🎉", "success");
    onOrderPlaced(orderId);
    go("success");
  };

  const selectedMethod = PAY_METHODS.find(m => m.id === method);

  return (
    <div style={{ paddingBottom: 100, minHeight: "100vh", background: "#fff8f5" }}>
      <div style={{ background: "#fff", padding: "48px 16px 16px", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
        <button onClick={() => go("cart")} style={{ background: "#f5f5f5", border: "none", borderRadius: 12, padding: "8px 16px", marginBottom: 12, cursor: "pointer", fontSize: 14, fontWeight: 700, color: "#666" }}>← Back</button>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: OG }}>💳 Secure Checkout</div>
        <div style={{ fontSize: 12, color: "#aaa", marginTop: 3, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>🛡️ 256-bit SSL encrypted · PCI DSS compliant</div>
      </div>

      <div style={{ padding: "16px 16px" }}>
        {/* Order summary */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "18px", marginBottom: 14, boxShadow: "0 2px 14px rgba(0,0,0,.06)" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a", marginBottom: 14 }}>🧾 Order Summary</div>
          {items.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 13, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ImgCard src={i.img} alt={i.name} style={{ width: 36, height: 36, borderRadius: 10 }} />
                <span style={{ color: "#444", fontWeight: 600 }}>{i.name} ×{i.qty}</span>
              </div>
              <span style={{ fontWeight: 800, color: "#1a1a1a" }}>₹{i.price * i.qty}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", paddingTop: 10, borderTop: "1px dashed #f0f0f0", marginTop: 4 }}>
            <span>Item Total</span><span>₹{total}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#888", marginTop: 6 }}>
            <span>GST (5%)</span><span>₹{gst}</span>
          </div>
          <div style={{ borderTop: "2px dashed #ffe0d0", paddingTop: 12, marginTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18, color: OG }}>
            <span>Total Payable</span><span>₹{grand}</span>
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: "#1a1a1a", marginBottom: 14 }}>Choose Payment Method</div>
        {PAY_METHODS.map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)} style={{ width: "100%", background: method === m.id ? "#FFF8F5" : "#fff", border: method === m.id ? `2px solid ${OG}` : "1.5px solid #f0f0f0", borderRadius: 20, padding: "14px 16px", marginBottom: 10, cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", transition: "all .2s", boxShadow: method === m.id ? `0 6px 20px rgba(255,87,34,.14)` : "none" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: m.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{m.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 15, color: "#1a1a1a" }}>{m.label}</div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 2, fontWeight: 500 }}>{m.sub}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${method === m.id ? OG : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "border-color .2s" }}>
              {method === m.id && <div style={{ width: 12, height: 12, borderRadius: 999, background: OG }} />}
            </div>
          </button>
        ))}

        {/* UPI ID input */}
        {(method === "gpay" || method === "phonepe" || method === "paytm" || method === "upi") && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "16px", marginBottom: 14, boxShadow: "0 2px 14px rgba(0,0,0,.06)" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#666", marginBottom: 8 }}>Enter UPI ID <span style={{ color: "#aaa", fontWeight: 500 }}>(optional for demo)</span></div>
            <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={{ ...INPUT_STYLE }} />
          </div>
        )}

        {/* Card input */}
        {method === "card" && (
          <div style={{ background: "#fff", borderRadius: 20, padding: "16px", marginBottom: 14, boxShadow: "0 2px 14px rgba(0,0,0,.06)" }}>
            <div style={{ background: "linear-gradient(135deg,#1a1a1a,#333)", borderRadius: 16, padding: "20px", marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>CARD NUMBER</div>
              <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: "#fff", marginTop: 4, letterSpacing: 3 }}>{cardNum.replace(/(\d{4})/g, "$1 ").trim() || "•••• •••• •••• ••••"}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                <div><div style={{ fontSize: 10, color: "#888" }}>EXPIRES</div><div style={{ color: "#fff", fontWeight: 700 }}>{cardExp || "MM/YY"}</div></div>
                <div style={{ fontSize: 28 }}>💳</div>
              </div>
            </div>
            <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g,"").slice(0,16))} placeholder="Card Number" style={{ ...INPUT_STYLE, marginBottom: 10, fontFamily: "monospace", letterSpacing: 2 }} />
            <div style={{ display: "flex", gap: 10 }}>
              <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY" style={{ ...INPUT_STYLE, flex: 1 }} />
              <input value={cardCvv} onChange={e => setCardCvv(e.target.value.slice(0,3))} placeholder="CVV" type="password" style={{ ...INPUT_STYLE, flex: 1 }} />
            </div>
          </div>
        )}

        {/* Pay button */}
        <Btn onClick={pay} disabled={loading} style={{ marginTop: 6, fontSize: 16, padding: "16px 0", opacity: loading ? .75 : 1, background: loading ? "#999" : `linear-gradient(135deg,${OG},${OG2})`, boxShadow: loading ? "none" : `0 6px 24px rgba(255,87,34,.4)` }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ width: 18, height: 18, border: "3px solid rgba(255,255,255,.3)", borderTopColor: "#fff", borderRadius: 999, display: "inline-block", animation: "spin .7s linear infinite" }} />
              Processing Payment…
            </span>
          ) : `🔒 Pay ₹${grand} via ${selectedMethod?.label}`}
        </Btn>
        <div style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 12, fontWeight: 600 }}>🛡️ Secured by SSL · Encrypted payment · No card data stored</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 10 }}>
          {["🔵 GPay","💜 PhonePe","💙 Paytm","📱 UPI"].map(l => <span key={l} style={{ fontSize: 10, color: "#ccc", fontWeight: 600 }}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}

// ─── SUCCESS SCREEN ────────────────────────────────────────────────────────────
function SuccessScreen({ go, orderId }) {
  const prepTime = useRef(10 + Math.floor(Math.random() * 8));
  const confettiItems = useRef([...Array(18)].map((_, i) => ({ id: i, x: 10 + Math.random() * 390, color: [OG,"#22c55e","#f59e0b","#8b5cf6","#ec4899","#3b82f6"][Math.floor(Math.random() * 6)], delay: Math.random() * .8, emoji: ["🎉","⭐","🍔","✨","🍕","❤️"][Math.floor(Math.random() * 6)] })));
  useEffect(() => { const t = setTimeout(() => go("tracking"), 6000); return () => clearTimeout(t); }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#fff8f5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      {confettiItems.current.map(c => <span key={c.id} style={{ position: "absolute", left: c.x, bottom: 100, fontSize: 22, animation: `confetti 1.4s ease ${c.delay}s both`, pointerEvents: "none" }}>{c.emoji}</span>)}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%,rgba(34,197,94,.06) 0%,transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ width: 110, height: 110, borderRadius: 999, background: "linear-gradient(135deg,#4ade80,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, margin: "0 auto", animation: "popIn .7s cubic-bezier(.34,1.56,.64,1) both", boxShadow: "0 12px 40px rgba(34,197,94,.4)" }}>✓</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 30, color: "#1a1a1a", marginTop: 24, animation: "fadeUp .6s ease .3s both" }}>Order Placed! 🎉</div>
        <div style={{ fontSize: 14, color: "#888", marginTop: 10, lineHeight: 1.8, animation: "fadeUp .6s ease .45s both" }}>Your food is being prepared by the<br />canteen kitchen. Hang tight!</div>

        <div style={{ background: "#fff", borderRadius: 24, padding: "20px 28px", marginTop: 24, boxShadow: "0 6px 28px rgba(0,0,0,.1)", animation: "fadeUp .6s ease .55s both" }}>
          <div style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>ORDER ID</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: OG, marginTop: 3 }}>#{orderId}</div>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 16, paddingTop: 16, borderTop: "1px dashed #f0f0f0" }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Status</div><div style={{ fontWeight: 800, fontSize: 13, color: "#22c55e", marginTop: 4 }}>Confirmed ✓</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Est. Time</div><div style={{ fontWeight: 800, fontSize: 13, color: "#1a1a1a", marginTop: 4 }}>{prepTime.current}–{prepTime.current + 5} mins</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>Type</div><div style={{ fontWeight: 800, fontSize: 13, color: "#1a1a1a", marginTop: 4 }}>Pickup 🧑‍🍳</div></div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: "#ccc", marginTop: 20, animation: "pulse 2s ease infinite", fontWeight: 600 }}>Redirecting to live tracking…</div>
        <Btn outline onClick={() => go("home")} style={{ marginTop: 16, width: "auto", padding: "12px 36px", animation: "fadeUp .6s ease .7s both" }}>Back to Home</Btn>
      </div>
    </div>
  );
}

// ─── TRACKING PAGE ─────────────────────────────────────────────────────────────
function TrackingPage({ go, orderId }) {
  const { push } = useContext(NotifContext);
  const stages = [["📋","Order Placed","Your order has been received"],["✅","Accepted","Canteen has accepted your order"],["👨‍🍳","Preparing","Chef is cooking your food"],["🔔","Ready for Pickup","Your order is ready! Collect it now"],["🎉","Completed","Enjoy your meal!"]];
  const [active, setActive] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [timer, setTimer] = useState(12 * 60);
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(s => {
        if (s >= stages.length - 1) { clearInterval(interval); return s; }
        const next = s + 1;
        if (next === 3) { setIsReady(true); push("🔔 Your order is READY for pickup!", "success"); }
        else push(stages[next][1], "info");
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => { const t = setInterval(() => setTimer(s => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  const mm = String(Math.floor(timer / 60)).padStart(2, "0");
  const ss = String(timer % 60).padStart(2, "0");

  return (
    <div style={{ paddingBottom: 90, minHeight: "100vh", background: "#fff8f5" }}>
      <div style={{ background: "#fff", padding: "48px 16px 18px", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: OG }}>🚚 Live Order Tracking</div>
        <div style={{ fontSize: 13, color: "#aaa", marginTop: 3, fontWeight: 600 }}>Order #{orderId || "CB" + Math.floor(100000 + Math.random() * 900000)}</div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        {isReady && (
          <div style={{ background: "linear-gradient(120deg,#22c55e,#16a34a)", borderRadius: 22, padding: "20px 22px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16, animation: "glow 1.5s ease-in-out infinite", boxShadow: "0 10px 32px rgba(34,197,94,.35)" }}>
            <span style={{ fontSize: 44, animation: "ring 1.5s ease-in-out infinite" }}>🔔</span>
            <div><div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>Your Order is Ready! ✅</div><div style={{ fontSize: 13, color: "rgba(255,255,255,.9)", marginTop: 3 }}>Head to the canteen counter to collect your food</div></div>
          </div>
        )}

        {/* ETA and progress */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "18px", marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: 17, color: "#1a1a1a" }}>{stages[active][0]} {stages[active][1]}</div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>{stages[active][2]}</div>
            </div>
            <div style={{ textAlign: "center", background: "#FFF0EA", borderRadius: 16, padding: "10px 16px", minWidth: 70 }}>
              <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600 }}>ETA</div>
              <div style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 20, color: OG }}>{mm}:{ss}</div>
            </div>
          </div>
          <div style={{ background: "#f5f5f5", borderRadius: 999, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 999, background: `linear-gradient(90deg,${OG},${OG2})`, width: `${(active / (stages.length - 1)) * 100}%`, transition: "width 1s ease", boxShadow: `0 2px 8px rgba(255,87,34,.4)` }} />
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#aaa", marginTop: 6, fontWeight: 600 }}>{Math.round((active / (stages.length - 1)) * 100)}% complete</div>
        </div>

        {/* Timeline */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "18px", boxShadow: "0 4px 20px rgba(0,0,0,.07)" }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a", marginBottom: 16 }}>Order Timeline</div>
          {stages.map(([ic, lb, sub], i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: 999, background: i < active ? "#22c55e" : i === active ? `linear-gradient(135deg,${OG},${OG2})` : "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, transition: "background .5s", boxShadow: i === active ? `0 4px 14px rgba(255,87,34,.4)` : "none" }}>{i < active ? "✓" : ic}</div>
                {i < stages.length - 1 && <div style={{ width: 2, height: 34, background: i < active ? "#22c55e" : "#f0f0f0", transition: "background .5s", marginTop: 2 }} />}
              </div>
              <div style={{ paddingTop: 10, paddingBottom: i < stages.length - 1 ? 0 : 0 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: i <= active ? "#1a1a1a" : "#ccc" }}>{lb}</div>
                <div style={{ fontSize: 11, color: i <= active ? "#888" : "#ddd", marginTop: 2 }}>{sub}</div>
                {i === active && <span style={{ fontSize: 10, background: `linear-gradient(135deg,${OG},${OG2})`, color: "#fff", borderRadius: 6, padding: "2px 9px", fontWeight: 700, display: "inline-block", marginTop: 5, animation: "pulse 1.5s ease infinite" }}>IN PROGRESS</span>}
                {i < active && <span style={{ fontSize: 10, background: "#dcfce7", color: "#16a34a", borderRadius: 6, padding: "2px 9px", fontWeight: 700, display: "inline-block", marginTop: 5 }}>Done ✓</span>}
              </div>
            </div>
          ))}
        </div>

        <Btn outline onClick={() => go("home")} style={{ marginTop: 16 }}>← Back to Home</Btn>
      </div>
    </div>
  );
}

// ─── ORDERS PAGE ───────────────────────────────────────────────────────────────
function OrdersPage({ go }) {
  const { orders } = useContext(OrdersContext);
  const [tab, setTab] = useState("active");
  const active = orders.filter(o => o.status !== "Completed");
  const past = orders.filter(o => o.status === "Completed");

  return (
    <div style={{ paddingBottom: 90, minHeight: "100vh", background: "#fff8f5" }}>
      <div style={{ background: "#fff", padding: "48px 16px 14px", boxShadow: "0 2px 16px rgba(0,0,0,.06)" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: OG }}>📦 My Orders</div>
        <div style={{ display: "flex", background: "#f5f5f5", borderRadius: 16, padding: 4, marginTop: 14 }}>
          {[["active","🔥 Active"],["past","📋 History"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ flex: 1, padding: "11px 0", background: tab === v ? "#fff" : "transparent", border: "none", borderRadius: 13, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 13, color: tab === v ? OG : "#999", cursor: "pointer", transition: "all .2s", boxShadow: tab === v ? "0 2px 10px rgba(0,0,0,.09)" : "none" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 16px" }}>
        {tab === "active" ? (
          active.length > 0 ? active.slice(0, 6).map(o => {
            const sc = STATUS_COLORS[o.status] || STATUS_COLORS["Placed"];
            return (
              <div key={o.id} style={{ background: "#fff", borderRadius: 22, padding: "18px", marginBottom: 14, border: `2px solid ${OG}1A`, boxShadow: `0 6px 24px rgba(255,87,34,.1)`, animation: "fadeUp .4s ease both" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div><div style={{ fontWeight: 800, fontSize: 15, color: OG }}>#{o.id}</div><div style={{ fontSize: 12, color: "#aaa", marginTop: 2, fontWeight: 600 }}>{o.time}</div></div>
                  <span style={{ background: o.status === "Ready" ? "#22c55e" : `linear-gradient(135deg,${OG},${OG2})`, color: "#fff", borderRadius: 22, padding: "5px 14px", fontSize: 11, fontWeight: 800, animation: "pulse 2s ease infinite", boxShadow: "0 3px 10px rgba(0,0,0,.15)" }}>{o.status === "Ready" ? "✅ READY" : "● LIVE"}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {o.items.slice(0, 3).map((i, idx) => <ImgCard key={idx} src={i.img} alt={i.name} style={{ width: 48, height: 48, borderRadius: 12 }} />)}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", marginLeft: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>{o.items.map(i => i.name).join(", ").slice(0,32)}…</div>
                    <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>₹{o.total} · {o.items.length} item{o.items.length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
                <Btn sm onClick={() => go("tracking")} style={{ marginTop: 14, padding: "10px 0", width: "100%", fontSize: 13 }}>Track Order →</Btn>
              </div>
            );
          }) : (
            <div style={{ textAlign: "center", padding: "56px 0", color: "#ccc" }}>
              <div style={{ fontSize: 60, animation: "bob 2s ease-in-out infinite" }}>📦</div>
              <div style={{ marginTop: 12, fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>No active orders</div>
              <div style={{ fontSize: 13, color: "#aaa", marginTop: 6 }}>Your current orders will appear here</div>
              <Btn onClick={() => go("menu")} style={{ width: "auto", padding: "12px 32px", marginTop: 20 }}>Order Now →</Btn>
            </div>
          )
        ) : past.length > 0 ? past.map(o => (
          <div key={o.id} style={{ background: "#fff", borderRadius: 22, padding: "16px", marginBottom: 12, boxShadow: "0 2px 14px rgba(0,0,0,.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><div style={{ fontWeight: 800, fontSize: 14, color: "#1a1a1a" }}>#{o.id}</div><div style={{ fontSize: 12, color: "#aaa", marginTop: 2, fontWeight: 600 }}>{o.time}</div></div>
              <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 22, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>✅ Completed</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              {o.items.slice(0, 3).map((i, idx) => <ImgCard key={idx} src={i.img} alt={i.name} style={{ width: 44, height: 44, borderRadius: 10 }} />)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px dashed #f0f0f0" }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: OG }}>₹{o.total}</span>
              <Btn sm onClick={() => { o.items.forEach(() => {}); go("menu"); }} style={{ padding: "8px 18px", fontSize: 12 }}>Reorder ↻</Btn>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: "center", padding: "56px 0", color: "#ccc" }}>
            <div style={{ fontSize: 60 }}>📋</div>
            <div style={{ marginTop: 12, fontWeight: 800, fontSize: 16, color: "#1a1a1a" }}>No past orders</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ──────────────────────────────────────────────────────────────
function ProfilePage({ go }) {
  const { user, logout, update } = useContext(AuthContext);
  const { orders } = useContext(OrdersContext);
  const { push } = useContext(NotifContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const myOrders = orders.filter(o => o.user === (user?.name || ""));
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);

  const saveProfile = () => {
    update({ ...user, name, phone });
    push("Profile updated! ✅", "success");
    setEditing(false);
  };

  return (
    <div style={{ paddingBottom: 90, minHeight: "100vh", background: "#fff8f5" }}>
      <div style={{ background: `linear-gradient(135deg,${OG},${OG2})`, padding: "48px 20px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, fontSize: 120, opacity: .07, animation: "float 4s ease-in-out infinite" }}>👤</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "#fff" }}>My Profile</div>
      </div>

      <div style={{ margin: "-56px 16px 0", background: "#fff", borderRadius: 24, padding: "22px", boxShadow: "0 12px 40px rgba(0,0,0,.12)", position: "relative", zIndex: 2, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 68, height: 68, borderRadius: 999, background: `linear-gradient(135deg,${OG},${OG2})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1 }}>
            {editing ? (
              <>
                <input value={name} onChange={e => setName(e.target.value)} style={{ ...INPUT_STYLE, marginBottom: 8, fontSize: 16, fontWeight: 700 }} />
                <input value={phone} onChange={e => setPhone(e.target.value)} style={{ ...INPUT_STYLE, fontSize: 13 }} />
              </>
            ) : (
              <>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#1a1a1a" }}>{user?.name}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{user?.email}</div>
                {user?.phone && <div style={{ fontSize: 13, color: "#aaa", marginTop: 2 }}>📞 {user?.phone}</div>}
              </>
            )}
          </div>
          {editing ? (
            <Btn sm onClick={saveProfile} style={{ padding: "9px 16px" }}>Save</Btn>
          ) : (
            <button onClick={() => setEditing(true)} style={{ background: "#FFF0EA", border: "none", borderRadius: 12, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: OG }}>Edit ✏️</button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px dashed #f0f0f0" }}>
          {[["📦", orders.length, "Orders"],["💰","₹"+totalSpent,"Spent"],["⭐","4.8","Rating"]].map(([ic, v, l]) => (
            <div key={l} style={{ textAlign: "center", background: "#fff8f5", borderRadius: 14, padding: "12px 8px" }}>
              <div style={{ fontSize: 22 }}>{ic}</div>
              <div style={{ fontWeight: 900, fontSize: 16, color: "#1a1a1a", marginTop: 4 }}>{v}</div>
              <div style={{ fontSize: 11, color: "#aaa", fontWeight: 600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {[["🍔","Favourite Foods","View saved items",() => go("menu")],["💳","Saved Payments","Manage payment methods",null],["📦","Order History","See all your orders",() => go("orders")],["🔔","Notifications","Manage alerts",null],["⚙️","Settings","App preferences",null]].map(([ic, lb, sub, action]) => (
          <button key={lb} onClick={action} style={{ width: "100%", background: "#fff", border: "none", borderRadius: 18, padding: "16px", marginBottom: 10, cursor: action ? "pointer" : "default", display: "flex", alignItems: "center", gap: 14, textAlign: "left", boxShadow: "0 2px 12px rgba(0,0,0,.06)", transition: "transform .2s" }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#FFF0EA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{ic}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a1a" }}>{lb}</div><div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{sub}</div></div>
            {action && <span style={{ color: "#ccc", fontSize: 20 }}>›</span>}
          </button>
        ))}

        <button onClick={() => { logout(); }} style={{ width: "100%", background: "#fee2e2", border: "none", borderRadius: 18, padding: "16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", marginTop: 6 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: "#fecaca", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🚪</div>
          <div style={{ fontWeight: 800, fontSize: 14, color: "#dc2626" }}>Log Out</div>
        </button>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ───────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const { orders, updateStatus } = useContext(OrdersContext);
  const { foods, addFood, editFood, deleteFood } = useContext(FoodsContext);
  const { push } = useContext(NotifContext);
  const [tab, setTab] = useState("dashboard");
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status !== "Completed").length;
  const completedOrders = orders.filter(o => o.status === "Completed").length;

  const handleStatusChange = (id, status) => {
    updateStatus(id, status);
    push(`Order #${id} → ${status}`, "success");
  };

  const navItems = [["dashboard","📊","Dashboard"],["orders","📦","Orders"],["foods","🍱","Menu"],["analytics","📈","Analytics"]];

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", maxWidth: 430, margin: "0 auto", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background: "#1a1a1a", padding: "48px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #2a2a2a" }}>
        <div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff" }}>🔐 Admin Panel</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Campus Bites Management</div>
        </div>
        <button onClick={onLogout} style={{ background: "#2a2a2a", border: "none", borderRadius: 12, padding: "8px 14px", color: "#ef4444", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Logout</button>
      </div>

      <div style={{ background: "#1a1a1a", display: "flex", gap: 2, padding: "0 16px", borderBottom: "1px solid #2a2a2a", overflowX: "auto" }}>
        {navItems.map(([id, ic, lb]) => (
          <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", padding: "14px 14px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 12, color: tab === id ? OG : "#555", cursor: "pointer", whiteSpace: "nowrap", borderBottom: tab === id ? `2px solid ${OG}` : "2px solid transparent" }}>{ic} {lb}</button>
        ))}
      </div>

      <div style={{ padding: "16px", maxHeight: "calc(100vh - 112px)", overflowY: "auto" }}>
        {tab === "dashboard" && <AdminDashTab orders={orders} foods={foods} totalRevenue={totalRevenue} pendingOrders={pendingOrders} completedOrders={completedOrders} />}
        {tab === "orders" && <AdminOrdersTab orders={orders} onStatusChange={handleStatusChange} />}
        {tab === "foods" && <AdminFoodsTab foods={foods} addFood={addFood} editFood={editFood} deleteFood={deleteFood} push={push} />}
        {tab === "analytics" && <AdminAnalyticsTab orders={orders} foods={foods} />}
      </div>
    </div>
  );
}

function AdminDashTab({ orders, foods, totalRevenue, pendingOrders, completedOrders }) {
  const stats = [["₹"+totalRevenue.toLocaleString(),"Revenue","💰","#22c55e"],[String(orders.length),"Orders","📦",OG],[String(pendingOrders),"Pending","⏳","#f59e0b"],[String(completedOrders),"Completed","✅","#8b5cf6"]];
  return (
    <div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", marginBottom: 18 }}>👋 Welcome, Admin!</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
        {stats.map(([v, l, ic, c]) => (
          <div key={l} style={{ background: "#1a1a1a", borderRadius: 20, padding: "18px 16px", border: "1px solid #2a2a2a" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: c + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 10 }}>{ic}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 22, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: "#666", fontWeight: 600, marginTop: 3 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 12 }}>📋 Recent Orders</div>
      {orders.slice(0, 4).map(o => {
        const sc = STATUS_COLORS[o.status] || STATUS_COLORS["Placed"];
        return (
          <div key={o.id} style={{ background: "#1a1a1a", borderRadius: 16, padding: "14px 16px", marginBottom: 10, border: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>#{o.id}</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{o.user} · ₹{o.total}</div></div>
            <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{o.status}</span>
          </div>
        );
      })}
    </div>
  );
}

function AdminOrdersTab({ orders, onStatusChange }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);
  return (
    <div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 14 }}>📦 Manage Orders</div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
        {["all","Placed","Accepted","Preparing","Ready","Completed"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ background: filter === s ? OG : "#1a1a1a", color: filter === s ? "#fff" : "#666", border: `1px solid ${filter === s ? "transparent" : "#2a2a2a"}`, borderRadius: 22, padding: "6px 14px", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11, cursor: "pointer", whiteSpace: "nowrap" }}>{s === "all" ? "All" : s}</button>
        ))}
      </div>
      {filtered.map(o => {
        const sc = STATUS_COLORS[o.status] || STATUS_COLORS["Placed"];
        const next = STATUS_FLOW[o.status];
        return (
          <div key={o.id} style={{ background: "#1a1a1a", borderRadius: 20, padding: "16px", marginBottom: 12, border: "1px solid #2a2a2a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div><div style={{ fontWeight: 800, fontSize: 14, color: "#fff" }}>#{o.id}</div><div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>👤 {o.user} · {o.time}</div></div>
              <span style={{ background: sc.bg, color: sc.color, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700 }}>{o.status}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              {o.items.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <ImgCard src={item.img} alt={item.name} style={{ width: 36, height: 36, borderRadius: 8 }} />
                  <span style={{ fontSize: 13, color: "#ccc" }}>{item.name} ×{item.qty}</span>
                  <span style={{ marginLeft: "auto", fontSize: 13, color: OG, fontWeight: 700 }}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #2a2a2a" }}>
              <span style={{ fontWeight: 800, color: "#fff", fontSize: 15 }}>₹{o.total}</span>
              {next && <button onClick={() => onStatusChange(o.id, next)} style={{ background: OG, border: "none", borderRadius: 12, padding: "8px 16px", color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>→ {next}</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AdminFoodsTab({ foods, addFood, editFood, deleteFood, push }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", cat: "snacks", desc: "", price: "", rating: 4.0, veg: true, img: "", tag: "popular" });
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!form.name || !form.price || !form.img) { push("Fill required fields", "error"); return; }
    const item = { ...form, price: Number(form.price), rating: Number(form.rating), veg: form.veg === true || form.veg === "true" };
    if (editing) { editFood({ ...item, id: editing }); push("Item updated ✅", "success"); }
    else { addFood(item); push("Item added ✅", "success"); }
    setShowForm(false); setEditing(null);
    setForm({ name: "", cat: "snacks", desc: "", price: "", rating: 4.0, veg: true, img: "", tag: "popular" });
  };

  const startEdit = food => { setEditing(food.id); setForm(food); setShowForm(true); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>🍱 Menu Items</div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); }} style={{ background: OG, border: "none", borderRadius: 12, padding: "8px 16px", color: "#fff", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>+ Add Item</button>
      </div>
      {showForm && (
        <div style={{ background: "#1a1a1a", borderRadius: 20, padding: "18px", marginBottom: 16, border: "1px solid #2a2a2a" }}>
          <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12 }}>{editing ? "Edit Item" : "Add New Item"}</div>
          {[["name","Food Name *"],["img","Image URL *"],["desc","Description"],["price","Price (₹) *"]].map(([k, lb]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 4 }}>{lb}</label>
              <input value={form[k]} onChange={f(k)} style={{ ...INPUT_STYLE, background: "#222", borderColor: "#333", color: "#fff" }} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 4 }}>Category</label>
              <select value={form.cat} onChange={f("cat")} style={{ ...INPUT_STYLE, background: "#222", borderColor: "#333", color: "#fff" }}>
                {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, color: "#666", display: "block", marginBottom: 4 }}>Type</label>
              <select value={String(form.veg)} onChange={e => setForm(p => ({ ...p, veg: e.target.value === "true" }))} style={{ ...INPUT_STYLE, background: "#222", borderColor: "#333", color: "#fff" }}>
                <option value="true">🟢 Veg</option>
                <option value="false">🔴 Non-Veg</option>
              </select>
            </div>
          </div>
          <Btn onClick={submit} style={{ marginTop: 12, fontSize: 14 }}>{editing ? "Update Item" : "Add Item"}</Btn>
        </div>
      )}
      {foods.map(f => (
        <div key={f.id} style={{ background: "#1a1a1a", borderRadius: 18, padding: "14px", marginBottom: 10, border: "1px solid #2a2a2a", display: "flex", gap: 12, alignItems: "center" }}>
          <ImgCard src={f.img} alt={f.name} style={{ width: 60, height: 60, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 13, color: "#fff" }}>{f.name}</div>
            <div style={{ fontSize: 11, color: OG, fontWeight: 700, marginTop: 2 }}>₹{f.price} · ⭐{f.rating}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => startEdit(f)} style={{ background: "#2a2a2a", border: "none", borderRadius: 10, padding: "7px 12px", color: "#fff", fontSize: 12, cursor: "pointer" }}>✏️</button>
            <button onClick={() => { deleteFood(f.id); push(`${f.name} deleted`, "info"); }} style={{ background: "#2a2a2a", border: "none", borderRadius: 10, padding: "7px 12px", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminAnalyticsTab({ orders, foods }) {
  const totalRev = orders.reduce((s, o) => s + o.total, 0);
  const byCat = {};
  foods.forEach(f => { byCat[f.cat] = (byCat[f.cat] || 0) + 1; });
  const maxCat = Math.max(...Object.values(byCat));
  const statusCounts = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  return (
    <div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", marginBottom: 18 }}>📈 Analytics</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[["₹"+totalRev.toLocaleString(),"Total Revenue","#22c55e"],[String(orders.length),"Total Orders",OG],[String(foods.length),"Menu Items","#8b5cf6"],[String(orders.filter(o=>o.status==="Completed").length),"Completed","#f59e0b"]].map(([v, l, c]) => (
          <div key={l} style={{ background: "#1a1a1a", borderRadius: 18, padding: "16px", border: "1px solid #2a2a2a" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: c }}>{v}</div>
            <div style={{ fontSize: 11, color: "#555", fontWeight: 600, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: 20, padding: "18px", border: "1px solid #2a2a2a", marginBottom: 14 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 14 }}>Order Status Breakdown</div>
        {Object.entries(statusCounts).map(([s, count]) => {
          const sc = STATUS_COLORS[s] || { color: "#fff", bg: "#333" };
          const pct = Math.round((count / orders.length) * 100);
          return (
            <div key={s} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{s}</span>
                <span style={{ fontSize: 12, color: sc.color, fontWeight: 800 }}>{count} ({pct}%)</span>
              </div>
              <div style={{ background: "#2a2a2a", borderRadius: 999, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 999, background: sc.color, width: `${pct}%`, transition: "width 1s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ background: "#1a1a1a", borderRadius: 20, padding: "18px", border: "1px solid #2a2a2a" }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#fff", marginBottom: 14 }}>Menu by Category</div>
        {Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
          const catInfo = CATS.find(c => c.id === cat);
          const pct = Math.round((count / maxCat) * 100);
          return (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#aaa", fontWeight: 600 }}>{catInfo?.emoji} {catInfo?.label || cat}</span>
                <span style={{ fontSize: 12, color: catInfo?.color || OG, fontWeight: 800 }}>{count} items</span>
              </div>
              <div style={{ background: "#2a2a2a", borderRadius: 999, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 999, background: catInfo?.color || OG, width: `${pct}%`, transition: "width 1s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
function AppInner() {
  const { user, logout } = useContext(AuthContext);
  const [screen, setScreen] = useState("splash");
  const [page, setPage] = useState("home");
  const [cat, setCat] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const go = dest => {
    if (["cart","orders","profile"].includes(dest) && !user) { setScreen("login"); return; }
    if (dest === "payment") { setScreen("payment"); return; }
    if (dest === "success") { setScreen("success"); return; }
    if (dest === "tracking") { setScreen("tracking"); return; }
    setPage(dest); setScreen("main");
  };

  useEffect(() => {
    if (user && screen === "login") {
      if (user.role === "admin") setScreen("admin");
      else setScreen("main");
    }
  }, [user]);

  const onOrderPlaced = id => { setCurrentOrderId(id); setActiveOrder({ id }); };

  const handleLoginDone = role => {
    if (role === "admin") setScreen("admin");
    else setScreen("main");
  };

  const pageMap = {
    home: <HomePage go={go} setCat={setCat} activeOrder={activeOrder} />,
    menu: <MenuPage catFilter={cat} setCat={setCat} />,
    cart: <CartPage go={go} />,
    orders: <OrdersPage go={go} />,
    profile: <ProfilePage go={go} />,
  };

  let content;
  if (screen === "splash") content = <SplashScreen onDone={() => setScreen(user ? (user.role === "admin" ? "admin" : "main") : "login")} />;
  else if (screen === "login") content = <LoginScreen onDone={handleLoginDone} />;
  else if (screen === "admin") return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <style>{GLOBAL_CSS}</style>
      <AdminDashboard onLogout={() => { logout(); setScreen("login"); }} />
    </div>
  );
  else if (screen === "success") content = <SuccessScreen go={go} orderId={currentOrderId} />;
  else if (screen === "tracking") content = <TrackingPage go={go} orderId={currentOrderId} />;
  else if (screen === "payment") content = <PaymentPage go={p => { if (p === "success") setScreen("success"); else go(p); }} onOrderPlaced={onOrderPlaced} />;
  else content = pageMap[page] || pageMap.home;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#fff8f5", position: "relative", boxShadow: "0 0 80px rgba(0,0,0,0.25)" }}>
      <style>{GLOBAL_CSS}</style>
      {content}
      {screen === "main" && <BottomNav page={page} go={go} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FoodsProvider>
          <OrdersProvider>
            <NotifProvider>
              <AppInner />
            </NotifProvider>
          </OrdersProvider>
        </FoodsProvider>
      </CartProvider>
    </AuthProvider>
  );
}
