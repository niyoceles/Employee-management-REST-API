import express from 'express';

import employees from './employeeRoute';
import managers from './managerRoute';

const router = express.Router();

router.use('/employees', employees);
router.use('/managers', managers);

export default router;
