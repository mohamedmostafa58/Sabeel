const User = require('../models/User'); 
const Memorization = require('../models/Memorization'); 
const saveMemorizationData = async (req, res) => {
  try {
    const { phone, daysPerWeek, memorizedAmount, amountPerDay } = req.body;

    if (!phone || !daysPerWeek || !memorizedAmount || !amountPerDay ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const memorization = new Memorization({
      userId: user._id,
      daysPerWeek,
      memorizedAmount,
      amountPerDay,
    });

    await memorization.save();
    generateToken(user, memorization, 201, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { saveMemorizationData };
const generateToken = (user, memorizationData, statusCode, res) => {
    const token = user.getSignedToken();
  
    return res.status(statusCode).json({
      token,
      user: {
        username: user.username,
        phone: user.phone,
        role: user.role,
        daysPerWeek: memorizationData.daysPerWeek,
        memorizedAmount: memorizationData.memorizedAmount,
        amountPerDay: memorizationData.amountPerDay,
      },
    });
  };
  