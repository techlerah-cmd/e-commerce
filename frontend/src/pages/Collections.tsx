import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow, differenceInDays } from "date-fns";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice, type Product } from "@/data/products";
import { getAllProductsCombined } from "@/lib/adminStore";
import { useAuth } from "@/contexts/AuthContext";
import { useAPICall } from "@/hooks/useApiCall";
import { IPagination, IProductList } from "@/types/apiTypes";
import { API_ENDPOINT } from "@/config/backend";
import { Search, Box } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/Loading";

const Collections = () => {
  const [products, setProducts] = useState<IProductList[]>([]);
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>("");
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<IPagination>({
    has_next: false,
    has_prev: false,
    page: 0,
    size: 20,
    total: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, filter]);
  const fetchProducts = async () => {
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.PRODUCT_LIST(
        currentPage,
        pagination.size,
        searchTerm,
        filter
      ),
      {},
      "application/json"
    );
    if (response.status === 200) {
      console.log("response", response.data);
      setProducts(response.data.items || []);
      setPagination(response.data.pagination || pagination);
    }
  };

  const handleSearch = () => {
    setSearchTerm(search);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setSearchTerm(search);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const goToPreviousPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((p) => p + 1);
  };

  return (
    <>
      <Header />
      <main
        className="min-h-screen"
        style={{ backgroundColor: "hsl(var(--background))" }}
      >
        <section
          className="border-b backdrop-blur supports-[backdrop-filter]:bg-white/60"
          style={{ backgroundColor: "hsl(var(--card) / 0.75)" }}
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    style={{ color: "hsl(var(--muted-foreground))" }}
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage style={{ color: "hsl(var(--foreground))" }}>
                    Collections
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1
                  className="font-serif-elegant text-4xl md:text-5xl"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  Curated Collections
                </h1>
                <p
                  className="mt-2 font-sans-clean max-w-2xl"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  Explore timeless sarees handcrafted with precision. Discover
                  pieces that echo grace and grandeur.
                </p>
              </div>
              <div className="flex items-center gap-3"></div>
            </div>
            <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className=" flex gap-2 ">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search products by name, description, or code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="pr-10"
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                      onClick={handleClearSearch}
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      ×
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  className="flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-ful">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="new_arrivals">New arrivals</SelectItem>
                    <SelectItem value="lowest_first">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="highest_first">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="btn-outline-luxury">
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            {fetching && <Loading />}
            {!fetching && (
              <>
                {products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div
                      className="mb-6 rounded-full p-6"
                      style={{ backgroundColor: "hsl(var(--muted) / 0.6)" }}
                    >
                      <Box
                        className="h-12 w-12"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      />
                    </div>
                    <h3
                      className="font-serif-elegant text-2xl font-semibold mb-2"
                      style={{ color: "hsl(var(--primary))" }}
                    >
                      No Products Found
                    </h3>
                    <p
                      className="font-sans-clean max-w-md mb-6"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {searchTerm || filter
                        ? "We couldn't find any products matching your search criteria. Try adjusting your filters or search terms."
                        : "No products are currently available in our collection. Please check back later."}
                    </p>
                    {(searchTerm || filter) && (
                      <Button
                        variant="outline"
                        className="btn-outline-luxury"
                        onClick={() => {
                          setSearchTerm("");
                          setSearch("");
                          setFilter("");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="card-product group cursor-pointer"
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          {differenceInDays(
                            new Date(),
                            new Date(p.created_at)
                          ) < 3 && (
                            <span
                              className="absolute left-4 top-4 rounded-full px-2 py-1 text-xs font-semibold"
                              style={{
                                backgroundColor: "hsl(var(--accent))",
                                color: "hsl(var(--accent-foreground))",
                              }}
                            >
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="p-6">
                          <h3
                            className="font-serif-elegant text-xl font-semibold transition-colors duration-300 group-hover:text-accent"
                            style={{ color: "hsl(var(--primary))" }}
                          >
                            {p.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-3">
                            <span
                              className="font-sans-clean text-lg font-bold"
                              style={{ color: "hsl(var(--accent))" }}
                            >
                              {formatPrice(p.price)}
                            </span>
                            {p.actual_price > p.price && (
                              <span
                                className="font-sans-clean text-sm line-through"
                                style={{
                                  color: "hsl(var(--muted-foreground))",
                                }}
                              >
                                {formatPrice(p.actual_price)}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            className="btn-outline-luxury mt-4 w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${p.id}`);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          {/* Pagination */}
          {!fetching && products.length > 0 && (
            <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 mt-6">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={!pagination.has_prev}
                className="flex items-center justify-center gap-2 w-auto sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-4 sm:py-2"
                aria-label="Previous page"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden xs:inline-block">Previous</span>
              </Button>

              <span
                style={{ color: "hsl(var(--muted-foreground))" }}
                className="text-xs sm:text-sm mt-2 sm:mt-0"
              >
                Page {pagination.page} of{" "}
                {Math.ceil(pagination.total / pagination.size)}
              </span>

              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={!pagination.has_next}
                className="flex items-center justify-center gap-2 w-auto sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-4 sm:py-2"
                aria-label="Next page"
              >
                <span className="hidden xs:inline-block">Next</span>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Collections;
