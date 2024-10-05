// files controller
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const FileModel = require('../utils/db');
const UserModel = require('../utils/redis');

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
  static async postUpload(req, res) {
    try {
      const {
        name, type, parentId = 0, isPublic = false, data,
      } = req.body;

      const token = req.headers['x-token'];
      const user = await UserModel.findByToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!name) return res.status(400).json({ error: 'Missing name' });
      if (!['folder', 'file', 'image'].includes(type)) return res.status(400).json({ error: 'Missing type' });
      if (type !== 'folder' && !data) return res.status(400).json({ error: 'Missing data' });

      if (parentId !== 0) {
        const parentFile = await FileModel.findById(parentId);
        if (!parentFile) return res.status(400).json({ error: 'Parent not found' });
        if (parentFile.type !== 'folder') return res.status(400).json({ error: 'Parent is not a folder' });
      }

      if (type === 'folder') {
        const newFile = await FileModel.create({
          userId: user.id,
          name,
          type,
          isPublic,
          parentId,
        });
        return res.status(201).json(newFile);
      }

      const filePath = path.join(FOLDER_PATH, uuidv4());
      const fileBuffer = Buffer.from(data, 'base64');

      if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH, { recursive: true });
      }

      fs.writeFileSync(filePath, fileBuffer);

      const newFile = await FileModel.create({
        userId: user.id,
        name,
        type,
        isPublic,
        parentId,
        localPath: filePath,
      });

      return res.status(201).json(newFile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = FilesController;
