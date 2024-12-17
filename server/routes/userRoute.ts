import express,{ Router } from "express";
import { UserController } from "../controllers";
const router: Router =express.Router();

const BASE_ROUTE = "/users";
//@ts-ignore
router.post("/add_user",UserController.add_user);
const MODULE = {
  BASE_ROUTE,
  router
};


export default MODULE;
