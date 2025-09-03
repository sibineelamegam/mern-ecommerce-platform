import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import CardItem from "../../components/common/CardItem";
import Spinner from "../../components/common/Spinner";
import commonStyles from "../../styles/commonStyles";
import { useProducts } from "../../context/ProductContext";
import AlertToast from "../../components/common/AlertToast";
import useAlert from "../../hooks/useAlert";

const ProductsPage = () => {
  const { id } = useParams();
  const { categoryProducts, loadingInitial, fetchProductsByCategory } =
    useProducts();
  const { alert, setAlert, closeAlert } = useAlert();

  useEffect(() => {
    if (!id) return; // no category → don’t fetch
    fetchProductsByCategory(id).then((res) => {
      if (res) setAlert({ ...res, open: true });
    });
  }, [id, fetchProductsByCategory, setAlert]);

  if (loadingInitial) return <Spinner />;

  return (
    <Box p={3}>
      <AlertToast alert={alert} closeAlert={closeAlert} />

      <Typography variant="h6" sx={commonStyles.sectionTitle}>
        Products
      </Typography>

      <Box sx={commonStyles.container}>
        {categoryProducts.length === 0 ? (
          <Typography sx={{ textAlign: "center", mt: 4 }}>
            🚀 No products found in this category.
          </Typography>
        ) : (
          categoryProducts.map((product) => (
            <Box key={product._id} sx={commonStyles.cardBox}>
              <CardItem
                id={product._id}
                title={product.name}
                subtitle={`$${product.price}`}
                image={product.images?.[0]}
                type="product"
                stock={product.stock}
                setAlert={setAlert}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ProductsPage;
