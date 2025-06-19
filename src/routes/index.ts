import { Router } from "express";
import { usersRoutes } from "./usersRoutes";
import { sessionRoutes } from "./sessionRoutes";

export const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionRoutes)