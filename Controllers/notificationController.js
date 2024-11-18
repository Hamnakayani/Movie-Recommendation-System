// Controllers/notificationController.js

const User = require('../Models/user');
const Movie = require('../Models/movie');
require('dotenv').config(); 
const sendReminderEmail = require('../utils/mailer');

const notifyUsers = async () => {
    try {
      const users = await User.find({ 'reminders.isNotified': false });
  
      for (const user of users) {
        for (const reminder of user.reminders) {
          const movie = await Movie.findById(reminder.movie);
  
          if (movie && movie.releaseDate && movie.releaseDate <= new Date()) {
            console.log(`Sending email to: ${user.email}`); 
            await sendReminderEmail(user.email, movie.title);
            
            reminder.isNotified = true; 
          }
        }
  
        await user.save();
      }
  
      console.log('Notifications sent');
    } catch (error) {
      console.error('Error sending notifications:', error.message);
    }
  };
  
  

const setReminder = async (req, res) => {
    try {
      
      const { movieId, reminderDate } = req.body;
  
      
      const userId = req.user.id;
  
      const user = await User.findById(userId);  
      const movie = await Movie.findById(movieId);  
  
      if (!user || !movie) {
        return res.status(404).json({ message: 'User or Movie not found' });
      }
  
      
      user.reminders.push({ movie: movieId, reminderDate, isNotified: false });
      await user.save();
  
      res.status(200).json({ message: 'Reminder set successfully', reminder: user.reminders });
    } catch (error) {
      console.error('Error setting reminder:', error.message);
      res.status(500).json({ error: 'Failed to set reminder' });
    }
  };
  
  
setInterval(notifyUsers, 60 * 60 * 1000);

module.exports = { notifyUsers,setReminder };
