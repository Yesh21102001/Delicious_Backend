const Menu = require("../model/Menu");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Delete uploaded image file
const deleteImageFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, "../uploads", filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
exports.upload = upload;

// GET all menu categories
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch menus", error: err.message });
  }
};

// POST create new category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new Menu({ name, items: [] });
    await newCategory.save();
    res.status(201).json({ message: "Category created", data: newCategory });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create category", error: err.message });
  }
};

// POST /api/menu/:categoryId/addItem
exports.addItemToCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { itemName, itemCost, isEnabled } = req.body;
    const image = req.file ? req.file.filename : null;

    const category = await Menu.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    category.items.push({
      itemName,
      itemCost,
      image,
      isEnabled: isEnabled !== undefined ? isEnabled : true,
    });

    await category.save();
    res.status(201).json({ message: "Item added", data: category });
  } catch (err) {
    res.status(500).json({ message: "Failed to add item", error: err.message });
  }
};

// GET by ID (category or item)
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Menu.findById(id);
    if (category)
      return res.status(200).json({ type: "category", data: category });

    const menus = await Menu.find();
    for (const menu of menus) {
      const item = menu.items.id(id);
      if (item) {
        return res
          .status(200)
          .json({ type: "item", data: item, categoryId: menu._id });
      }
    }

    res.status(404).json({ message: "Category or item not found" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const { name, isEnabled } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const category = await Menu.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (image && category.image) deleteImageFile(category.image);

    if (name !== undefined) category.name = name;
    if (isEnabled !== undefined) category.isEnabled = isEnabled;
    if (image) category.image = image;

    await category.save();
    res.status(200).json({ message: "Category updated", data: category });
  } catch (error) {
    res.status(500).json({ message: "Update error", error: error.message });
  }
};

exports.updateItemById = async (req, res) => {
  const { categoryId, itemId } = req.params;
  const { itemName, itemCost, isEnabled } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const category = await Menu.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const item = category.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (image && item.image) deleteImageFile(item.image);

    if (itemName !== undefined) item.itemName = itemName;
    if (itemCost !== undefined) item.itemCost = itemCost;
    if (isEnabled !== undefined) item.isEnabled = isEnabled;
    if (image) item.image = image;

    await category.save();
    res.status(200).json({ message: "Item updated", data: item });
  } catch (error) {
    res.status(500).json({ message: "Item update failed", error: error.message });
  }
};

exports.deleteCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Menu.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete all item images
    category.items.forEach((item) => deleteImageFile(item.image));

    // Delete category image if exists
    if (category.image) deleteImageFile(category.image);

    // Delete category from DB
    await Menu.findByIdAndDelete(id);

    res.status(200).json({ message: "Category and its items deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Category deletion failed", error: error.message });
  }
};

exports.deleteItemById = async (req, res) => {
  const { categoryId, itemId } = req.params;

  try {
    const category = await Menu.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const item = category.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete image if present
    if (item.image) deleteImageFile(item.image);

    // Remove item from array
    category.items = category.items.filter(i => i._id.toString() !== itemId);

    await category.save();

    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Item deletion failed", error: error.message });
  }
};
