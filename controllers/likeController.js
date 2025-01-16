const { Caption } = require('../models');
const router = require('express').Router();

router.post('/captions/:id/like', async (req, res) => {
  const { id: captionId } = req.params;

  try {
    const caption = await Caption.findByPk(captionId);
    if (!caption) {
      return res.status(404).send({ error: 'Підпис не знайдено' });
    }

    caption.likes += 1;
    await caption.save();

    res.status(200).send({ likes: caption.likes });
  } catch (err) {
    res.status(500).send({ error: 'Помилка при додаванні лайка' });
  }
});

router.delete('/captions/:id/like', async (req, res) => {
  const { id: captionId } = req.params;

  try {
    const caption = await Caption.findByPk(captionId);
    if (!caption) {
      return res.status(404).send({ error: 'Підпис не знайдено' });
    }

    if (caption.likes > 0) {
      caption.likes -= 1;
      await caption.save();
    }

    res.status(200).send({ likes: caption.likes });
  } catch (err) {
    res.status(500).send({ error: 'Помилка при видаленні лайка' });
  }
});

router.get('/captions/:id/likes', async (req, res) => {
  const { id: captionId } = req.params;

  try {
    const caption = await Caption.findByPk(captionId);
    if (!caption) {
      return res.status(404).send({ error: 'Підпис не знайдено' });
    }

    res.status(200).send({ likes: caption.likes });
  } catch (err) {
    res.status(500).send({ error: 'Помилка при отриманні лайків' });
  }
});

module.exports = router;