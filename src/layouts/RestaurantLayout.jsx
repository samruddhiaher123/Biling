import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useRestaurantData } from "../features/restaurant/RestaurantDataContext.jsx";

const navigation = [
  { label: "Overview", path: "/dashboard", icon: "grid" },
  { label: "Orders", path: "/orders", icon: "receipt" },
  { label: "Kitchen", path: "/kitchen", icon: "chef" },
  { label: "Tables & QR", path: "/tables", icon: "table" },
  { label: "Menu", path: "/menu", icon: "menu" },
  { label: "Billing", path: "/billing", icon: "wallet" },
  { label: "Sales & reports", path: "/reports", icon: "chart" },
];

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    receipt: <><path d="M5 3.5h14v17l-3-2-4 2-4-2-3 2z" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4" /></>,
    chef: <><path d="M6 10.5a4 4 0 1 1 7.5-2A4.5 4.5 0 1 1 18 15H6a3 3 0 0 1 0-6" /><path d="M7 15v5h10v-5" /></>,
    table: <><path d="M4 8h16M6 8v12m12-12v12M3 20h18M7 4h10v4H7z" /></>,
    menu: <><path d="M4 5h16M4 12h16M4 19h16" /><circle cx="8" cy="5" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /></>,
    wallet: <><rect x="3" y="5" width="18" height="15" rx="2" /><path d="M3 9h18M15.5 14h.01" /><path d="M6 5V3h12v2" /></>,
    chart: <><path d="M4 19V5m0 14h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1a1.7 1.7 0 1 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 1 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 1 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 1 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 1 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a1.7 1.7 0 1 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 1 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 1 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2.9z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
  };
  return <svg {...common}>{paths[name] || paths.grid}</svg>;
}

export { Icon };

export default function RestaurantLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data, notice } = useRestaurantData();
  const pendingCount = data.orders.filter((order) => order.status === "New").length;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <Link className="brand" to="/dashboard" aria-label="HUNGER dashboard home">
          <span className="brand-mark">h<span>.</span></span>
          <span className="brand-name">HUNGER<small>RESTAURANT OS</small></span>
        </Link>
        <div className="restaurant-switcher">
          <div className="restaurant-avatar">J</div>
          <div className="switcher-copy"><strong>{data.settings.name}</strong><small>Restaurant workspace</small></div>
          <span className="chevron">⌄</span>
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={() => setMenuOpen(false)} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.label === "Orders" && pendingCount > 0 && <span className="nav-badge">{pendingCount}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-tip">
          <div className="tip-icon">✦</div>
          <strong>Your day, at a glance</strong>
          <p>Stay on top of service with a live view of your restaurant.</p>
          <span>Made for hospitality <span aria-hidden="true">↗</span></span>
        </div>
        <NavLink to="/settings" className={({ isActive }) => `nav-link settings-link ${isActive ? "active" : ""}`} onClick={() => setMenuOpen(false)}>
          <Icon name="settings" /><span>Restaurant settings</span>
        </NavLink>
        <div className="profile">
          <div className="profile-avatar">AK</div>
          <div className="profile-copy"><strong>Arjun Kumar</strong><small>Restaurant owner</small></div>
        </div>
      </aside>
      {menuOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <main className="main-shell">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><span>☰</span></button>
          <div className="breadcrumb"><span>Restaurant</span><span className="crumb-divider">/</span><strong>Operations</strong></div>
          <div className="topbar-actions">
            <span className="service-status"><i /> Demo workspace</span>
            <Link className="icon-button search-shortcut" to="/orders" aria-label="Search orders"><Icon name="search" /></Link>
            <Link className="icon-button notification-button" to="/orders" aria-label="Open incoming orders"><Icon name="bell" /><i /></Link>
            <div className="topbar-divider" />
            <span className="today-date">Mon, 24 Jun 2024</span>
          </div>
        </header>
        <div className="content-area"><Outlet /></div>
      </main>
      <div className="demo-ribbon"><span className="demo-dot" /> DEMO MODE <span>·</span> Browser-only sample data</div>
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}
