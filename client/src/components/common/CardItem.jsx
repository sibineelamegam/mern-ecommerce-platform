import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import cardStyles from "../../styles/cardStyles";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const CardItem = ({ title, subtitle, image, type, id, stock, setAlert }) => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { auth } = useAuth();
  const { cart } = useCart();

  const imageUrl = image
    ? `${import.meta.env.VITE_UPLOADS_BASE_URL}/${image}`
    : "/placeholder.png";

  const isInWishlist = wishlist.some((item) => item.product._id === id);
  const cartItem = cart.find((item) => item.product._id === id);
  const effectiveStock = stock - (cartItem?.quantity || 0);

  const handleWishlistToggle = async () => {
    if (!auth) return;

    const result = await toggleWishlist({ productId: id });

    // Show alert in the component
    if (setAlert) {
      setAlert({
        ...result,
        open: true,
      });
    }
  };

  return (
    <Card sx={cardStyles.card}>
      <CardActionArea
        onClick={() =>
          navigate(type === "category" ? `/products/${id}` : `/product/${id}`)
        }
        disabled={effectiveStock <= 0}
      >
        {effectiveStock <= 0 && (
          <Box sx={cardStyles.outOfStockBadge}>Out of Stock</Box>
        )}

        <CardMedia
          component="img"
          image={imageUrl}
          alt={title}
          sx={cardStyles.media}
        />

        <CardContent sx={cardStyles.content}>
          <Typography variant="h6" gutterBottom sx={cardStyles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>

      {type === "product" && auth && (
        <IconButton onClick={handleWishlistToggle} sx={cardStyles.wishlistIcon}>
          {isInWishlist ? (
            <Favorite sx={{ color: "#9c27b0" }} />
          ) : (
            <FavoriteBorder sx={{ color: "#faf2f2ff" }} />
          )}
        </IconButton>
      )}
    </Card>
  );
};

export default CardItem;
