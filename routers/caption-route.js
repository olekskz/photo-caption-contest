const express = require('express');
const { User, Photo, Caption } = require('../models');
const router = express.Router();

router.post('/posts/:id/captions', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { caption } = req.body;
  const postId = req.params.id;

  try {
    const photo = await Photo.findByPk(postId);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const newCaption = await Caption.create({
      text: caption,
      user_id: req.user.id,
      photo_id: postId,
    });

    res.json({ caption: newCaption.text });
  } catch (err) {
    console.error('Error adding caption:', err);
    res.status(500).json({ message: 'Error adding caption' });
  }
});

router.get('/posts/:id/captions', async (req, res) => {
  const postId = req.params.id;

  try {
    const captions = await Caption.findAll({
      where: { photo_id: postId },
      include: [{ model: User, as: 'user', attributes: ['username'] }], // Включаємо асоціацію з користувачем
      order: [['createdAt', 'ASC']],
    });

    res.json(captions);
  } catch (err) {
    console.error('Error fetching captions:', err);
    res.status(500).json({ message: 'Error fetching captions' });
  }
});

module.exports = router;