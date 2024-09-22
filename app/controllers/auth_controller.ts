import type { HttpContext } from '@adonisjs/core/http'
import User from '../models/user.js';

export default class AuthController {
    async UserLogin({ request, response }: HttpContext) {
        const user = request.only(["email", "password"]);

        if (!user.email || !user.password) {
            return response.status(409).json({
                error: true,
                message: "Credenciais invalidas"
            });
        }

        try {
            const emailExists = await User.findBy('email', user.email);

            if (!emailExists) {
                return response.status(409).json({
                    error: true,
                    message: "Credenciais invalidas"
                });
            }

            await User.verifyCredentials(user.email, user.password)    
            const token = await User.accessTokens.create(emailExists)

            return response.accepted({
                error: false,
                message: "Usuario logado com sucesso",
                token 
            })

        } catch (error) {
            if (error.code === "E_INVALID_CREDENTIALS") {
                return response.status(409).json({
                    error: true,
                    message: "Credenciais invalidas"
                })
            }

            return response.status(500).json({
                error: true,
                message: "Algo deu errado!",
                details: error
            });
        }
    }
}