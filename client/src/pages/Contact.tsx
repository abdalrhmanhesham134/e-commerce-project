import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitted(false);
    }, 3000);
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
            <Link href="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-blue-600 font-semibold">
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
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600 mb-12">
            Have a question? We would love to hear from you. Send us a message and we will respond
            as soon as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info */}
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Email</h3>
              </div>
              <p className="text-gray-600">info@ecommerce.com</p>
              <p className="text-gray-600">support@ecommerce.com</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Phone</h3>
              </div>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-gray-600">Mon-Fri, 9am-6pm EST</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold">Address</h3>
              </div>
              <p className="text-gray-600">123 Commerce Street</p>
              <p className="text-gray-600">New York, NY 10001</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                <p className="font-semibold">Thank you for your message!</p>
                <p>We will get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows={6}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            )}
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold mb-2">What is your return policy?</h4>
                <p className="text-gray-600">
                  We offer a 30-day return policy on all products. Items must be in original condition
                  with all packaging and documentation.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold mb-2">How long does shipping take?</h4>
                <p className="text-gray-600">
                  Standard shipping typically takes 5-7 business days. Express shipping options are
                  available at checkout.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold mb-2">Do you ship internationally?</h4>
                <p className="text-gray-600">
                  Yes, we ship to most countries worldwide. International shipping costs and times
                  vary by location.
                </p>
              </div>
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and digital wallets for your convenience.
                </p>
              </div>
            </div>
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
