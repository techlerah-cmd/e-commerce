import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  Coupon,
  addCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  searchCoupons,
} from "@/lib/adminStore";
import {
  Trash2,
  Edit,
  Plus,
  Search,
  Calendar,
  Users,
  Percent,
} from "lucide-react";
import { ICouponCode, IPagination } from "@/types/apiTypes";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";

const Coupons = () => {
  const [coupons, setCoupons] = useState<ICouponCode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<ICouponCode | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState<string>("");
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const itemsPerPage = 10;
  const [form, setForm] = useState<ICouponCode>({
    code: "",
    discount_type: "percent",
    discount_value: 0,
    min_order: 10,
    max_uses: 10,
    expires_at: new Date().toDateString(),
  });
  const { authToken } = useAuth();
  const [pagination, setPagination] = useState<IPagination>({
    has_next: false,
    has_prev: false,
    page: 0,
    size: 20,
    total: 0,
  }); // Assuming pa

  useEffect(() => {
    fetchCoupons();
  }, [currentPage, query]);

  const fetchCoupons = async () => {
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.ADMIN_COUPON_LIST(currentPage, pagination.size, searchQuery),
      {},
      "application/json",
      authToken,
      "getProducts"
    );
    if (response.status === 200) {
      setCoupons(response.data.items);
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

  const handleClearSearch = () => {
    setSearchQuery("");
    // loadProducts();
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  const resetForm = () => {
    setForm({
      code: "",
      discount_type: "percent",
      discount_value: 0,
      min_order: 10,
      max_uses: 10,
      expires_at: new Date().toDateString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.code ||
      !form.discount_type ||
      !form.min_order ||
      !form.discount_value ||
      !form.max_uses ||
      !form.expires_at
    ) {
      toast.error("Please fill required fields");
      return;
    }

    if (editingCoupon) {
      // Update existing coupon
      const updated_data = {
        ...form,
      };
      if ("id" in updated_data) {
        delete updated_data.id;
      }
      if ("used_count" in updated_data) {
        delete updated_data.used_count;
      }
      const response = await makeApiCall(
        "PUT",
        API_ENDPOINT.EDIT_COUPON(editingCoupon.id),
        updated_data,
        "application/json",
        authToken,
        "updateCoupon"
      );
      if (response.status === 200) {
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon.id === editingCoupon?.id
              ? { ...coupon, ...updated_data }
              : coupon
          )
        );
        toast.success("Coupon Updated Successfully");
        setIsEditModalOpen(false);
        setEditingCoupon(null);
      } else {
        toast.error("Error While Updating Coupon");
      }
    } else {
      // Add new coupon
      const updated_data = {
        ...form,
      };
      if ("id" in updated_data) {
        delete updated_data.id;
      }
      if ("used_count" in updated_data) {
        delete updated_data.used_count;
      }
      const response = await makeApiCall(
        "POST",
        API_ENDPOINT.ADD_COUPON,
        updated_data,
        "application/json",
        authToken,
        "addCoupon"
      );
      if (response.status === 200) {
        setCoupons([...coupons, response.data]);
        toast.success("Coupon Added Successfully");
        setIsAddModalOpen(false);
      } else {
        toast.error("Error While Adding Coupon");
      }
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
    const response = await makeApiCall(
      "DELETE",
      API_ENDPOINT.DELETE_COUPON(id),
      {},
      "application/json",
      authToken,
      "deleteCoupon"
    );
    if (response.status === 200 || response.status === 204) {
      setCoupons((prevCoupons) =>
        prevCoupons.filter((coupon) => coupon.id !== id)
      );
      toast.success("Coupon Deleted Successfully");
    } else {
      toast.error("Error While Deleting Coupon");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-serif-elegant text-3xl text-secondary">
            Coupon Management
          </h1>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="btn-luxury"
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif-elegant text-xl text-secondary">
                  Add New Coupon
                </DialogTitle>
              </DialogHeader>
              <CouponForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                onCancel={() => setIsAddModalOpen(false)}
                isEditing={false}
                loading={
                  fetchType === "AddCoupon" || fetchType === "updateCoupon"
                }
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search coupons by code or discount type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                  onClick={handleClearSearch}
                >
                  ×
                </Button>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Min Order</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fetching && fetchType == "getProducts" && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Loading />
                      </TableCell>
                    </TableRow>
                  )}

                  {!fetching &&
                    coupons.map((coupon) => (
                      <TableRow key={coupon.code}>
                        <TableCell>
                          <div className="font-medium text-secondary">
                            {coupon.code}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">
                              {coupon.discount_type === "percent"
                                ? `${coupon.discount_value}%`
                                : `${coupon.discount_value}₹`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{coupon.min_order.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">
                              {coupon.used_count}
                              {coupon.max_uses ? `/${coupon.max_uses}` : ""}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {coupon.expires_at
                                ? new Date(
                                    coupon.expires_at
                                  ).toLocaleDateString()
                                : "Never"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outlineSecondary"
                              size="sm"
                              onClick={() => {
                                setEditingCoupon(coupon);
                                setForm({
                                  ...coupon,
                                  expires_at: new Date(coupon.expires_at)
                                    .toISOString()
                                    .split("T")[0],
                                });
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outlineSecondary" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Coupon
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {coupon.code}
                                    "? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(coupon.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {coupons.map((coupon) => (
            <Card key={coupon.code}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-secondary">
                      {coupon.code}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {coupon.discount_type === "percent" ? (
                        <Percent className="w-3 h-3" />
                      ) : (
                        <span>₹</span>
                      )}
                      <span>
                        {coupon.discount_type === "percent"
                          ? `${coupon.discount_value}%`
                          : coupon.discount_value}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Min Order</div>
                    <div className="font-medium">
                      ₹{coupon.min_order.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Usage</div>
                    <div className="font-medium">
                      {coupon.used_count}
                      {coupon.max_uses ? `/${coupon.max_uses}` : ""}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Expires</div>
                    <div className="font-medium">
                      {coupon.expires_at
                        ? new Date(coupon.expires_at).toLocaleDateString()
                        : "Never"}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outlineSecondary"
                    size="sm"
                    onClick={() => {
                      setEditingCoupon(coupon);
                      setForm({
                        ...coupon,
                        expires_at: new Date(coupon.expires_at)
                          .toISOString()
                          .split("T")[0],
                      });
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outlineSecondary"
                        size="sm"
                        className="flex-1"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{coupon.code}"? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(coupon.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {!fetching && coupons.length > 0 && (
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

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif-elegant text-xl text-secondary">
                Edit Coupon
              </DialogTitle>
            </DialogHeader>
            <CouponForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingCoupon(null);
                resetForm();
              }}
              isEditing={true}
              loading={
                fetchType === "AddCoupon" || fetchType === "updateCoupon"
              }
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

// Coupon Form Component
interface CouponFormProps {
  form: ICouponCode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  loading: boolean;
}

const CouponForm: React.FC<CouponFormProps> = ({
  form,
  setForm,
  onSubmit,
  onCancel,
  isEditing,
  loading,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="discount_value">Discount Value</Label>
          <Input
            id="discount_value"
            type="tel"
            step="0.01"
            value={form.discount_value}
            onChange={(e) =>
              setForm({ ...form, discount_value: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="min_order">Minimum Order (₹)</Label>
          <Input
            id="min_order"
            type="tel"
            step="0.01"
            value={form.min_order}
            onChange={(e) => setForm({ ...form, min_order: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label>Discount Type</Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={form.discount_type === "percent" ? "default" : "outline"}
            className="text-secondary"
            onClick={() => setForm({ ...form, discount_type: "percent" })}
          >
            Percent (%)
          </Button>
          <Button
            type="button"
            className="text-secondary"
            variant={form.discount_type === "flat" ? "default" : "outline"}
            onClick={() => setForm({ ...form, discount_type: "flat" })}
          >
            Flat (₹)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="max_uses">Max Uses</Label>
          <Input
            id="max_uses"
            type="tel"
            value={form.max_uses}
            required
            onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="expire_at">Expires At</Label>
          <Input
            id="expire_at"
            type="date"
            value={form.expires_at}
            required
            onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outlineSecondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="btn-luxury"
          loading={loading}
          disabled={loading}
        >
          {isEditing ? "Update Coupon" : "Add Coupon"}
        </Button>
      </div>
    </form>
  );
};

export default Coupons;
