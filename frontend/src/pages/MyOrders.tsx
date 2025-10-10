/* eslint-disable @typescript-eslint/no-explicit-any */
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import {
  Eye,
  Package,
  CreditCard,
  Truck,
  XCircle,
  Search,
  Clock,
  Box,
  CheckCircle,
} from "lucide-react";
import { useAPICall } from "@/hooks/useApiCall";
import { ICustomerOrder, IPagination } from "@/types/apiTypes";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINT } from "@/config/backend";
import toast from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<ICustomerOrder | null>(
    null
  );
  const [orders, setOrders] = useState<ICustomerOrder[]>([]);
  const [pagination, setPagination] = useState<IPagination>({
    has_next: false,
    has_prev: false,
    page: 0,
    size: 20,
    total: 0,
  });
  const { authToken } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [query, setQuery] = useState("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, query]);

  const fetchOrders = async () => {
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.ORDER_LIST(currentPage, pagination.size, query),
      {},
      "application/json",
      authToken,
      "getProducts"
    );
    if (response.status === 200) {
      setOrders(response.data.items);
      setPagination(response.data);
    } else {
      toast.error("Error while fetching products");
    }
  };

  const handleSearch = () => setQuery(searchQuery);
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") setQuery(searchQuery);
  };

  const goToPreviousPage = () => setCurrentPage(currentPage - 1);
  const goToNextPage = () => setCurrentPage(currentPage + 1);
  const getStatusBadge = (status: ICustomerOrder["status"]) => {
    const statusConfig: Record<
      string,
      { label: string; bg: string; text: string; border?: string; icon: any }
    > = {
      payment_pending: {
        label: "Payment Pending",
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-100",
        icon: Clock,
      },
      created: {
        label: "Created",
        bg: "bg-gray-100",
        text: "text-gray-900",
        border: "border-gray-200",
        icon: Clock,
      },
      payment_paid: {
        label: "Processing",
        bg: "bg-violet-50",
        text: "text-violet-800",
        border: "border-violet-100",
        icon: Package,
      },
      shipped: {
        label: "Shipped",
        bg: "bg-green-50",
        text: "text-green-800",
        border: "border-green-100",
        icon: Truck,
      },
      cancelled: {
        label: "Cancelled",
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-100",
        icon: XCircle,
      },
      canceled: {
        label: "Cancelled",
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-100",
        icon: XCircle,
      },
      payment_failed: {
        label: "Payment Failed",
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-100",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] ?? {
      label: String(status ?? "Unknown"),
      bg: "bg-gray-50",
      text: "text-gray-800",
      border: "border-gray-100",
      icon: Clock,
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="h-3 w-3 text-current" />
        <span>{config.label}</span>
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; bg: string; text: string; border?: string; icon: any }
    > = {
      created: {
        label: "Pending",
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-100",
        icon: Clock,
      },
      paid: {
        label: "Completed",
        bg: "bg-green-50",
        text: "text-green-800",
        border: "border-green-100",
        icon: CheckCircle,
      },
      failed: {
        label: "Failed",
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-100",
        icon: XCircle,
      },
      cancelled: {
        label: "Cancelled",
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-100",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] ?? {
      label: String(status ?? "Unknown"),
      bg: "bg-gray-50",
      text: "text-gray-800",
      border: "border-gray-100",
      icon: Clock,
    };

    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="h-3 w-3 text-current" />
        <span>{config.label}</span>
      </span>
    );
  };

  const openDetailsDialog = (order: ICustomerOrder) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[hsl(var(--background))] text-muted">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif-elegant text-3xl text-primary-foreground">
              My Orders
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-2 max-w-md">
              <Input
                type="text"
                placeholder="Search orders by number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pr-10"
              />
              <Button
                onClick={handleSearch}
                className="btn-luxury flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> Search
              </Button>
            </div>
          </div>

          {!fetching && (
            <>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 rounded-full bg-[hsl(var(--muted))] p-6">
                    <Box className="h-12 w-12 text-muted " />
                  </div>
                  <h3 className="font-serif-elegant text-2xl font-semibold text-primary-foreground mb-2">
                    No Orders Found
                  </h3>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Orders Grid */}
                  <div className="grid gap-6">
                    {orders.map((order) => (
                      <Card
                        key={order.id}
                        className="hover:shadow-luxury transition-shadow bg-white"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-primary-foreground">
                              Order #{order.order_number}
                            </CardTitle>
                            {getStatusBadge(order.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Order Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                  Items
                                </p>
                                <p className="font-medium">
                                  {order.items.length} item(s)
                                </p>
                              </div>
                              <div>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                  Total Amount
                                </p>
                                <p className="font-semibold text-primary-foreground">
                                  ₹{order.total.toLocaleString("en-IN")}
                                </p>
                              </div>
                              <div>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                  Payment
                                </p>
                                <p className="font-medium capitalize">
                                  {getPaymentStatusBadge(
                                    order.transaction?.status
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                  Shipping Address
                                </p>
                                <p className="font-medium">
                                  {order.shipping_address.city},{" "}
                                  {order.shipping_address.state}
                                </p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDetailsDialog(order)}
                                className="text-primary-foreground flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" /> View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {fetching && (
            <div className="py-4">
              <Loading />
            </div>
          )}

          {/* Pagination */}
          {!fetching && orders.length != 0 && (
            <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 mt-6">
              <Button
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

          <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto p-6 rounded-2xl bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] shadow-luxury">
              <DialogHeader className="relative">
                <DialogTitle className="font-serif-elegant text-xl text-primary-foreground">
                  Order Details - #{selectedOrder?.order_number}
                </DialogTitle>

                {/* Close button */}
                {/* <button
                  onClick={() => setDetailsDialogOpen(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 rounded-md p-1 hover:bg-[hsl(var(--input))]/40 transition"
                >
                  <XCircle className="h-5 w-5 text-muted " />
                </button> */}
              </DialogHeader>

              {selectedOrder && (
                <div className="space-y-6 mt-4">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 text-[hsl(var(--foreground))]">
                        Order Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[hsl(var(--muted-foreground))]">
                            Order #
                          </span>
                          <span className="font-medium text-[hsl(var(--foreground))]">
                            {selectedOrder.order_number}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-[hsl(var(--muted-foreground))]">
                            Status:
                          </span>
                          <div>{getStatusBadge(selectedOrder.status)}</div>
                        </div>

                        {selectedOrder.delivery_tracking_id && (
                          <div className="flex justify-between">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              Tracking ID:
                            </span>
                            <span className="font-mono text-xs text-[hsl(var(--foreground))]">
                              {selectedOrder.delivery_tracking_id}
                            </span>
                          </div>
                        )}

                        {selectedOrder.delivery_partner && (
                          <div className="flex justify-between">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              Delivery Partner:
                            </span>
                            <span className="font-medium text-[hsl(var(--foreground))]">
                              {selectedOrder.delivery_partner}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium mb-2 text-[hsl(var(--foreground))]">
                        Shipping Address
                      </h4>
                      <div className="bg-[hsl(var(--muted))]/30 p-3 rounded-lg text-sm">
                        <p className="font-medium text-[hsl(var(--foreground))]">
                          {selectedOrder.shipping_address.full_name}
                        </p>
                        <p className="text-[hsl(var(--muted-foreground))]">
                          {selectedOrder.shipping_address.phone}
                        </p>
                        <p className="mt-1 text-[hsl(var(--foreground))]">
                          {selectedOrder.shipping_address.street}
                        </p>
                        {selectedOrder.shipping_address.landmark && (
                          <p className="text-[hsl(var(--muted-foreground))]">
                            {selectedOrder.shipping_address.landmark}
                          </p>
                        )}
                        <p className="text-[hsl(var(--foreground))]">
                          {selectedOrder.shipping_address.city},{" "}
                          {selectedOrder.shipping_address.state}{" "}
                          {selectedOrder.shipping_address.postcode}
                        </p>
                        <p className="text-[hsl(var(--foreground))]">
                          {selectedOrder.shipping_address.country}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2 text-[hsl(var(--foreground))]">
                      Order Items
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex items-center gap-3 p-3 border rounded-lg border-[hsl(var(--border))] bg-[hsl(var(--card))]/50"
                        >
                          <div className="flex-1">
                            <p
                              onClick={() => {
                                navigate(`/product/${item.product_id}`);
                              }}
                              className="font-medium hover:underline cursor-pointer text-primary-foreground"
                            >
                              {item.name}
                            </p>

                            <p className="text-sm text-primary-foreground ">
                              Quantity: {item.qty}
                            </p>
                            <p className="text-sm text-primary-foreground ">
                              Unit Price: ₹
                              {item.unit_price?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-[hsl(var(--foreground))]">
                              ₹{item.total_price?.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Tracking Info */}
                  {(selectedOrder.delivery_tracking_id ||
                    selectedOrder.delivery_partner) && (
                    <div>
                      <h4 className="font-medium mb-2 text-[hsl(var(--foreground))]">
                        Delivery Tracking Information
                      </h4>
                      <div className="bg-[hsl(var(--muted))]/10 p-3 rounded-lg text-sm space-y-2">
                        {selectedOrder.delivery_tracking_id && (
                          <div className="flex justify-between">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              Tracking ID:
                            </span>
                            <span className="font-mono text-[hsl(var(--foreground))]">
                              {selectedOrder.delivery_tracking_id}
                            </span>
                          </div>
                        )}
                        {selectedOrder.delivery_partner && (
                          <div className="flex justify-between">
                            <span className="text-[hsl(var(--muted-foreground))]">
                              Delivery Partner:
                            </span>
                            <span className="text-[hsl(var(--foreground))]">
                              {selectedOrder.delivery_partner}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Summary */}
                  <div>
                    <h4 className="font-medium mb-2 text-[hsl(var(--foreground))]">
                      Payment Summary
                    </h4>
                    <div className="bg-[hsl(var(--muted))]/10 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Subtotal:
                        </span>
                        <span className="text-[hsl(var(--foreground))]">
                          ₹{selectedOrder.subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Tax:
                        </span>
                        <span className="text-[hsl(var(--foreground))]">
                          ₹{selectedOrder.tax.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Shipping Charge:
                        </span>
                        <span className="text-[hsl(var(--foreground))]">
                          ₹
                          {selectedOrder.shipping_charge.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-[hsl(var(--muted-foreground))]">
                          Discount:
                        </span>
                        <span className="font-semibold text-[hsl(var(--accent))]">
                          -₹{selectedOrder.discount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-semibold">
                        <span className="text-[hsl(var(--foreground))]">
                          Total:
                        </span>
                        <span className="text-[hsl(var(--accent))]">
                          ₹{selectedOrder.total.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  {selectedOrder.transaction && (
                    <div>
                      <h4 className="font-medium mb-2 text-[hsl(var(--foreground))]">
                        Payment Details
                      </h4>
                      <div className="bg-[hsl(var(--muted))]/10 p-3 rounded-lg text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[hsl(var(--muted-foreground))]">
                            Transaction ID:
                          </span>
                          <span className="font-mono text-[hsl(var(--foreground))]">
                            {selectedOrder.transaction.transaction_id}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-[hsl(var(--muted-foreground))]">
                            Payment Method:
                          </span>
                          <span className="text-[hsl(var(--foreground))]">
                            {selectedOrder.transaction.payment_method}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-[hsl(var(--muted-foreground))]">
                            Amount Paid:
                          </span>
                          <span className="text-[hsl(var(--foreground))]">
                            ₹
                            {selectedOrder.transaction.amount.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-[hsl(var(--muted-foreground))]">
                            Payment Status:
                          </span>
                          <div>
                            {getPaymentStatusBadge(
                              selectedOrder.transaction.status
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MyOrders;
