import { createBrowserRouter, RouterProvider } from "react-router";
import "./App.css";
import { RootLayout } from "./components/RootLayout";
import Customer from "./pages/Customer";
import Item from "./pages/Item";
import PlaceOrder from "./pages/PlaceOrder";
import Dashboard from "./pages/Dashboard";
import { store } from "./store/store";
import { Provider } from "react-redux";

function App() {
  const routes = createBrowserRouter([
    {
      path: "",
      element: <RootLayout />,
      children: [
        { path: "", element: <Dashboard /> },
        { path: "/customer", element: <Customer /> },
        { path: "/item", element: <Item /> },
        { path: "/place-order", element: <PlaceOrder /> },
      ],
    },
  ]);

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>
    </>
  );
}

export default App;
