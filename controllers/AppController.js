// controllers/AppController.js
const redisClient = require('../utils/redis'); // Utilitaire pour Redis
const dbClient = require('../utils/db'); // Utilitaire pour MongoDB

class AppController {
  // Endpoint pour /status: Vérifie si Redis et la DB sont vivants
  static getStatus(req, res) {
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  // Endpoint pour /stats: Retourne le nombre d'utilisateurs et de fichiers
  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers(); // Compter le nombre d'utilisateurs
    const filesCount = await dbClient.nbFiles(); // Compter le nombre de fichiers
    res.status(200).json({ users: usersCount, files: filesCount });
  }
}

module.exports = AppController;
