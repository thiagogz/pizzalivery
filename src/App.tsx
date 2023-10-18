import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/home/Home"
import Sizes from "./pages/sizes/Sizes"
import Flavours from "./pages/flavours/Flavours"
import Summary from "./pages/summary/Summary"
import Checkout from "./pages/checkout/Checkout"
import Login from "./pages/login/Login"
import { routes } from "./routes"
import PrivateRoutes from "./components/privateRoutes/PrivateRoutes"
import DualFlavours from "./pages/dualFlavours/DualFlavours"
import OrderDone from "./pages/orderDone/OrderDone"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.pizzaSize} element={<Sizes />} />
        <Route path={routes.pizzaFlavour} element={<Flavours />} />
        <Route path={routes.pizzaDualFlavour} element={<DualFlavours />}/>
        <Route path={routes.summary} element={<Summary />} />
        <Route element={<PrivateRoutes />}>
          <Route path={routes.checkout} element={<Checkout />} />
        </Route>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.orderDone} element={<OrderDone />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
