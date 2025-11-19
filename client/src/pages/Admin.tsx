import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Upload, Download, Plus, Trash2 } from "lucide-react";
import { APP_TITLE } from "@/const";

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    barcode: "",
    productName: "",
    price: "",
    color: "",
    description: "",
    imageUrl: "",
  });

  const { data: products, refetch: refetchProducts } = trpc.products.list.useQuery();
  const uploadMutation = trpc.admin.uploadProducts.useMutation();
  const createProductMutation = trpc.products.create.useMutation();
  const deleteProductMutation = trpc.products.delete.useMutation();

  // Redirect if not admin
  if (user?.role !== "administrator") {
    setLocation("/");
    return null;
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(",")[1];
        try {
          const result = await uploadMutation.mutateAsync({ fileData: base64 });
          setUploadStatus({
            type: "success",
            message: `Successfully imported ${result.successCount} products out of ${result.totalRows} rows.${
              result.errors ? ` Errors: ${result.errors.join("; ")}` : ""
            }`,
          });
          refetchProducts();
        } catch (error) {
          setUploadStatus({
            type: "error",
            message: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          });
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/trpc/admin.getXLSXTemplate");
      const data = await response.json();
      const base64 = data.result.data;
      const link = document.createElement("a");
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
      link.download = "product_template.xlsx";
      link.click();
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: `Failed to download template: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.barcode || !newProduct.productName || !newProduct.price) {
      setUploadStatus({
        type: "error",
        message: "Please fill in all required fields (barcode, product name, price)",
      });
      return;
    }

    try {
      await createProductMutation.mutateAsync(newProduct);
      setUploadStatus({
        type: "success",
        message: "Product added successfully!",
      });
      setNewProduct({
        barcode: "",
        productName: "",
        price: "",
        color: "",
        description: "",
        imageUrl: "",
      });
      setShowAddProduct(false);
      refetchProducts();
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: `Failed to add product: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  };

  const handleDeleteProduct = async (barcode: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductMutation.mutateAsync(barcode);
        setUploadStatus({
          type: "success",
          message: "Product deleted successfully!",
        });
        refetchProducts();
      } catch (error) {
        setUploadStatus({
          type: "error",
          message: `Failed to delete product: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">{APP_TITLE} - Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Status Messages */}
        {uploadStatus.type && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              uploadStatus.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {uploadStatus.message}
          </div>
        )}

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Import Products from XLSX</CardTitle>
            <CardDescription>
              Upload an Excel file to import multiple products at once
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your XLSX file here, or click to select
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  disabled={isUploading}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {isUploading ? "Uploading..." : "Select File"}
                </Button>
              </div>
              <Button
                onClick={handleDownloadTemplate}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add Product Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add Product Manually</CardTitle>
            <CardDescription>
              Add a single product to your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showAddProduct ? (
              <Button onClick={() => setShowAddProduct(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Barcode (Required)
                    </label>
                    <Input
                      value={newProduct.barcode}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, barcode: e.target.value })
                      }
                      placeholder="e.g., BARCODE001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Name (Required)
                    </label>
                    <Input
                      value={newProduct.productName}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, productName: e.target.value })
                      }
                      placeholder="Product name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (Required)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <Input
                      value={newProduct.color}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, color: e.target.value })
                      }
                      placeholder="e.g., Red, Blue"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    placeholder="Product description"
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <Input
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddProduct}>Add Product</Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddProduct(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Current Products ({products?.length || 0})</CardTitle>
            <CardDescription>
              Manage your product inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products && products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4">Barcode</th>
                      <th className="text-left py-3 px-4">Product Name</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Color</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.barcode} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{product.barcode}</td>
                        <td className="py-3 px-4">{product.productName}</td>
                        <td className="py-3 px-4">${parseFloat(product.price).toFixed(2)}</td>
                        <td className="py-3 px-4">{product.color || "-"}</td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteProduct(product.barcode)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No products found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
