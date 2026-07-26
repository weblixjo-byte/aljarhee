const XLSX = require("xlsx");
const filePath = "c:/Users/VECTUS-H/Desktop/Book1.xlsx";
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

console.log("Analyzing Book1.xlsx rows...");
rows.forEach((row, idx) => {
  if (!row || row.length === 0) return;
  // If a row has very few elements and contains some text, print it
  const nonEmpties = row.filter(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");
  if (nonEmpties.length <= 2 && nonEmpties.length > 0) {
    console.log(`Row ${idx + 1} (potential header):`, row);
  }
});
