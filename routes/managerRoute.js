import express from 'express';
import managerController from '../controllers/managerController';
import managerValidation from '../validations/inputValidation';
import { checkToken } from '../helpers';

const router = express.Router();
router.post(
  '/',
  managerValidation.validateInput,
  managerController.signUpManager
);
router.post('/signin', managerController.signIn);
router.get('/:token', managerController.verifyManager);
router.post('/send-email', managerController.sendLinkResetPassword);
router.post('/reset/:token', managerController.resetPassword);
router.get('/get/:token', managerController.getToken);
router.post('/signout', checkToken, managerController.signoutManager);

export default router;
