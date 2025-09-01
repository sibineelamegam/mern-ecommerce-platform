const cardStyles = {
  card: {
    maxWidth: "100%",
    bgcolor: "background.paper",
    color: "text.primary",
    borderRadius: 2,
    boxShadow: 3,
    transition: "transform 0.2s",
    position: "relative",
    "&:hover": {
      transform: "scale(1.03)",
      boxShadow: 6,
    },
  },
  media: {
    height: 180,
    objectFit: "cover",
  },
  content: {
    padding: "20px !important",
    textTransform: "capitalize",
  },
  title: {
    fontSize: "17px",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    bgcolor: "red",
    color: "white",
    px: 1,
    py: 0.5,
    borderRadius: 1,
    fontSize: 12,
    fontWeight: "bold",
  },
  wishlistIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    bgcolor: "transparent",
    "&:hover": {
      bgcolor: "transparent",
    },
  },
};

export default cardStyles;
