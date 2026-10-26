import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RestaurantLayout from "../../layouts/RestaurantLayout.jsx";
import {
  BillingPage,
  DashboardPage,
  KitchenPage,
  MenuPage,
  OrdersPage,
  ReportsPage,
  SettingsPage,
  TablesPage,
} from "../../features/restaurant/RestaurantPages.jsx";
import { RestaurantDataProvider } from "../../features/restaurant/RestaurantDataContext.jsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <RestaurantDataProvider>
        <Routes>
          <Route element={<RestaurantLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />
            <Route path="/tables" element={<TablesPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </RestaurantDataProvider>
    </BrowserRouter>
  );
}
