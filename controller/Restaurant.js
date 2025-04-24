
const Restaurant =require("../model/Restaurant");

exports.toggleRestaurantStatus = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    restaurant.isOnline = !restaurant.isOnline;
    await restaurant.save();

    res.status(200).json({
      message: `Restaurant is now ${restaurant.isOnline ? "Online" : "Offline"}`,
      isOnline: restaurant.isOnline,
    });
  } catch (err) {
    res.status(500).json({ message: "Error toggling status", error: err });
  }
};

exports.getMenuIfOnline = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    if (!restaurant.isOnline) {
      return res.status(403).json({ message: "Restaurant is offline" });
    }

    const menu = await Menu.find({ restaurantId });
    res.status(200).json(menu);
  } catch (err) {
    res.status(500).json({ message: "Error fetching menu", error: err });
  }
};
