const fs = require('fs');

const difference = require('lodash/difference');
const { getAllFilesFrom } = require('../utils/file');

const getDestinationFolder = destFolder => {
  const pathi = destFolder.split('/');
  return `/baky/from_${pathi[pathi.length - 1]}`;
};

const createDestinationFolder = (base, destFolder) => {
  const dir = `${base}${getDestinationFolder(destFolder)}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const baky = async ({ folders }) => {
  console.info('Initiating baky...');
  const folderPromises = folders.map(folder => getAllFilesFrom(folder, true));
  return Promise.all(folderPromises)
    .then(res => {
      res.forEach((result, ix) => {
        console.info('current folder:', folders[ix]);

        folders.forEach((_, ixComparator) => {
          if (ix === ixComparator) return;
          console.info('comparing with folder', folders[ixComparator]);

          const diff = difference(result.list, res[ixComparator].list);
          if (diff.length) {
            console.warn(
              'files not found',
              diff,
              'in folder',
              folders[ixComparator],
            );

            console.info(`${diff.length} files are not present.`);

            console.info('Initiating copy');

            const copyPromises = [];

            diff.forEach(missingFile => {
              const copyPromise = new Promise((resolve, reject) => {
                createDestinationFolder(folders[ixComparator], folders[ix]);

                const missingFileInfo = result.details.find(
                  fileInfo => fileInfo.id === missingFile,
                );
                console.log('missingFileInfo', missingFileInfo);
                const source = missingFileInfo.filePath;
                console.log('source', source);
                const dest = `${folders[ixComparator]}${getDestinationFolder(
                  folders[ix],
                )}/${missingFileInfo.file}`;

                console.log('dest', dest);

                fs.copyFile(source, dest, err => {
                  if (err) {
                    console.error(`Error copying:${source}
                    to: ${dest}
                    error:${err}`);

                    reject();
                  }

                  resolve();
                });
              });

              copyPromises.push(copyPromise);
            });

            return Promise.all(copyPromises);
          }
        });
      });
    })
    .catch(err => console.log(err));
};

module.exports = baky;
