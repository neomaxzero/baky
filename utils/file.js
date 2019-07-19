const fs = require("fs");

const getFolderContent = async folder => {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
};

const getAllFilesFrom = async (folder, includeDetails, total = []) => {
  const files = await getFolderContent(folder);

  return files.reduce(async (carry, file) => {
    const filePath = `${folder}/${file}`;
    const fileInfo = fs.lstatSync(filePath);

    if (fileInfo.isDirectory()) {
      return await getAllFilesFrom(filePath, includeDetails, total);
    } else {
      const carryUpdated = await carry;
      let info = file;
      if (includeDetails) {
        info = {
          file,
          filePath
        };
      }
      carryUpdated.push(info);
      return carryUpdated;
    }
  }, total);
};

module.exports = {
  getAllFilesFrom
};
