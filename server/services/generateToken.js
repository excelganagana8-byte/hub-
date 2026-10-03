import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" },
  );
};
