import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "@/lib/adminStore";
import { useEffect, useState } from "react";
import {
  Eye,
  Edit,
  Package,
  CreditCard,
  Truck,
  XCircle,
  Search,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { ICustomerOrder, IPagination } from "@/types/apiTypes";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { set } from "date-fns";

const Orders = () => {
  const [orders, setOrders] = useState<ICustomerOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ICustomerOrder | null>(
    null
  );
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("payment_pending");
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const { authToken } = useAuth();
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const [query, setQuery] = useState<string>("");
  const [pagination, setPagination] = useState<IPagination>({
    has_next: false,
    has_prev: false,
    page: 0,
    size: 5,
    total: 0,
  }); // Assum
  const navigate = useNavigate();
  useEffect(() => {
    fetchProducts();
  }, [currentPage, query]);

  const fetchProducts = async () => {
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.ADMIN_ORDER_LIST(
        currentPage,
        pagination.size,
        query,
        selectedFilter
      ),
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
    setQuery(searchTerm);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setQuery(searchTerm);
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

  const handleStatusUpdate = async () => {
    // if (selectedOrder.status == newStatus) return;

    const response = await makeApiCall(
      "PUT",
      API_ENDPOINT.UPDATE_ORDER_STATUS(selectedOrder.id),
      {
        status: newStatus,
        delivery_partner: deliveryPartner,
        delivery_tracking_id: trackingId,
      },
      "application/json",
      authToken,
      "updateOrderStatus"
    );
    if (response.status != 200) {
      toast.error("Failed to update order status");
    } else {
      toast.success("Order status updated successfully");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder!.id
            ? { ...order, status: newStatus,delivery_partner: deliveryPartner,delivery_tracking_id: trackingId }
            : order
        )
      );
      setStatusDialogOpen(false);
    }
  };

  const openStatusDialog = (order: ICustomerOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setDeliveryPartner(order.delivery_partner || "");
    setTrackingId(order.delivery_tracking_id || "");
    setStatusDialogOpen(true);
  };

  const openDetailsDialog = (order: ICustomerOrder) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-serif-elegant text-3xl text-primary">
            Orders Management
          </h1>
        </div>

        <div className="mb-6">
          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search products by name, description, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pr-10"
              />
            </div>
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No orders yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Orders Grid */}
            <div className="grid gap-6">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-primary">
                          Order #
                          {order.order_number ||
                            order.order_number ||
                            order.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {order.transaction?.created_at
                            ? new Date(
                                order.transaction.created_at
                              ).toLocaleString()
                            : order.created_at
                            ? new Date(order.created_at).toLocaleString()
                            : "N/A"}
                        </p>
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
                            {order.items?.length || 0} item(s)
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">
                            {order.shipping_address?.full_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-semibold text-accent">
                            ₹{order.total.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payment</p>
                          <p className="font-medium capitalize">
                            {order.transaction?.payment_method ||
                              order.transaction?.payment_method ||
                              "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Info (if shipped) */}
                      {order.status === "shipped" &&
                        (order.delivery_partner ||
                          order.delivery_partner ||
                          order.delivery_tracking_id ||
                          order.delivery_tracking_id) && (
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <h4 className="font-medium text-sm mb-2">
                              Delivery Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              {(order.delivery_partner ||
                                order.delivery_partner) && (
                                <div>
                                  <p className="text-muted-foreground">
                                    Delivery Partner
                                  </p>
                                  <p className="font-medium">
                                    {order.delivery_partner ||
                                      order.delivery_partner}
                                  </p>
                                </div>
                              )}
                              {(order.delivery_tracking_id ||
                                order.delivery_tracking_id) && (
                                <div>
                                  <p className="text-muted-foreground">
                                    Tracking ID
                                  </p>
                                  <p className="font-medium font-mono">
                                    {order.delivery_tracking_id ||
                                      order.delivery_tracking_id}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openStatusDialog(order)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!fetching && (
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

            {/* No results message */}
            {orders.length === 0 && searchTerm && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  No orders found matching "{searchTerm}". Try a different
                  search term.
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Order Details Modal */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Order Details - #
                {selectedOrder?.order_number ||
                  selectedOrder?.id.slice(0, 8).toUpperCase()}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-mono">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Order Number:
                        </span>
                        <span className="font-medium">
                          {selectedOrder.order_number ||
                            selectedOrder.order_number}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      {(selectedOrder.transaction?.created_at ||
                        selectedOrder.created_at) && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Created:
                          </span>
                          <span>
                            {new Date(
                              selectedOrder.transaction?.created_at ||
                                selectedOrder.created_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedOrder.transaction?.updated_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Last Updated:
                          </span>
                          <span>
                            {new Date(
                              selectedOrder.transaction.updated_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{selectedOrder.user?.full_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{selectedOrder.user?.email || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{selectedOrder.shipping_address?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                      <p className="font-medium">
                        {selectedOrder.shipping_address?.full_name}
                      </p>
                      <p>{selectedOrder.shipping_address?.street}</p>
                      <p>
                        {selectedOrder.shipping_address?.city},{" "}
                        {selectedOrder.shipping_address?.state}
                      </p>
                      <p>
                        {selectedOrder.shipping_address?.country} -{" "}
                        {selectedOrder.shipping_address?.postcode}
                      </p>
                      {selectedOrder.shipping_address?.landmark && (
                        <p className="text-muted-foreground">
                          Landmark: {selectedOrder.shipping_address?.landmark}
                        </p>
                      )}
                      <p className="mt-1">
                        Phone: {selectedOrder.shipping_address?.phone}
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-2">Order Items</h4>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
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
                              {item.unit_price.toLocaleString("en-IN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{item.total_price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/50 p-4 rounded-lg text-sm text-center text-muted-foreground">
                      No items found in this order
                    </div>
                  )}
                </div>

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
                        ₹{(selectedOrder.tax || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping Charge:</span>
                      <span>
                        ₹{selectedOrder.shipping_charge.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount:</span>
                      <span>
                        -₹
                        {(selectedOrder.discount || 0).toLocaleString("en-IN")}
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

                {/* Delivery Tracking Information */}
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

                {/* Transaction Details */}
                {selectedOrder.transaction && (
                  <div>
                    <h4 className="font-medium mb-2">Transaction Details</h4>
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
                        <span className="capitalize">
                          {selectedOrder.transaction.payment_method}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span>
                          ₹
                          {selectedOrder.transaction.amount.toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={
                            selectedOrder.transaction.status === "paid"
                              ? "default"
                              : selectedOrder.transaction.status === "failed"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {selectedOrder.transaction.status}
                        </Badge>
                      </div>
                      {selectedOrder.transaction.created_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Created At:
                          </span>
                          <span>
                            {new Date(
                              selectedOrder.transaction.created_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {selectedOrder.transaction.updated_at && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Updated At:
                          </span>
                          <span>
                            {new Date(
                              selectedOrder.transaction.updated_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {/* Transaction Metadata */}
                      {selectedOrder.transaction.transaction_metadata && (
                        <>
                          <Separator className="my-2" />
                          <h5 className="font-medium text-xs text-muted-foreground mb-2">
                            Payment Gateway Details
                          </h5>
                          {selectedOrder.transaction.transaction_metadata
                            .id && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Gateway Order ID:
                              </span>
                              <span className="font-mono text-xs">
                                {
                                  selectedOrder.transaction.transaction_metadata
                                    .id
                                }
                              </span>
                            </div>
                          )}
                          {selectedOrder.transaction.transaction_metadata
                            .currency && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Currency:
                              </span>
                              <span>
                                {
                                  selectedOrder.transaction.transaction_metadata
                                    .currency
                                }
                              </span>
                            </div>
                          )}
                          {selectedOrder.transaction.transaction_metadata
                            .amount && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Gateway Amount:
                              </span>
                              <span>
                                ₹
                                {(
                                  selectedOrder.transaction.transaction_metadata
                                    .amount / 100
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                          {selectedOrder.transaction.transaction_metadata
                            .amount_paid !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Amount Paid:
                              </span>
                              <span>
                                ₹
                                {(
                                  selectedOrder.transaction.transaction_metadata
                                    .amount_paid / 100
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                          {selectedOrder.transaction.transaction_metadata
                            .amount_due !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Amount Due:
                              </span>
                              <span>
                                ₹
                                {(
                                  selectedOrder.transaction.transaction_metadata
                                    .amount_due / 100
                                ).toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                          {selectedOrder.transaction.transaction_metadata
                            .attempts !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Payment Attempts:
                              </span>
                              <span>
                                {
                                  selectedOrder.transaction.transaction_metadata
                                    .attempts
                                }
                              </span>
                            </div>
                          )}
                          {selectedOrder.transaction.transaction_metadata
                            .status && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Gateway Status:
                              </span>
                              <span className="capitalize">
                                {
                                  selectedOrder.transaction.transaction_metadata
                                    .status
                                }
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Modal */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Update Order Status - #{selectedOrder?.order_number}{" "}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Order Status</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value: OrderStatus) => setNewStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment_pending">
                      Payment Pending
                    </SelectItem>
                    <SelectItem value="payment_paid">Payment Paid</SelectItem>
                    <SelectItem value="payment_failed">
                      Payment Failed
                    </SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newStatus === "shipped" && (
                <>
                  <div>
                    <Label htmlFor="delivery-partner">
                      Delivery Partner (Optional)
                    </Label>
                    <Input
                      id="delivery-partner"
                      value={deliveryPartner}
                      onChange={(e) => setDeliveryPartner(e.target.value)}
                      placeholder="e.g., FedEx, DHL, Blue Dart"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tracking-id">Tracking ID (Optional)</Label>
                    <Input
                      id="tracking-id"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleStatusUpdate}
                  className="flex-1"
                  loading={fetchType == "updateOrderStatus" && fetching}
                  disabled={fetchType == "updateOrderStatus" && fetching}
                >
                  Update Status
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatusDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Orders;
