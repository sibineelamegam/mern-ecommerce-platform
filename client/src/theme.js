import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2", // MUI blue
    },
    secondary: {
      main: "#9c27b0", // MUI purple
    },
    background: {
      default: "#121212", 
      paper: "#1e1e1e"
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
        },
      },
    },
  },
});

export default darkTheme;
