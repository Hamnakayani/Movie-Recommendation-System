const express = require('express');
const router = express.Router();
const authenticateJWT = require('../Middleware/authMiddleware')
const { notifyUsers,setReminder } = require('../Controllers/notificationController');


router.get('/send-notifications', async (req, res) => {
  try {
   
    await notifyUsers();
    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ message: 'Error sending notifications', error: error.message });
  }
});
router.post('/set-reminder', authenticateJWT,setReminder);
module.exports = router;
