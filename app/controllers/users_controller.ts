import type { HttpContext } from '@adonisjs/core/http'
import AuthController from './auth_controller.js';
import User from "../models/user.js";

export default class UsersController extends AuthController {
    async CreateUser({ request, response }: HttpContext) {
        try {
            const { name, email, username, password }: any = request.body();

            if (!name || !email || !username || !password) {
                response.status(409).json({
                    error: true,
                    message: "name, email, username e password sao obrigatorios"
                });
            }

            const emailExists = await User.findBy({ email })
            const userNameExists = await User.findBy({ username })

            if (emailExists) {
                return response.status(409).json({
                    error: true,
                    message: "Ja existe algum usuario com esse email"
                });
            }

            if (userNameExists) {
                return response.status(409).json({
                    error: true,
                    message: "Ja existe algum usuario com esse username"
                });
            }

            await User.create({
                name,
                email,
                username,
                password
            });

            return response.status(201).json({
                error: false,
                message: "Usuario criado com sucesso!"
            })
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Algo deu errado",
                _error: error
            })
        }
    }

    async ListUsers({ response }: HttpContext) {
        try {
            const users = await User.all();
            
            return response.status(200).json({
                error: false,
                message: users
            })
        } catch (error) {
            return response.status(200).json({
                error: true,
                message: "Algum erro ocorreu"
            })
        }
    }

    async DeleteUsers({ response, request }: HttpContext) {
        const id = request.param("id");

        if(isNaN(id)) {
            return response.status(409).json({
                error: true,
                message: "Id invalido"
            });
        }

        try {
            const user = await User.find(id);
            response.send(user);
            
            if(!user) {
                return response.status(409).json({
                    error: true,
                    message: "usuario nao encontrado"
                });
            }

            await user.delete();

            return response.status(204).json({});
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Algo deu errado",
                details: error
            })
        }
    }

    async UpdateUser({ request, response }: HttpContext) {
        const id = request.param('id');
        const { name, email, username, password }: any = request.body();

        if(isNaN(id)) {
            return response.status(409).json({
                error: true,
                message: "Id inválido"
            });
        }

        try {
            const user = await User.find(id);

            if (!user) {
                return response.status(404).json({
                    error: true,
                    message: "Usuário não encontrado"
                });
            }

            if (name) user.name = name;
            if (email) user.email = email;
            if (username) user.username = username;
            if (password) user.password = password;

            await user.save();

            return response.status(200).json({
                error: false,
                message: "Usuário atualizado com sucesso!"
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Algo deu errado",
                details: error
            });
        }
    }
}