const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/app/admin/page.tsx");
let content = fs.readFileSync(filePath, "utf-8");

// Normalize line endings to LF for easier string matching
const originalIsCrlf = content.includes("\r\n");
if (originalIsCrlf) {
  content = content.replace(/\r\n/g, "\n");
}

// We search for a large unique substring of the parsing code
const startMarker = "        const mappedProducts: any[] = [];";
const endMarker = "            newArrival\n          });\n        });";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1) {
  console.error("Start marker not found!");
  process.exit(1);
}
if (endIndex === -1) {
  console.error("End marker not found!");
  process.exit(1);
}

console.log(`Found start marker at index ${startIndex}`);
console.log(`Found end marker at index ${endIndex}`);

const blockToReplace = content.substring(startIndex, endIndex + endMarker.length);

const replacement = `        const mappedProducts: any[] = [];

        // Track running divider metadata for cases where columns are not specified per-row (e.g. Book1.xlsx)
        let currentBrand = "all";
        let currentModel = "all";
        let currentYear = "all";
        let currentCategory = "all";
        let currentCategoryName = "جميع القطع";

        // Helper to check if a row is a header row
        const isHeaderRow = (row: any[]) => {
          if (!Array.isArray(row) || row.length === 0) return false;
          let matchCount = 0;
          const headerKeywords = [
            "brand", "model", "year", "cat-products", "product-title", "product name", 
            "price", "onsale", "fade-in src", "woocommerce", "الشركة", "الماركة", "الموديل", "السنة"
          ];
          row.forEach(cell => {
            if (cell !== undefined && cell !== null) {
              const valStr = String(cell).toLowerCase().trim();
              if (headerKeywords.some(kw => valStr.includes(kw))) {
                matchCount++;
              }
            }
          });
          return matchCount >= 3; // If at least 3 cells match header keywords
        };

        const updateColIndices = (row: any[]) => {
          colIndices = {
            title: -1,
            brand: -1,
            model: -1,
            year: -1,
            category: -1,
            image: -1,
            onsale: -1,
            originalPrice: -1,
            price2: -1
          };

          row.forEach((cell, idx) => {
            if (cell === undefined || cell === null) return;
            const val = String(cell).toLowerCase().trim();

            // Title
            if (
              val === "product name" || val === "product-title" || val === "product title" || 
              val === "title" || val === "name" || val === "الاسم" || val === "اسم المنتج" ||
              val === "product_title"
            ) {
              colIndices.title = idx;
            }
            // Brand
            else if (val === "brand" || val === "الشركة" || val === "الماركة") {
              colIndices.brand = idx;
            }
            // Model
            else if (val === "model" || val === "الموديل" || val === "الفئة") {
              colIndices.model = idx;
            }
            // Year
            else if (val === "year" || val === "السنة" || val === "سنة الصنع") {
              colIndices.year = idx;
            }
            // Category
            else if (
              val === "last cat" || val === "last_cat" || val === "last-cat" || 
              val === "cat-products" || val === "cat products" || val === "cat-products href" ||
              val === "category" || val === "type" || val === "التصنيف" || val === "القسم"
            ) {
              colIndices.category = idx;
            }
            // Image
            else if (
              val === "fade-in src" || val === "fade_in_src" || val === "foto in src" || 
              val === "foto_in_src" || val === "image" || val === "src" || val === "photo" || 
              val === "الصورة" || val === "رابط الصورة"
            ) {
              colIndices.image = idx;
            }
            // On Sale
            else if (val === "onsale" || val === "discount" || val === "sale" || val === "خصم") {
              colIndices.onsale = idx;
            }
            // Original Price
            else if (
              val === "price-amount" || val === "price amount" || val === "price_amount" || 
              val === "price" || val === "original_price" || val === "السعر" ||
              val === "woocommerce-price-amount"
            ) {
              colIndices.originalPrice = idx;
            }
            // Price 2
            else if (
              val === "price-amount (2)" || val === "price amount (2)" || val === "price_amount (2)" || 
              val === "price2" || val === "sale_price" || val === "woocommerce-price-amount (2)" ||
              val === "woocommerce-price-amount(2)"
            ) {
              colIndices.price2 = idx;
            }
          });
        };

        // Helper to check if a row is a divider row and update running category/car metadata
        const checkAndParseDividerRow = (r: any[]) => {
          const nonEmpties = r.filter(cell => cell !== undefined && cell !== null && String(cell).trim() !== "");
          if (nonEmpties.length > 0 && nonEmpties.length <= 2) {
            const text = String(nonEmpties[0]).trim();
            
            const hasCatKeywords = ["بودي", "body", "كهرباء", "كهربا", "electrical", "ميكانيك", "mechanical", "قطع", "غيار"].some(kw => text.includes(kw));
            const hasCarKeywords = ["تويوتا", "toyota", "بريوس", "prius", "لكزس", "lexus", "نيسان", "nissan", "فورد", "ford", "سيفيك", "سنترا", "سوناتا", "كامري", "اوبتيما", "النترا"].some(kw => text.includes(kw));
            const hasNumbers = /\d+/.test(text);

            if (hasCatKeywords || hasCarKeywords || hasNumbers) {
              // Parse category
              if (text.includes("بودي") || text.includes("body")) {
                currentCategory = "body";
                currentCategoryName = "قطع بودي";
              } else if (text.includes("كهرباء") || text.includes("كهربا") || text.includes("electrical")) {
                currentCategory = "electrical";
                currentCategoryName = "قطع كهرباء";
              } else if (text.includes("ميكانيك") || text.includes("mechanical")) {
                currentCategory = "mechanical";
                currentCategoryName = "قطع ميكانيك";
              }

              // Parse brand & model
              if (text.includes("بريوس") || text.includes("prius")) {
                currentBrand = "toyota";
                currentModel = "بريوس";
              } else if (text.includes("تويوتا") || text.includes("toyota")) {
                currentBrand = "toyota";
              } else if (text.includes("لكزس") || text.includes("lexus")) {
                currentBrand = "lexus";
              } else if (text.includes("نيسان") || text.includes("nissan")) {
                currentBrand = "nissan";
              } else if (text.includes("فورد") || text.includes("ford")) {
                currentBrand = "ford";
              }

              // Parse year ranges
              const rangeMatch = text.match(/(20\\d{2})\\s*[-/]\\s*(20\\d{2})/);
              if (rangeMatch) {
                currentYear = \`\dots\`; // will be set properly below
                currentYear = \`\${rangeMatch[1]}-\${rangeMatch[2]}\`;
              } else {
                const shortRangeMatch = text.match(/\\b(\\d{2})\\s*[-/ ]\\s*(\\d{2})\\b/);
                if (shortRangeMatch) {
                  const y1 = parseInt(shortRangeMatch[1]);
                  const y2 = parseInt(shortRangeMatch[2]);
                  currentYear = \`20\${y1 < 10 ? '0' + y1 : y1}-20\${y2 < 10 ? '0' + y2 : y2}\`;
                } else {
                  const singleMatch = text.match(/\\b(20\\d{2})\\b/);
                  if (singleMatch) {
                    currentYear = singleMatch[1];
                  }
                }
              }
              return true;
            }
          }
          return false;
        };

        rawRows.forEach((row, idx) => {
          if (!Array.isArray(row) || row.length === 0) return;

          // Check if it is a header row
          if (isHeaderRow(row)) {
            updateColIndices(row);
            return;
          }

          // Check if it is a section divider row (e.g. "بودي بريوس 2004 - 2009")
          if (checkAndParseDividerRow(row)) {
            return;
          }

          // Skip if no columns mapped yet
          if (colIndices.title === -1 && colIndices.image === -1) {
            return;
          }

          // Parse product name
          const titleRaw = colIndices.title !== -1 ? row[colIndices.title] : "";
          let title = String(titleRaw || "").trim();

          // Skip empty lines or header definitions that slipped through
          if (!title || title.toLowerCase() === "screen-reader-text" || title.toLowerCase().includes("currencysymbol")) {
            return;
          }

          const carDetails = detectCarDetails(title);
          const newArrival = idx % 5 === 0;

          // Parse category
          const categoryRaw = colIndices.category !== -1 ? row[colIndices.category] : "";
          let categoryText = String(categoryRaw || "").trim();

          // Parse brand, model, year
          const rawBrand = colIndices.brand !== -1 ? row[colIndices.brand] : "";
          const rawModel = colIndices.model !== -1 ? row[colIndices.model] : "";
          const rawYear = colIndices.year !== -1 ? row[colIndices.year] : "";

          const mapBrand = (val: string): string => {
            const b = String(val || "").trim().toLowerCase();
            if (b === "تويوتا" || b === "toyota") return "toyota";
            if (b === "لكزس" || b === "lexus") return "lexus";
            if (b === "نيسان" || b === "nissan") return "nissan";
            if (b === "فورد" || b === "ford") return "ford";
            if (b === "لينكولن" || b === "لينكون" || b === "lincoln") return "lincoln";
            return String(val || "").trim();
          };

          // Clean values (if they are URLs, discard them)
          const cleanValue = (val: any): string => {
            const s = String(val || "").trim();
            if (s.startsWith("http")) return "";
            return s;
          };

          const cleanedBrand = cleanValue(rawBrand);
          const finalBrand = cleanedBrand ? mapBrand(cleanedBrand) : currentBrand;

          const cleanedModel = cleanValue(rawModel);
          const finalModel = cleanedModel ? String(cleanedModel).trim() : currentModel;

          const cleanedYear = cleanValue(rawYear);
          const finalYear = cleanedYear ? String(cleanedYear).trim() : currentYear;

          // Parse prices
          const onsaleRaw = colIndices.onsale !== -1 ? row[colIndices.onsale] : "";
          const onsaleVal = parseFloat(String(onsaleRaw)) || 0;

          const origPriceRaw = colIndices.originalPrice !== -1 ? row[colIndices.originalPrice] : "";
          const originalPrice = parseFloat(String(origPriceRaw).replace(/[^\d.]/g, "")) || 0;

          const priceRaw = colIndices.price2 !== -1 ? row[colIndices.price2] : "";
          let price = parseFloat(String(priceRaw || "").replace(/[^\d.]/g, "")) || 0;

          if (price <= 0 && originalPrice > 0) {
            if (onsaleVal < 0) {
              price = Math.round(originalPrice * (1 + onsaleVal) * 100) / 100;
            } else if (onsaleVal > 0 && onsaleVal < 1) {
              price = Math.round(originalPrice * (1 - onsaleVal) * 100) / 100;
            } else {
              price = originalPrice;
            }
          }

          const imageUrlRaw = colIndices.image !== -1 ? row[colIndices.image] : "";
          const imageUrl = String(imageUrlRaw || "").trim();

          // Map Category
          let finalCategory = currentCategory;
          let finalCategoryName = currentCategoryName;

          if (categoryText && !categoryText.startsWith("http")) {
            if (categoryText.includes("بودي") || categoryText.includes("body")) {
              finalCategory = "body";
              finalCategoryName = "قطع بودي";
            } else if (categoryText.includes("كهرباء") || categoryText.includes("electrical")) {
              finalCategory = "electrical";
              finalCategoryName = "قطع كهرباء";
            } else if (categoryText.includes("ميكانيك") || categoryText.includes("mechanical")) {
              finalCategory = "mechanical";
              finalCategoryName = "قطع ميكانيك";
            } else if (categoryText !== "جميع القطع" && categoryText !== "وصل حديثاً" && categoryText !== "أحدث العروض") {
              finalCategory = mapCategory(categoryText);
              finalCategoryName = categoryText;
            }
          }

          mappedProducts.push({
            id: mappedProducts.length + 1000,
            name: title,
            category: finalCategory,
            categoryName: finalCategoryName,
            brand: finalBrand,
            model: finalModel,
            year: finalYear,
            price: price || 0,
            originalPrice: originalPrice > price ? originalPrice : undefined,
            condition: carDetails.condition,
            conditionText: carDetails.conditionText,
            image: imageUrl || "/assets/images/placeholder-product.png",
            description: \`قطعة غيار أصلية متوافقة مع سيارات \${finalBrand === "all" ? "مختلف الأنواع" : finalBrand.toUpperCase()} \${finalModel === "all" ? "" : finalModel}، خاضعة لفحص الجودة وكفالة تشغيل حقيقية من مركز الجارحي.\`,
            featured: mappedProducts.length < 8,
            bestSeller: false,
            newArrival
          });
        });`;

let newContent = content.replace(blockToReplace, replacement);

if (originalIsCrlf) {
  newContent = newContent.replace(/\n/g, "\r\n");
}

fs.writeFileSync(filePath, newContent, "utf-8");
console.log("Successfully patched page.tsx!");
