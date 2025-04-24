const express = require("express");
const router = express.Router();

const {
  getMenuByRestaurant,
  getAllMenus,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  updateMenuItem,
  deleteMenuItem,
} = require("../controller/Menu");

router.get("/", getAllMenus);
router.get("/:restaurantId", getMenuByRestaurant);
router.post("/", upload.array("images"), createMenuCategory);
router.patch("/:categoryId", updateMenuCategory);
router.delete("/:categoryId", deleteMenuCategory);

router.patch("/:categoryId/item/:itemId", updateMenuItem);
router.delete("/:categoryId/item/:itemId", deleteMenuItem);

module.exports = router;
