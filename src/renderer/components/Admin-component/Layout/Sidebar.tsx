import React from "react";
import { styled, Theme, useTheme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import DashboardIconTwoTone from "@mui/icons-material/DashboardTwoTone";
import InventoryIconTwoTone from "@mui/icons-material/InventoryTwoTone";
import SellIconTwoTone from "@mui/icons-material/SellTwoTone";
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import ReceiptTwoToneIcon from '@mui/icons-material/ReceiptTwoTone';
import WarehouseTwoToneIcon from '@mui/icons-material/WarehouseTwoTone';
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import GroupAddTwoToneIcon from '@mui/icons-material/GroupAddTwoTone';
import { SidebarProps } from "./../../../interfaces/layout-Interfaces";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const menuGroups = [
    {
      title: "إدارة",
      items: [
        { text: "الصفحه الرئيسيه", icon: <DashboardIconTwoTone />, path: "/SystemAdmin" },
        { text: "المخازن", icon: <InventoryIconTwoTone />, path: "/SystemAdmin/Inventory" },
        { text: "المبيعات", icon: <SellIconTwoTone />, path: "/SystemAdmin/Sales" },
        { text: "المنتجات", icon: <ShoppingCartTwoToneIcon />, path: "/SystemAdmin/Product" },
        { text: "الموردون", icon: <LocalShippingTwoToneIcon />, path: "/SystemAdmin/Supplier" },
        { text: "المشتريات", icon: <ReceiptTwoToneIcon />, path: "/SystemAdmin/Products" },
        
      ],
    },
    {
      title: "إضافة",
      items: [
        { text: "اضافة مخزن", icon: <WarehouseTwoToneIcon />, path: "/SystemAdmin/AddInventory" },
        { text: "اضافة منتج", icon: <AddShoppingCartTwoToneIcon />, path: "/SystemAdmin/AddProduct" },
        { text: "اضافه مورد", icon: <GroupAddTwoToneIcon />, path: "/SystemAdmin/AddSupplier" },
        
      ],
    },
  ];

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
      {menuGroups.map((group) => (
              <React.Fragment key={group.title}>
                <ListSubheader>{group.title}</ListSubheader>
                {group.items.map((item) => (
                  <ListItem
                    key={item.text}
                    disablePadding
                    selected={location.pathname === item.path}
                  >
                    <ListItemButton onClick={() => navigate(item.path)}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
                <Divider />
              </React.Fragment>
            ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;

