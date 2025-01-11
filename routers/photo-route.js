const express = require('express');
const {User, Photo} = require('../models');
const router = express.Router();
const passport = require('passport')
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'photo-contest',
    allowed_formats: ['jpg', 'png'],
  },
});


const upload = multer({ storage: storage });

router.post('/addPost', upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    const { title } = req.body;
    const imagePath = req.file.path;
  
    try {
      const newPhoto = await Photo.create({
        title,
        url: imagePath,
        user_id: req.user.id // Assuming you have user authentication
      });
  
  
      res.redirect('/auth/main');
    } catch (err) {
      console.error('Error creating photo:', err); // Додайте це для перевірки помилок
      res.status(500).json({ message: 'Помилка при створенні посту', error: err.message });
    }
  });
  
  
  router.get('/posts', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
  
    try {
      const posts = await Photo.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [['createdAt', 'DESC']],
        include: [{ model: User, as: 'user', attributes: ['username'] }] // Додаємо користувача до постів з псевдонімом
      });
  
      res.json({
        posts: posts.rows,
        totalPages: Math.ceil(posts.count / limit),
        currentPage: page
      });
    } catch (err) {
      console.error('Error fetching posts:', err);
      res.status(500).json({ message: 'Помилка при отриманні постів' });
    }
  });


module.exports = router;
