const Menu = require("../model/Menu");
const multer = require("multer");
const path = require("path");

// ==== Multer Setup ====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
// =======================

// You can export this to use in routes
exports.upload = upload;

// Get all categories
exports.getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all menus", error: err });
  }
};

// Get menu by restaurant
exports.getMenuByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menu = await Menu.find({ restaurantId });
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu", error: err });
  }
};

// Create category with items + images
exports.createMenuCategory = async (req, res) => {
  try {
    const { name, restaurantId, items } = req.body;
    const parsedItems = JSON.parse(items); // array
    const uploadedFiles = req.files;

    const itemsWithImages = parsedItems.map((item, index) => ({
      ...item,
      image: uploadedFiles[index]?.filename || null,
    }));

    const newCategory = new Menu({
      name,
      restaurantId,
      items: itemsWithImages,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: "Failed to create menu category", error: err });
  }
};

// Update category
exports.updateMenuCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, isEnabled } = req.body;

    const updated = await Menu.findByIdAndUpdate(
      categoryId,
      { name, isEnabled },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update category", error: err });
  }
};

// Delete category
exports.deleteMenuCategory = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.categoryId);
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
};

// Update a specific item
exports.updateMenuItem = async (req, res) => {
  try {
    const { categoryId, itemId } = req.params;
    const { name, cost, isEnabled } = req.body;

    const menu = await Menu.findById(categoryId);
    const item = menu.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.name = name ?? item.name;
    item.cost = cost ?? item.cost;
    item.isEnabled = isEnabled ?? item.isEnabled;

    await menu.save();
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: "Update item failed", error: err });
  }
};

// Delete item
exports.deleteMenuItem = async (req, res) => {
  try {
    const { categoryId, itemId } = req.params;
    const menu = await Menu.findById(categoryId);
    menu.items.id(itemId).remove();
    await menu.save();
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete item failed", error: err });
  }
};
