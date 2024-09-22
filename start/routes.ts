import router from '@adonisjs/core/services/router'
import UsersController from '../app/controllers/users_controller.js'
import AuthController from '../app/controllers/auth_controller.js';
import { middleware } from './kernel.js';
import TasksController from '../app/controllers/tasks_controller.js';

router.group(() => {
  router.get('/list', [UsersController, "ListUsers"]);
  router.post('/create', [UsersController, "CreateUser"]);
  router.put('/update/:id', [UsersController, "UpdateUser"]);
  router.delete('/delete/:id', [UsersController, "DeleteUsers"]);

  router.group(() => {
    router.post('/login', [AuthController, "UserLogin"]);
  }).prefix("/auth");

  router.group(() => {
    router.get('/list', [TasksController, "ListTasks"]);
    router.post('/create', [TasksController, "CreateTask"]);
    router.put('/update/:id', [TasksController, "UpdateTask"]);
    router.delete('/delete/:id', [TasksController, "DeleteTask"]);
  }).prefix('task').use(middleware.auth())
}).prefix("/user");