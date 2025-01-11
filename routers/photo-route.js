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


  
const {Photo} = require('../models')
const router = express.Router();

router.post('/photos', async (req, res) => {
    try {
        const {title, url, user_id} = req.body;

        const newPhoto = await Photo.create({
            title,
            url,
            user_id,
        });

        return res.status(201).json(newPhoto);
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
});

router.get('/photos', async (req, res) => {
    try {
        const photos = await Photo.findAll()
        return res.status(200).json(photos);
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'failed to load photos'});
    }
});

router.get('/photos/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const photo = await Photo.findByPk(id)

        if (!photo) {
            return res.status(404).json({error: 'photo not found'})
        }

        return res.status(200).json(photo);
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'dailed to load photo'})
    }
});

router.put('/photos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, url, user_id } = req.body;

        
        const photo = await Photo.findByPk(id);

        if (!photo) {
            return res.status(404).json({ error: 'Photo not found' });
        }


        await photo.update({ title, url, user_id });

        return res.status(200).json(photo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to update photo' });
    }
});

router.delete('/photos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        
        const photo = await Photo.findByPk(id);

        if (!photo) {
            return res.status(404).json({ error: 'Photo not found' });
        }

        
        await photo.destroy();

        return res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to delete photo' });
    }
});

module.exports = router;
