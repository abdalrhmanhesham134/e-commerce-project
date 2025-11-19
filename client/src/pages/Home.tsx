import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Truck, Award } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: products } = trpc.products.list.useQuery();

  const featuredProducts = products?.slice(0, 6) || [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                {user?.role === 'administrator' && (
                  <Link href="/admin" className="text-blue-600 hover:text-blue-900 font-semibold">
                    Admin
                  </Link>
                )}
                <Link href="/account" className="text-gray-600 hover:text-gray-900">
                  Account
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()} className="text-blue-600 hover:text-blue-900 font-semibold">
                Login
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Welcome to {APP_TITLE}</h2>
          <p className="text-xl mb-8 text-blue-100">
            Discover our premium collection of products with unbeatable prices
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h4 className="font-semibold mb-2">Easy Shopping</h4>
              <p className="text-gray-600">Simple and intuitive shopping experience</p>
            </div>
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h4 className="font-semibold mb-2">Quality Products</h4>
              <p className="text-gray-600">Carefully selected premium items</p>
            </div>
            <div className="text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h4 className="font-semibold mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Quick and reliable shipping</p>
            </div>
            <div className="text-center">
              <Award className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h4 className="font-semibold mb-2">Best Prices</h4>
              <p className="text-gray-600">Competitive pricing guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-12">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
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
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <Link href={`/products/${product.barcode}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About Us</h4>
              <p className="text-gray-400">Your trusted online shopping destination</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="text-gray-400 space-y-2">
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="text-gray-400 space-y-2">
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400">Email: info@ecommerce.com</p>
              <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {APP_TITLE}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
