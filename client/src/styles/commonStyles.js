const commonStyle = {
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  cardBox: {
    flex: "1 1 calc(25% - 16px)", // 4 per row on large screens
    maxWidth: "calc(25% - 16px)",
    margin: "8px",

    // Responsive breakpoints
    "@media (max-width: 1200px)": {
      flex: "1 1 calc(33.33% - 16px)", // 3 per row
      maxWidth: "calc(33.33% - 16px)",
    },
    "@media (max-width: 900px)": {
      flex: "1 1 calc(50% - 16px)", // 2 per row
      maxWidth: "calc(50% - 16px)",
    },
    "@media (max-width: 600px)": {
      flex: "1 1 100%", // 1 per row
      maxWidth: "100%",
    },
  },
  sectionTitle: {
    marginBottom: 2,
    marginTop: 4,
    fontWeight: "bold",
  },
};

export default commonStyle;
