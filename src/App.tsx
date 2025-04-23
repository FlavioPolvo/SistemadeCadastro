import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ConfigurationPanel from "./components/ConfigurationPanel";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-form" element={<ProductForm />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/configuration" element={<ConfigurationPanel />} />
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
