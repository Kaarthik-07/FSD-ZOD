import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { pool } from "../config/config";
import { userQueries } from "../queries";
export const check = async (req: Request, res: Response) => {
  res.status(200).json({
    statusCode: 201,
    msg: "GET point working fine",
  });
};

const add_user = async (req: Request, res: Response) => {
  const { first_name, last_name, email, employee_id, phone_number, department, role, date_of_joining } = req.body;
  const client = await pool.connect();
  try {
    const result = await client.query(userQueries.create_post, [
      first_name,
      last_name,
      email,
      phone_number,
      department,
      role,
      date_of_joining,
    ]);
    if (result) {
      return res
        .status(200)
        .json({ statusCode: 201, msg: "User created successfully" });
    } else {
      
      return res
        .status(500)
        .json({ statusCode: 500, msg: "Error while creating user" });
    }
  } catch (err) {
    console.error("Error creating user:", err);
    console.log(err)
    return res.status(500).json({ statusCode: 500, msg: "Internal server error" });
  } finally {
    client.release();
  }
}

const MODULE = {
  add_user,
};
export default MODULE;
