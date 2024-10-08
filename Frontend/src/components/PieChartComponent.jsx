import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const PieChartComponent = ({ month }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchPieChartData();
  }, [month]);

  const fetchPieChartData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/pie-chart?month=${month}`
      );
      const data = await response.json();
      console.log(data); // Check the structure of your data here
      setChartData(data);
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count" // Use 'count' for value
            label={(entry) =>
              `${entry.category} (${(
                (entry.count /
                  chartData.reduce((acc, cur) => acc + cur.count, 0)) *
                100
              ).toFixed(0)}%)`
            } // Calculate and display percentage
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
