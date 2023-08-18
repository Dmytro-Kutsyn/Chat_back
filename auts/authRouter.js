import { Router} from "express";
import { check } from "express-validator"

import autsController from "../auts/authController.js";
import authMiddlewaree from "../middlewaree/authMiddlewaree.js";
import roleMiddlewaree from "../middlewaree/roleMiddlewaree.js";

const authRouter = new Router()

// authRouter.get('/users', roleMiddlewaree(['ADMIN']), autsController.getUsers)
authRouter.get('/users', autsController.getUsers)
authRouter.get('/current_user', autsController.getCurrentUser);
authRouter.post('/registration', [
    check('username', 'Имя пользователя не должно быть пустим').notEmpty(),
    check('email', 'email пользователя не должно быть пустим').notEmpty(),
    check('gender', 'gender пользователя не должно быть пустим').notEmpty(),
    check('phone', 'phone пользователя не должно быть пустим').notEmpty(),
    check('prefix', 'prefix пользователя не должно быть пустим').notEmpty(),
    check('password', 'Пароль должен быть больше 4 символов и меньше 10 символов').isLength({ min: 4, max: 10 }),
], autsController.registration)
authRouter.post('/login', autsController.login)
authRouter.put('/edit_profile', autsController.editProfile)

export default authRouter;
