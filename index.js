const dotenv = require("dotenv");
dotenv.config();

const fs = require("fs");
const path = require("path");
const Jimp = require("jimp");

let photoArray = getCsvArray().slice(1);
// console.log(photoArray[0]);
let numberOfReadable = 0;

fs.writeFile(path.resolve(__dirname, "data", "pixels.json"), "[", (err) => {
  return false;
});
getImagePixels(numberOfReadable);

function getImagePixels(i) {
  Jimp.read(
    path.resolve(__dirname, "train", "train", "images", photoArray[i][0])
  )
    .then((image) => {
      let ans = {
        class: photoArray[i][1],
        pixels: [],
      };
      for (let i = 0; i < 480; i++) {
        for (let j = 0; j < 480; j++) {
          let color = Jimp.intToRGBA(image.getPixelColor(i, j));
          ans.pixels.push([color.r, color.g, color.b]);
        }
      }
      fs.appendFileSync(
        path.resolve(__dirname, "data", "pixels.json"),
        JSON.stringify(ans)
      );
      console.log(`Файл считан ${i}: ${photoArray[i][0]}`);

      if (i >= photoArray.length - 1) {
        fs.appendFileSync(path.resolve(__dirname, "data", "pixels.json"), "]");
        afterRead();
      } else {
        fs.appendFileSync(path.resolve(__dirname, "data", "pixels.json"), ",");
        getImagePixels(++i);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function afterRead() {
  console.log("Готово");
}

function getCsvArray() {
  let inputCSV = fs
    .readFileSync(path.resolve(__dirname, "train", "train", "train.csv"), {
      encoding: "utf-8",
    })
    .split("\n");
  inputCSV.forEach((el, i) => {
    inputCSV[i] = el.split(",");
  });
  return inputCSV;
}
