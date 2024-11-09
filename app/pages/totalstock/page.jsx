"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    const fetchTotalStock = async () => {
      try {
        const response = await fetch("/api/total_cost");
        if (response.ok) {
          const data = await response.json();
          const stock = parseInt(data?.totalStock, 10);

          if (!isNaN(stock)) {
            setTotalStock(stock);
          } else {
            console.error("Invalid totalStock value:", data?.totalStock);
          }
        } else {
          console.error("Failed to fetch total stock");
        }
      } catch (error) {
        console.error("Error fetching total stock:", error);
      }
    };

    fetchTotalStock();
  }, []);

  return (
    <div className="pt-[40%] lg:h-screen lg:pt-0 bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Total Stock</h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-6xl font-bold text-green-500 flex items-center justify-center"
          >
            {totalStock.toLocaleString()}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
