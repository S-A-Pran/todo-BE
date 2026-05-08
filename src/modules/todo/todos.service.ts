import { pool } from "../../config/db";

type TProps = {
  user_id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date: Date;
  id?: string;
};
const todosCreateService = async ({
  user_id,
  title,
  description,
  completed,
  due_date,
}: TProps) => {
  const result = await pool.query(
    `INSERT INTO todos(user_id, title, description, completed, due_date) values($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, title, description, completed, due_date],
  );

  return result;
};

const todosUpdateService = async ({
  user_id,
  title,
  description,
  completed,
  due_date,
  id,
}: TProps) => {
  const result = await pool.query(
    `UPDATE todos SET user_id=$1, title=$2, description=$3, completed=$4, due_date=$5 WHERE id=$6`,
    [user_id, title, description, completed, due_date, id],
  );

  return result;
};

const todosDeleteServices = async (id: string) => {
  const result = await pool.query(`DELETE FROM todos WHERE id=$1`, [id]);

  return result;
};

const todosListServices = async () => {
  const result = await pool.query(`SELECT * FROM todos`);

  return result;
};

const todosServices = {
  todosCreateService,
  todosUpdateService,
  todosDeleteServices,
  todosListServices,
};

export default todosServices;
