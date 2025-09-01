const productDetails = {
  container: {
    display: "flex",
    alignItems:"center",
    flexDirection: { xs: "column", md: "row" },
    gap:8,
    padding: "24px",
    backgroundColor: "#121212",
    color: "#ffffff",
    minHeight: "80vh",
  },
  image: {
    width: "100%",
    maxWidth: 500,
    height: 400,
    objectFit: "cover",
    borderRadius: 8,
    border: "2px solid #333",
  },
  detailsContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
     gap: 2,
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: "2rem",
  },
  price: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#ff9800",
  },
  description: {
    fontSize: "1rem",
    lineHeight: 1.6,
  },
  actionsContainer: {
    display: "flex",
    gap: 3,
    marginTop: 5,
  },
};

export default productDetails;
