import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatRupees, orderStatuses } from "../../services/mockRestaurantData.js";
import { Icon } from "../../layouts/RestaurantLayout.jsx";
import { useRestaurantData } from "./RestaurantDataContext.jsx";

function PageHeading({ eyebrow = "MONDAY, 24 JUNE 2024", title, description, children }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{children && <div className="heading-actions">{children}</div>}</div>;
}

function StatusPill({ status }) {
  const className = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-pill status-${className}`}><i />{status}</span>;
}

const orderTransitions = {
  New: ["Accepted", "Cancelled"],
  Accepted: ["Preparing", "Cancelled"],
  Preparing: ["Ready", "Cancelled"],
  Ready: ["Served", "Cancelled"],
  Served: [],
  Cancelled: [],
};

function DemoNote({ children }) {
  return <div className="demo-note"><span className="note-icon">i</span><span>{children}</span></div>;
}

function EmptyState({ title, message }) {
  return <div className="empty-state"><div className="empty-icon"><Icon name="receipt" size={22} /></div><strong>{title}</strong><p>{message}</p></div>;
}

function Money({ value }) {
  return <span className="money">{formatRupees(value)}</span>;
}

function MetricCard({ label, value, detail, tone, icon, trend }) {
  return <article className={`metric-card metric-${tone}`}><div className="metric-top"><span>{label}</span><span className="metric-icon"><Icon name={icon} size={18} /></span></div><strong className="metric-value">{value}</strong><div className="metric-detail">{trend && <span className="trend">{trend}</span>}{detail}</div></article>;
}

function SalesChart() {
  const points = "0,112 54,92 108,99 162,63 216,78 270,46 324,57 378,24 432,36 486,10";
  const fill = `0,145 ${points} 486,145`;
  return <div className="chart-wrap">
    <div className="chart-summary"><div><strong>₹ 38,420</strong><span><b>+12.8%</b> vs yesterday</span></div><span className="select-control chart-period">Today</span></div>
    <div className="chart-area">
      <div className="chart-y-labels"><span>₹ 10k</span><span>₹ 7.5k</span><span>₹ 5k</span><span>₹ 2.5k</span><span>₹ 0</span></div>
      <svg className="sales-chart" viewBox="0 0 486 150" preserveAspectRatio="none" role="img" aria-label="Illustrative sales trend throughout today">
        <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#e98950" stopOpacity=".22" /><stop offset="100%" stopColor="#e98950" stopOpacity="0" /></linearGradient></defs>
        <path d="M 0 20 H 486 M 0 52 H 486 M 0 84 H 486 M 0 116 H 486 M 0 145 H 486" className="chart-grid" />
        <polygon points={fill} fill="url(#chartFill)" />
        <polyline points={points} className="chart-line" />
        <circle cx="378" cy="24" r="4.5" className="chart-point" />
      </svg>
    </div>
    <div className="chart-x-labels"><span>10 AM</span><span>11 AM</span><span>12 PM</span><span>1 PM</span><span>2 PM</span><span>3 PM</span></div>
  </div>;
}

function OrderTable({ orders, compact = false, onSelect }) {
  if (!orders.length) return <EmptyState title="No orders found" message="Try adjusting your search or filters." />;
  return <div className={`table-scroll ${compact ? "compact-table" : ""}`}><table><thead><tr><th>ORDER</th><th>TABLE</th><th>ITEMS</th><th>AMOUNT</th><th>STATUS</th><th>TIME</th></tr></thead><tbody>
    {orders.map((order) => <tr key={order.id}>
      <td>{onSelect ? <button className="order-open" onClick={() => onSelect(order)}><strong className="order-number">{order.id}</strong><small>Open order details</small></button> : <><strong className="order-number">{order.id}</strong><small>#{order.id.slice(-3)}</small></>}</td><td>{order.table}</td>
      <td>{order.items.reduce((sum, item) => sum + item.qty, 0)} items <span className="muted">· {order.items[0]?.name}</span></td><td><Money value={order.items.reduce((sum, item) => sum + item.qty * item.price, 0)} /></td>
      <td><StatusPill status={order.status} /></td><td className="muted">{order.time}</td>
    </tr>)}
  </tbody></table></div>;
}

function DashboardPage() {
  const { data } = useRestaurantData();
  const orders = data.orders;
  const pending = orders.filter((order) => ["New", "Accepted", "Preparing"].includes(order.status)).length;
  const openTables = data.tables.filter((table) => table.status !== "Available").length;
  const activeOrders = [...orders].slice(0, 4);
  return <>
    <PageHeading title="Good afternoon, Arjun" description="Here’s what’s happening at Juniper & Grain today.">
      <span className="button button-secondary"><Icon name="clock" size={16} /> Today</span>
      <button className="button button-primary" onClick={() => window.print()}><span>⇩</span> Export overview</button>
    </PageHeading>
    <div className="service-callout"><span className="callout-icon">✦</span><span><strong>Lunch service is in full swing.</strong> Keep an eye on the kitchen queue and open table sessions.</span><Link to="/kitchen">View kitchen <Icon name="arrow" size={15} /></Link></div>
    <section className="metrics-grid">
      <MetricCard label="Today's sales" value="₹38,420" detail={<span>vs. ₹34,050 yesterday</span>} trend="+12.8%" tone="orange" icon="chart" />
      <MetricCard label="Orders today" value="48" detail={<span>Across 8 table sessions</span>} trend="+8" tone="blue" icon="receipt" />
      <MetricCard label="Pending orders" value={pending} detail={<span>Need attention</span>} tone="yellow" icon="clock" />
      <MetricCard label="Completed" value="36" detail={<span>75% of today's orders</span>} tone="green" icon="grid" />
      <MetricCard label="Active tables" value={`${openTables} / ${data.tables.length}`} detail={<span>{data.tables.filter((table) => table.status === "Available").length} tables available</span>} tone="purple" icon="table" />
      <MetricCard label="Unpaid bills" value="2" detail={<span>₹2,060 outstanding</span>} tone="rose" icon="wallet" />
    </section>
    <section className="dashboard-main-grid">
      <article className="panel sales-panel"><div className="panel-heading"><div><h2>Sales overview</h2><p>A quick look at today's performance</p></div></div><SalesChart /></article>
      <article className="panel popular-panel"><div className="panel-heading"><div><h2>Popular items</h2><p>Best sellers today</p></div><Link to="/menu" className="text-link">View menu <Icon name="arrow" size={14} /></Link></div>
        <div className="popular-list">{[["Paneer Tikka", "Starters", "32 sold", "₹10,240", "PT", "peach"], ["Butter Chicken", "Main course", "26 sold", "₹12,480", "BC", "sand"], ["Masala Soda", "Beverages", "21 sold", "₹1,890", "MS", "blue"], ["Veg Biryani", "Main course", "18 sold", "₹5,220", "VB", "sage"]].map(([name, category, sold, amount, initials, color], index) => <div className="popular-item" key={name}><span className={`food-avatar ${color}`}>{initials}</span><div className="popular-name"><strong>{name}</strong><small>{category}</small></div><span className="popular-sold">{sold}</span><strong className="popular-revenue">{amount}</strong>{index === 0 && <span className="top-tag">#1</span>}</div>)}</div>
      </article>
    </section>
    <section className="dashboard-lower-grid">
      <article className="panel recent-panel"><div className="panel-heading"><div><h2>Recent orders</h2><p>Latest activity from your tables</p></div><Link to="/orders" className="text-link">All orders <Icon name="arrow" size={14} /></Link></div><OrderTable orders={activeOrders} compact /></article>
      <article className="panel table-summary-panel"><div className="panel-heading"><div><h2>Table status</h2><p>Sample session overview</p></div><Link to="/tables" className="text-link">Floor plan <Icon name="arrow" size={14} /></Link></div><div className="table-status-list">{data.tables.slice(0, 5).map((table) => <div key={table.id} className="table-status-row"><span className={`table-mini-icon table-${table.status.toLowerCase()}`}>{table.id.split("-")[1]}</span><span className="table-status-title"><strong>Table {table.id.slice(-2)}</strong><small>{table.orders ? `${table.orders} orders · ${table.since}` : `${table.seats} seats`}</small></span><StatusPill status={table.status} />{table.amount > 0 && <strong className="table-amount">{formatRupees(table.amount)}</strong>}</div>)}</div></article>
    </section>
    <section className="panel payment-panel"><div className="panel-heading"><div><h2>Recent payments</h2><p>Latest settled bills</p></div><Link to="/billing" className="text-link">Payment history <Icon name="arrow" size={14} /></Link></div>
      <div className="payment-row payment-header"><span>REFERENCE</span><span>TABLE</span><span>METHOD</span><span>AMOUNT</span><span>TIME</span><span>STATUS</span></div>
      {data.payments.map((payment) => <div className="payment-row" key={payment.id}><strong>{payment.id}</strong><span>{payment.table}</span><span><i className="method-mark">{payment.method === "UPI" ? "↗" : "₹"}</i>{payment.method}</span><strong>{formatRupees(payment.amount)}</strong><span className="muted">{payment.time}</span><StatusPill status={payment.status} /></div>)}
    </section>
  </>;
}

function OrdersPage() {
  const { data, updateOrderStatus } = useRestaurantData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All statuses");
  const [date, setDate] = useState("2024-06-24");
  const [selected, setSelected] = useState(null);
  const orders = useMemo(() => data.orders.filter((order) => {
    const matchesQuery = `${order.id} ${order.table} ${order.items.map((item) => item.name).join(" ")}`.toLowerCase().includes(query.toLowerCase());
    const matchesDate = !date || order.date === date;
    return matchesQuery && matchesDate && (filter === "All statuses" || order.status === filter);
  }), [data.orders, date, filter, query]);
  return <>
    <PageHeading title="Orders" description="Follow every order from the first tap to the table."><button className="button button-secondary" onClick={() => window.print()}><span>⇩</span> Export</button></PageHeading>
    <DemoNote>Order list and status changes below use illustrative demo data saved only in this browser. Live order updates require a backend API.</DemoNote>
    <section className="panel page-panel"><div className="list-toolbar"><label className="search-field"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order, table or item…" /></label><input className="select-control date-filter" type="date" aria-label="Filter orders by date" value={date} onChange={(event) => setDate(event.target.value)} /><select className="select-control" aria-label="Filter by status" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All statuses</option>{orderStatuses.map((status) => <option key={status}>{status}</option>)}</select><span className="result-count">{orders.length} orders</span></div>
      <OrderTable orders={orders} onSelect={setSelected} />
    </section>
    {selected && <div className="modal-backdrop" onClick={() => setSelected(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="order-detail-title" onClick={(event) => event.stopPropagation()}>
      <div className="modal-heading"><div><span className="eyebrow">ORDER DETAILS</span><h2 id="order-detail-title">{selected.id} <span className="muted">· {selected.table}</span></h2></div><button className="icon-button" onClick={() => setSelected(null)} aria-label="Close order details">×</button></div>
      <div className="detail-meta"><span><Icon name="clock" size={15} /> {selected.time} · {selected.minutesAgo} min ago</span><StatusPill status={selected.status} /></div>
      <div className="order-detail-items">{selected.items.map((item) => <div key={item.name}><span>{item.qty} × {item.name}</span><strong>{formatRupees(item.qty * item.price)}</strong></div>)}</div>
      <div className="detail-total"><span>Order total</span><strong>{formatRupees(selected.items.reduce((sum, item) => sum + item.qty * item.price, 0))}</strong></div>
      <label className="field-label">Update status<select className="input-control" value={selected.status} disabled={!orderTransitions[selected.status]?.length} onChange={(event) => { updateOrderStatus(selected.id, event.target.value); setSelected({ ...selected, status: event.target.value }); }}>{[selected.status, ...(orderTransitions[selected.status] || [])].map((status) => <option key={status}>{status}</option>)}</select></label>
      <p className="field-hint">Prototype only. In production, the server must validate order status transitions.</p>
    </section></div>}
  </>;
}

function KitchenPage() {
  const { data, updateOrderStatus } = useRestaurantData();
  const kitchenOrders = data.orders.filter((order) => ["New", "Accepted", "Preparing", "Ready"].includes(order.status));
  const columns = [
    { title: "New", statuses: ["New"], className: "new" },
    { title: "In preparation", statuses: ["Accepted", "Preparing"], className: "preparing" },
    { title: "Ready to serve", statuses: ["Ready"], className: "ready" },
  ];
  const nextStatus = { New: "Accepted", Accepted: "Preparing", Preparing: "Ready", Ready: "Served" };
  return <>
    <PageHeading title="Kitchen display" description="A clear view of what needs to be made and served."><span className="live-pill"><i /> DEMO BOARD</span></PageHeading>
    <DemoNote>Kitchen cards are sample orders. Status changes stay in this browser; use a confirmed backend workflow for live service.</DemoNote>
    <div className="kitchen-board">{columns.map((column) => {
      const orders = kitchenOrders.filter((order) => column.statuses.includes(order.status));
      return <section className={`kitchen-column column-${column.className}`} key={column.title}><div className="column-heading"><div><span className="column-dot" /><h2>{column.title}</h2></div><span className="column-count">{orders.length}</span></div>
        {!orders.length ? <div className="column-empty">Nothing here right now</div> : orders.map((order) => <article className="kitchen-card" key={order.id}><div className="kitchen-card-top"><strong>{order.id}</strong><span className="elapsed"><Icon name="clock" size={14} /> {order.minutesAgo}m</span></div><div className="kitchen-table">{order.table} <span>·</span> {order.time}</div><div className="kitchen-items">{order.items.map((item) => <div key={item.name}><strong>{item.qty}×</strong><span>{item.name}</span></div>)}</div><div className="kitchen-card-bottom"><StatusPill status={order.status} /><button className="button button-small button-dark" onClick={() => updateOrderStatus(order.id, nextStatus[order.status])}>{order.status === "Ready" ? "Mark served" : `Start ${order.status === "New" ? "order" : "next"}`} <Icon name="arrow" size={14} /></button></div></article>)}
      </section>;
    })}</div>
  </>;
}

function TablesPage() {
  const { data } = useRestaurantData();
  const occupied = data.tables.filter((table) => table.status === "Occupied").length;
  return <>
    <PageHeading title="Tables & QR codes" description="See your floor at a glance and follow active sessions."><button className="button button-secondary" onClick={() => window.print()}>Print floor plan</button></PageHeading>
    <DemoNote>Tables, session identifiers, and QR placeholders are illustrative. The backend must issue and validate session tokens; no QR token is created here.</DemoNote>
    <div className="table-stats"><div><span className="stat-indicator occupied" /><strong>{occupied}</strong><span>Occupied</span></div><div><span className="stat-indicator available" /><strong>{data.tables.filter((table) => table.status === "Available").length}</strong><span>Available</span></div><div><span className="stat-indicator billing" /><strong>{data.tables.filter((table) => table.status === "Billing").length}</strong><span>Billing</span></div><div className="floor-caption">GROUND FLOOR <span>·</span> 8 TABLES</div></div>
    <div className="tables-grid">{data.tables.map((table) => <article className={`table-card card-${table.status.toLowerCase()}`} key={table.id}><div className="table-card-top"><div className="table-number-block"><span className="table-outline"><Icon name="table" size={19} /></span><div><strong>{table.id}</strong><small>{table.seats} seats</small></div></div></div><StatusPill status={table.status} />
      {table.session ? <><div className="table-card-session"><span>SESSION</span><strong>{table.session}</strong></div><div className="table-card-meta"><span>{table.orders} orders</span><strong>{formatRupees(table.amount)}</strong></div><div className="table-card-footer"><span>Since {table.since}</span><Link to={`/billing?session=${encodeURIComponent(table.session)}`}>View bill <Icon name="arrow" size={13} /></Link></div></> : <div className="available-copy"><span className="qr-placeholder">▦</span><span>Ready for next guests</span><span className="unavailable-action" title="QR generation requires backend-issued table data">QR setup unavailable</span></div>}
    </article>)}</div>
  </>;
}

function MenuPage() {
  const { data, addMenuItem, deleteMenuItem, toggleMenuAvailability, updateMenuItem } = useRestaurantData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  const categories = ["Starters", "Main course", "Beverages", "Desserts"];
  const items = data.menu.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && (category === "All categories" || item.category === category));
  function submitItem(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name").trim();
    const item = { name, category: form.get("category"), description: form.get("description").trim(), price: Number(form.get("price")), initials: name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() };
    if (editingItem) updateMenuItem(editingItem.id, item);
    else addMenuItem({ ...item, available: true, color: "peach" });
    setShowForm(false);
    setEditingItem(null);
  }
  return <>
    <PageHeading title="Menu management" description="Keep your menu fresh, accurate and ready to order."><button className="button button-primary" onClick={() => setShowForm(true)}><Icon name="plus" size={16} /> Add menu item</button></PageHeading>
    <DemoNote>Menu edits are saved as browser-only demo data. They do not publish to customer QR menus.</DemoNote>
    <section className="panel page-panel"><div className="list-toolbar"><label className="search-field"><Icon name="search" size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search menu items…" /></label><select className="select-control" aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}><option>All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select><span className="result-count">{items.length} items</span></div>
      <div className="menu-table-wrap"><table className="menu-table"><thead><tr><th>ITEM</th><th>CATEGORY</th><th>PRICE</th><th>AVAILABILITY</th><th>ACTIONS</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><div className="menu-name-cell"><span className={`food-avatar ${item.color}`}>{item.initials}</span><div><button className="menu-item-view" onClick={() => setViewingItem(item)}>{item.name}</button><small>{item.description}</small></div></div></td><td>{item.category}</td><td><strong>{formatRupees(item.price)}</strong></td><td><button className={`availability-toggle ${item.available ? "is-available" : ""}`} onClick={() => toggleMenuAvailability(item.id)} aria-pressed={item.available}><span /><span>{item.available ? "Available" : "Unavailable"}</span></button></td><td><button className="text-button" onClick={() => { setEditingItem(item); setShowForm(true); }}>Edit</button><button className="text-button danger-text" onClick={() => window.confirm(`Remove ${item.name} from demo menu?`) && deleteMenuItem(item.id)}>Delete</button></td></tr>)}</tbody></table>{items.length === 0 && <EmptyState title="No menu items found" message="Try a different search or category." />}</div>
    </section>
    {showForm && <div className="modal-backdrop" onClick={() => { setShowForm(false); setEditingItem(null); }}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="add-menu-title" onClick={(event) => event.stopPropagation()}><div className="modal-heading"><div><span className="eyebrow">MENU MANAGEMENT · DEMO</span><h2 id="add-menu-title">{editingItem ? "Edit menu item" : "Add menu item"}</h2></div><button className="icon-button" aria-label="Close" onClick={() => { setShowForm(false); setEditingItem(null); }}>×</button></div><form onSubmit={submitItem} className="menu-form"><label className="field-label">Item name<input className="input-control" name="name" defaultValue={editingItem?.name || ""} required maxLength="60" /></label><label className="field-label">Category<select className="input-control" name="category" defaultValue={editingItem?.category || categories[0]}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label><label className="field-label">Description<textarea className="input-control" name="description" defaultValue={editingItem?.description || ""} rows="3" maxLength="140" /></label><label className="field-label">Price (₹)<input className="input-control" type="number" name="price" defaultValue={editingItem?.price || ""} min="1" step="1" required /></label><p className="field-hint">This {editingItem ? "change is" : "item is added"} to demo data only; customer menus are not connected.</p><div className="modal-actions"><button className="button button-secondary" type="button" onClick={() => { setShowForm(false); setEditingItem(null); }}>Cancel</button><button className="button button-primary" type="submit">{editingItem ? "Save demo changes" : "Add to demo menu"}</button></div></form></section></div>}
    {viewingItem && <div className="modal-backdrop" onClick={() => setViewingItem(null)}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="view-menu-title" onClick={(event) => event.stopPropagation()}><div className="modal-heading"><div><span className="eyebrow">MENU ITEM · DEMO</span><h2 id="view-menu-title">{viewingItem.name}</h2></div><button className="icon-button" aria-label="Close item details" onClick={() => setViewingItem(null)}>×</button></div><p className="menu-view-description">{viewingItem.description || "No description provided."}</p><div className="detail-meta"><span>{viewingItem.category}</span><StatusPill status={viewingItem.available ? "Available" : "Unavailable"} /></div><div className="detail-total"><span>Price</span><strong>{formatRupees(viewingItem.price)}</strong></div></section></div>}
  </>;
}

function BillingPage() {
  const { data } = useRestaurantData();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(() => searchParams.get("session") || "");
  const activeTables = data.tables.filter((table) => table.session);
  const selected = activeTables.find((table) => table.session === session)
    || activeTables[0];
  const billItems = selected
    ? data.orders.filter((order) => order.table === selected.id).flatMap((order) => order.items)
    : [];
  const subtotal = billItems.reduce((total, item) => total + item.qty * item.price, 0);
  return <>
    <PageHeading title="Billing & payments" description="Review table sessions and settle bills with confidence." />
    <DemoNote>Payments are not connected. No transaction can be created, marked paid, or used to close a session in this prototype.</DemoNote>
    <div className="billing-layout"><section className="panel billing-sessions"><div className="panel-heading"><div><h2>Active sessions</h2><p>{activeTables.length} open on the floor</p></div></div><div className="session-list">{activeTables.map((table) => <button key={table.session} className={`session-option ${selected?.session === table.session ? "selected" : ""}`} onClick={() => setSession(table.session)}><span className="session-table-icon"><Icon name="table" size={17} /></span><span className="session-copy"><strong>Table {table.id.slice(-2)}</strong><small>{table.session} · {table.orders} orders</small></span><strong>{formatRupees(table.amount)}</strong><span className="session-chevron">›</span></button>)}</div></section>
      <section className="panel bill-panel"><div className="bill-heading"><div><span className="eyebrow">TABLE SESSION</span><h2>{selected ? `Table ${selected.id.slice(-2)}` : "Select a session"}</h2></div>{selected && <StatusPill status={selected.status} />}</div>
        {selected ? <><div className="bill-meta"><span>Session <strong>{selected.session}</strong></span><span>{selected.orders} eligible orders</span></div><div className="bill-items">{data.orders.filter((order) => order.table === selected.id).flatMap((order) => order.items.map((item, index) => <div key={`${order.id}-${item.name}-${index}`}><span className="bill-item-name"><strong>{item.qty} × {item.name}</strong><small>{formatRupees(item.price)} each</small></span><span>{formatRupees(item.qty * item.price)}</span></div>))}</div><div className="bill-totals"><div><span>Subtotal</span><strong>{formatRupees(subtotal)}</strong></div><div><span>Tax / service charge</span><span className="muted">Not configured</span></div><div className="bill-final"><strong>Amount due*</strong><strong>{formatRupees(subtotal)}</strong></div></div><div className="payment-methods"><span>PAYMENT METHOD</span><button disabled>Cash</button><button disabled>UPI</button></div><button className="button button-primary button-full" disabled title="Payment API is not available">Record payment unavailable</button><p className="field-hint">* Illustrative amount only, not a verified bill. Tax and charges are not calculated.</p></> : <EmptyState title="No active sessions" message="There are no table sessions to bill." />}
      </section></div>
    <section className="panel payment-panel history-panel"><div className="panel-heading"><div><h2>Payment history</h2><p>Illustrative completed transactions</p></div></div><div className="payment-row payment-header"><span>REFERENCE</span><span>TABLE</span><span>METHOD</span><span>AMOUNT</span><span>TIME</span><span>STATUS</span></div>{data.payments.map((payment) => <div className="payment-row" key={payment.id}><strong>{payment.id}</strong><span>{payment.table}</span><span>{payment.method}</span><strong>{formatRupees(payment.amount)}</strong><span className="muted">{payment.time}</span><StatusPill status={payment.status} /></div>)}</section>
  </>;
}

function ReportsPage() {
  const { data } = useRestaurantData();
  const [range, setRange] = useState("This week");
  const rows = [
    { date: "24 Jun 2024", ref: "DAY-024", orders: 48, method: "UPI · Cash", amount: 38_420 },
    { date: "23 Jun 2024", ref: "DAY-023", orders: 52, method: "UPI · Cash", amount: 42_180 },
    { date: "22 Jun 2024", ref: "DAY-022", orders: 44, method: "UPI · Cash", amount: 35_760 },
    { date: "21 Jun 2024", ref: "DAY-021", orders: 39, method: "UPI · Cash", amount: 31_940 },
    { date: "20 Jun 2024", ref: "DAY-020", orders: 46, method: "UPI · Cash", amount: 37_250 },
  ];
  function exportCsv() {
    const csv = ["Date,Reference,Orders,Payment methods,Sales (INR)", ...rows.map((row) => `${row.date},${row.ref},${row.orders},"${row.method}",${row.amount}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "hunger-demo-sales-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  return <>
    <PageHeading title="Sales & reports" description="Understand sales trends and day-to-day performance."><button className="button button-primary" onClick={exportCsv}><span>⇩</span> Export CSV</button></PageHeading>
    <DemoNote>All report figures on this page are illustrative demo data, not live sales. Real reports require verified backend payment and order records.</DemoNote>
    <div className="report-toolbar"><div className="report-tabs">{["Today", "This week", "This month"].map((value) => <button key={value} className={range === value ? "selected" : ""} onClick={() => setRange(value)}>{value}</button>)}</div><span className="button button-secondary">Demo date · 24 Jun 2024</span></div>
    <section className="report-metrics"><MetricCard label="Gross sales" value={range === "Today" ? "₹38,420" : range === "This week" ? "₹1,85,550" : "₹7,42,680"} detail="Illustrative totals" tone="orange" icon="chart" /><MetricCard label="Orders" value={range === "Today" ? "48" : "229"} detail="Orders in selected period" tone="blue" icon="receipt" /><MetricCard label="Average order value" value="₹796" detail="Sales ÷ orders" tone="green" icon="wallet" /><MetricCard label="Top item" value="Paneer Tikka" detail="32 sold today" tone="purple" icon="grid" /></section>
    <section className="dashboard-main-grid reports-grid"><article className="panel sales-panel"><div className="panel-heading"><div><h2>Sales trend</h2><p>{range} · demo data</p></div></div><SalesChart /></article><article className="panel popular-panel"><div className="panel-heading"><div><h2>Payment methods</h2><p>Illustrative mix for today</p></div></div><div className="method-breakdown"><div className="method-legend"><span><i className="legend-upi" /> UPI <strong>68%</strong></span><span><i className="legend-cash" /> Cash <strong>32%</strong></span></div><div className="method-bar"><span /><i /></div><p className="field-hint">Based on sample records only. Payment method reporting needs the billing API.</p></div><div className="report-popular"><h3>Popular menu items</h3>{data.menu.slice(0, 3).map((item, index) => <div key={item.id}><span>{index + 1}</span><strong>{item.name}</strong><b>{[32, 26, 21][index]} sold</b></div>)}</div></article></section>
    <section className="panel payment-panel report-records"><div className="panel-heading"><div><h2>Daily sales records</h2><p>Sample business activity</p></div></div><div className="table-scroll"><table><thead><tr><th>DATE</th><th>REFERENCE</th><th>ORDERS</th><th>PAYMENT METHODS</th><th>TOTAL SALES</th></tr></thead><tbody>{rows.map((row) => <tr key={row.ref}><td>{row.date}</td><td><strong>{row.ref}</strong></td><td>{row.orders}</td><td>{row.method}</td><td><strong>{formatRupees(row.amount)}</strong></td></tr>)}</tbody></table></div></section>
  </>;
}

