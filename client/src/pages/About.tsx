import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function About() {
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
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/about" className="text-blue-600 font-semibold">
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
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">About {APP_TITLE}</h2>
            <p className="text-xl text-gray-600">
              Your trusted destination for quality products and exceptional customer service
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 mb-4">
                At {APP_TITLE}, our mission is to provide customers with access to high-quality products
                at competitive prices. We believe in building long-term relationships with our customers
                by delivering exceptional value and outstanding service.
              </p>
              <p className="text-gray-600">
                We are committed to sustainability, ethical sourcing, and supporting local communities
                through our business practices.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span>Quality: We never compromise on product quality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span>Integrity: Honest and transparent business practices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span>Customer Focus: Your satisfaction is our priority</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span>Innovation: Continuously improving our services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 font-bold mr-3">✓</span>
                  <span>Sustainability: Protecting our environment</span>
                </li>
              </ul>
            </div>
          </div>

          {/* History Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-4">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Founded in 2024, {APP_TITLE} started with a simple vision: to make quality shopping
              accessible to everyone. What began as a small operation has grown into a thriving
              e-commerce platform serving thousands of satisfied customers.
            </p>
            <p className="text-gray-600 mb-4">
              Over the years, we have expanded our product range, improved our logistics, and
              enhanced our customer service to meet the evolving needs of our customers.
            </p>
            <p className="text-gray-600">
              Today, we continue to innovate and grow, always keeping our customers at the heart
              of everything we do.
            </p>
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8">Why Choose Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
                <p className="text-gray-600">Quality Products</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600">Customer Support</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-600 text-white p-12 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Shop?</h3>
            <p className="mb-6 text-blue-100">
              Explore our extensive collection of products and find exactly what you need.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Browse Products
              </Button>
            </Link>
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
