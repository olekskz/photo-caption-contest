const express = require('express');
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
