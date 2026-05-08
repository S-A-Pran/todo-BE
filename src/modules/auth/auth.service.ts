import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";
const loginService = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;

  const user = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

  if (!user.rows.length) {
    return undefined;
  }

  const isMatched = await bcrypt.compare(
    String(password),
    user.rows[0].password,
  );

  if (!isMatched) {
    return null;
  }

  const token = jwt.sign(
    {
      name: user.rows[0].name,
      email: user.rows[0].email,
      role: user.rows[0].role,
    },
    String(config.jwt_secret),
    {
      expiresIn: "7d",
    },
  );

  return {
    user: user.rows[0],
    token,
  };
};

const authService = {
  loginService,
};

export default authService;
