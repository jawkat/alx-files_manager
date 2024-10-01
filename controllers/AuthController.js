const sha1 = require('sha1'); // Importing sha1
const { v4: uuidv4 } = require('uuid'); // Importing uuid
const redisClient = require('../utils/redis'); // Importing Redis client
const dbClient = require('../utils/db'); // Importing DB client

class AuthController {
  // Method to authenticate a user and generate a token
  static async getConnect(req, res) {
    const authHeader = req.header('Authorization');

    // Check if Authorization header exists and is Basic Auth
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Decode Base64 credentials
    const base64Credentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = decodedCredentials.split(':');

    // Ensure both email and password are provided
    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Hash the password and attempt to find the user in the database
    const hashedPassword = sha1(password);
    const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });

    // If user is not found, return Unauthorized
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate a new token
    const token = uuidv4();

    // Store the token in Redis with an expiry of 24 hours (86400 seconds)
    await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 86400);

    // Return the token to the user
    return res.status(200).json({ token });
  }

  // Method to sign out a user by removing their token
  static async getDisconnect(req, res) {
    const token = req.header('X-Token');

    // Check if the token is provided in the header
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if the token exists in Redis
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Remove the token from Redis
    await redisClient.del(`auth_${token}`);

    // Return 204 status for successful logout
    return res.status(204).send();
  }
}

module.exports = AuthController;
