const express = require("express");

const router = express.Router();
const { dataSource } = require("../db/data-source");
const {
  isNotValidSting,
  isNotValidInteger,
  isUndefined,
} = require("../utils/validUtils");
const logger = require("../utils/logger")("CreditPackage");

// 取得購買方案
router.get("/", async (req, res, next) => {
  try {
    const packages = await dataSource.getRepository("CreditPackage").find({
      select: ["id", "name", "credit_amount", "price"],
    });
    // 用express改寫
    res.status(200).json({
      status: "success",
      data: packages,
    });
  } catch (error) {
    // 統一改寫
    next(error);
  }
});
// 新增購買方案
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    if (
      isUndefined(data.name) ||
      isNotValidSting(data.name) ||
      isUndefined(data.credit_amount) ||
      isNotValidInteger(data.credit_amount) ||
      isUndefined(data.price) ||
      isNotValidInteger(data.price)
    ) {
      res.status(400).json({
        "status": "failed",
        "message": "欄位未填寫正確",
      });
      return;
    }
    const creditPackageRepo = await dataSource.getRepository("CreditPackage");
    const existPackage = await creditPackageRepo.find({
      where: {
        name: data.name,
      },
    });
    if (existPackage.length > 0) {
      res.status(409).json({
        "status": "failed",
        "message": "欄位未填寫正確",
      });
      return;
    }
    const newPackage = await creditPackageRepo.create({
      name: data.name,
      credit_amount: data.credit_amount,
      price: data.price,
    });
    const result = await creditPackageRepo.save(newPackage);
    res.status(200).json({
      "status": "success",
      "data": result,
    });
  } catch (error) {
    next(error);
  }
});
// 刪除購買方案
router.delete("/:creditPackageId", async (req, res, next) => {
  try {
    const packageId = req.params;
    if (isUndefined(packageId) || isNotValidSting(packageId)) {
      res.status(400).json({
        "status": "failed",
        "message": "ID錯誤",
      });
      return;
    }
    const result = await dataSource
      .getRepository("CreditPackage")
      .delete(packageId);
    if (result.affected === 0) {
      res.status(400).json({
        "status": "failed",
        "message": "ID錯誤",
      });
      return;
    }
    res.status(200).json({
      "status": "success",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
