import type { HttpContext } from '@adonisjs/core/http'
import Task from '../models/task.js'

export default class TasksController {
    async ListTasks({ response, auth }: HttpContext) {
        try {
            const tasks = await Task.findManyBy("user_id", auth.user?.id);
            
            return response.ok({
                tasks
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Algo deu errado!"
            })
        }
    }

    async CreateTask({ request, response, auth }: HttpContext) {
        try {
            const { title, description } = request.body();

            if(!title || !description) {
                return response.abort({
                    error: true,
                    message: "Informe o titulo e a descricao da tarefa"
                });
            }

            const taskExists = await Task.findBy({ title });
            
            if(taskExists) {
                return response.conflict({
                    error: true,
                    message: "Esta tarefa ja existe"
                });
            } else {   
                const task = await Task.create({
                    title,
                    description,
                    user_id: auth.user?.id
                });
                
                response.created({
                    error: false,
                    message: "Tarefa criada com sucesso",
                    task
                })
            }
        } catch (error) {
            response.abort({
                error: true,
                message: "Algo deu errado"
            })
        }
    }

    async UpdateTask({ request, response, auth }: HttpContext) {
        try {
            const { title, description } = request.body();
            const taskId = request.param("id");

            const task = await Task.find(taskId);

            if (!task || task.user_id !== auth.user?.id) {
                return response.notFound({
                    error: true,
                    message: "Tarefa não encontrada"
                });
            }

            task.title = title || task.title;
            task.description = description || task.description;
            await task.save();

            return response.ok({
                error: false,
                message: "Tarefa atualizada com sucesso",
                task
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Algo deu errado"
            });
        }
    }

    async DeleteTask({ response, request, auth }: HttpContext) {
        try {
            const taskId = request.param("id");
            const task = await Task.find(taskId);

            if (!task || task.user_id !== auth.user?.id) {
                return response.notFound({
                    error: true,
                    message: "Tarefa não encontrada"
                });
            }

            await task.delete();

            return response.ok({
                error: false,
                message: "Tarefa excluída com sucesso"
            });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: "Algo deu errado"
            });
        }
    }
}