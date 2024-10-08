import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import TransactionTable from "./components/TransactionTable";
import Statistics from "./components/Statistics";
import BarChart from "./components/BarChartComponent";
import PieChart from "./components/PieChartComponent";

axios.defaults.baseURL = "http://localhost:3000/api";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3); // Default to March
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className=" mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Sales Dashboard
      </h1>

      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow">
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="mb-4 sm:mb-0 p-2 border rounded text-gray-700 w-full sm:w-auto"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
        <div className="flex w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded flex-grow text-gray-700"
          />
        </div>
      </div>

      <TransactionTable
        month={selectedMonth}
        searchTerm={searchTerm}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <Statistics month={selectedMonth} />
        <BarChart month={selectedMonth} />
      </div>

      <div className="mt-8">
        <PieChart month={selectedMonth} />
      </div>
    </div>
  );
};

export default App;
