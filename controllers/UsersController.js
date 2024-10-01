// controllers/UsersController.js
import sha1 from 'sha1';
import dbClient from '../utils/db';

const RedisClient = require('../utils/redis');

const { ObjectId } = require('mongodb');

class UsersController {
  // Endpoint pour POST /users: Créer un nouvel utilisateur
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Vérifier si l'email est fourni
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // Vérifier si le mot de passe est fourni
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Vérifier si l'email existe déjà dans la base de données
    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hasher le mot de passe avec SHA1
    const hashedPassword = sha1(password);

    // Créer le nouvel utilisateur
    const result = await dbClient.db.collection('users').insertOne({
      email,
      password: hashedPassword
    });

    // Répondre avec l'ID et l'email de l'utilisateur
    return res.status(201).json({ id: result.insertedId, email });
  }
}

module.exports = UsersController;
