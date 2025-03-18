import React from "react";
import { motion } from "framer-motion";
import { InventoryItem } from "../types";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "@/features/cart/utils/cartUtils";

interface ItemCardProps {
  item: InventoryItem;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const navigate = useNavigate();

  // Trim description to 10 words max
  const trimDescription = (text: string) => {
    const words = text.split(" ");
    if (words.length <= 10) return text;
    return words.slice(0, 10).join(" ") + "...";
  };

  const handleItemClick = () => {
    navigate(`/item-view/${item.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
    alert(`${item.name} added to cart!`);
  };

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full h-96 flex flex-col cursor-pointer"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleItemClick}
    >
      <div className="w-full h-48 overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
          style={{ height: "192px" }}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <p className="text-gray-600 flex-grow">
          {trimDescription(item.description)}
        </p>
        <div className="mt-auto">
          <p className="text-lg font-bold">${item.price}</p>
          <div className="flex items-center mt-2">
            <button
              style={{ color: "white" }}
              className="flex-grow bg-black text-white py-2 rounded-md hover:bg-gray-800 flex items-center justify-center"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
