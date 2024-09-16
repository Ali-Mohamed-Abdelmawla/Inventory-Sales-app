import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { Outlet } from "react-router-dom";
import Header from "./Layout/Header";
import Sidebar from "./Layout/Sidebar";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AdminLayout: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;

// import React, { useState } from "react";
// import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
// import Box from "@mui/material/Box";
// import CssBaseline from "@mui/material/CssBaseline";
// import { Outlet } from "react-router-dom";
// import Header from "./Layout/Header";
// import Sidebar from "./Layout/Sidebar";
// import rtlPlugin from "stylis-plugin-rtl";
// import { CacheProvider } from "@emotion/react";
// import createCache from "@emotion/cache";
// import theme from "../../Apptheme";
// // Create RTL cache
// const cacheRtl = createCache({
//   key: "muirtl",
//   stylisPlugins: [ rtlPlugin],
// });

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-start",
//   padding: theme.spacing(0, 1),
//   ...theme.mixins.toolbar,
// }));

// // Create RTL theme
// const rtlTheme = createTheme({
//   direction: "rtl",
// });

// const AdminLayout: React.FC = () => {
//   const [open, setOpen] = useState(false);

//   const handleDrawerOpen = () => {
//     setOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setOpen(false);
//   };

//   return (
//     <CacheProvider value={cacheRtl}>
//       <ThemeProvider theme={theme}>
//         <Box sx={{ display: "flex", direction: "rtl" }}>
//           <CssBaseline />
//           <Header open={open} handleDrawerOpen={handleDrawerOpen} />
//           <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
//           <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//             <DrawerHeader />
//             <Outlet />
//           </Box>
//         </Box>
//       </ThemeProvider>
//     </CacheProvider>
//   );
// };

// export default AdminLayout;