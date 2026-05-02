import { pool } from "../config/db";

type TProps = {
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
  id?: string;
};
const userCreateService = async (data: TProps) => {
  const { name, email, age, phone, address } = data;
  const result = await pool.query(
    `INSERT INTO users(name, email, age, phone, address) values($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, age, phone, address],
  );
  return result;
};

const userUpdateService = async (data: TProps) => {
  const { name, email, age, phone, address, id } = data;
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, age=$3, phone=$4, address=$5 WHERE id=$6`,
    [name, email, age, phone, address, id],
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
