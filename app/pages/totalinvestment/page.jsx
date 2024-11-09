"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Page() {
  const [totalcost, setTotalCost] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [targetRevenue, setTargetRevenue] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (targetRevenue > 0) {
      const interval = setInterval(() => {
        setRevenue((prev) => {
          const next = prev + 100000;
          return next > targetRevenue ? targetRevenue : next;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [targetRevenue]);

  useEffect(() => {
    const fetchTotalCost = async () => {
      try {
        const response = await fetch("/api/total_cost");
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const result = await response.json();
        console.log("API Response:", result);
        setTotalCost(result.totalCost);
        setTargetRevenue(result.totalCost);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchTotalCost();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="pt-[40%] lg:h-screen lg:p-0 bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Total Valuation Of Your Store
          </h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-6xl font-bold text-green-500 flex items-center justify-center"
          >
            {revenue.toLocaleString()}
          </motion.div>
          <motion.div
            initial={{ width: "0%" }}
            animate={{
              width: `${
                targetRevenue > 0 ? (revenue / targetRevenue) * 100 : 0
              }%`,
            }}
            transition={{ duration: 1 }}
            className="h-4 bg-green-300 mt-4 rounded-full"
          />
        </motion.div>
        <div className="hidden">{totalcost}</div>
      </div>
    </div>
  );
}
