import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import CardItem from "../../components/common/CardItem";
import Spinner from "../../components/common/Spinner";
import commonStyles from "../../styles/commonStyles";
import { useCategories } from "../../context/CategoryContext";
import useAlert from "../../hooks/useAlert";
import AlertToast from "../../components/common/AlertToast";

const CustomerHome = () => {
  const { categories, fetchCategories, loadingInitial } = useCategories();
  const { alert, closeAlert } = useAlert();

  /** Fetch Categories automatically on context mount */
  useEffect(() => {
    if (categories.length === 0)
      fetchCategories()
  }, [fetchCategories, categories.length]);

  const mainCategories = categories.filter((cat) => !cat.parentCategory);
  const subCategories = categories.filter((cat) => cat.parentCategory);

  const renderSection = (title, items, type) => (
    <>
      <Typography variant="h6" sx={commonStyles.sectionTitle}>
        {title}
      </Typography>
      <Box sx={commonStyles.container}>
        {items.length === 0 ? (
          <Typography>No items found.</Typography>
        ) : (
          items.map((item) => (
            <Box key={item._id} sx={commonStyles.cardBox}>
              <CardItem
                title={item.name}
                subtitle={item.parentCategory?.name}
                image={item.image}
                type={type}
                id={item._id}
              />
            </Box>
          ))
        )}
      </Box>
    </>
  );

  if (loadingInitial) return <Spinner />;

  return (
    <div>
      {renderSection("Main Categories", mainCategories, "category")}
      {renderSection("Subcategories", subCategories, "category")}

      <AlertToast alert={alert} closeAlert={closeAlert} />
    </div>
  );
};

export default CustomerHome;
