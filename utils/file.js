const fs = require('fs');

const getFolderContent = async folder => {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) reject(err);
      resolve(files);
    });
  });
};

const getAllFilesFrom = async (
  folder,
  includeDetails,
  total = { details: [], list: [] },
) => {
  const files = await getFolderContent(folder);

  return files.reduce(async (carry, file) => {
    const filePath = `${folder}/${file}`;
    const fileInfo = fs.lstatSync(filePath);

    if (fileInfo.isDirectory()) {
      return await getAllFilesFrom(filePath, includeDetails, total);
    } else {
      const carryUpdated = await carry;
      if (includeDetails) {
        carryUpdated.details.push({
          file,
          filePath,
          size: fileInfo.size,
          id: `${file}_${fileInfo.size}`,
        });
      }
      carryUpdated.list.push(`${file}_${fileInfo.size}`);
      return carryUpdated;
    }
  }, total);
};

module.exports = {
  getAllFilesFrom,
};
