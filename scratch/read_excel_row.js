const XLSX = require("xlsx");
const path = require("path");

const filePath = "c:/Users/VECTUS-H/Desktop/original.xlsx";
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log("Headers at row 1:", rows[0]);
console.log("Headers at row 40:", rows[39]);

console.log("\nRows 170 to 180 (1-indexed, i.e. array indices 169 to 179):");
for (let i = 169; i < 179; i++) {
  console.log(`Row ${i + 1}:`, rows[i]);
}
