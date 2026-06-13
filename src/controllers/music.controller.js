const musicModel = require('../models/music.models')
const { uploadFile } = require('../services/storage.service')
const jwt = require('jsonwebtoken')

async function createMusic(req, res) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== 'artist') {
            return res.status(403).json({ message: "You don't have access to create a music" })
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const { title } = req.body
    const file = req.file

    if (!title) {
        return res.status(400).json({ message: 'Title is required' })
    }

    if (!file) {
        return res.status(400).json({ message: 'Audio file is required' })
    }

    try {
        const result = await uploadFile(file.buffer.toString('base64'))

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id,
        })

        return res.status(201).json({
            message: 'music created successfully',
            music: {
                id: music.id,
                uri: music.uri,
                title: music.title,
                artist: music.artist,
            },
        })
    } catch (err) {
        return res.status(500).json({ message: 'Failed to upload music' })
    }
}

module.exports = { createMusic }
