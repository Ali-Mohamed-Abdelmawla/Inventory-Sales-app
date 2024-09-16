import {
  HashRouter as Router,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { lazy, Suspense } from "react";

const LoginContainer = lazy(
  () => import("./components/LoginComponent/LoginContainer")
);
const SystemAdmin = lazy(() => import("./components/Admin-component/index"));

import sweetAlertInstance from "./helper/SweetAlert";

const Statistics = lazy(
  () =>
    import(
      "./components/Admin-component/Statistics-component/StatisticsContainer"
    )
);

const Inventories = lazy(
  () =>
    import(
      "./components/Admin-component/Inventories-component/InventoriesContainer"
    )
);

const Products = lazy(
  () =>
    import("./components/Admin-component/Products-component/PrroductsContainer")
);

const Suppliers = lazy(
  () =>
    import(
      "./components/Admin-component/Suppliers-component/SuppliersContainer"
    )
);

const AddInventory = lazy(
  () =>
    import(
      "./components/Admin-component/Inventories-component/Add/AddInventoryContainer"
    )
);

const EditInventory = lazy(
  () =>
    import(
      "./components/Admin-component/Inventories-component/Edit/EditInventoryContainer"
    )
);

const AddProduct = lazy(
  () =>
    import(
      "./components/Admin-component/Products-component/Add/AddProductContainer"
    )
);

const EditProduct = lazy(
  () =>
    import(
      "./components/Admin-component/Products-component/Edit/EditProductContainer"
    )
);

const AddSupplier = lazy(
  () =>
    import(
      "./components/Admin-component/Suppliers-component/Add/AddSupplierContainer"
    )
);

const EditSupplier = lazy(
  () =>
    import(
      "./components/Admin-component/Suppliers-component/Edit/EditSupplierContainer"
    )
);
import Loader from "./helper/loading-component/loader";

//========================= It is best to read this code starting from here ================================
const IsAuthenticated = () => {
  // Check if the JWT token is stored in sessionStorage
  const token = sessionStorage.getItem("accessToken");
  return token !== null;
};

interface ProtectedRouteProps {
  element: React.ReactElement;
}

// Define a higher-order component for protected routes
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  // Check if the user is authenticated
  const isAuthenticated = IsAuthenticated();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    sweetAlertInstance
      .fire({
        icon: "error",
        title: "تسجيل الدخول مطلوب",
        text: "عذراً، يجب عليك تسجيل الدخول.",
      })
      .then(() => {
        console.log("redirect to login");
        navigate("/");
      });

    return null;
  }
  return <>{element}</>;
};

// ========================= LazyLoad helper ==================================
interface LazyLoadRouteProps {
  component: React.ComponentType;
}
const LazyLoadRoute: React.FC<LazyLoadRouteProps> = ({
  component: Component,
  ...props
}) => (
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);

const LazyLoadProtectedRoute: React.FC<LazyLoadRouteProps> = ({
  component: Component,
  ...props
}) => (
  <Suspense fallback={<Loader />}>
    <ProtectedRoute element={<Component {...props} />} />
  </Suspense>
);

// ========================= Routes =========================

function Routing() {
  const router = createHashRouter([
    {
      path: "/",
      element: <LazyLoadRoute component={LoginContainer} />,
    },
    {
      path: "/SystemAdmin",
      element: <LazyLoadProtectedRoute component={SystemAdmin} />,
      children: [
        { path: "", element: <LazyLoadRoute component={Statistics} /> },
        {
          path: "Inventory",
          element: <LazyLoadRoute component={Inventories} />,
        },
        { path: "Product", element: <LazyLoadRoute component={Products} /> },

        { path: "Supplier", element: <LazyLoadRoute component={Suppliers} /> },

        //==================================================================================
        //==-Inventories-==
        {
          path: "AddInventory",
          element: <LazyLoadRoute component={AddInventory} />,
        },
        {
          path: "EditInventory",
          element: <LazyLoadRoute component={EditInventory} />,
        },
        //==================================================================================
        //==-Products-==
        {
          path: "AddProduct",
          element: <LazyLoadRoute component={AddProduct} />,
        },
        {
          path: "EditProduct",
          element: <LazyLoadRoute component={EditProduct} />,
        },
        //==================================================================================
        //==-Suppliers-==
        {
          path: "AddSupplier",
          element: <LazyLoadRoute component={AddSupplier} />,
        },
        {
          path: "EditSupplier",
          element: <LazyLoadRoute component={EditSupplier} />,
        },
        //==================================================================================
        //==-Sales-==
        
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default Routing;
