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

  const handleSearch = () => {
    setQuery(searchQuery);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setQuery(searchQuery);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const getStatusBadge = (status: ICustomerOrder["status"]) => {
    const statusConfig = {
      payment_pending: {
        label: "Payment Pending",
        className: "bg-amber-100 text-amber-800 border border-amber-200",
        icon: Clock, // waiting
      },
      created: {
        label: "Created",
        className: "bg-gray-100 text-gray-800 border border-gray-200",
        icon: Clock, // just created
      },
      payment_paid: {
        label: "Processing",
        className: "bg-blue-100 text-blue-800 border border-blue-200",
        icon: Package, // package ready
      },
      shipped: {
        label: "Shipped",
        className: "bg-green-100 text-green-800 border border-green-200",
        icon: Truck, // delivery truck
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 border border-red-200",
        icon: XCircle, // cancelled ❌
      },
      canceled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 border border-red-200",
        icon: XCircle, // cancelled ❌
      },
      payment_failed: {
        label: "Payment Failed",
        className: "bg-red-100 text-red-800 border border-red-200",
        icon: XCircle, // failed ❌
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };
const getPaymentStatusBadge = (status: string) => {
  const statusConfig = {
    created: {
      label: "Pending",
      className: "bg-amber-100 text-amber-800 border border-amber-200",
      icon: Clock, // waiting
    },
    paid: {
      label: "Completed",
      className: "bg-green-100 text-green-800 border border-green-200",
      icon: CheckCircle, // success ✅
    },
    failed: {
      label: "Failed",
      className: "bg-red-100 text-red-800 border border-red-200",
      icon: XCircle, // failed ❌
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border border-red-200",
      icon: XCircle, // cancelled ❌
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
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
      <main className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif-elegant text-3xl text-primary">
              My Orders
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-2 max-w-md">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search orders by number "
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pr-10"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>
          {!fetching && (
            <>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 rounded-full bg-muted p-6">
                    <Box className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif-elegant text-2xl font-semibold text-primary mb-2">
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
                        className="hover:shadow-md transition-shadow bg-[#f0ecd3]"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-primary">
                                Order #{order.order_number}
                              </CardTitle>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Order Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Items</p>
                                <p className="font-medium">
                                  {order.items.length} item(s)
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Total Amount
                                </p>
                                <p className="font-semibold text-green-500">
                                  ₹{order.total.toLocaleString("en-IN")}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Payment</p>
                                <p className="font-medium capitalize">
                                  {getPaymentStatusBadge(
                                    order.transaction?.status
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
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
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
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
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={!pagination.has_prev}
                className="flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
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
                Previous
              </Button>

              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of{" "}
                {Math.ceil(pagination.total / pagination.size)}
              </span>

              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={!pagination.has_next}
                className="flex items-center gap-2"
              >
                Next
                <svg
                  className="w-4 h-4"
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
          {/* Order Details Modal */}
          <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif-elegant text-xl text-primary">
                  Order Details - #{selectedOrder?.order_number}
                </DialogTitle>
              </DialogHeader>

              {selectedOrder && (
                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Order Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">orders</span>
                          <span className="font-medium">
                            {selectedOrder.order_number}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          {getStatusBadge(selectedOrder.status)}
                        </div>
                        {selectedOrder.delivery_tracking_id && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Tracking ID:
                            </span>
                            <span className="font-mono text-xs">
                              {selectedOrder.delivery_tracking_id}
                            </span>
                          </div>
                        )}
                        {selectedOrder.delivery_partner && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Delivery Partner:
                            </span>
                            <span className="font-medium">
                              {selectedOrder.delivery_partner}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium mb-2">Shipping Address</h4>
                      <div className="bg-muted/30 p-3 rounded-lg text-sm">
                        <p className="font-medium">
                          {selectedOrder.shipping_address.full_name}
                        </p>
                        <p className="text-muted-foreground">
                          {selectedOrder.shipping_address.phone}
                        </p>
                        <p className="mt-1">
                          {selectedOrder.shipping_address.street}
                        </p>
                        {selectedOrder.shipping_address.landmark && (
                          <p className="text-muted-foreground">
                            {selectedOrder.shipping_address.landmark}
                          </p>
                        )}
                        <p>
                          {selectedOrder.shipping_address.city},{" "}
                          {selectedOrder.shipping_address.state}{" "}
                          {selectedOrder.shipping_address.postcode}
                        </p>
                        <p>{selectedOrder.shipping_address.country}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p
                              onClick={() => {
                                navigate(`/product/${item.product_id}`);
                              }}
                              className="font-medium hover:underline cursor-pointer text-blue-500"
                            >
                              {item.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.qty}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Unit Price: ₹
                              {item.unit_price?.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ₹{item.total_price?.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {(selectedOrder.delivery_tracking_id ||
                    selectedOrder.delivery_partner) && (
                    <div>
                      <h4 className="font-medium mb-2">
                        Delivery Tracking Information
                      </h4>
                      <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
                        {selectedOrder.delivery_tracking_id && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Tracking ID:
                            </span>
                            <span className="font-mono">
                              {selectedOrder.delivery_tracking_id}
                            </span>
                          </div>
                        )}
                        {selectedOrder.delivery_partner && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Delivery Partner:
                            </span>
                            <span>{selectedOrder.delivery_partner}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Payment Summary */}
                  <div>
                    <h4 className="font-medium mb-2">Payment Summary</h4>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>
                          ₹{selectedOrder.subtotal.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax:</span>
                        <span>
                          ₹{selectedOrder.tax.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping Charge:</span>
                        <span>
                          ₹
                          {selectedOrder.shipping_charge.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount:</span>
                        <span>
                          -₹{selectedOrder.discount.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span className="text-accent">
                          ₹{selectedOrder.total.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  {selectedOrder.transaction && (
                    <div>
                      <h4 className="font-medium mb-2">Payment Details</h4>
                      <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Transaction ID:
                          </span>
                          <span className="font-mono">
                            {selectedOrder.transaction.transaction_id}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Payment Method:
                          </span>
                          <span>
                            {selectedOrder.transaction.payment_method}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Amount Paid:
                          </span>
                          <span>
                            ₹
                            {selectedOrder.transaction.amount.toLocaleString(
                              "en-IN"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Payment Status:
                          </span>
                          {getPaymentStatusBadge(
                            selectedOrder.transaction.status
                          )}
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
