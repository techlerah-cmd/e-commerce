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
import { categories } from "@/data/category";

const Collections = () => {
  const [products, setProducts] = useState<IProductList[]>([]);
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const { user } = useAuth();
  const [filter, setFilter] = useState<string>(""); // used for sort / built-in filters
  const [category, setCategory] = useState<string>("all"); // NEW: horizontal categories
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, filter, category]);

  const fetchProducts = async () => {
    // API_ENDPOINT.PRODUCT_LIST(...) returns a URL string. We'll append category only if it's not "All".
    const url = API_ENDPOINT.PRODUCT_LIST(
      currentPage,
      pagination.size,
      searchTerm,
      filter,
      category == "all" ? "" : category
    );

    const response = await makeApiCall("GET", url, {}, "application/json");
    if (response.status === 200) {
      setProducts(response.data.items || []);
      setPagination(response.data.pagination || pagination);
    }
  };

  const handleSearch = () => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setSearchTerm(search);
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchTerm("");
  };

  const goToPreviousPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((p) => p + 1);
  };

  // derive categories from products (keeps default "All")

  // helper to change category — resets page & search if needed
  const selectCategory = (c: string) => {
    setCategory(c);
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen  bg-muted">
        <section className="border-b supports-[backdrop-filter]:backdrop-blur-sm bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 ">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-muted">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-muted" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-muted">
                    Collections
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1
                  className="font-serif-elegant text-4xl md:text-5xl"
                  style={{ color: "hsl(var(--primary, 41 89% 84%))" }}
                >
                  Curated Collections
                </h1>
                <p className="mt-2 font-sans-clean max-w-2xl text-muted">
                  Explore timeless sarees handcrafted with precision. Discover
                  pieces that echo grace and grandeur.
                </p>
              </div>

              <div className="flex items-center gap-3" />
            </div>

            {/* --- HORIZONTAL CATEGORY SCROLLER (NEW) --- */}

            <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div className=" flex gap-2 ">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search products by name, description, or code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="pr-10 bg-muted"
                    // input background + text color from theme (ensures not plain white)
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={handleClearSearch}
                      style={{
                        color: "hsl(var(--muted-foreground, 0 0% 20%))",
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleSearch}
                  className="flex items-center gap-2"
                  style={{
                    backgroundImage: "var(--gradient-accent)",
                    color: "hsl(var(--accent-foreground, 0 0% 8%))",
                    borderColor: "hsl(var(--primary, 41 89% 84%))",
                  }}
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-nowrap pl-2 text-muted ">Filter :</p>
                <Select
                  value={filter}
                  onValueChange={(v) => {
                    setFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-full bg-muted ">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
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
              </div>
            </div>
            <div className="mt-6">
              <div className="overflow-x-auto no-scrollbar py-2">
                <div className="flex gap-3 items-center px-2">
                  <Button
                    key={"all"}
                    variant={category == "all" ? "default" : "outlinePrimary"}
                    size="sm"
                    onClick={() => selectCategory("all".toLocaleLowerCase())}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap focus:!outline-none focus:ring-2 focus:ring-offset-2 outline-none transition  ${
                      category == "all" ? "scale-105 " : ""
                    }`}
                    aria-pressed={category == "all"}
                    aria-label={`Filter by All`}
                  >
                    {"All"}
                  </Button>
                  {categories.map((c) => {
                    const active =
                      c.toLocaleLowerCase() === category.toLocaleLowerCase();
                    return (
                      <Button
                        key={c}
                        variant={active ? "default" : "outlinePrimary"}
                        size="sm"
                        onClick={() => selectCategory(c.toLocaleLowerCase())}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap focus:!outline-none focus:ring-2 focus:ring-offset-2 outline-none transition  ${
                          active ? "scale-105 " : ""
                        }`}
                        aria-pressed={active}
                        aria-label={`Filter by ${c}`}
                      >
                        {c}
                      </Button>
                    );
                  })}
                </div>
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
                      style={{ color: "hsl(var(--secondary))" }}
                    >
                      No Products Found
                    </h3>

                    <p
                      className="font-sans-clean max-w-md mb-6"
                      style={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {searchTerm || filter || (category && category !== "all")
                        ? "We couldn't find any products matching your search criteria. Try adjusting your filters or search terms."
                        : "No products are currently available in our collection. Please check back later."}
                    </p>

                    {(searchTerm ||
                      filter ||
                      (category && category !== "All")) && (
                      <Button
                        variant="outlineSecondary"
                        onClick={() => {
                          setSearchTerm("");
                          setSearch("");
                          setFilter("");
                          setCategory("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/product/${p.id}`)}
                      >
                        {/* CARD WRAPPER */}
                        <div className="relative overflow-hidden">
                          {/* PRODUCT IMAGE (FULL COVER) */}
                          <div className="relative w-full h-56 sm:h-72 md:h-[26rem] lg:h-[30rem]">
                            <img
                              src={p.image}
                              alt={p.title}
                              className="
              absolute inset-0 w-full h-full 
              object-cover 
              transition-transform duration-700 ease-out
              
            "
                            />

                            {/* Subtle dark overlay for readability */}
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                backgroundColor:
                                  "hsl(var(--foreground, 0 0% 8%) / 0.18)",
                                mixBlendMode: "multiply",
                              }}
                            />

                            {/* OUT OF STOCK LABEL */}
                            {p.stock === 0 && (
                              <div className="absolute left-1/2 bottom-6 transform -translate-x-1/2 w-10/12 md:w-8/12 lg:w-1/2">
                                <div className="bg-white/95 px-4 py-3 text-center rounded-sm shadow-sm">
                                  <span
                                    className="block font-semibold uppercase tracking-wider text-xs md:text-sm"
                                    style={{
                                      color: "hsl(var(--ast-global-color-2))",
                                    }}
                                  >
                                    Out of stock
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* TEXT CONTENT */}
                          <div className="px-4 sm:px-6 py-2 pb-4 text-center">
                            <h3
                              className="font-serif-elegant text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2"
                              style={{
                                color: "hsl(var(--ast-global-color-2))",
                              }}
                            >
                              {p.title}
                            </h3>

                            <div className="mb-2 flex justify-center gap-1">
                              <div
                                className="text-sm sm:text-base md:text-lg font-semibold"
                                style={{
                                  color: "hsl(var(--ast-global-color-2))",
                                }}
                              >
                                {formatPrice(p.price)}
                              </div>
                              {p.actual_price > p.price && (
                                <div
                                  className="text-xs sm:text-sm mt-1 line-through"
                                  style={{
                                    color: "hsl(var(--muted-foreground))",
                                  }}
                                >
                                  {formatPrice(p.actual_price)}
                                </div>
                              )}
                            </div>

                            {/* READ MORE BUTTON */}
                            <Button
                              variant="outline"
                              className="text-secondary border-transparent hover:bg-secondary hover:text-muted text-xs sm:text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${p.id}`);
                              }}
                            >
                              Read more
                            </Button>
                          </div>
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
                onClick={goToPreviousPage}
                disabled={!pagination.has_prev}
                className="flex items-center justify-center gap-2 w-auto sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-4 sm:py-2"
                aria-label="Previous page"
                style={{
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--muted-foreground))",
                }}
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
                onClick={goToNextPage}
                disabled={!pagination.has_next}
                className="flex items-center justify-center gap-2 w-auto sm:w-auto text-sm sm:text-base px-4 py-2 sm:px-4 sm:py-2"
                aria-label="Next page"
                style={{
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--muted-foreground))",
                }}
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
