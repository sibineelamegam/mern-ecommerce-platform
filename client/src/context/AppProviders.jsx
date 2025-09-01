// src/context/AppProviders.jsx
import { AuthProvider } from "./AuthContext";
import { CategoryProvider } from "./CategoryContext";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";
import { OrderProvider } from "./OrderContext";

const AppProviders = ({ children }) => (
  <AuthProvider>
    <CategoryProvider>
      <ProductProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>{children}</OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
    </CategoryProvider>
  </AuthProvider>
);

export default AppProviders;
