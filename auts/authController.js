import pkg from "bcryptjs"
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken'

import User from "../models/User.js"
import Role from "../models/Role.js"

import config from "../config.js"

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, config.secret, { expiresIn: "24h" })
}

class autsController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }
            const { username, password, email, gender, phone, prefix } = req.body;
            const candidate = await User.findOne({ username })
            const checkEmail = await User.findOne({ email })
            
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким именем уже существует' })
            }
            if (checkEmail) {
                return res.status(400).json({ message: 'Пользователь с такой почтой уже существует' })
            }
            const hashPassword = pkg.hashSync(password, 7)
            const userRole = await Role.findOne({ value: 'USER' })

            const user = new User({ username, password: hashPassword, roles: [userRole.value], email, gender, phone, prefix })

            await user.save()
            return res.json({ message: 'Пользователь успешно зарегистрирован', data: user })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username })
            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден` })
            }

            const validPassvord = pkg.compareSync(password, user.password)

            if (!validPassvord) {
                return res.status(400).json({ message: 'Введен неверный пароль' })
            }
            const token = generateAccessToken(user._id, user.roles)

            const { password: userPassword, ...userData } = user._doc

            return res.json({ token, userData })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Login error' })
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (e) {
            console.log(e)
        }
    }
    async editProfile(req, res) {
        try {
          const {
            username,
            email,
            password,
            gender,
            phone,
            prefix,
            id,
            description,
            icon
        } = req.body;
          const { token } = req.headers;

          jwt.verify(token, config.secret, async (err, decoded) => {
            if (err) {
              return res.status(401).json({ message: 'Неверный токен. Аутентификация не пройдена.' });
            }
    
            const userId = decoded.id;

            if (userId !== id) {
              return res.status(403).json({ message: 'Вы не имеете права редактировать профиль другого пользователя.' });
            }
    
            const hashPassword = pkg.hashSync(password, 7);

            const updatedUser = await User.findByIdAndUpdate(userId, {
                username,
                email,
                password: hashPassword,
                gender,
                phone,
                prefix,
                description,
                icon
            }, { new: true });
            const { password: oldPassword, ...userData } = updatedUser._doc;
    
            return res.json({ message: 'Профиль успешно обновлен', data: userData });
          });
        } catch (e) {
          res.status(400).json({ message: 'Ошибка при редактировании профиля' });
        }
    }
    async getCurrentUser(req, res) {
        try {
          const { token } = req.headers;

          jwt.verify(token, config.secret, async (err, decoded) => {

            if (err) {
              return res.status(401).json({ message: 'Неверный токен. Аутентификация не пройдена.' });
            }
    
            const userId = decoded.id;
            const user = await User.findById(userId);
    
            if (!user) {
              return res.status(404).json({ message: 'Пользователь не найден.' });
            }
    
            const { password: userPassword, ...userData } = user._doc;
    
            return res.json({ data: userData });
          });
        } catch (e) {
          res.status(400).json({ message: 'Ошибка при получении пользователя по токену' });
        }
    }
}

export default new autsController()
