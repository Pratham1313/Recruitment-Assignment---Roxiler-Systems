import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUpDown } from "lucide-react";

const TransactionTable = ({
  month,
  searchTerm,
  currentPage,
  setCurrentPage,
}) => {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const perPage = 10;

  useEffect(() => {
    fetchTransactions();
  }, [month, searchTerm, currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/transactions", {
        params: {
          month,
          search: searchTerm,
          page: currentPage,
          perPage,
        },
      });
      setTransactions(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedTransactions = () => {
    const sortableTransactions = [...transactions];
    if (sortConfig.key !== null) {
      sortableTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTransactions;
  };

  const SortableHeader = ({ column, label }) => (
    <th
      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap sticky top-0 bg-gray-50 z-10"
      onClick={() => requestSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <ArrowUpDown size={14} />
      </div>
    </th>
  );

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-lg shadow bg-white">
        <div className="overflow-x-auto">
          <div
            className="inline-block min-w-full align-middle"
            style={{ height: "58.60vh" }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: "58.60vh" }}>
              {" "}
              {/* Use maxHeight for dynamic scroll */}
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                      Number
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                      Title
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                      Description
                    </th>
                    <SortableHeader column="price" label="Price" />
                    <SortableHeader column="category" label="Category" />
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                      Date of Sale
                    </th>
                    <SortableHeader column="sold" label="Sold" />
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-10">
                      Image
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getSortedTransactions().length > 0 ? (
                    getSortedTransactions().map((transaction, i) => (
                      <tr key={transaction.id} className="h-0">
                        {" "}
                        {/* Fixed row height */}
                        <td className="px-8 py-2 text-sm text-gray-900 max-w-[100px]">
                          {perPage * (currentPage - 1) + (i + 1)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 max-w-[150px]">
                          <div className="truncate">{transaction.title}</div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 max-w-[200px]">
                          <div className="truncate">
                            {transaction.description}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 max-w-[100px]">
                          ${transaction.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 max-w-[100px]">
                          {transaction.category}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 max-w-[120px]">
                          {new Date(
                            transaction.dateOfSale
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 max-w-[120px]">
                          {transaction.sold ? "Sold" : "Not Sold"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          <div className="h-16 w-16">
                            <img
                              src={transaction.image}
                              alt={transaction.title}
                              className="h-full w-full object-cover rounded"
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-gray-500 py-4"
                      >
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between px-4 py-3 sm:px-6">
        <button
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
