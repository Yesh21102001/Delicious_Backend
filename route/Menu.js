const express = require("express");
const router = express.Router();
const {
  getById,
  getAllMenus,
  createCategory,
  addItemToCategory,
  upload,
  updateCategoryById,
  updateItemById,
  deleteCategoryById,
  deleteItemById,
} = require("../controller/Menu");

router.get("/getMenu", getAllMenus);
router.get("/:id", getById);

router.post("/createCategory", createCategory);
router.post("/:categoryId/addItem", upload.single("image"), addItemToCategory);

// Updates
router.put("/updateCategory/:id", upload.single("image"), updateCategoryById);
router.put("/updateItem/:categoryId/:itemId", upload.single("image"), updateItemById);

// Deletes
router.delete("/deleteCategory/:id", deleteCategoryById);
router.delete("/deleteItem/:categoryId/:itemId", deleteItemById);

module.exports = router;