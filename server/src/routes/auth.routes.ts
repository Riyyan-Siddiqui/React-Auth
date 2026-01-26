import {Router} from 'express';
// import {logIn, logOut, signUp, forgetPassword, setPassword, verifyCode} from '../controllers/auth.controller';
import {logIn, signUp, refresh, getMe, logOut} from "../controllers/auth.controller";
import { authenticate } from '../middlewares/authenticate.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { isOwner } from '../middlewares/ownership.middleware';
import {Request, Response, NextFunction} from 'express';
import User from '../models/user.model';

const authRouter = Router();

authRouter.post('/login', logIn)

authRouter.post('/signup', signUp)

authRouter.post('/refresh',  refresh)


// authRouter.get(
//   "/users/:id",
//   authenticate,
//   isOwner("id"), // checks req.user.id === req.params.id OR role === admin
//   async (req, res) => {
//       const user = await User.findById(req.params.id).select("-password");
//       res.json(user);
//   }
// );

authRouter.get("/me", authenticate, 
getMe);

authRouter.post('/logout',authenticate, logOut)

// authRouter.post('/forget-password', forgetPassword)

// authRouter.post('/verify-code', verifyCode)

// authRouter.post('/set-password', setPassword)




export default authRouter;