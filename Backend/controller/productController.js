const Product = require("../model/Product"); // Assuming you have a Product model

// Initialize database controller
exports.initializeDatabase = async (req, res) => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();

    // Add dateOfSale and sold fields to each product
    const enrichedProducts = products.map((product) => ({
      ...product,
      sold: Math.random() < 0.5, // Randomly set sold status
      dateOfSale: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ),
    }));

    await Product.insertMany(enrichedProducts);
    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listTransactions = async (req, res) => {
  try {
    let { month, search, page = 1, perPage = 10 } = req.query;
    page = parseInt(page);
    perPage = parseInt(perPage);
    month = parseInt(month);

    let matchStage = {};

    if (month) {
      matchStage.$expr = {
        $eq: [{ $month: "$dateOfSale" }, month],
      };
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      const searchPrice = !isNaN(search) ? Number(search) : null;

      matchStage.$or = [{ title: searchRegex }, { description: searchRegex }];

      if (searchPrice !== null) {
        matchStage.$or.push({ price: searchPrice });
      }
    }

    const [products, totalItems] = await Promise.all([
      Product.aggregate([
        { $match: matchStage },
        { $skip: (page - 1) * perPage },
        { $limit: perPage },
      ]),
      Product.countDocuments(matchStage),
    ]);

    res.json({
      products,
      currentPage: page,
      perPage,
      totalPages: Math.ceil(totalItems / perPage),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Statistics controller
exports.getStatistics = async (req, res) => {
  try {
    const month = parseInt(req.query.month);

    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ error: "Valid month (1-12) is required" });
    }

    const result = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, "$price", 0],
            },
          },
          soldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, 1, 0],
            },
          },
          notSoldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", false] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.json(
      result[0] || {
        totalSaleAmount: 0,
        soldItems: 0,
        notSoldItems: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bar chart controller
exports.getBarChartData = async (req, res) => {
  try {
    const month = parseInt(req.query.month);

    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ error: "Valid month (1-12) is required" });
    }

    const result = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901],
          default: "901-above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          range: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 0] }, then: "0-100" },
                { case: { $eq: ["$_id", 101] }, then: "101-200" },
                { case: { $eq: ["$_id", 201] }, then: "201-300" },
                { case: { $eq: ["$_id", 301] }, then: "301-400" },
                { case: { $eq: ["$_id", 401] }, then: "401-500" },
                { case: { $eq: ["$_id", 501] }, then: "501-600" },
                { case: { $eq: ["$_id", 601] }, then: "601-700" },
                { case: { $eq: ["$_id", 701] }, then: "701-800" },
                { case: { $eq: ["$_id", 801] }, then: "801-900" },
              ],
              default: "901-above",
            },
          },
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Pie chart controller
exports.getPieChartData = async (req, res) => {
  try {
    const month = parseInt(req.query.month);

    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ error: "Valid month (1-12) is required" });
    }

    const result = await Product.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, month],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
