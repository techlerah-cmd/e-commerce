/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import imageCompression from "browser-image-compression";

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
import { useState, useEffect } from "react";

import { Edit, Trash2, Plus, Package, Search } from "lucide-react";
import { useAPICall } from "@/hooks/useApiCall";
import { API_ENDPOINT } from "@/config/backend";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { Loading } from "@/components/ui/Loading";
import { IPagination, IProduct } from "@/types/apiTypes";
import { useNavigate } from "react-router-dom";
import { categories } from "@/data/category";

const AddProduct = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { authToken } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState<IPagination>({
    has_next: false,
    has_prev: false,
    page: 0,
    size: 20,
    total: 0,
  }); // Assuming pagination data has a 'total' property
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const [form, setForm] = useState<IProduct>({
    title: "",
    description: "",
    code: "",
    price: 0,
    actual_price: 0,
    images: [],
    product_metadata: [] as { key: string; value: string }[],
    stock: 0,
    active: true,
    featured: false,
    category: categories && categories.length > 0 ? categories[0] : "all",
  } as IProduct);

  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, query]);

  const fetchProducts = async () => {
    const response = await makeApiCall(
      "GET",
      API_ENDPOINT.ADMIN_PRODUCT_LIST(
        currentPage,
        pagination.size,
        searchQuery
      ),
      {},
      "application/json",
      authToken,
      "getProducts"
    );
    if (response.status === 200) {
      setProducts(response.data.items);
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
  };

  const goToPreviousPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((p) => p + 1);
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      code: "",
      price: 0,
      actual_price: 0,
      images: [],
      product_metadata: [],
      stock: 0,
      active: true,
      featured: false,
      category: categories && categories.length > 0 ? categories[0] : "all",
    } as IProduct);
    setDeletedImages([]);
  };

  // helper to slugify category for backend: lowercase + replace spaces with hyphens

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    const originalPrice = Number(form.actual_price);
    const stock = Number(form.stock);

    if (
      !form.title ||
      !price ||
      !form.code ||
      !form.description ||
      (form.images && form.images.length === 0)
    ) {
      toast.error("Please fill in the required fields.");
      return;
    }
    // Build formData common parts helper
    const appendCommon = (formdata: FormData) => {
      formdata.append("title", form.title);
      formdata.append("code", form.code);
      formdata.append("price", price.toString());
      formdata.append("actual_price", originalPrice.toString());
      formdata.append("description", form.description);
      formdata.append("stock", stock.toString());
      formdata.append("active", form.active ? "true" : "false");
      formdata.append("featured", form.featured ? "true" : "false");
      formdata.append(
        "product_metadata",
        JSON.stringify(form.product_metadata || [])
      );
      // category appended as normalized slug
      formdata.append("category", form.category);
    };

    if (editingProduct) {
      // Update existing product
      const formdata = new FormData();
      appendCommon(formdata);

      // Add deleted images (for backend to remove them)
      deletedImages.forEach((imageId) => {
        formdata.append("deleted_images_ids", imageId);
      });

      // Add new image files
      form.images.forEach((item: any) => {
        if (item.isNew && item.file) {
          formdata.append("images", item.file, item.file.name);
        }
      });

      // Call update function
      const response = await makeApiCall(
        "PUT",
        API_ENDPOINT.EDIT_PRODUCT(editingProduct?.id ?? ""),
        formdata,
        "application/form-data",
        authToken,
        "updateProduct"
      );
      if (response.status === 200 || response.status === 201) {
        setProducts((prevProducts) =>
          prevProducts.map((prod) =>
            prod.id === editingProduct?.id ? response.data : prod
          )
        );
        toast.success(`Successfully updated product.`);
        setIsEditModalOpen(false);
      } else {
        toast.error("Failed to update product");
      }
    } else {
      // Add new product
      const formdata = new FormData();
      appendCommon(formdata);

      form.images.forEach((item: any) => {
        if (item.file) {
          formdata.append("images", item.file, item.file.name);
        }
      });

      const response = await makeApiCall(
        "POST",
        API_ENDPOINT.ADD_PRODUCT,
        formdata,
        "application/form-data",
        authToken,
        "createProduct"
      );
      if (response.status === 200 || response.status === 201) {
        setProducts([response.data, ...products]);
        setIsAddModalOpen(false);
        toast.success(`Successfully created.`);
      } else {
        toast.error("Failed to create product");
        return;
      }
    }

    resetForm();
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
    setForm({
      ...product,
      // ensure category present (fallback to store default)
      category:
        (product && (product as any).category) ||
        (categories && categories.length > 0 ? categories[0] : "all"),
    } as IProduct);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (productId: string, productName: string) => {
    const response = await makeApiCall(
      "DELETE",
      `${API_ENDPOINT.DELETE_PRODUCT(productId)}`,
      {},
      "application/json",
      authToken,
      "deleteProduct"
    );
    if (response.status === 200) {
      setProducts((prevState) =>
        prevState.filter((item) => item.id != productId)
      );
      toast.success(`Product successfully deleted.`);
    } else {
      toast.error("Something went wrong.");
    }
  };

  const addMetadata = () => {
    setForm({
      ...form,
      product_metadata: [
        ...(form.product_metadata || []),
        { key: "", value: "" },
      ] as any[],
    });
  };

  const updateMetadata = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newMetadata = [...(form.product_metadata || [])];
    newMetadata[index] = { ...newMetadata[index], [field]: value };
    setForm({ ...form, product_metadata: newMetadata });
  };

  const removeMetadata = (index: number) => {
    setForm({
      ...form,
      product_metadata: form.product_metadata.filter((_, i) => i !== index),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const compressedFiles: File[] = [];

    for (const file of filesArray) {
      try {
        const options = {
          maxSizeMB: 2, // allow up to ~2MB per image (higher size = better quality)
          maxWidthOrHeight: 1600, // larger max dimensions (sharper images)
          useWebWorker: true,
          initialQuality: 0.9, // increase compression quality (default ~0.8)
        };
        const compressedFile = await imageCompression(file, options);
        compressedFiles.push(compressedFile);
      } catch (error) {
        console.error("Image compression error:", error);
        compressedFiles.push(file); // fallback to original
      }
    }

    // Update form state with compressed images
    setForm({
      ...form,
      images: [
        ...(form.images || []),
        ...compressedFiles.map((f) => ({ file: f, isNew: true })),
      ],
    });

    // Reset input so user can re-upload same file if needed
    e.target.value = "";
  };


  const removeImage = (index: number) => {
    const imageToRemove = form.images[index];
    if (!imageToRemove.isNew && imageToRemove.id) {
      setDeletedImages([...deletedImages, imageToRemove.id]);
    }

    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-serif-elegant text-3xl text-secondary">
            Product Management
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
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif-elegant text-xl text-secondary">
                  Add New Product
                </DialogTitle>
              </DialogHeader>
              <ProductForm
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                onCancel={() => setIsAddModalOpen(false)}
                isEditing={false}
                addMetadata={addMetadata}
                updateMetadata={updateMetadata}
                removeMetadata={removeMetadata}
                handleImageUpload={handleImageUpload}
                removeImage={removeImage}
                loading={
                  fetchType == "createProduct" || fetchType === "updateProduct"
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
                placeholder="Search products by name, description, or code..."
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
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search
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
                    <TableHead className="w-[200px]">Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Sold</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
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
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                product.images.length > 0
                                  ? product.images[0].url
                                  : "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg"
                              }
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <div
                                onClick={() =>
                                  navigate(`/product/${product.id}`)
                                }
                                className="font-medium hover:cursor-pointer hover:underline"
                              >
                                {product.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {product.code && (
                                  <span className="text-secondary font-medium">
                                    #{product.code}
                                  </span>
                                )}
                                {product.code && " "}
                                {/* show category if available */}
                                {product.category && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({product.category})
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ₹{product.price.toLocaleString()}
                          </div>
                          {product.actual_price && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₹{product.actual_price.toLocaleString()}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.stock}</span>
                            <Package className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {product.total_sold}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className="m-auto text-nowrap"
                            variant={
                              product.stock > 0 ? "default" : "destructive"
                            }
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outlineSecondary"
                              size="sm"
                              onClick={() => handleEdit(product)}
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
                                    Delete Product
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "
                                    {product.title}"? This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDelete(product.id, product.title)
                                    }
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
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img
                    src={
                      product.images.length > 0
                        ? product.images[0].url
                        : "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg"
                    }
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{product.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.code && (
                            <span className="text-secondary font-medium">
                              #{product.code}
                            </span>
                          )}
                        </p>
                      </div>
                      <Badge
                        variant={product.stock > 0 ? "default" : "destructive"}
                      >
                        {product.stock > 0 ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Price
                        </div>
                        <div className="font-medium">
                          ₹{product.price.toLocaleString()}
                        </div>
                        {product.actual_price && (
                          <div className="text-xs text-muted-foreground line-through">
                            ₹{product.actual_price.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Sold
                        </div>
                        <div className="font-medium">{product.total_sold}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Label className="text-sm">Stock:</Label>
                      <span className="font-medium">{product.stock}</span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outlineSecondary"
                        size="sm"
                        onClick={() => handleEdit(product)}
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
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.title}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDelete(product.id, product.title)
                              }
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {!fetching && products.length > 0 && (
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
                Edit Product
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              form={form}
              setForm={setForm}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsEditModalOpen(false);
                setEditingProduct(null);
                resetForm();
              }}
              isEditing={true}
              addMetadata={addMetadata}
              updateMetadata={updateMetadata}
              removeMetadata={removeMetadata}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              loading={
                fetchType == "updateProduct" || fetchType === "createProduct"
              }
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

// Product Form Component
interface ProductFormProps {
  form: IProduct;
  loading: boolean;
  setForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  addMetadata: () => void;
  updateMetadata: (
    index: number,
    field: "key" | "value",
    value: string
  ) => void;
  removeMetadata: (index: number) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  form,
  setForm,
  onSubmit,
  onCancel,
  isEditing,
  addMetadata,
  updateMetadata,
  removeMetadata,
  handleImageUpload,
  removeImage,
  loading,
}) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Category select (fixed list from store) */}
      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full px-3 py-2 rounded border bg-transparent focus:border-primary outline-none"
        >
          {categories.map((c) => (
            <option className="bg-transparent" key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">Original Price (₹)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={form.actual_price}
            onChange={(e) =>
              setForm({ ...form, actual_price: Number(e.target.value) })
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="stock">Stock Quantity</Label>
        <Input
          id="stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="code">Product Code</Label>
        <Input
          id="code"
          type="text"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
      </div>

      {/* Images Section */}
      <div>
        <Label>Images</Label>
        <div className="space-y-2">
          {/* Existing Images (for editing) */}
          {form.images.map((item: any, index: number) => (
            <div key={`url-${index}`} className="flex items-center gap-2">
              <img
                src={item.isNew ? URL.createObjectURL(item.file) : item.url}
                alt={`Product ${index + 1}`}
                className="w-12 h-12 object-cover rounded"
              />
              <Input
                value={item.isNew ? item.file.name : item.url}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outlineSecondary"
                size="sm"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* File Upload */}
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Metadata Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Metadata</Label>
          <Button
            type="button"
            variant="outlineSecondary"
            size="sm"
            onClick={addMetadata}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
        <div className="space-y-2">
          {form.product_metadata.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Key"
                value={item.key}
                onChange={(e) => updateMetadata(index, "key", e.target.value)}
              />
              <Input
                placeholder="Value"
                value={item.value}
                onChange={(e) => updateMetadata(index, "value", e.target.value)}
              />
              <Button
                type="button"
                variant="outlineSecondary"
                size="sm"
                onClick={() => removeMetadata(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="active"
            checked={form.active}
            onCheckedChange={(v) => setForm({ ...form, active: Boolean(v) })}
          />
          <Label htmlFor="active">Active</Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="featured"
            checked={form.featured}
            onCheckedChange={(v) => setForm({ ...form, featured: Boolean(v) })}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          disabled={loading}
          variant="outlineSecondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="btn-luxury"
          loading={loading}
          disabled={loading}
        >
          {isEditing ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default AddProduct;
