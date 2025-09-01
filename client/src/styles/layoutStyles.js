// src/styles/layoutStyles.js

export const drawerWidth = 240;

export const layoutStyles = {
  main: (sidebarOpen, isMobile) => ({
    backgroundColor: "#121212",
    flexGrow: 1,
    transition: "margin-left 0.3s",
    marginLeft: !isMobile && sidebarOpen ? `${drawerWidth}px` : "0px",
    padding: "24px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  }),
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    display: { xs: "block", md: "block" },
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      top: "64px",
      height: "calc(100% - 64px)",
      borderRight: "none",
      boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
    },
  },
  header: {
    zIndex: 1201,
  },
  avatarBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
};
