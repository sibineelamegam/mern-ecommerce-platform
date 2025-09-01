import { Box, Typography } from "@mui/material";
import CardItem from "../../components/common/CardItem";
import Spinner from "../../components/common/Spinner";
import commonStyles from "../../styles/commonStyles";
import { useWishlist } from "../../context/WishlistContext";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const WishlistPage = () => {
  const { wishlist, loadingInitial } = useWishlist();
  const { alert, setAlert, closeAlert } = useAlert();

  if (loadingInitial) return <Spinner />;

  return (
    <Box p={3}>
      <AlertToast alert={alert} closeAlert={closeAlert} />

      <Typography variant="h6" gutterBottom>My Wishlist</Typography>

      {wishlist.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Your wishlist is empty ❤️
        </Typography>
      ) : (
        <Box sx={commonStyles.container}>
          {wishlist.map(item => (
            <Box key={item._id} sx={commonStyles.cardBox}>
              <CardItem
                id={item.product._id}
                title={item.product.name}
                subtitle={`$${item.product.price}`}
                image={item.product.images?.[0]}
                type="product"
                stock={item.product.stock}
                setAlert={setAlert}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default WishlistPage;
