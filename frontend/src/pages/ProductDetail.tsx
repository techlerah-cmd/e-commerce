import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getProductById, formatPrice } from "@/data/products";
import {
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/lib/cart";
import { IProduct } from "@/types/apiTypes";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { differenceInDays, set } from "date-fns";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedImageIndex, setSelectedIndex] = useState<number>(0);
  const { authToken, isAuthenticated } = useAuth();
  useEffect(() => {
    fetchProduct();
  }, []);
  const fetchProduct = async () => {
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.GET_PRODUCT(id),
      {},
      "application/json",
      null,
      "getProduct"
    );
    if (response.status == 200) {
      let data: IProduct = response.data;
      if (data.images.length == 0) {
        data = {
          ...data,
          images: [
            {
              url: "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg",
            },
          ],
        };
      }
      setProduct(data);
    } else {
      setProduct(null);
    }
  };

  if (!product && isFetched) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-secondary flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif-elegant text-4xl text-secondary mb-4">
              Product Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Button
              onClick={() => navigate("/collections")}
              className="btn-luxury"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const increaseQuantity = () => {
    if (quantity == product.stock) {
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this beautiful saree: ${product.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard");
    }
  };
  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const response = await makeApiCall(
      "POST",
      API_ENDPOINT.ADD_TO_CART,
      {
        product_id: product.id,
        qty: quantity,
      },
      "application/json",
      authToken,
      "addToCart"
    );
    if (response.status == 200 || response.status == 201) {
      toast.success("Product Added to Cart");
    } else {
      toast.error("Product is out of stock.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-secondary">
        {fetching && fetchType != "addToCart" && (
          <div className="py-4 min-h-screen">
            <Loading />
          </div>
        )}
        {!(fetching && fetchType == "getProduct") && isFetched && product && (
          <>
            <section className="px-4 py-12 sm:px-6  bg-muted lg:px-8">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  {/* Product Images */}
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white">
                      <img
                        src={product.images[selectedImage].url}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />

                      {differenceInDays(
                        new Date(),
                        new Date(product.created_at)
                      ) < 3 && (
                        <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
                          NEW
                        </Badge>
                      )}
                    </div>
                    {product.images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {product.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 aspect-square w-20 rounded-md overflow-hidden border-2 transition-colors ${
                              selectedImage === index
                                ? "border-accent"
                                : "border-transparent"
                            }`}
                          >
                            <img
                              src={image.url}
                              alt={`${product.title} ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-6">
                    <div>
                      <h1 className="font-serif-elegant text-3xl font-bold text-secondary lg:text-4xl">
                        {product.title}
                      </h1>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.avg_rating || 0}) • {product.review_count}{" "}
                          reviews
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-sans-clean text-3xl font-bold text-primary-foreground">
                        {formatPrice(product.price)}
                      </span>
                      {product.actual_price && (
                        <span className="font-sans-clean text-xl text-muted-foreground line-through">
                          {formatPrice(product.actual_price)}
                        </span>
                      )}
                      {product.actual_price && (
                        <Badge variant="destructive" className="text-xs">
                          {Math.round(
                            ((product.actual_price - product.price) /
                              product.actual_price) *
                              100
                          )}
                          % OFF
                        </Badge>
                      )}
                    </div>

                    {/* Stock Status */}
                    {product.stock === 0 ? (
                      <Badge
                        variant="destructive"
                        className="w-fit text-sm py-1 px-3"
                      >
                        Out of Stock
                      </Badge>
                    ) : product.stock <= 5 ? (
                      <Badge
                        variant="secondary"
                        className="w-fit text-sm py-1 px-3 bg-orange-100 text-orange-800 border-orange-300"
                      >
                        Only {product.stock} left in stock
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="w-fit text-sm py-1 px-3 bg-green-100 text-green-800 border-green-300"
                      >
                        In Stock
                      </Badge>
                    )}

                    <p className="font-sans-clean text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>

                    {/* Product Specifications */}
                    {product.product_metadata.length > 0 && (
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="font-serif-elegant text-lg font-semibold text-secondary mb-4">
                            Product Details
                          </h3>
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {product.product_metadata.map(({ key, value }) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground">
                                  {key}:
                                </span>
                                <span className="font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Quantity Selector - Only show if in stock */}
                    {product.stock > 0 && (
                      <div className="flex items-center gap-4">
                        <span className="font-medium text-muted-foreground">
                          Quantity:
                        </span>
                        <div className="flex items-center border border-border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={decreaseQuantity}
                            disabled={quantity <= 1}
                            className="h-10 w-10 p-0 hover:bg-muted"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="flex items-center justify-center h-10 w-12 text-center font-medium">
                            {quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={increaseQuantity}
                            className="h-10 w-10 p-0 hover:bg-muted"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        {product.stock > 0 ? (
                          <Button
                            onClick={addToCart}
                            className="btn-luxury flex-1 bg-secondary"
                            loading={fetchType == "addToCart"}
                            disabled={fetchType == "addToCart"}
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Add to Cart
                          </Button>
                        ) : (
                          <Button
                            disabled
                            className="flex-1 bg-gray-300 text-gray-600 cursor-not-allowed"
                          >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Out of Stock
                          </Button>
                        )}
                        {/* <Button
                          variant="outline"
                          onClick={handleWishlist}
                          className={`btn-outline-luxury ${
                            isWishlisted ? "bg-red-50 border-red-200" : ""
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              isWishlisted ? "fill-red-500 text-red-500" : ""
                            }`}
                          />
                        </Button> */}
                        <Button
                          variant="outlineSecondary"
                          onClick={handleShare}
                          className="btn-outline-luxury"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {/* <Button
                        variant="outline"
                        className="btn-outline-luxury w-full"
                        onClick={() => {
                          // addToCart(product, 1);
                          navigate("/cart");
                        }}
                      >
                        Buy Now
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        <Footer />
      </main>
    </>
  );
};

export default ProductDetail;
