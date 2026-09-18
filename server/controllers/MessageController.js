import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiver, content } = req.body;

    if (!receiver || !content?.trim()) {
      return res.status(400).json({
        message: "Receiver and message content are required",
      });
    }

    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const message = await Message.create({
      sender: req.user.id,
      receiver,
      content: content.trim(),
    });

    const populatedMessage = await message.populate(
      "sender receiver",
      "username email",
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user.id,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.user.id,
        },
      ],
    })
      .populate("sender receiver", "username email")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get conversation error:", error);

    res.status(500).json({
      message: "Failed to load conversation",
    });
  }
};
