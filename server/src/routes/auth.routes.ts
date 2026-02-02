import {Router} from 'express';
import {logIn, signUp, refresh, getMe, logOut, forgetPassword, verifyCode, setPassword, resendOTP} from "../controllers/auth.controller";
import { authenticate } from '../middlewares/authenticate.middleware';

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

authRouter.post('/forget-password', forgetPassword)

authRouter.post('/verify-code', verifyCode)

authRouter.post('/resend-otp', resendOTP)

authRouter.post('/set-password', setPassword)




export default authRouter;