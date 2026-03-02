const fs = require("fs");
const path = require("path");

// Function to rename images and store the mapping
const renameImagesSequentially = function (imagesDir) {
  const imageFiles = fs.readdirSync(imagesDir);
  const imageMap = {};

  imageFiles.sort().forEach((file, index) => {
    const oldPath = path.join(imagesDir, file);
    const newName = `${index + 1}.png`;
    const newPath = path.join(imagesDir, newName);

    // Rename the image
    fs.renameSync(oldPath, newPath);

    // Store the mapping
    imageMap[file] = index + 1;
  });

  // Save the mapping to a JSON file
  fs.writeFileSync(
    path.join(imagesDir, "imageMap.json"),
    JSON.stringify(imageMap, null, 2)
  );

  console.log("Renaming completed. Mapping saved to imageMap.json.");
  return imageMap;
};

// Usage
//renameImagesSequentially("/path/to/your/images");

// Function to rename images back using the stored mapping
const renameImagesBack = function (imagesDir, imageMap) {
  for (const [originalName, newIndex] of Object.entries(imageMap)) {
    const oldPath = path.join(imagesDir, `${newIndex}.png`);
    const newPath = path.join(imagesDir, originalName);

    // Rename the image back to its original name
    fs.renameSync(oldPath, newPath);
  }

  console.log("Images renamed back to their original names.");
};

// Function to find duplicates based on image ID
function findDuplicateImages(imagesDir) {
  const imageFiles = fs.readdirSync(imagesDir);
  const imageMap = {};
  const duplicates = [];

  // Process each image file
  imageFiles.forEach((file) => {
    const fileName = path.parse(file).name;
    const match = fileName.match(/\d+/); // Extract the number portion (image ID)

    if (match) {
      const imageID = match[0];
      if (imageMap[imageID]) {
        duplicates.push({
          original: imageMap[imageID],
          duplicate: file,
        });
      } else {
        imageMap[imageID] = file;
      }
    }
  });

  // Log the duplicates
  duplicates.forEach((pair) => {
    console.log(
      `Duplicate found: ${pair.duplicate} is a duplicate of ${pair.original}`
    );
  });

  return duplicates;
}

// Define the directory where JSON files will be created
const traitsDir = "/home/goonerlabs/Apostrophe/preparePuffsMint/traits/puffs";

// Define the JSON object template
const traitTemplate = {
  Backgrounds: "null",
  Clothes: "null",
  Drip: "null",
  Eyes: "null",
  Glasses: "null",
  "Hand items": "null",
  Hats: "null",
  Masks: "null",
  Mouth: "null",
  Skin: "null",
  Necklace: "null",
};

// Function to create 2000 JSON files
const createTraitFiles = function () {
  for (let i = 1; i <= 2000; i++) {
    const fileName = `${i}.json`;
    const filePath = path.join(traitsDir, fileName);

    // Write the JSON object to the file
    fs.writeFileSync(filePath, JSON.stringify(traitTemplate, null, 2));
    console.log(`Created ${fileName}`);
  }
  console.log("All files created successfully.");
};

// Function to update the JSON files
const updateTraitFiles = function () {
  for (let i = 1; i <= 2000; i++) {
    const fileName = `${i}.json`;
    const filePath = path.join(traitsDir, fileName);

    // Read the JSON file
    let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (data["Clothes"] === "Fur Coat") {
      data["Necklace"] = "Pimp Chain";
      // delete data["Clothes"];
    }

    // Turquoise

    // Capitalize "Items" in "Hand Items" key if it's written as "hand items"
    //if (data["Hand items"]) {
    //data["Hand Items"] = data["Hand items"];
    //delete data["Hand items"];
    //}

    // Write the updated JSON back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
  console.log("All files updated successfully.");
};

function cleanJsonFiles(
  folderPath = "/home/goonerlabs/Apostrophe/preparePuffsMint/traits/puffs",
  start = 1,
  end = 1997
) {
  for (let i = start; i <= end; i++) {
    const filePath = path.join(folderPath, `${i}.json`);

    try {
      // Read the JSON file
      const data = fs.readFileSync(filePath, "utf-8");
      const jsonObject = JSON.parse(data);

      // Remove keys with "null" values
      for (const key in jsonObject) {
        if (jsonObject[key] === "null") {
          delete jsonObject[key];
        }
      }

      // Write the cleaned object back to the file
      fs.writeFileSync(filePath, JSON.stringify(jsonObject, null, 2), "utf-8");
    } catch (err) {
      console.error(`Error processing file ${i}.json: ${err.message}`);
    }
  }

  console.log("All files processed successfully.");
}

function findDuplicates(
  folderPath = "/home/goonerlabs/Apostrophe/preparePuffsMint/traits/puffs",
  start = 1,
  end = 2000
) {
  const jsonObjects = new Map(); // To store JSON content as strings and their corresponding file numbers

  for (let i = start; i <= end; i++) {
    const filePath = path.join(folderPath, `${i}.json`);

    try {
      // Read the JSON file
      const data = fs.readFileSync(filePath, "utf-8");
      const jsonObject = JSON.parse(data);

      // Convert the JSON object to a string for comparison
      const jsonString = JSON.stringify(
        jsonObject,
        Object.keys(jsonObject).sort()
      );

      // Check for duplicates
      if (jsonObjects.has(jsonString)) {
        const originalFileNumber = jsonObjects.get(jsonString);
        console.log(
          `Duplicate found: ${i}.json is a duplicate of ${originalFileNumber}.json`
        );
      } else {
        jsonObjects.set(jsonString, i);
      }
    } catch (err) {
      console.error(`Error processing file ${i}.json: ${err.message}`);
    }
  }
}

function extractUniqueKeyValuePairs(
  folderPath = "/home/goonerlabs/Apostrophe/preparePuffsMint/traits/puffs",
  start = 1,
  end = 2000,
  outputFilePath = "./uniqueKeyValuePairs.json"
) {
  const uniquePairs = new Set();

  for (let i = start; i <= end; i++) {
    const filePath = path.join(folderPath, `${i}.json`);

    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const jsonObject = JSON.parse(data);

      for (const [key, value] of Object.entries(jsonObject)) {
        uniquePairs.add(`${key}:${value}`);
      }
    } catch (err) {
      console.error(`Error processing file ${i}.json: ${err.message}`);
    }
  }

  // Convert the Set to an array and write it to the output file
  const uniquePairsArray = Array.from(uniquePairs);
  fs.writeFileSync(
    outputFilePath,
    JSON.stringify(uniquePairsArray, null, 2),
    "utf-8"
  );
  console.log(`Unique key-value pairs written to ${outputFilePath}`);
}

