import Team from "../models/Team.js";
import { recordActivity } from "./ActivityController.js";

export const createTeam = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Team name is required",
      });
    }

    const team = await Team.create({
      name: name.trim(),
      description: description?.trim() || "",
      color: color || "bg-blue-600",
      owner: req.user.id,
      members: [
        {
          user: req.user.id,
          role: "owner",
        },
      ],
    });

    const populatedTeam = await Team.findById(team._id)
      .populate("owner", "username email")
      .populate("members.user", "username email");

    // Record real activity
    await recordActivity({
      user: req.user.id,
      type: "team",
      action: "created_team",
      content: `Created team "${team.name.trim()}"`,
      team: team._id,
      teamName: team.name.trim(),
    });

    res.status(201).json({
      message: "Team created successfully",
      team: populatedTeam,
    });
  } catch (error) {
    console.error("Create team error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      "members.user": req.user.id,
    })
      .populate("owner", "username email")
      .populate("members.user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      teams,
    });
  } catch (error) {
    console.error("Get teams error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await Team.findOne({
      _id: teamId,
      "members.user": req.user.id,
    })
      .populate("owner", "username email")
      .populate("members.user", "username email");

    if (!team) {
      return res.status(404).json({
        message: "Team not found or you are not a member of this team",
      });
    }

    res.status(200).json({
      team,
    });
  } catch (error) {
    console.error("Get team error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
