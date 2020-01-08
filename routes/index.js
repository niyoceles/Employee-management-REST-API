import express from 'express';

const router = express.Router();

router.get('/app', (req, res) => {
  return res.status(200).json({
    message: 'app configured successful'
  });
});

export default router;
