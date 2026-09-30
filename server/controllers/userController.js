import User from "../models/User.js";
import Message from "../models/Message.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user.id },
    }).select("_id username email");

    const latestMessages = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: req.user.id }, { receiver: req.user.id }],
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          sender: 1,
          receiver: 1,
          content: 1,
          createdAt: 1,
        },
      },
    ]);

    const latestMessageMap = new Map();

    for (const message of latestMessages) {
      const otherUserId =
        message.sender.toString() === req.user.id.toString()
          ? message.receiver.toString()
          : message.sender.toString();

      if (!latestMessageMap.has(otherUserId)) {
        latestMessageMap.set(otherUserId, message);
      }
    }

    const usersWithLatestMessage = users.map((user) => {
      const latestMessage = latestMessageMap.get(user._id.toString());

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        latestMessage: latestMessage
          ? {
              content: latestMessage.content,
              createdAt: latestMessage.createdAt,
            }
          : null,
      };
    });

    res.json(usersWithLatestMessage);
  } catch (error) {
    console.error("Failed to load users:", error);

    res.status(500).json({
      message: "Failed to load users",
    });
  }
};
