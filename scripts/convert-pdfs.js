const pdf = require("pdf-poppler");
const path = require("path");
const fs = require("fs");

const rootDir = path.join(__dirname, "..");
const publicDir = path.join(rootDir, "public");

const options = {
  format: "png",
  out_dir: publicDir,
  out_prefix: "",
  page: null, // convert all pages
};

async function convertPdfs() {
  const pdfs = [
    {
      input: path.join(publicDir, "Chocolate Chip Cookie Label.pdf"),
      output: "chocolate-chip-ingredients.png",
    },
    {
      input: path.join(publicDir, "Butterscotch Cookie Label.pdf"),
      output: "butterscotch-ingredients.png",
    },
  ];

  for (const pdfFile of pdfs) {
    try {
      if (!fs.existsSync(pdfFile.input)) {
        console.log(`PDF not found: ${pdfFile.input}`);
        continue;
      }

      const outputPath = path.join(publicDir, pdfFile.output);
      const pdfOptions = {
        ...options,
        out_prefix: path.basename(pdfFile.output, ".png"),
      };

      await pdf.convert(pdfFile.input, pdfOptions);
      console.log(`Converted ${pdfFile.input} to ${outputPath}`);
    } catch (error) {
      console.error(`Error converting ${pdfFile.input}:`, error.message);
      console.log(
        "Note: pdf-poppler requires poppler-utils. On Windows, you may need to install it separately or convert PDFs manually."
      );
    }
  }
}

convertPdfs();