function SettingsPage() {
  const { data, updateSettings, resetDemo } = useRestaurantData();
  function submitSettings(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    updateSettings({ name: form.get("name").trim(), address: form.get("address").trim(), phone: form.get("phone").trim(), opening: form.get("opening"), closing: form.get("closing") });
  }
  return <>
    <PageHeading title="Restaurant settings" description="Manage the basic details shown in your restaurant workspace." />
    <DemoNote>Settings are saved in local browser storage only. Authentication, staff roles and restaurant access are not configured in this prototype.</DemoNote>
    <div className="settings-layout">    <section className="panel settings-panel"><div className="panel-heading"><div><h2>Restaurant details</h2><p>Basic information for your restaurant</p></div></div><form key={JSON.stringify(data.settings)} onSubmit={submitSettings} className="settings-form"><label className="field-label">Restaurant name<input className="input-control" name="name" defaultValue={data.settings.name} required maxLength="80" /></label><label className="field-label">Phone number<input className="input-control" name="phone" defaultValue={data.settings.phone} required type="tel" /></label><label className="field-label full-field">Address<textarea className="input-control" name="address" defaultValue={data.settings.address} required rows="2" /></label><label className="field-label">Opening time<input className="input-control" name="opening" defaultValue={data.settings.opening} /></label><label className="field-label">Closing time<input className="input-control" name="closing" defaultValue={data.settings.closing} /></label><div className="form-footer"><span className="field-hint">Demo changes persist in this browser.</span><button className="button button-primary" type="submit">Save changes</button></div></form></section>
      <section className="panel settings-panel"><div className="panel-heading"><div><h2>Prototype data</h2><p>Reset this browser's sample records</p></div></div><p className="reset-copy">Reset orders, tables, menu items, payments, and restaurant details to their original illustrative values.</p><button className="button button-secondary danger-button" onClick={() => window.confirm("Reset all saved demo data in this browser?") && resetDemo()}>Reset demo data</button></section>
      <section className="panel settings-panel"><div className="panel-heading"><div><h2>Backend connection</h2><p>Not configured</p></div><span className="status-pill status-new"><i /> Offline</span></div><p className="reset-copy">No Spring Boot backend or API documentation was present in the workspace. Operations that require server confirmation are intentionally unavailable.</p><code className="api-hint">VITE_API_BASE_URL</code></section>
    </div>
  </>;
}

export { DashboardPage, OrdersPage, KitchenPage, TablesPage, MenuPage, BillingPage, ReportsPage, SettingsPage };
