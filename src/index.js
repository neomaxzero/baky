const difference = require('lodash/difference');
const { getAllFilesFrom } = require('../utils/file');

const baky = async ({ folders }) => {
  console.info('Initiating baky...');
  const folderPromises = folders.map(folder => getAllFilesFrom(folder, true));
  return Promise.all(folderPromises)
    .then(res => {
      // console.log(res);
      res.forEach((result, ix) => {
        console.info('current folder:', folders[ix]);

        folders.forEach((_, ixComparator) => {
          if (ix === ixComparator) return;
          console.info('comparing with folder', folders[ixComparator]);

          // console.info('files in comparator folder', res[ixComparator].list);
          // const pairNameSizeComparatorFolder =
          const diff = difference(result.list, res[ixComparator].list);
          if (diff.length) {
            console.warn(
              'files not found',
              diff,
              'in folder',
              folders[ixComparator],
            );
          }
        });
        // console.info('folder', folders[ix], 'files', result.details);

        // para cada
      });
    })
    .catch(err => console.log(err));
};

module.exports = baky;
