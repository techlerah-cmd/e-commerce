import { Button } from "@/components/ui/button";
import { IProductList } from "@/types/apiTypes";
import { Heart, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";


import { Link, useNavigate } from "react-router-dom";
import { Loading } from "./ui/Loading";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/products";

type ProductGridProps = {
  hideViewAllButton?: boolean;
};

const ProductGrid = ({ hideViewAllButton = false }: ProductGridProps) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [products, setProducts] = useState<IProductList[]>([]);
  const {fetchType,fetching,isFetched,makeApiCall} = useAPICall()
  const {user} = useAuth()
  const navigate = useNavigate()
  useEffect(()=>{
    fetchProducts()
  },[])
  const fetchProducts = async ()=>{
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.PRODUCT_LIST(1,4,'',""),{},"application/json"
    )
    if(response.status === 200){
      console.log("response",response.data)
      setProducts(response.data.items);
    }
  }
  if(isFetched &&  (!products || products.length == 0)){
    return null
  }
  return (
    <section className="py-20 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif-elegant text-4xl md:text-5xl font-bold text-primary mb-4">
            Shop <span className="text-gradient-gold">Premium</span> Sarees
          </h2>
          <p className="font-sans-clean text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked collection of the finest sarees, each piece crafted with
            precision and love
          </p>
        </div>

        {/* Product Grid */}
        {fetching && 
        
        <Loading />
        }
        {!fetching &&
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div key={product.id} className="card-product group">
              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <span className="bg-accent text-accent-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                  {Math.ceil(
                    ((product.actual_price - product.price) /
                      product.actual_price) *
                      100
                  ) > 2 && (
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">
                      SAVE{" "}
                      {Math.ceil(
                        ((product.actual_price - product.price) /
                          product.actual_price) *
                          100
                      )}
                      %
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-serif-elegant text-xl font-semibold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                  {product.title}
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <span className="font-sans-clean text-lg font-bold text-accent">
                    {formatPrice(product.price)}
                  </span>
                  <span className="font-sans-clean text-sm text-muted-foreground line-through">
                    {product.actual_price}
                  </span>
                </div>

                <Button onClick={()=>{
                  navigate(`/product/${product.id}`)
                }} variant="outline" className="btn-outline-luxury w-full">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
        }

        {!hideViewAllButton && (
          <div className="text-center">
            <Link to="/collections">
              <Button className="btn-luxury text-lg px-12 py-4">
                View All Sarees
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
