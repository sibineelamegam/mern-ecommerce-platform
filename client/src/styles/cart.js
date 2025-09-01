// src/styles/cart.js
const cartStyles = {
  container: {
    p: 3,
    color: "white",
  },
  title: {
    mb: 2,
    fontWeight: "bold",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 2,
    p: 2,
    borderRadius: 2,
    bgcolor: "background.paper",
  },
  image: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 2,
    mr: 2,
  },
  itemDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mt: 1,
  },
  rightSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 1,
  },
  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mt: 2,
  },
};

export default cartStyles;