function sortKeyValuePairs(
  inputFilePath = "./uniqueKeyValuePairs.json",
  sortedOutputFilePath = "./sortedKeyValuePairs.json"
) {
  try {
    const data = fs.readFileSync(inputFilePath, "utf-8");
    const keyValuePairs = JSON.parse(data);

    // Sort by key first, then by value
    keyValuePairs.sort((a, b) => {
      const [keyA, valueA] = a.split(":");
      const [keyB, valueB] = b.split(":");

      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });

    // Write sorted pairs to the output file
    fs.writeFileSync(
      sortedOutputFilePath,
      JSON.stringify(keyValuePairs, null, 2),
      "utf-8"
    );
    console.log(`Sorted key-value pairs written to ${sortedOutputFilePath}`);
  } catch (err) {
    console.error(`Error sorting key-value pairs: ${err.message}`);
  }
}

function findFilesWithKeyValuePair(
  keyValuePair,
  folderPath = "/home/goonerlabs/Apostrophe/preparePuffsMint/traits/puffs",
  start = 1,
  end = 1997
) {
  const [searchKey, searchValue] = keyValuePair.split(":");

  for (let i = start; i <= end; i++) {
    const filePath = path.join(folderPath, `${i}.json`);

    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const jsonObject = JSON.parse(data);

      if (jsonObject.hasOwnProperty(searchKey)) {
        if (jsonObject[searchKey] === searchValue) {
          console.log(`Found in file: ${i}.json`);
        }
      }
    } catch (err) {
      console.error(`Error processing file ${i}.json: ${err.message}`);
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function randomizeImagesAndTraits(
  imagesDir = "/home/goonerlabs/Apostrophe/preparePuffsMint/images/puffs",
  traitsDir = "/home/goonerlabs/Apostrophe/preparePuffsMint/traits/puffs",
  totalFiles = 2000
) {
  // Create an array of numbers from 1 to totalFiles
  const fileNumbers = Array.from({ length: totalFiles }, (_, i) => i + 1);

  // Shuffle the array to randomize the file numbers
  shuffleArray(fileNumbers);

  // Iterate through the shuffled array to rename images and traits
  for (let i = 0; i < totalFiles; i++) {
    const originalIndex = i + 1;
    const newIndex = fileNumbers[i];

    const originalImagePath = path.join(imagesDir, `${originalIndex}.png`);
    const newImagePath = path.join(imagesDir, `${newIndex}.png`);

    const originalJsonPath = path.join(traitsDir, `${originalIndex}.json`);
    const newJsonPath = path.join(traitsDir, `${newIndex}.json`);

    // Swap the images
    if (originalIndex !== newIndex) {
      fs.renameSync(originalImagePath, newImagePath + ".tmp");
      fs.renameSync(newImagePath, originalImagePath);
      fs.renameSync(newImagePath + ".tmp", newImagePath);

      // Swap the corresponding trait JSON files
      fs.renameSync(originalJsonPath, newJsonPath + ".tmp");
      fs.renameSync(newJsonPath, originalJsonPath);
      fs.renameSync(newJsonPath + ".tmp", newJsonPath);

      console.log(
        `Swapped: ${originalIndex}.png with ${newIndex}.png and ${originalIndex}.json with ${newIndex}.json`
      );
    }
  }
}

module.exports = {
  updateTraitFiles,
  renameImagesSequentially,
  renameImagesBack,
  findDuplicateImages,
  createTraitFiles,
  cleanJsonFiles,
  findDuplicates,
  extractUniqueKeyValuePairs,
  sortKeyValuePairs,
  findFilesWithKeyValuePair,
  randomizeImagesAndTraits,
};
