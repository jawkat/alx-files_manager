import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis'; // Import redisClient

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
      password: hashedPassword,
    });

    // Répondre avec l'ID et l'email de l'utilisateur
    return res.status(201).json({ id: result.insertedId, email });
  }

  // Endpoint pour GET /users/me: Récupérer l'utilisateur connecté
  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.db.collection('users').findOne({ _id: dbClient.getObjectId(userId) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id: user._id.toString(), email: user.email });
  }
}

module.exports = UsersController;
