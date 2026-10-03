import Activity from "../models/Activity.js";
import Team from "../models/Team.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { getIO } from "../socket.js";

// Helper to record and broadcast real activity
export const recordActivity = async ({
  user,
  type = "team",
  action,
  content,
  team = null,
  teamName = null,
  targetUser = null,
  metadata = null,
  createdAt = new Date(),
}) => {
  try {
    const newActivity = await Activity.create({
      user,
      type,
      action,
      content,
      team,
      teamName,
      targetUser,
      metadata,
      createdAt,
    });

    const populated = await Activity.findById(newActivity._id)
      .populate("user", "username email")
      .populate("team", "name color")
      .populate("targetUser", "username email");

    const formatted = {
      _id: populated._id,
      id: populated._id,
      type: populated.type,
      action: populated.action,
      user: populated.user?.username || "Unknown User",
      userId: populated.user?._id,
      content: populated.content,
      team: populated.team?.name || populated.teamName || null,
      teamId: populated.team?._id || populated.team || null,
      createdAt: populated.createdAt,
    };

    try {
      const io = getIO();
      if (io) {
        io.emit("newActivity", formatted);
      }
    } catch {
      // Socket not yet ready or running without socket
    }

    return formatted;
  } catch (error) {
    console.error("Failed to record activity:", error);
    return null;
  }
};

// GET /api/activities
export const getActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

    // Find all teams the user belongs to
    const userTeams = await Team.find({
      "members.user": userId,
    }).select("_id name");
    const teamIds = userTeams.map((t) => t._id);

    // Query activities related to user or user's teams
    let activities = await Activity.find({
      $or: [
        { user: userId },
        { team: { $in: teamIds } },
        { targetUser: userId },
      ],
    })
      .populate("user", "username email")
      .populate("team", "name color")
      .populate("targetUser", "username email")
      .sort({ createdAt: -1 })
      .limit(limit);

    // If zero activities in DB yet, backfill from real existing Teams and Messages
    if (activities.length === 0) {
      const backfilled = [];

      // 1. Backfill from real teams
      const allUserTeams = await Team.find({
        $or: [{ owner: userId }, { "members.user": userId }],
      })
        .populate("owner", "username email")
        .sort({ createdAt: -1 })
        .limit(10);

      for (const t of allUserTeams) {
        backfilled.push({
          user: t.owner?._id || userId,
          type: "team",
          action: "created_team",
          content: `Created team "${t.name}"`,
          team: t._id,
          teamName: t.name,
          createdAt: t.createdAt,
        });
      }

      // 2. Backfill from real messages
      const userMessages = await Message.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate("sender", "username email")
        .populate("receiver", "username email")
        .sort({ createdAt: -1 })
        .limit(10);

      for (const m of userMessages) {
        const isSender = m.sender?._id?.toString() === userId.toString();
        const otherUser = isSender ? m.receiver?.username : m.sender?.username;
        backfilled.push({
          user: m.sender?._id || userId,
          type: "message",
          action: "sent_message",
          content: isSender
            ? `Sent a message to ${otherUser || "a colleague"}`
            : `Received a message from ${otherUser || "a colleague"}`,
          targetUser: m.receiver?._id,
          createdAt: m.createdAt,
        });
      }

      if (backfilled.length > 0) {
        // Sort backfilled activities chronologically descending
        backfilled.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        await Activity.insertMany(backfilled);

        // Re-query populated activities
        activities = await Activity.find({
          $or: [
            { user: userId },
            { team: { $in: teamIds } },
            { targetUser: userId },
          ],
        })
          .populate("user", "username email")
          .populate("team", "name color")
          .populate("targetUser", "username email")
          .sort({ createdAt: -1 })
          .limit(limit);
      }
    }

    const formatted = activities.map((act) => ({
      _id: act._id,
      id: act._id,
      type: act.type,
      action: act.action,
      user: act.user?.username || "Unknown User",
      userId: act.user?._id,
      content: act.content,
      team: act.team?.name || act.teamName || null,
      teamId: act.team?._id || act.team || null,
      createdAt: act.createdAt,
    }));

    res.status(200).json({
      activities: formatted,
    });
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({
      message: "Failed to load recent activity",
    });
  }
};

// POST /api/activities
export const createActivity = async (req, res) => {
  try {
    const { type, action, content, teamId, teamName, targetUserId, metadata } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Content is required for activity",
      });
    }

    const formatted = await recordActivity({
      user: req.user.id,
      type: type || "team",
      action: action || "custom_action",
      content: content.trim(),
      team: teamId || null,
      teamName: teamName || null,
      targetUser: targetUserId || null,
      metadata: metadata || null,
    });

    res.status(201).json({
      activity: formatted,
    });
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({
      message: "Failed to create activity",
    });
  }
};
