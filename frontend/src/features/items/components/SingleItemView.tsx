import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getInventoryItemById } from "../services";
import { InventoryItem } from "../types";
import { motion } from "framer-motion";
import { Plus, Minus, ShoppingCart, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { addToCart } from "@/features/cart/utils/cartUtils";

const SingleItemView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getInventoryItemById(id!);
        setItem(data);
      } catch (error) {
        console.error("Failed to fetch item:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (item) {
      addToCart(item, quantity);
      alert(`${item.name} (${quantity}) added to cart!`);
    }
  };

  const handleBuyNow = () => {
    // Buy now logic here
    console.log("Buy now:", item, "Quantity:", quantity);
    localStorage.setItem("buyItemQty", quantity.toString());
    navigate("/place-order/" + item?.id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Item not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 to-pink-100">
      <Navbar />
      <main className="flex-1 container mx-auto p-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Item Image */}
          <div className="flex justify-center items-center">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>

          {/* Item Details */}
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold text-black">{item.name}</h1>
            <p className="text-gray-700">{item.description}</p>
            <p className="text-2xl font-bold text-black">${item.price}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <button
                style={{ color: "white", padding: 2, marginRight: 12 }}
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-bold text-black">{quantity}</span>
              <button
                style={{ color: "white", padding: 2, marginRight: 2 }}
                onClick={() => setQuantity((prev) => prev + 1)}
                className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 gap-5">
              <button
                style={{ color: "white" }}
                onClick={handleAddToCart}
                className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                <CreditCard size={20} />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SingleItemView;
