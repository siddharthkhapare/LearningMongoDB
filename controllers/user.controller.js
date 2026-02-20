exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .select("-password");

  const total = await User.countDocuments();

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    users
  });
};



exports.userStats = async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(stats);
};



exports.createUserWithTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.create([req.body], { session });

    await Profile.create(
      [{ user: user[0]._id, bio: "" }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json(user);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};