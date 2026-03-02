const {
  renameImagesSequentially,
  renameImagesBack,
  findDuplicateImages,
  createTraitFiles,
  updateTraitFiles,
  cleanJsonFiles,
  findDuplicates,
  extractUniqueKeyValuePairs,
  sortKeyValuePairs,
  findFilesWithKeyValuePair,
  randomizeImagesAndTraits,
} = require("./renameImages");

findFilesWithKeyValuePair("Mouth:Bear");

// randomizeImagesAndTraits();

// Usage
// const map = renameImagesSequentially(
//   "/home/goonerlabs/Apostrophe/preparePuffsMint/images/puffs"
// );
// console.log("Image mapping: ", map);

// Usage
//const imageMap = require("/path/to/your/images/imageMap.json");
//renameImagesBack("/path/to/your/images", imageMap);

// Usage
// const duplicates = findDuplicateImages(
//   "/home/goonerlabs/Apostrophe/preparePuffsMint/images/puffs"
// );

// console.log("Total duplicates found:", duplicates.length);
