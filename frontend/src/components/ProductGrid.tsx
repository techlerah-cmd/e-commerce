import { Button } from "@/components/ui/button";
import { IProductList } from "@/types/apiTypes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "./ui/Loading";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/products";

type ProductGridProps = {
  hideViewAllButton?: boolean;
};

const ProductGrid = ({ hideViewAllButton = false }: ProductGridProps) => {
  const [products, setProducts] = useState<IProductList[]>([]);
  const { makeApiCall, fetching } = useAPICall();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.PRODUCT_LIST(1, 4, "", ""),
      {},
      "application/json"
    );
    if (response.status === 200) {
      setProducts(response.data.items);
    }
  };

  if (!fetching && (!products || products.length === 0)) return null;

  return (
    <section className="bg-secondary py-20 px-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif-elegant text-4xl md:text-5xl font-bold text-primary mb-4">
            Shop <span className="">Premium</span> Sarees
          </h2>
          <p className="font-sans-clean text-lg text-muted max-w-2xl mx-auto">
            Handpicked collection of the finest sarees, each piece crafted with
            precision and love
          </p>
        </div>

        {/* Product Grid */}
        {fetching && <Loading />}
        {!fetching && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {products.map((product) => (
              <div key={product.id} className="relative group overflow-hidden">
                {/* Product Image */}
                <div className="relative aspect-[3/4] w-full">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--ast-global-color-8))/60] via-[hsl(var(--ast-global-color-7))/30] to-transparent" />
                </div>

                {/* Product Info */}
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 lg:bottom-8 lg:left-8 lg:right-8 text-white">
                  {/* Background for readability */}
                  <div className="bg-black/50 backdrop-blur-sm p-3 rounded-md">
                    <h3 className="font-serif-elegant text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-sans-clean text-lg font-bold text-[hsl(var(--ast-global-color-0))]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="font-sans-clean text-sm line-through text-[hsl(var(--ast-global-color-6))]">
                        {product.actual_price}
                      </span>
                    </div>

                    <Button
                      onClick={() => navigate(`/product/${product.id}`)}
                      variant="outline"
                      className="btn-outline-luxury w-full"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!hideViewAllButton && (
          <div className="text-center">
            <Button
              onClick={() => navigate("/collections")}
              className="btn-luxury text-lg px-12 py-4"
            >
              View All Sarees
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
