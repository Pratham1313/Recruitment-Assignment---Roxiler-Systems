const express = require("express");
const router = express.Router();
const productController = require("../controller/productController.js");

router.get("/initialize-db", productController.initializeDatabase);
router.get("/transactions", productController.listTransactions);
router.get("/statistics", productController.getStatistics);
router.get("/bar-chart", productController.getBarChartData);
router.get("/pie-chart", productController.getPieChartData);

module.exports = router;
