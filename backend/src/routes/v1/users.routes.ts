import { Router } from 'express';

import { getUsers, postUser, putUser, removeUser } from '../../controllers/users.controller.js';
import { requireAdmin, requireAuth } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../utils/async-handler.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);
usersRouter.use(requireAdmin);

usersRouter.get('/users', asyncHandler(getUsers));
usersRouter.post('/users', asyncHandler(postUser));
usersRouter.put('/users/:id', asyncHandler(putUser));
usersRouter.delete('/users/:id', asyncHandler(removeUser));
