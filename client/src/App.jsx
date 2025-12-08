import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Home from "./Page/Home";
import "./Styles/index.scss";
import Navigation from "./Components/Navigation";
import Footer from "./Components/Footer";
import Shop from "./Page/Shop";
import ProductDetail from "./Page/ProductDetail";
import { CartProvider } from "./Hook/useCartContext";
import CartPage from "./Page/Cart";
import CheckOut from "./Page/CheckOut";
import { CheckOutProvider } from "./Hook/useCheckOutContext";
import { UserProvider } from "./Hook/useUserContext";
import Login from "./Page/Login";
import Account from "./Page/Account";
import Profile from "./Page/Account/Profile";
import Address from "./Page/Account/Address";
import Order from "./Page/Account/Order";
import Admin from "./Page/Admin";
import DashBoard from "./Page/Admin/DashBoard";
import User from "./Page/Admin/User";
import Product from "./Page/Admin/Product";
import OrderAdmin from "./Page/Admin/Order";

function AppProvider({ children }) {
  return (
    <UserProvider>
      <CartProvider>
        <CheckOutProvider>{children}</CheckOutProvider>
      </CartProvider>
    </UserProvider>
  );
}

function Layout() {
  return (
    <>
      <div className="container">
        <Navigation />
      </div>
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop">
              <Route index element={<Shop />} />
              <Route path="new_arrival" element={<Shop />} />
              <Route path="sale" element={<Shop />} />
              <Route path="products" element={<Navigate to={"/shop"} replace/>} />
            </Route>
            <Route path="shop/products/:slug" element={<ProductDetail />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckOut />} />
            <Route path="account" element={<Account />}>
              <Route path="profile" element={<Profile />} />
              <Route path="address" element={<Address />} />
              <Route path="order">
                <Route index element={<Navigate to="all" replace />} />
                <Route path=":tabPath" element={<Order />} />
              </Route>
            </Route>
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<Admin />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="user" element={<User />} />
            <Route path="product" element={<Product />} />
            <Route path="order" element={<OrderAdmin />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
