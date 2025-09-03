import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import CardItem from "../../components/common/CardItem";
import Spinner from "../../components/common/Spinner";
import commonStyles from "../../styles/commonStyles";
import { useProducts } from "../../context/ProductContext";

const ProductsPage = () => {
  const { id } = useParams();
  const { categoryProducts, loadingCategory, fetchProductsByCategory } =
    useProducts();

  useEffect(() => {
    if (!id) return;
    fetchProductsByCategory(id);
  }, [id, fetchProductsByCategory]);

  if (loadingCategory) return <Spinner />;

  return (
    <Box p={3}>
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
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default ProductsPage;
