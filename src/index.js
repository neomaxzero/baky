const { getAllFilesFrom } = require("../utils/file");

const baky = async ({ folders }) => {
  console.log(folders);
  const folderPromises = folders.map(folder => getAllFilesFrom(folder, true));
  return Promise.all(folderPromises)
    .then(res => {
      res.forEach((result, ix) => {});
      console.log(res);
    })
    .catch(err => console.log(err));
};

module.exports = baky;
