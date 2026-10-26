export const STORAGE_KEY = "hunger.restaurant-dashboard.demo.v1";

export const initialData = {
  orders: [
    { id: "HG-2084", date: "2024-06-24", table: "T-04", items: [{ name: "Paneer Tikka", qty: 2, price: 320 }, { name: "Masala Soda", qty: 2, price: 90 }], status: "Preparing", time: "12:42 PM", minutesAgo: 8 },
    { id: "HG-2083", date: "2024-06-24", table: "T-02", items: [{ name: "Butter Chicken", qty: 1, price: 480 }, { name: "Garlic Naan", qty: 2, price: 80 }], status: "New", time: "12:38 PM", minutesAgo: 12 },
    { id: "HG-2082", date: "2024-06-24", table: "T-07", items: [{ name: "Veg Biryani", qty: 2, price: 290 }, { name: "Raita", qty: 2, price: 70 }], status: "Ready", time: "12:31 PM", minutesAgo: 19 },
    { id: "HG-2081", date: "2024-06-24", table: "T-01", items: [{ name: "Dal Makhani", qty: 1, price: 280 }, { name: "Tandoori Roti", qty: 3, price: 45 }], status: "Served", time: "12:19 PM", minutesAgo: 31 },
    { id: "HG-2080", date: "2024-06-24", table: "T-05", items: [{ name: "Chicken 65", qty: 1, price: 340 }, { name: "Lime Water", qty: 1, price: 80 }], status: "Accepted", time: "12:10 PM", minutesAgo: 40 },
    { id: "HG-2079", date: "2024-06-24", table: "T-03", items: [{ name: "Gulab Jamun", qty: 2, price: 120 }], status: "Served", time: "11:56 AM", minutesAgo: 54 },
  ],
  menu: [
    { id: 1, name: "Paneer Tikka", category: "Starters", description: "Char-grilled cottage cheese, house spice blend", price: 320, available: true, initials: "PT", color: "peach" },
    { id: 2, name: "Butter Chicken", category: "Main course", description: "Slow-cooked tomato gravy, finished with cream", price: 480, available: true, initials: "BC", color: "sand" },
    { id: 3, name: "Veg Biryani", category: "Main course", description: "Fragrant basmati rice, seasonal vegetables", price: 290, available: true, initials: "VB", color: "sage" },
    { id: 4, name: "Dal Makhani", category: "Main course", description: "Black lentils simmered overnight", price: 280, available: false, initials: "DM", color: "lavender" },
    { id: 5, name: "Masala Soda", category: "Beverages", description: "House lime, roasted cumin, sparkling water", price: 90, available: true, initials: "MS", color: "blue" },
    { id: 6, name: "Gulab Jamun", category: "Desserts", description: "Warm milk dumplings, saffron syrup", price: 120, available: true, initials: "GJ", color: "rose" },
  ],
  tables: [
    { id: "T-01", seats: 2, status: "Occupied", session: "S-184", amount: 415, orders: 1, since: "12:09 PM" },
    { id: "T-02", seats: 4, status: "Occupied", session: "S-183", amount: 640, orders: 1, since: "12:34 PM" },
    { id: "T-03", seats: 2, status: "Available", session: null, amount: 0, orders: 0, since: null },
    { id: "T-04", seats: 4, status: "Occupied", session: "S-182", amount: 820, orders: 1, since: "12:18 PM" },
    { id: "T-05", seats: 6, status: "Billing", session: "S-181", amount: 420, orders: 1, since: "11:58 AM" },
    { id: "T-06", seats: 2, status: "Available", session: null, amount: 0, orders: 0, since: null },
    { id: "T-07", seats: 4, status: "Occupied", session: "S-180", amount: 720, orders: 1, since: "12:26 PM" },
    { id: "T-08", seats: 4, status: "Available", session: null, amount: 0, orders: 0, since: null },
  ],
  payments: [
    { id: "TXN-7418", table: "T-06", method: "UPI", amount: 1_420, time: "12:26 PM", status: "Paid" },
    { id: "TXN-7417", table: "T-08", method: "Cash", amount: 860, time: "12:04 PM", status: "Paid" },
    { id: "TXN-7416", table: "T-03", method: "UPI", amount: 1_180, time: "11:48 AM", status: "Paid" },
  ],
  settings: { name: "Juniper & Grain", address: "12, Residency Road, Bengaluru", phone: "+91 80 4567 8900", opening: "11:00 AM", closing: "11:00 PM" },
};

export function loadDemoData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialData, ...JSON.parse(stored) } : initialData;
  } catch (error) {
    console.warn("Could not read saved dashboard demo data.", error);
    return initialData;
  }
}

export function saveDemoData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("Could not save dashboard demo data.", error);
  }
}

export function formatRupees(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const orderStatuses = ["New", "Accepted", "Preparing", "Ready", "Served", "Cancelled"];
