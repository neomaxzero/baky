const chalk = require("chalk");
const fs = require("fs");
const { getBakyLogo } = require("../utils/cli");
const log = console.log;

const difference = require("lodash/difference");
const { getAllFilesFrom } = require("../utils/file");

const getDestinationFolder = destFolder => {
  const pathi = destFolder.split("/");
  return `/baky/from_${pathi[pathi.length - 1]}`;
};

const createDestinationFolder = (base, destFolder) => {
  const dir = `${base}${getDestinationFolder(destFolder)}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const baky = async ({ folders, tap, verbose }) => {
  getBakyLogo(chalk);
  const folderPromises = folders.map(folder => getAllFilesFrom(folder, true));
  return Promise.all(folderPromises)
    .then(res => {
      res.forEach((result, ix) => {
        log(chalk.yellow("current folder:"), folders[ix]);

        folders.forEach((_, ixComparator) => {
          if (ix === ixComparator) return;
          log(chalk.yellow("comparing with folder"), folders[ixComparator]);

          const diff = difference(result.list, res[ixComparator].list);
          if (diff.length) {
            if (verbose) {
              console.warn(
                "files not found",
                diff,
                "in folder",
                folders[ixComparator]
              );
            }

            log(chalk.bold.hex("#F595AA")(`${diff.length} files missing. :(`));

            const copyPromises = [];

            diff.forEach(missingFile => {
              const copyPromise = new Promise((resolve, reject) => {
                if (!tap) {
                  createDestinationFolder(folders[ixComparator], folders[ix]);
                }

                const missingFileInfo = result.details.find(
                  fileInfo => fileInfo.id === missingFile
                );

                if (verbose) {
                  log("missingFileInfo", missingFileInfo);
                }

                if (!tap) {
                  const source = missingFileInfo.filePath;
                  const dest = `${folders[ixComparator]}${getDestinationFolder(
                    folders[ix]
                  )}/${missingFileInfo.file}`;
                  fs.copyFile(source, dest, err => {
                    if (err) {
                      console.error(`Error copying:${source}
                      to: ${dest}
                      error:${err}`);

                      reject();
                    }

                    resolve();
                  });
                } else {
                  resolve();
                }
              });

              copyPromises.push(copyPromise);
            });

            return Promise.all(copyPromises);
          }
        });
      });
    })
    .catch(err => log(err));
};

module.exports = baky;
