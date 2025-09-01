// src/components/common/Spinner.jsx
import { Box, CircularProgress } from "@mui/material";

const Spinner = ({ size = 50, thickness = 4 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <CircularProgress size={size} thickness={thickness} />
    </Box>
  );
};

export default Spinner;
