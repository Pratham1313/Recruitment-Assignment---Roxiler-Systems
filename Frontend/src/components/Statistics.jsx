import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({
    totalSaleAmount: 0,
    soldItems: 0,
    notSoldItems: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/statistics?month=${month}`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4 text-center">
        Monthly Statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="text-center p-4 border rounded-lg shadow-sm bg-gray-50">
          <p className="text-gray-600">Total Sale</p>
          <p className="text-2xl font-bold">
            ${stats.totalSaleAmount.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-4 border rounded-lg shadow-sm bg-gray-50">
          <p className="text-gray-600">Sold Items</p>
          <p className="text-2xl font-bold">{stats.soldItems}</p>
        </div>
        <div className="text-center p-4 border rounded-lg shadow-sm bg-gray-50">
          <p className="text-gray-600">Not Sold</p>
          <p className="text-2xl font-bold">{stats.notSoldItems}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Statistics;
