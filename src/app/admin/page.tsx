"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { useProducts } from "../../context/ProductContext";
import { useToast } from "../../context/ToastContext";
import { 
  Upload, 
  FileText, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Database,
  ArrowDownToLine,
  Layers,
  Percent,
  Check,
  Edit,
  Search,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  Star,
  Briefcase,
  MapPin,
  Calendar,
  Loader2
} from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

interface ImportedRow {
  "onsale"?: string | number;
  "woocommerce-LoopProduct-link href"?: string;
  "fade-in src"?: string;
  "cat-products"?: string;
  "product-title"?: string;
  "Price-amount"?: string | number;
  "Price-currencySymbol"?: string;
  "Price-amount (2)"?: string | number;
  "Price-currencySymbol (2)"?: string;
  "screen-reader-text"?: string;
  "screen-reader-text (2)"?: string;
  [key: string]: any;
}

// Custom RFC-compliant CSV parser that handles quotes, escaping, and line breaks, returning a 2D array of cells
function parseCSV(text: string): any[][] {
  const lines: string[] = [];
  let currentLine = "";
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentLine += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === '\n' || char === '\r') {
      if (inQuotes) {
        currentLine += char;
      } else {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        lines.push(currentLine);
        currentLine = "";
      }
    } else {
      currentLine += char;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  
  if (lines.length === 0) return [];
  
  // Auto-detect CSV separator: comma vs semicolon
  const firstLine = lines[0];
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const separator = semicolonCount > commaCount ? ";" : ",";
  
  return lines.map(line => parseCSVLine(line, separator));
}

