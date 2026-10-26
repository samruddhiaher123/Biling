import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initialData, loadDemoData, saveDemoData } from "../../services/mockRestaurantData.js";

const RestaurantDataContext = createContext(null);

export function RestaurantDataProvider({ children }) {
  const [data, setData] = useState(loadDemoData);
  const [notice, setNotice] = useState("");

  useEffect(() => saveDemoData(data), [data]);

  const value = useMemo(() => ({
    data,
    notice,
    announce: setNotice,
    updateOrderStatus: (orderId, status) => {
      setData((current) => ({
        ...current,
        orders: current.orders.map((order) => order.id === orderId ? { ...order, status } : order),
      }));
      setNotice(`${orderId} moved to ${status}. Demo changes are saved in this browser.`);
    },
    toggleMenuAvailability: (itemId) => {
      setData((current) => ({
        ...current,
        menu: current.menu.map((item) => item.id === itemId ? { ...item, available: !item.available } : item),
      }));
      setNotice("Availability updated in demo data.");
    },
    addMenuItem: (item) => {
      setData((current) => ({ ...current, menu: [{ ...item, id: Date.now() }, ...current.menu] }));
      setNotice("Menu item added to demo data.");
    },
    updateMenuItem: (itemId, item) => {
      setData((current) => ({
        ...current,
        menu: current.menu.map((existing) => existing.id === itemId ? { ...existing, ...item } : existing),
      }));
      setNotice("Menu item updated in demo data.");
    },
    deleteMenuItem: (itemId) => {
      setData((current) => ({ ...current, menu: current.menu.filter((item) => item.id !== itemId) }));
      setNotice("Menu item removed from demo data.");
    },
    updateSettings: (settings) => {
      setData((current) => ({ ...current, settings }));
      setNotice("Restaurant details saved to demo data.");
    },
    resetDemo: () => {
      setData(initialData);
      setNotice("Demo data has been reset.");
    },
  }), [data, notice]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  return <RestaurantDataContext.Provider value={value}>{children}</RestaurantDataContext.Provider>;
}

export function useRestaurantData() {
  const context = useContext(RestaurantDataContext);
  if (!context) throw new Error("useRestaurantData must be used within RestaurantDataProvider");
  return context;
}
