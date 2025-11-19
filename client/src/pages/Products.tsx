import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { ShoppingCart } from "lucide-react";

export default function Products() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [cart, setCart] = useState<Array<{ barcode: string; quantity: number }>>([]);

  const { data: products } = trpc.products.search.useQuery({
    query: searchQuery,
    color: selectedColor || undefined,
    minPrice,
    maxPrice,
  });

  const colors = Array.from(new Set(products?.map((p) => p.color).filter(Boolean) || []));

  const handleAddToCart = (barcode: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.barcode === barcode);
      if (existing) {
        return prev.map((item) =>
          item.barcode === barcode ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { barcode, quantity: 1 }];
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/products" className="text-blue-600 font-semibold">
              Products
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/account" className="text-gray-600 hover:text-gray-900">
              Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-8">Our Products</h2>

          {/* Filters */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={selectedColor || ""}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="">All Colors</option>
                  {colors.map((color) => (
                    <option key={color} value={color || ""}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice || ""}
                  onChange={(e) => setMinPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice || ""}
                  onChange={(e) => setMaxPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products && products.length > 0 ? (
              products.map((product) => (
                <Card key={product.barcode} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="h-48 w-full object-cover rounded-md mb-4"
                      />
                    )}
                    <CardTitle>{product.productName}</CardTitle>
                    {product.color && (
                      <CardDescription>Color: {product.color}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">SKU: {product.barcode}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/products/${product.barcode}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        onClick={() => handleAddToCart(product.barcode)}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>&copy; 2024 {APP_TITLE}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
