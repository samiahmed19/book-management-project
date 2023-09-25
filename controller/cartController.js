const Cart = require('../models/cart');

exports.addToCart = async (req, res) => {
  try {
    const cartItem = {
      bookId: req.body.bookId,
      quantity: req.body.quantity,
    };

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { $addToSet: { items: cartItem } },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Book added to the cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add the book to the cart' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    // Implement logic to update the cart (update quantities or remove items)
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: req.body.items },
      { new: true }
    );

    res.status(200).json({ message: 'Cart updated successfully', cart: updatedCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the cart' });
  }
};

exports.viewCart = async (req, res) => {
  try {
    // Implement logic to view the cart
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch the cart' });
  }
};
