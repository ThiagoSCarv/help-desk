import { Router } from "express";
import { UsersControllers } from "@/controllers/usersController";

export const usersRoutes = Router()
const usersController = new UsersControllers()

usersRoutes.post("/", usersController.create)