function parseCSVLine(line: string, separator: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === separator) {
      if (inQuotes) {
        current += separator;
      } else {
        result.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export default function AdminPage() {
  // ─── ALL HOOKS MUST BE AT THE TOP — React Rules of Hooks ───
  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "aljarhee2025";
  const [isAuthed, setIsAuthed] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  const { products, categorySettings, brandSettings, modelSettings, saveCategorySettings, importProducts, resetProducts } = useProducts();
  const { showToast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    withDiscount: 0,
  });

  const [activeTab, setActiveTab] = useState<"import" | "manage" | "careers" | "categories">("import");

  const switchTab = (tab: "import" | "manage" | "careers" | "categories") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_active_tab", tab);
    }
  };

  // Category Settings States
  const [tempCategoryImages, setTempCategoryImages] = useState<Record<string, string>>({});
  const [tempBrandLogos, setTempBrandLogos] = useState<Record<string, string>>({});
  const [tempModelImages, setTempModelImages] = useState<Record<string, string>>({});
  const [imagesSubTab, setImagesSubTab] = useState<"categories" | "brands" | "models">("categories");
  const [isSavingCategoryImages, setIsSavingCategoryImages] = useState(false);

  const handleCategoryImgChange = (catName: string, val: string) => {
    setTempCategoryImages(prev => ({
      ...prev,
      [catName]: val
    }));
  };

  const handleBrandLogoChange = (brandName: string, val: string) => {
    setTempBrandLogos(prev => ({
      ...prev,
      [brandName.toLowerCase()]: val
    }));
  };

  const handleModelImageChange = (modelName: string, val: string) => {
    setTempModelImages(prev => ({
      ...prev,
      [modelName.toLowerCase()]: val
    }));
  };

  const handleSaveAllImages = async () => {
    setIsSavingCategoryImages(true);
    const finalSettings = {
      categories: {
        ...categorySettings,
        ...tempCategoryImages
      },
      brands: {
        ...brandSettings,
        ...tempBrandLogos
      },
      models: {
        ...modelSettings,
        ...tempModelImages
      }
    };
    const success = await saveCategorySettings(finalSettings);
    setIsSavingCategoryImages(false);
    if (success) {
      showToast("تم حفظ التعديلات بنجاح ومزامنتها مع المتجر!", "success");
    } else {
      showToast("حدث خطأ أثناء حفظ التعديلات. يرجى التحقق من الشبكة.", "error");
    }
  };

    // Careers / Jobs Management States
  const [careersList, setCareersList] = useState<any[]>([]);
  const [careersLoading, setCareersLoading] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobLocation, setNewJobLocation] = useState("عمان، البيادر");
  const [newJobDesc, setNewJobDesc] = useState("");
  const [newJobReqs, setNewJobReqs] = useState("");
  const [newJobImage, setNewJobImage] = useState("");
  const [isUploadingJobImage, setIsUploadingJobImage] = useState(false);
  const [manageSearch, setManageSearch] = useState("");
  const [manageCategory, setManageCategory] = useState("all");
  const [manageBrand, setManageBrand] = useState("all");
  const [manageStatus, setManageStatus] = useState("all");
  const [managePage, setManagePage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // ─ Auth gate effect
  useEffect(() => {
    const ok = sessionStorage.getItem("admin_authed");
    if (ok === "1") setIsAuthed(true);
    // Restore saved tab
    const saved = localStorage.getItem("admin_active_tab");
    if (saved === "manage" || saved === "import" || saved === "careers" || saved === "categories") {
      setActiveTab(saved as any);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput === ADMIN_PASS) {
      sessionStorage.setItem("admin_authed", "1");
      setIsAuthed(true);
      setPassError(false);
    } else {
      setPassError(true);
      setPassInput("");
    }
  };

  // Load careers list
  const loadCareers = async () => {
    try {
      setCareersLoading(true);
      if (!supabase) return;
      const { data, error } = await supabase
        .from("careers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCareersList(data || []);
    } catch (err) {
      console.error("Failed to load careers:", err);
      showToast("حدث خطأ أثناء تحميل الوظائف.", "error");
    } finally {
      setCareersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "careers") {
      loadCareers();
    }
  }, [activeTab]);

  // Handle uploading careers banner/announcement image
  const handleJobImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingJobImage(true);
      if (!supabase) throw new Error("Supabase is not initialized");

      const fileExt = file.name.split(".").pop();
      const fileName = `careers/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      if (data?.publicUrl) {
        setNewJobImage(data.publicUrl);
        showToast("تم رفع صورة الإعلان بنجاح!", "success");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      showToast(`فشل رفع الصورة: ${err.message || err}`, "error");
    } finally {
      setIsUploadingJobImage(false);
    }
  };

  // Add new jobvacancy
  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim() || !newJobDesc.trim()) {
      showToast("يرجى إدخال المسمى الوظيفي والوصف الأساسي.", "error");
      return;
    }

    try {
      if (!supabase) throw new Error("Supabase is not initialized");

      const newJob = {
        title: newJobTitle.trim(),
        location: newJobLocation.trim(),
        description: newJobDesc.trim(),
        requirements: newJobReqs.trim() || null,
        image: newJobImage.trim() || null,
      };

      const { error } = await supabase
        .from("careers")
        .insert([newJob]);

      if (error) throw error;

      showToast("تم نشر إعلان الوظيفة بنجاح!", "success");
      setNewJobTitle("");
      setNewJobDesc("");
      setNewJobReqs("");
      setNewJobImage("");
      loadCareers();
    } catch (err: any) {
      console.error("Save error:", err);
      showToast(`فشل الحفظ: ${err.message || err}`, "error");
    }
  };

  // Delete vacancy
  const handleDeleteJob = async (id: number) => {
    if (!confirm("هل أنت متأكد من حذف إعلان الوظيفة هذا نهائياً؟")) return;

    try {
      if (!supabase) throw new Error("Supabase is not initialized");

      const { error } = await supabase
        .from("careers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      showToast("تم حذف إعلان الوظيفة بنجاح.", "success");
      loadCareers();
    } catch (err: any) {
      console.error("Delete error:", err);
      showToast(`فشل الحذف: ${err.message || err}`, "error");
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Helper to map dynamic categories based on keywords
  const mapCategory = (catText: string = ""): string => {
    const text = catText.toLowerCase();
    if (text.includes("هايبرد") || text.includes("كهربا") || text.includes("بطاري")) return "hybrid";
    if (text.includes("ميكانيك") || text.includes("محرك") || text.includes("موتور") || text.includes("بريك") || text.includes("فحمات") || text.includes("فلتر")) return "mechanical";
    if (text.includes("دوزان") || text.includes("تعليق") || text.includes("مساعد") || text.includes("مقص")) return "suspension";
    if (text.includes("بودي") || text.includes("هيكل") || text.includes("ضوء") || text.includes("كشاف") || text.includes("صدام") || text.includes("مرايا")) return "body";
    if (text.includes("كهرباء") || text.includes("تكييف") || text.includes("كمبريسور") || text.includes("حساس") || text.includes("فيش")) return "electrical";
    return catText.trim() || "accessories";
  };

  // CAR DATABASES FOR CLASSIFICATION
  const CAR_BRANDS = [
    { id: "toyota", nameAr: "تويوتا", nameEn: "Toyota", keywords: ["تويوتا", "toyota"] },
    { id: "kia", nameAr: "كيا", nameEn: "Kia", keywords: ["كيا", "kia"] },
    { id: "hyundai", nameAr: "هيونداي", nameEn: "Hyundai", keywords: ["هيونداي", "hyundai"] },
    { id: "ford", nameAr: "فورد", nameEn: "Ford", keywords: ["فورد", "ford"] },
    { id: "honda", nameAr: "هوندا", nameEn: "Honda", keywords: ["هوندا", "honda"] },
    { id: "chevrolet", nameAr: "شفروليه", nameEn: "Chevrolet", keywords: ["شفروليه", "شيفورليه", "chevrolet", "chevy"] },
    { id: "lexus", nameAr: "لكزس", nameEn: "Lexus", keywords: ["لكزس", "lexus"] },
    { id: "tesla", nameAr: "تيسلا", nameEn: "Tesla", keywords: ["تيسلا", "تسلا", "tesla"] },
    { id: "byd", nameAr: "بي واي دي", nameEn: "BYD", keywords: ["بي واي دي", "byd"] },
    { id: "volkswagen", nameAr: "فولكس فاجن", nameEn: "Volkswagen", keywords: ["فولكس", "فولكسفاجن", "volkswagen", "vw", "جولف", "golf"] },
    { id: "nissan", nameAr: "نيسان", nameEn: "Nissan", keywords: ["نيسان", "nissan"] },
    { id: "mitsubishi", nameAr: "ميتسوبيشي", nameEn: "Mitsubishi", keywords: ["ميتسوبيشي", "mitsubishi"] },
    { id: "mercedes", nameAr: "مرسيدس", nameEn: "Mercedes", keywords: ["مرسيدس", "mercedes", "benz"] },
    { id: "bmw", nameAr: "بي إم دبليو", nameEn: "BMW", keywords: ["بي ام", "بي إم", "bmw"] }
  ];

  const CAR_MODELS = [
    { brand: "toyota", model: "بريوس (Prius)", keywords: ["بريوس", "prius"] },
    { brand: "toyota", model: "كامري (Camry)", keywords: ["كامري", "camry"] },
    { brand: "toyota", model: "كورولا (Corolla)", keywords: ["كورولا", "corolla"] },
    { brand: "toyota", model: "راف فور (RAV4)", keywords: ["راف", "rav"] },
    { brand: "toyota", model: "سي اتش ار (C-HR)", keywords: ["c-hr", "chr", "سي اتش"] },
    { brand: "toyota", model: "يارس (Yaris)", keywords: ["يارس", "ياريس", "yaris"] },
    { brand: "toyota", model: "أفالون (Avalon)", keywords: ["افالون", "avalon"] },
    
    { brand: "kia", model: "نيرو (Niro)", keywords: ["نيرو", "niro"] },
    { brand: "kia", model: "أوبتيما (Optima)", keywords: ["اوبتيما", "optima"] },
    { brand: "kia", model: "كي 5 (K5)", keywords: ["k5", "كي 5", "كي فايف"] },
    { brand: "kia", model: "سورينتو (Sorento)", keywords: ["سورينتو", "sorento"] },
    { brand: "kia", model: "سبورتج (Sportage)", keywords: ["سبورتج", "سبورتيج", "sportage"] },
    { brand: "kia", model: "سول (Soul)", keywords: ["سول", "soul"] },
    { brand: "kia", model: "سيراتو (Cerato)", keywords: ["سيراتو", "cerato"] },
    { brand: "kia", model: "فورتي (Forte)", keywords: ["فورتي", "forte"] },
    { brand: "kia", model: "إي في 6 (EV6)", keywords: ["ev6", "اي في"] },

    { brand: "hyundai", model: "سوناتا (Sonata)", keywords: ["سوناتا", "sonata"] },
    { brand: "hyundai", model: "آيونيك (Ioniq)", keywords: ["ايونيك", "ioniq"] },
    { brand: "hyundai", model: "توسان (Tucson)", keywords: ["توسان", "tucson"] },
    { brand: "hyundai", model: "كونا (Kona)", keywords: ["كونا", "kona"] },
    { brand: "hyundai", model: "إلنترا (Elantra)", keywords: ["النترا", "elantra"] },
    { brand: "hyundai", model: "أفانتي (Avante)", keywords: ["افانتي", "avante"] },
    { brand: "hyundai", model: "سانتا فيه (Santa Fe)", keywords: ["سانتا", "santa"] },

    { brand: "ford", model: "فيوجن (Fusion)", keywords: ["فيوجن", "fusion"] },
    { brand: "ford", model: "سي ماكس (C-Max)", keywords: ["سي ماكس", "c-max", "cmax"] },
    { brand: "ford", model: "إسكيب (Escape)", keywords: ["اسكايب", "escape", "اسكيب"] },
    { brand: "ford", model: "فوكس (Focus)", keywords: ["فوكس", "focus"] },

    { brand: "honda", model: "سيفيك (Civic)", keywords: ["سيفيك", "civic"] },
    { brand: "honda", model: "أكورد (Accord)", keywords: ["اكورد", "accord"] },
    { brand: "honda", model: "سي آر في (CR-V)", keywords: ["cr-v", "crv"] },
    { brand: "honda", model: "إنسايت (Insight)", keywords: ["انسايت", "insight"] },

    { brand: "chevrolet", model: "فولت (Volt)", keywords: ["فولت", "volt"] },
    { brand: "chevrolet", model: "بولت (Bolt)", keywords: ["بولت", "bolt"] },
    { brand: "chevrolet", model: "ماليبو (Malibu)", keywords: ["ماليبو", "malibu"] },
    { brand: "chevrolet", model: "سبارك (Spark)", keywords: ["سبارك", "spark"] },

    { brand: "lexus", model: "سي تي 200 اتش (CT200h)", keywords: ["ct200h", "ct 200h", "ct"] },
    { brand: "lexus", model: "إي إس (ES)", keywords: ["es300", "es350", "es 300", "es300h"] },
    { brand: "lexus", model: "آر إكس (RX)", keywords: ["rx450", "rx350", "rx 450", "rx450h"] },

    { brand: "tesla", model: "موديل 3 (Model 3)", keywords: ["model 3", "موديل 3"] },
    { brand: "tesla", model: "موديل واي (Model Y)", keywords: ["model y", "موديل واي"] },

    { brand: "byd", model: "سونغ (Song)", keywords: ["song", "سونغ", "سونج"] },
    { brand: "byd", model: "هان (Han)", keywords: ["han", "هان"] },

    { brand: "volkswagen", model: "آي دي 4 (ID.4)", keywords: ["id4", "id.4"] },
    { brand: "volkswagen", model: "آي دي 6 (ID.6)", keywords: ["id6", "id.6"] },
    { brand: "volkswagen", model: "آي دي 3 (ID.3)", keywords: ["id3", "id.3"] },
    { brand: "volkswagen", model: "إي جولف (e-Golf)", keywords: ["جولف", "golf", "اي جولف"] }
  ];

  // Helper to detect brand and model from product title
  const detectCarDetails = (title: string = "") => {
    const lowerTitle = title.toLowerCase();
    let brand = "all";
    let brandText = "جميع الماركات";
    let model = "جميع الموديلات";
    let year = "all";

    // 1. Detect Brand
    for (const b of CAR_BRANDS) {
      const matches = b.keywords.some(kw => lowerTitle.includes(kw));
      if (matches) {
        brand = b.id;
        brandText = b.nameAr;
        break;
      }
    }

    // 2. Detect Model
    for (const m of CAR_MODELS) {
      // Allow cross-detecting brand from model even if brand keyword wasn't explicit
      const matches = m.keywords.some(kw => lowerTitle.includes(kw));
      if (matches) {
        model = m.model;
        if (brand === "all") {
          brand = m.brand;
          const associatedBrand = CAR_BRANDS.find(b => b.id === m.brand);
          if (associatedBrand) {
            brandText = associatedBrand.nameAr;
          }
        }
        break;
      }
    }

    // 3. Extract Year Range (e.g. 2016-2022 or 2018)
    const yearRegex = /\b(20\d{2})[-/](20\d{2})\b/;
    const yearMatch = yearRegex.exec(title);
    if (yearMatch) {
      year = `${yearMatch[1]}-${yearMatch[2]}`;
    } else {
      const singleYearRegex = /\b(20\d{2})\b/;
      const singleYearMatch = singleYearRegex.exec(title);
      if (singleYearMatch) {
        year = singleYearMatch[1];
      }
    }

    // Check used vs new
    let condition = "new";
    let conditionText = "جديد";
    if (lowerTitle.includes("مستعمل") || lowerTitle.includes("فحص") || lowerTitle.includes("نظيف")) {
      condition = "used";
      conditionText = "مستعمل نظيف";
    }

    return { brand, brandText, model, year, condition, conditionText };
  };

  // Main file processing logic
  const processFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) return;

        let rawRows: any[][] = [];
        const isCSV = file.name.toLowerCase().endsWith(".csv");

        if (isCSV) {
          const encodings = ["utf-8", "windows-1256", "utf-16le", "windows-1252"];
          let bestText = "";
          let maxArabicCount = -1;

          for (const encoding of encodings) {
            try {
              const decoder = new TextDecoder(encoding);
              const decodedText = decoder.decode(new Uint8Array(data as ArrayBuffer));
              
              // Count Arabic characters in Unicode range
              const arabicMatch = decodedText.match(/[\u0600-\u06FF]/g);
              const arabicCount = arabicMatch ? arabicMatch.length : 0;
              
              if (arabicCount > maxArabicCount) {
                maxArabicCount = arabicCount;
                bestText = decodedText;
              }
            } catch (err) {
              console.warn(`Failed decoding with ${encoding}:`, err);
            }
          }
          
          console.log(`Auto-selected CSV encoding with ${maxArabicCount} Arabic characters.`);
          rawRows = parseCSV(bestText);
        } else {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        }

        if (rawRows.length === 0) {
          showToast("الملف المرفوع فارغ ولا يحتوي على أي بيانات.", "error");
          return;
        }

        let colIndices = {
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

        const mappedProducts: any[] = [];

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
            const hasNumbers = /d+/.test(text);

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
              const rangeMatch = text.match(/(20\d{2})\s*[-/]\s*(20\d{2})/);
              if (rangeMatch) {
                currentYear = `${rangeMatch[1]}-${rangeMatch[2]}`;
              } else {
                const shortRangeMatch = text.match(/\b(\d{2})\s*[-/ ]\s*(\d{2})\b/);
                if (shortRangeMatch) {
                  const y1 = parseInt(shortRangeMatch[1]);
                  const y2 = parseInt(shortRangeMatch[2]);
                  currentYear = `20${y1 < 10 ? '0' + y1 : y1}-20${y2 < 10 ? '0' + y2 : y2}`;
                } else {
                  const singleMatch = text.match(/\b(20\d{2})\b/);
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
          const originalPrice = parseFloat(String(origPriceRaw).replace(/[^d.]/g, "")) || 0;

          const priceRaw = colIndices.price2 !== -1 ? row[colIndices.price2] : "";
          let price = parseFloat(String(priceRaw || "").replace(/[^d.]/g, "")) || 0;

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
            description: `قطعة غيار أصلية متوافقة مع سيارات ${finalBrand === "all" ? "مختلف الأنواع" : finalBrand.toUpperCase()} ${finalModel === "all" ? "" : finalModel}، خاضعة لفحص الجودة وكفالة تشغيل حقيقية من مركز الجارحي.`,
            featured: mappedProducts.length < 8,
            bestSeller: false,
            newArrival
          });
        });

        // Filter out items that have completely empty names
        const validProducts = mappedProducts.filter(p => p.name && p.name.trim() !== "");

        if (validProducts.length === 0) {
          showToast("لم يتم العثور على منتجات صالحة في الملف المرفوع.", "error");
          return;
        }

        setParsedData(validProducts);
        
        // Calculate statistics
        const categoriesFound = new Set(validProducts.map(p => p.categoryName)).size;
        const discountCount = validProducts.filter(p => p.originalPrice).length;

        setStats({
          total: validProducts.length,
          categories: categoriesFound,
          withDiscount: discountCount,
        });

        showToast(`تم تحليل الملف بنجاح! تم العثور على ${validProducts.length} منتج.`, "success");
      } catch (err) {
        console.error(err);
        showToast("حدث خطأ أثناء قراءة وتحليل ملف الإكسيل. تأكد من توافق البيانات.", "error");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Drop event handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Save parsed items to storage and context
  const handleSave = () => {
    if (parsedData.length === 0) return;
    importProducts(parsedData);
    showToast("تم تحديث المنتجات بنجاح وحفظها كقاعدة بيانات للموقع!", "success");
  };

  // Reset products to fallback state
  const handleReset = () => {
    if (confirm("هل أنت متأكد من رغبتك في حذف ومسح كافة المنتجات الحالية من الموقع وقاعدة البيانات نهائياً؟")) {
      resetProducts();
      setParsedData([]);
      setFileName("");
      setStats({ total: 0, categories: 0, withDiscount: 0 });
      showToast("تم مسح كافة المنتجات من قاعدة البيانات بنجاح.", "success");
    }
  };

  // Product management action handlers
  const handleUpdateProduct = (updatedProd: any) => {
    const brandMap: Record<string, string> = {
      toyota: "تويوتا",
      kia: "كيا",
      hyundai: "هيونداي",
      ford: "فورد",
      honda: "هوندا",
      chevrolet: "شفروليه",
      lexus: "لكزس",
      tesla: "تيسلا",
      byd: "بي واي دي",
      volkswagen: "فولكس فاجن",
      nissan: "نيسان",
      mitsubishi: "ميتسوبيشي",
      mercedes: "مرسيدس",
      bmw: "بي إم دبليو",
      all: "جميع الماركات"
    };
    
    if (updatedProd.brand) {
      updatedProd.brandText = brandMap[updatedProd.brand.toLowerCase()] || updatedProd.brand;
    }

    if (updatedProd.originalPrice && Number(updatedProd.originalPrice) <= Number(updatedProd.price)) {
      updatedProd.originalPrice = undefined;
    }

    const originalProd = products.find(p => p.id === updatedProd.id);
    if (updatedProd.newArrival && (!originalProd || !originalProd.newArrival)) {
      const currentCount = products.filter(p => p.newArrival).length;
      if (currentCount >= 10) {
        showToast("خطأ: تم تجاوز الحد الأقصى لآخر العروض (10 منتجات)!", "error");
        return;
      }
    }

    const updatedProducts = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    importProducts(updatedProducts);
    
    fetch("/api/admin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProducts),
    }).catch(err => console.error("Failed to sync edited database on disk:", err));

    showToast("تم تحديث المنتج بنجاح وحفظ التغييرات!", "success");
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا المنتج نهائياً؟")) {
      const updatedProducts = products.filter(p => p.id !== productId);
      importProducts(updatedProducts);
      
      fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProducts),
      }).catch(err => console.error("Failed to sync deleted database on disk:", err));

      showToast("تم حذف المنتج بنجاح.", "success");
    }
  };

  const handleToggleNewArrival = (productId: number, checked: boolean) => {
    if (checked) {
      const currentCount = products.filter(p => p.newArrival).length;
      if (currentCount >= 10) {
        showToast("خطأ: لا يمكن اختيار أكثر من 10 منتجات لآخر العروض!", "error");
        return;
      }
    }
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return { ...p, newArrival: checked };
      }
      return p;
    });
    importProducts(updatedProducts);

    fetch("/api/admin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProducts),
    }).catch(err => console.error("Failed to sync new arrival flag on disk:", err));

    showToast(checked ? "تم إضافة المنتج لآخر العروض" : "تم إزالة المنتج من آخر العروض", "success");
  };

  const handleResetStatus = (field: "newArrival") => {
    const label = "آخر العروض";
    if (confirm(`هل أنت متأكد من رغبتك في تصفير وإلغاء جميع المنتجات من تصنيف "${label}"؟`)) {
      const updatedProducts = products.map(p => ({ ...p, [field]: false }));
      importProducts(updatedProducts);

      fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProducts),
      }).catch(err => console.error(`Failed to reset ${field} on disk:`, err));

      showToast(`تم تصفير وإلغاء تصنيف "${label}" بالكامل بنجاح.`, "success");
    }
  };

  // Dynamically extract active list of categories and brands in database
  const activeCategories = Array.from(new Set(products.map(p => p.categoryName || p.category).filter(Boolean)));
  const activeBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  const brandMap: Record<string, string> = {
    toyota: "تويوتا (Toyota)",
    kia: "كيا (Kia)",
    hyundai: "هيونداي (Hyundai)",
    ford: "فورد (Ford)",
    honda: "هوندا (Honda)",
    chevrolet: "شفروليه (Chevrolet)",
    lexus: "لكزس (Lexus)",
    tesla: "تيسلا (Tesla)",
    byd: "بي واي دي (BYD)",
    volkswagen: "فولكس فاجن (Volkswagen)",
    nissan: "نيسان (Nissan)",
    mitsubishi: "ميتسوبيشي (Mitsubishi)",
    mercedes: "مرسيدس (Mercedes)",
    bmw: "بي إم دبليو (BMW)",
    all: "كل الماركات"
  };

  const ITEMS_PER_PAGE = 15;
  const filteredManageProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(manageSearch.toLowerCase()) || 
                          (p.model && p.model.toLowerCase().includes(manageSearch.toLowerCase())) ||
                          (p.brand && p.brand.toLowerCase().includes(manageSearch.toLowerCase())) ||
                          p.id.toString().includes(manageSearch);
    const matchesCategory = manageCategory === "all" || p.category === manageCategory || p.categoryName === manageCategory;
    const matchesBrand = manageBrand === "all" || p.brand === manageBrand;
    
    let matchesStatus = true;
    if (manageStatus === "newarrivals") matchesStatus = !!p.newArrival;
    else if (manageStatus === "onsale") matchesStatus = !!(p.originalPrice && p.originalPrice > p.price);

    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  const totalManagePages = Math.ceil(filteredManageProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = filteredManageProducts.slice((managePage - 1) * ITEMS_PER_PAGE, managePage * ITEMS_PER_PAGE);

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 font-sans" dir="rtl">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-lg p-10 w-full max-w-sm flex flex-col gap-6 text-right">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#2d7a1f]/10 rounded-2xl flex items-center justify-center">
              <Database size={26} className="text-[#2d7a1f]" />
            </div>
            <h1 className="text-base font-black text-slate-900">لوحة إدارة الجارحي</h1>
            <p className="text-xs font-bold text-slate-400 text-center">أدخل كلمة المرور للوصول إلى لوحة التحكم</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={passInput}
              onChange={e => { setPassInput(e.target.value); setPassError(false); }}
              placeholder="كلمة المرور"
              autoFocus
              className={`w-full border ${
                passError ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"
              } focus:border-[#2d7a1f] outline-none rounded-xl py-3 px-4 text-sm font-bold text-slate-800 text-right font-sans transition-colors`}
            />
            {passError && (
              <p className="text-xs font-black text-red-500 flex items-center gap-1">
                <AlertCircle size={12} /> كلمة المرور غير صحيحة
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-sm py-3 rounded-xl transition-all shadow-md shadow-[#2d7a1f]/20 border-0 cursor-pointer"
            >
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Panel */}
      <header className="bg-white border-b border-slate-200 py-5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-brand-green border border-slate-200 hover:border-brand-green/20 px-3 py-1.5 rounded-lg transition-all"
            >
              <ArrowRight size={14} />
              <span>العودة للموقع</span>
            </Link>
            <h1 className="text-lg font-black text-slate-900">لوحة الإدارة والمخازن</h1>
          </div>
          <div className="flex items-center gap-2">
            <Database size={18} className="text-brand-green" />
            <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-md">
              قاعدة البيانات النشطة: {products.length} منتج
            </span>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[73px] z-20 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
          <button
            onClick={() => switchTab("import")}
            className={`py-4 border-b-2 font-black text-xs transition-all flex items-center gap-2 cursor-pointer bg-transparent outline-none ${
              activeTab === "import"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Upload size={14} />
            <span>استيراد المنتجات (CSV / Excel)</span>
          </button>
          
          <button
            onClick={() => switchTab("manage")}
            className={`py-4 border-b-2 font-black text-xs transition-all flex items-center gap-2 cursor-pointer bg-transparent outline-none ${
              activeTab === "manage"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Database size={14} />
            <span>إدارة وتعديل المنتجات المضافة ({products.length})</span>
          </button>

          <button
            onClick={() => switchTab("careers")}
            className={`py-4 border-b-2 font-black text-xs transition-all flex items-center gap-2 cursor-pointer bg-transparent outline-none ${
              activeTab === "careers"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Briefcase size={14} />
            <span>إعلانات الوظائف</span>
          </button>

          <button
            onClick={() => switchTab("categories")}
            className={`py-4 border-b-2 font-black text-xs transition-all flex items-center gap-2 cursor-pointer bg-transparent outline-none ${
              activeTab === "categories"
                ? "border-brand-green text-brand-green"
                : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            <Layers size={14} />
            <span>إدارة صور الأقسام</span>
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col gap-8 animate-fade-in">
        
        {activeTab === "import" ? (
          <>
            {/* Upload Zone */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-4 transition-all bg-white shadow-xs cursor-pointer min-h-[300px] ${
                    dragActive 
                      ? "border-brand-green bg-brand-green/5" 
                      : "border-slate-300 hover:border-brand-green/50"
                  }`}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleChange}
                  />
                  
                  <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-2">
                    <Upload size={32} />
                  </div>
                  
                  <h3 className="text-base font-black text-slate-800">اسحب شيت الإكسيل هنا أو اضغط للاختيار</h3>
                  <p className="text-slate-400 text-xs font-medium max-w-sm">
                    يدعم صيغ Excel (.xlsx, .xls) وصيغة CSV المباشرة. يتم تصنيف السيارات والأسعار بذكاء اصطناعي فوري.
                  </p>

                  {fileName && (
                    <div className="mt-4 flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-700 border border-slate-200">
                      <FileText size={16} className="text-brand-green" />
                      <span>الملف النشط: {fileName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats & Actions Sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
                  <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">إحصائيات الملف المرفوع</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Database size={16} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-600">إجمالي المنتجات</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 font-en">{stats.total}</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-600">التصنيفات المكتشفة</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 font-en">{stats.categories}</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Percent size={16} className="text-slate-500" />
                        <span className="text-xs font-bold text-slate-600">منتجات خاضعة لخصم</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 font-en">{stats.withDiscount}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 mt-2">
                    <button
                      onClick={handleSave}
                      disabled={parsedData.length === 0}
                      className={`w-full py-4 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border-0 ${
                        parsedData.length > 0 
                          ? "bg-[#2d7a1f] hover:bg-[#246118] text-white shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <Check size={18} />
                      <span>اعتماد وحفظ البيانات للموقع</span>
                    </button>

                    <button
                      onClick={handleReset}
                      className="w-full py-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Trash2 size={16} />
                      <span>مسح جميع المنتجات وقاعدة البيانات</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Grid */}
            {parsedData.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900">معاينة المنتجات المستوردة قبل الحفظ ({parsedData.length} منتج)</h3>
                  <span className="text-slate-400 text-xs font-bold">يرجى التأكد من صحة الصور والأسعار أدناه</span>
                </div>

                <div className="overflow-x-auto max-h-[500px]">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-black">
                        <th className="pb-3 pl-4">الصورة</th>
                        <th className="pb-3 px-4">اسم المنتج</th>
                        <th className="pb-3 px-4">التصنيف</th>
                        <th className="pb-3 px-4">السيارة والموديل</th>
                        <th className="pb-3 px-4">السعر الأصلي</th>
                        <th className="pb-3 pr-4">سعر البيع</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedData.map((prod, index) => {
                        const discount = prod.originalPrice 
                          ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                          : 0;

                        return (
                          <tr key={index} className="text-xs text-slate-700 font-medium">
                            <td className="py-3 pl-4">
                              <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center overflow-hidden">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/assets/images/placeholder-product.png";
                                  }}
                                />
                              </div>
                            </td>
                            <td className="py-3 px-4 max-w-[300px]">
                              <span className="font-black text-slate-800 block mb-0.5">{prod.name}</span>
                              <span className="text-[0.65rem] text-slate-400 font-bold block">{prod.conditionText}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-black">
                                {prod.categoryName || prod.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 uppercase font-en text-[0.68rem] font-bold">
                              {prod.brand} {prod.model} ({prod.year})
                            </td>
                            <td className="py-3 px-4 font-en font-black text-slate-400 line-through">
                              {prod.originalPrice ? `${prod.originalPrice} د.أ` : "-"}
                            </td>
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-1.5">
                                <span className="font-en font-black text-slate-900">{prod.price} د.أ</span>
                                {discount > 0 && (
                                  <span className="bg-red-500 text-white font-en text-[0.6rem] font-black px-1.5 py-0.5 rounded-sm">
                                    {discount}% خصم
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : activeTab === "careers" ? (
          /* Tab 3: Careers / Jobs Management */
          <div className="flex flex-col gap-8" dir="rtl">

            {/* ─────────── Add New Job Form ─────────── */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Plus size={16} className="text-brand-green" />
                  <span>إنشاء إعلان وظيفي جديد</span>
                </h2>
                <p className="text-slate-400 text-xs font-bold mt-1">أدخل تفاصيل الوظيفة وارفع صورة الإعلان ثم اضغط نشر</p>
              </div>

              <form onSubmit={handleAddJob} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Job Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <Briefcase size={12} className="text-brand-green" />
                    المسمى الوظيفي *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJobTitle}
                    onChange={e => setNewJobTitle(e.target.value)}
                    placeholder="مثال: فني صيانة هايبرد"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 text-right font-sans transition-colors"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <MapPin size={12} className="text-red-400" />
                    موقع العمل *
                  </label>
                  <input
                    type="text"
                    required
                    value={newJobLocation}
                    onChange={e => setNewJobLocation(e.target.value)}
                    placeholder="مثال: عمان، البيادر"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 text-right font-sans transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-black text-slate-700">وصف الوظيفة *</label>
                  <textarea
                    required
                    rows={4}
                    value={newJobDesc}
                    onChange={e => setNewJobDesc(e.target.value)}
                    placeholder="اكتب وصفاً تفصيلياً للوظيفة، المهام، والمسؤوليات..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 text-right font-sans resize-none transition-colors"
                  />
                </div>

                {/* Requirements */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-black text-slate-700">المتطلبات والشروط <span className="text-slate-400 font-medium">(اختياري)</span></label>
                  <textarea
                    rows={3}
                    value={newJobReqs}
                    onChange={e => setNewJobReqs(e.target.value)}
                    placeholder="مثال: خبرة 2-3 سنوات، شهادة فنية، معرفة بأنظمة OBD..."
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2.5 px-3 text-xs font-bold text-slate-800 text-right font-sans resize-none transition-colors"
                  />
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs font-black text-slate-700">صورة الإعلان <span className="text-slate-400 font-medium">(اختياري)</span></label>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="job-image-upload"
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed text-xs font-black cursor-pointer transition-all ${
                        isUploadingJobImage
                          ? "border-slate-300 text-slate-400 bg-slate-50"
                          : "border-brand-green/40 text-brand-green bg-brand-green/5 hover:bg-brand-green/10"
                      }`}
                    >
                      {isUploadingJobImage ? (
                        <><Loader2 size={14} className="animate-spin" /><span>جاري الرفع...</span></>
                      ) : (
                        <><ArrowDownToLine size={14} /><span>رفع صورة</span></>
                      )}
                      <input
                        id="job-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleJobImageUpload}
                        disabled={isUploadingJobImage}
                      />
                    </label>
                    {newJobImage && (
                      <div className="flex items-center gap-2">
                        <img
                          src={newJobImage}
                          alt="معاينة"
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => setNewJobImage("")}
                          className="text-red-500 hover:text-red-700 bg-red-50 border border-red-100 rounded-lg p-1.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {!newJobImage && !isUploadingJobImage && (
                      <span className="text-xs text-slate-400 font-bold">لم يتم اختيار صورة</span>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="md:col-span-2 flex items-center gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    className="bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-xs px-8 py-3 rounded-xl transition-all shadow-md shadow-[#2d7a1f]/20 hover:-translate-y-0.5 flex items-center gap-2 border-0 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>نشر الإعلان الوظيفي</span>
                  </button>
                  <span className="text-xs text-slate-400 font-bold">سيظهر الإعلان فوراً في صفحة الوظائف بالموقع</span>
                </div>
              </form>
            </div>

            {/* ─────────── Active Jobs List ─────────── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <Layers size={15} className="text-brand-green" />
                  <span>الإعلانات المنشورة حالياً</span>
                  {!careersLoading && (
                    <span className="bg-slate-100 text-slate-500 text-[0.65rem] font-black px-2 py-0.5 rounded-full font-en">
                      {careersList.length}
                    </span>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={loadCareers}
                  disabled={careersLoading}
                  className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-brand-green border border-slate-200 hover:border-brand-green/30 px-3 py-1.5 rounded-lg transition-all bg-white cursor-pointer"
                >
                  {careersLoading ? <Loader2 size={12} className="animate-spin" /> : <ArrowDownToLine size={12} />}
                  <span>تحديث</span>
                </button>
              </div>

              {/* Loading */}
              {careersLoading && (
                <div className="flex items-center justify-center py-16 gap-3">
                  <Loader2 className="animate-spin text-brand-green" size={28} />
                  <span className="text-xs font-black text-slate-400">جاري تحميل الإعلانات...</span>
                </div>
              )}

              {/* Empty */}
              {!careersLoading && careersList.length === 0 && (
                <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-14 flex flex-col items-center justify-center gap-3 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <Briefcase size={22} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-black text-slate-500">لا توجد إعلانات وظيفية منشورة بعد</p>
                  <p className="text-[0.65rem] text-slate-400 font-bold">استخدم النموذج أعلاه لإضافة أول إعلان</p>
                </div>
              )}

              {/* Jobs Grid */}
              {!careersLoading && careersList.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {careersList.map(job => (
                    <div
                      key={job.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col group"
                    >
                      {/* Image */}
                      {job.image ? (
                        <div className="w-full h-40 bg-slate-50 overflow-hidden border-b border-slate-100">
                          <img
                            src={job.image}
                            alt={job.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-24 bg-gradient-to-br from-brand-green/10 to-emerald-50 border-b border-slate-100 flex items-center justify-center">
                          <Briefcase size={28} className="text-brand-green/40" />
                        </div>
                      )}

                      {/* Body */}
                      <div className="p-4 flex-grow flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2 text-[0.62rem] font-black">
                          <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500">
                            <MapPin size={10} className="text-red-400" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg text-slate-500">
                            <Calendar size={10} />
                            {new Date(job.created_at).toLocaleDateString("ar-JO")}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-slate-800 group-hover:text-brand-green transition-colors">
                          {job.title}
                        </h4>

                        <p className="text-[0.7rem] text-slate-500 font-bold leading-relaxed line-clamp-3">
                          {job.description}
                        </p>

                        {job.requirements && (
                          <div className="mt-1 bg-slate-50 border border-slate-100 rounded-xl p-3">
                            <span className="text-[0.65rem] font-black text-slate-600 block mb-1">المتطلبات:</span>
                            <p className="text-[0.62rem] text-slate-500 font-bold leading-relaxed whitespace-pre-line line-clamp-3">
                              {job.requirements}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-100 hover:border-red-200 text-red-600 text-xs font-black transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>حذف الإعلان</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : activeTab === "categories" ? (
          /* Tab 4: Manage Category, Brand, and Model Images */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col gap-6" dir="rtl">
            <div className="border-b border-slate-100 pb-5">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Layers size={16} className="text-brand-green" />
                <span>إدارة صور السيارات والأقسام</span>
              </h3>
              <p className="text-slate-400 text-xs font-bold mt-1">تخصيص صور تعبيرية للماركات، موديلات السيارات، وأقسام قطع الغيار لعرضها في المتجر</p>
            </div>

            {/* Sub Tabs Selection */}
            <div className="flex gap-2 border-b border-slate-100 pb-1">
              <button
                type="button"
                onClick={() => setImagesSubTab("categories")}
                className={`px-4 py-2 border-b-2 font-black text-xs transition-all cursor-pointer bg-transparent outline-none ${
                  imagesSubTab === "categories"
                    ? "border-brand-green text-brand-green"
                    : "border-transparent text-slate-400 hover:text-slate-650"
                }`}
              >
                صور الأقسام ({Array.from(new Set(products.map(p => p.categoryName || p.category).filter(Boolean))).length})
              </button>
              <button
                type="button"
                onClick={() => setImagesSubTab("brands")}
                className={`px-4 py-2 border-b-2 font-black text-xs transition-all cursor-pointer bg-transparent outline-none ${
                  imagesSubTab === "brands"
                    ? "border-brand-green text-brand-green"
                    : "border-transparent text-slate-400 hover:text-slate-650"
                }`}
              >
                شعارات الماركات ({Array.from(new Set(products.map(p => p.brand).filter(Boolean))).length})
              </button>
              <button
                type="button"
                onClick={() => setImagesSubTab("models")}
                className={`px-4 py-2 border-b-2 font-black text-xs transition-all cursor-pointer bg-transparent outline-none ${
                  imagesSubTab === "models"
                    ? "border-brand-green text-brand-green"
                    : "border-transparent text-slate-400 hover:text-slate-650"
                }`}
              >
                صور الموديلات ({(() => { const seen = new Set(); products.forEach(p => { if (p.model && p.year) seen.add(p.model.trim().toLowerCase() + "_" + p.year.trim().toLowerCase()); }); return seen.size; })()})
              </button>
            </div>

            {/* Sub Tab Contents */}
            {imagesSubTab === "categories" && (
              <div className="flex flex-col gap-6">
                {(() => {
                  const uniqueCategories = Array.from(new Set(products.map(p => p.categoryName || p.category).filter(Boolean)));
                  if (uniqueCategories.length === 0) {
                    return <div className="text-center py-10 text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">لا توجد أقسام مسجلة بالموقع حالياً.</div>;
                  }
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {uniqueCategories.map(catName => {
                        const currentVal = tempCategoryImages[catName] !== undefined ? tempCategoryImages[catName] : (categorySettings[catName] || "");
                        return (
                          <div key={catName} className="flex flex-col gap-1.5 p-4 border border-slate-100 rounded-2xl bg-slate-50/50 text-right">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-800">{catName}</span>
                              {currentVal && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">معرّف</span>}
                            </div>
                            <div className="flex gap-2 mt-1">
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => handleCategoryImgChange(catName, e.target.value)}
                                placeholder="أدخل رابط صورة القسم (مثال: https://...)"
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-green focus:outline-none text-xs font-en"
                              />
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                {currentVal ? <img src={currentVal} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/assets/images/placeholder-product.png"; }} /> : <Layers size={14} className="text-slate-400" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {imagesSubTab === "brands" && (
              <div className="flex flex-col gap-6">
                {(() => {
                  const uniqueBrands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
                  if (uniqueBrands.length === 0) {
                    return <div className="text-center py-10 text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">لا توجد ماركات مسجلة بالموقع حالياً.</div>;
                  }
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {uniqueBrands.map(brandName => {
                        const key = brandName.toLowerCase();
                        const currentVal = tempBrandLogos[key] !== undefined ? tempBrandLogos[key] : (brandSettings[key] || "");
                        return (
                          <div key={brandName} className="flex flex-col gap-1.5 p-4 border border-slate-100 rounded-2xl bg-slate-50/50 text-right">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-800 font-en uppercase">{brandName}</span>
                              {currentVal && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">معرّف</span>}
                            </div>
                            <div className="flex gap-2 mt-1">
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => handleBrandLogoChange(brandName, e.target.value)}
                                placeholder="أدخل رابط شعار الماركة (مثال: https://...)"
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-green focus:outline-none text-xs font-en"
                              />
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                {currentVal ? <img src={currentVal} alt="Preview" className="w-full h-full object-contain p-1" onError={(e) => { e.currentTarget.src = "/assets/images/placeholder-product.png"; }} /> : <Layers size={14} className="text-slate-400" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {imagesSubTab === "models" && (
              <div className="flex flex-col gap-6">
                {(() => {
                  const uniqueModelCombos: { model: string; year: string }[] = [];
                  const seenCombos = new Set<string>();
                  products.forEach(p => {
                    if (p.model && p.year) {
                      const key = `${p.model.trim().toLowerCase()}_${p.year.trim().toLowerCase()}`;
                      if (!seenCombos.has(key)) {
                        seenCombos.add(key);
                        uniqueModelCombos.push({
                          model: p.model.trim(),
                          year: p.year.trim()
                        });
                      }
                    }
                  });
                  uniqueModelCombos.sort((a, b) => a.model.localeCompare(b.model) || a.year.localeCompare(b.year));

                  if (uniqueModelCombos.length === 0) {
                    return <div className="text-center py-10 text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">لا توجد موديلات مسجلة بالموقع حالياً.</div>;
                  }
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {uniqueModelCombos.map(combo => {
                        const comboKey = `${combo.model.toLowerCase()}_${combo.year.toLowerCase()}`;
                        const label = `${combo.model} (${combo.year})`;
                        const currentVal = tempModelImages[comboKey] !== undefined ? tempModelImages[comboKey] : (modelSettings[comboKey] || "");
                        return (
                          <div key={comboKey} className="flex flex-col gap-1.5 p-4 border border-slate-100 rounded-2xl bg-slate-50/50 text-right">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-800">{label}</span>
                              {currentVal && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">معرّف</span>}
                            </div>
                            <div className="flex gap-2 mt-1">
                              <input
                                type="text"
                                value={currentVal}
                                onChange={(e) => handleModelImageChange(comboKey, e.target.value)}
                                placeholder="أدخل رابط صورة الموديل (مثال: https://...)"
                                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:border-brand-green focus:outline-none text-xs font-en"
                              />
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                {currentVal ? <img src={currentVal} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/assets/images/placeholder-product.png"; }} /> : <Layers size={14} className="text-slate-400" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleSaveAllImages}
                disabled={isSavingCategoryImages}
                className="bg-[#2d7a1f] hover:bg-[#246118] disabled:opacity-50 text-white font-black text-xs px-8 py-3.5 rounded-xl border-0 cursor-pointer transition-all shadow-md shadow-[#2d7a1f]/10 flex items-center gap-2"
              >
                {isSavingCategoryImages ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <span>حفظ التعديلات</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Tab 2: Manage Products Catalog */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex flex-col gap-1 text-right">
                <h3 className="text-sm font-black text-slate-900">إدارة وتعديل المنتجات المضافة</h3>
                <p className="text-slate-400 text-xs font-bold">ابحث، عدّل الأسعار، تحكّم بالخصومات، أو حدد منتجات مختارة وآخر العروض للصفحة الرئيسية</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="بحث بالاسم أو الكود..."
                    value={manageSearch}
                    onChange={(e) => { setManageSearch(e.target.value); setManagePage(1); }}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold text-slate-800 text-right font-sans"
                  />
                  <Search size={14} className="absolute top-1/2 right-3.5 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Category Filter */}
                <select
                  value={manageCategory}
                  onChange={(e) => { setManageCategory(e.target.value); setManagePage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer text-right appearance-none font-sans"
                >
                  <option value="all">كل الأقسام</option>
                  {activeCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                {/* Brand Filter */}
                <select
                  value={manageBrand}
                  onChange={(e) => { setManageBrand(e.target.value); setManagePage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer text-right appearance-none font-sans"
                >
                  <option value="all">كل الماركات</option>
                  {activeBrands.map(b => (
                    <option key={b} value={b}>{brandMap[b.toLowerCase()] || b.toUpperCase()}</option>
                  ))}
                </select>

                {/* Display Status Filter */}
                <select
                  value={manageStatus}
                  onChange={(e) => { setManageStatus(e.target.value); setManagePage(1); }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer text-right appearance-none font-sans"
                >
                  <option value="all">جميع الحالات</option>
                  <option value="newarrivals">آخر العروض</option>
                  <option value="onsale">القطع الخاضعة لخصم</option>
                </select>
              </div>
            </div>

            {/* Reset Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-rose-50/50 border border-rose-100/60 rounded-2xl p-4">
              <span className="text-[0.7rem] font-bold text-rose-800 text-right">
                إجراءات سريعة لتصفير تصنيفات الصفحة الرئيسية (الأقصى 10 قطع):
              </span>
              <div className="flex flex-wrap gap-2.5 justify-end">
                <button
                  onClick={() => handleResetStatus("newArrival")}
                  className="bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 font-black text-[0.68rem] px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  تصفير آخر العروض ({products.filter(p => p.newArrival).length}/10)
                </button>
              </div>
            </div>

            {/* Products Table */}
            {paginatedProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs font-black">
                      <th className="pb-3 pl-4">الصورة</th>
                      <th className="pb-3 px-4">اسم المنتج</th>
                      <th className="pb-3 px-4">التصنيف</th>
                      <th className="pb-3 px-4">الماركة / الموديل</th>
                      <th className="pb-3 px-4">الأسعار والخصم</th>
                      <th className="pb-3 px-4 text-center">آخر العروض ({products.filter(p => p.newArrival).length}/10)</th>
                      <th className="pb-3 pr-4 text-center">خيارات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedProducts.map((prod) => {
                      const discount = prod.originalPrice 
                        ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                        : 0;

                      return (
                        <tr key={prod.id} className="text-xs text-slate-700 font-medium hover:bg-slate-50/50">
                          <td className="py-3.5 pl-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 p-1 flex items-center justify-center overflow-hidden">
                              <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/assets/images/placeholder-product.png";
                                  }}
                                />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-[280px]">
                            <span className="font-black text-slate-800 block mb-0.5">{prod.name}</span>
                            <span className="text-[0.65rem] text-slate-400 font-bold block uppercase font-en">كود: #{prod.id}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-black">
                              {prod.categoryName || prod.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 uppercase font-en text-[0.68rem] font-bold">
                            {prod.brand} {prod.model} ({prod.year})
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-en font-black text-slate-900">{prod.price} د.أ</span>
                                {discount > 0 && (
                                  <span className="bg-red-500 text-white font-en text-[0.6rem] font-black px-1.5 py-0.5 rounded-sm">
                                    {discount}% خصم
                                  </span>
                                )}
                              </div>
                              {prod.originalPrice && (
                                <span className="text-[0.65rem] text-slate-400 line-through font-en font-bold">السعر الأصلي: {prod.originalPrice} - خصم {prod.originalPrice - prod.price} د.أ</span>
                              )}
                            </div>
                          </td>

                          {/* New Arrival Checkbox */}
                          <td className="py-3.5 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={!!prod.newArrival}
                              onChange={(e) => handleToggleNewArrival(prod.id, e.target.checked)}
                              className="w-4.5 h-4.5 accent-brand-green cursor-pointer"
                            />
                          </td>
                          {/* Actions */}
                          <td className="py-3.5 pr-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setEditingProduct({ ...prod })}
                                className="p-1.5 rounded-lg border border-slate-200 hover:border-brand-green/30 text-slate-500 hover:text-brand-green transition-all bg-white cursor-pointer"
                                title="تعديل المنتج"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 rounded-lg border border-red-100 hover:border-red-200 text-slate-400 hover:text-red-600 transition-all bg-white cursor-pointer"
                                title="حذف المنتج"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                لم يتم العثور على منتجات مطابقة لمعايير التصفية.
              </div>
            )}

            {/* Pagination */}
            {totalManagePages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                <button
                  onClick={() => setManagePage(p => Math.max(1, p - 1))}
                  disabled={managePage === 1}
                  className="flex items-center gap-1 text-xs font-black text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors border-0 cursor-pointer"
                >
                  <ChevronRight size={14} />
                  <span>السابق</span>
                </button>
                
                <span className="text-xs font-black text-slate-500">
                  الصفحة <span className="text-slate-800 font-en">{managePage}</span> من <span className="text-slate-800 font-en">{totalManagePages}</span>
                </span>

                <button
                  onClick={() => setManagePage(p => Math.min(totalManagePages, p + 1))}
                  disabled={managePage === totalManagePages}
                  className="flex items-center gap-1 text-xs font-black text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors border-0 cursor-pointer"
                >
                  <span>التالي</span>
                  <ChevronLeft size={14} />
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Product Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden text-right border border-slate-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-1 rounded-full hover:bg-slate-200/50 transition-all flex items-center justify-center w-8 h-8"
              >
                <X size={18} />
              </button>
              <h3 className="text-sm font-black text-slate-950 flex items-center gap-2">
                <Edit size={16} className="text-brand-green" />
                <span>تعديل تفاصيل المنتج</span>
              </h3>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-black text-slate-700">اسم المنتج</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right font-sans"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">التصنيف</label>
                <input
                  type="text"
                  value={editingProduct.categoryName || editingProduct.category}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    categoryName: e.target.value,
                    category: e.target.value
                  })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right font-sans"
                  placeholder="مثال: بريكات، بواجي..."
                />
              </div>

              {/* Brand Select */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">ماركة السيارة</label>
                <select
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right cursor-pointer font-sans"
                >
                  <option value="toyota">تويوتا (Toyota)</option>
                  <option value="kia">كيا (Kia)</option>
                  <option value="hyundai">هيونداي (Hyundai)</option>
                  <option value="ford">فورد (Ford)</option>
                  <option value="honda">هوندا (Honda)</option>
                  <option value="chevrolet">شفروليه (Chevrolet)</option>
                  <option value="lexus">لكزس (Lexus)</option>
                  <option value="tesla">تيسلا (Tesla)</option>
                  <option value="byd">بي واي دي (BYD)</option>
                  <option value="volkswagen">فولكس فاجن (Volkswagen)</option>
                  <option value="nissan">نيسان (Nissan)</option>
                  <option value="mitsubishi">ميتسوبيشي (Mitsubishi)</option>
                  <option value="mercedes">مرسيدس (Mercedes)</option>
                  <option value="bmw">بي إم دبليو (BMW)</option>
                  <option value="all">أخرى / جميع السيارات</option>
                </select>
              </div>

              {/* Model */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">الموديل</label>
                <input
                  type="text"
                  value={editingProduct.model}
                  onChange={(e) => setEditingProduct({ ...editingProduct, model: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right font-sans"
                />
              </div>

              {/* Year */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">سنة الصنع</label>
                <input
                  type="text"
                  value={editingProduct.year}
                  onChange={(e) => setEditingProduct({ ...editingProduct, year: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right font-sans"
                  placeholder="مثال: 2012-2018"
                />
              </div>

              {/* Sale Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">سعر البيع (د.أ)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right font-sans"
                />
              </div>

              {/* Original Price */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">السعر الأصلي (د.أ - للخصم)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.originalPrice || ""}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    originalPrice: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right font-sans"
                  placeholder="اتركه فارغاً لإلغاء الخصم"
                />
              </div>

              {/* Condition */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">الحالة</label>
                <select
                  value={editingProduct.condition}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    condition: e.target.value,
                    conditionText: e.target.value === "new" ? "جديد" : "مستعمل نظيف"
                  })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right cursor-pointer font-sans"
                >
                  <option value="new">جديد (New)</option>
                  <option value="used">مستعمل نظيف (Used)</option>
                </select>
              </div>

              {/* Image URL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black text-slate-700">رابط صورة المنتج</label>
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right font-sans"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-xs font-black text-slate-700">وصف المنتج</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-brand-green outline-none rounded-xl py-2 px-3 text-xs font-bold text-slate-800 text-right font-sans resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-start gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
              <button
                onClick={() => handleUpdateProduct(editingProduct)}
                className="bg-[#2d7a1f] hover:bg-[#246118] text-white font-black text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-[#2d7a1f]/10 border-0"
              >
                حفظ التغييرات
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-black text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
