import express from 'express';
import employeeController from '../controllers/employeeController';
import employeeValidation from '../validations/inputValidation';
import { checkToken } from '../helpers';

const router = express.Router();
router.post(
  '/',
  checkToken,
  employeeValidation.validateInput,
  employeeController.createEmployee
);
router.put(
  '/:id',
  checkToken,
  employeeValidation.validateInput,
  employeeController.updateEmployee
);
router.put('/:id/activate', checkToken, employeeController.activateEmployee);
router.put('/:id/suspend', checkToken, employeeController.suspendEmployee);
router.delete('/:id/delete', checkToken, employeeController.deleteEmployee);
router.post('/search', checkToken, employeeController.searchEmploye);

export default router;
