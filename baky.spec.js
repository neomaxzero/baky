const { getAllFilesFrom } = require("./utils/file");
const baky = require("./");

const BASE_TEST_FOLDER = "./runtime-test";

describe("Sync())", () => {
  describe("file are synchronize across folder", () => {
    test("folder A, B and C have all the same files", async () => {
      const config = {
        folders: [
          `${BASE_TEST_FOLDER}/A`,
          `${BASE_TEST_FOLDER}/B`,
          `${BASE_TEST_FOLDER}/C`
        ]
      };
      await baky(config);

      const filesA = await getAllFilesFrom(`${BASE_TEST_FOLDER}/A`);
      const filesB = await getAllFilesFrom(`${BASE_TEST_FOLDER}/B`);
      const filesC = await getAllFilesFrom(`${BASE_TEST_FOLDER}/C`);

      return filesA.forEach(fileName => {
        expect(filesB).toContain(fileName);
        expect(filesC).toContain(fileName);
      });
    });
  });
});
