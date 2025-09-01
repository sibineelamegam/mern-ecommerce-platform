import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Tooltip } from "@mui/material";
import productDetails from "../../styles/productDetails";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import Spinner from "../../components/common/Spinner";
import AlertToast from "../../components/common/AlertToast";
import useAlert from "../../hooks/useAlert";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const { cart, addItem } = useCart(); // Use context method
  const { products, fetchProductById, loadingAction } = useProducts();
  const navigate = useNavigate();

  const { alert, setAlert, closeAlert } = useAlert();

  // Fetch product if not already in context
  const product = products.find((p) => p._id === id);
  useEffect(() => {
    if (!product) fetchProductById(id);
  }, [id, product, fetchProductById]);

  if (loadingAction || !product) return <Spinner />;

  const cartItem = cart.find((item) => item.product._id === product._id);
  const effectiveStock = product.stock - (cartItem?.quantity || 0);

  const imageUrl = `${import.meta.env.VITE_UPLOADS_BASE_URL.replace(/\/$/, "")}/${product.images?.[0] || ""}`;

  const handleLoginRedirect = () => {
    navigate("/login", { state: { from: `/product/${id}` } });
  };

  // Use addItem from CartContext instead of API call
  const handleAddToCart = async () => {
    if (!auth) return; // Do nothing if not authenticated
    if (effectiveStock <= 0) {
      return setAlert({
        open: true,
        type: "error",
        message: "Not enough stock available",
      });
    }

    const result = await addItem(product._id, 1); // context method
    setAlert({
      ...result,
      open: true, // show toast
    });
  };

  const handleBuyNow = () => {
    if (!auth) return handleLoginRedirect(); // Login redirect handled
    if (effectiveStock <= 0) {
      return setAlert({ open: true, type: "error", message: "Out of stock" });
    }
    navigate("/customer/checkout", { state: { productId: product._id } });
  };

  // Disable Add to Cart if no auth or no stock
  const disableAddToCart = !auth || effectiveStock <= 0;
  const addToCartTooltip = !auth
    ? "Login to enable this action"
    : effectiveStock <= 0
    ? "Out of stock"
    : "";

  // Disable Buy Now only if no stock
  const disableBuyNow = effectiveStock <= 0;
  const buyNowTooltip = effectiveStock <= 0 ? "Out of stock" : "";

  return (
    <Box sx={productDetails.container}>
      <AlertToast alert={alert} closeAlert={closeAlert} />

      <Box component="img" src={imageUrl} alt={product.name} sx={productDetails.image} />
      <Box sx={productDetails.detailsContainer}>
        <Typography sx={productDetails.sectionTitle}>{product.name}</Typography>
        <Typography sx={productDetails.price}>${product.price}</Typography>
        <Typography sx={productDetails.stock}>
          {effectiveStock > 0 ? `Stock: ${effectiveStock}` : "Out of Stock"}
        </Typography>
        <Typography sx={productDetails.description}>{product.description}</Typography>

        <Box sx={productDetails.actionsContainer}>
          <Tooltip title={addToCartTooltip} arrow>
            <span>
              <Button
                variant="contained"
                color="primary"
                disabled={disableAddToCart}
                onClick={handleAddToCart}
              >
                {effectiveStock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </span>
          </Tooltip>

          <Tooltip title={buyNowTooltip} arrow>
            <span>
              <Button
                variant="outlined"
                color="secondary"
                disabled={disableBuyNow}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetailsPage;
