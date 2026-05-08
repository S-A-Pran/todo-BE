import { pool } from "../../config/db";

type TProps = {
  name: string;
  email: string;
  password: string;
  role: string;
  age: number;
  phone: string;
  address: string;
  id?: string;
};
const userCreateService = async (data: TProps) => {
  const { name, email, password, role, age, phone, address } = data;
  const result = await pool.query(
    `INSERT INTO users(name, email, password, role, age, phone, address) values($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [name, email, password, role, age, phone, address],
  );
  return result;
};

const userUpdateService = async (data: TProps) => {
  const { name, email, password, role, age, phone, address, id } = data;
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, password=$3, role=$4, age=$5, phone=$6, address=$7 WHERE id=$8`,
    [name, email, password, role, age, phone, address, id],
  );

  return result;
};

const userDeleteService = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id=$1`, [id]);
  return result;
};

const userListService = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const userServices = {
  userCreateService,
  userUpdateService,
  userDeleteService,
  userListService,
};

export default userServices;
