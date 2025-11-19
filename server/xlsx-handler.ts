import XLSX from 'xlsx';
import { InsertProduct } from '../drizzle/schema';

export interface XLSXProductRow {
  productName?: string;
  price?: string | number;
  color?: string;
  description?: string;
  barcode?: string;
  productImage?: string;
}

/**
 * Parse XLSX file buffer and extract product data
 */
export function parseXLSXFile(buffer: Buffer): XLSXProductRow[] {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    
    if (!sheetName) {
      throw new Error('No sheets found in XLSX file');
    }
    
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<XLSXProductRow>(worksheet);
    
    return rows;
  } catch (error) {
    throw new Error(`Failed to parse XLSX file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate and convert XLSX rows to Product objects
 */
export function validateAndConvertProducts(rows: XLSXProductRow[]): { products: InsertProduct[], errors: string[] } {
  const products: InsertProduct[] = [];
  const errors: string[] = [];
  
  rows.forEach((row, index) => {
    try {
      // Validate required fields
      if (!row.barcode || !row.barcode.toString().trim()) {
        errors.push(`Row ${index + 2}: Missing barcode (required)`);
        return;
      }
      
      if (!row.productName || !row.productName.toString().trim()) {
        errors.push(`Row ${index + 2}: Missing product name (required)`);
        return;
      }
      
      if (!row.price) {
        errors.push(`Row ${index + 2}: Missing price (required)`);
        return;
      }
      
      // Convert price to string
      const priceStr = row.price.toString().trim();
      if (isNaN(parseFloat(priceStr))) {
        errors.push(`Row ${index + 2}: Invalid price format`);
        return;
      }
      
      // Create product object
      const product: InsertProduct = {
        barcode: row.barcode.toString().trim(),
        productName: row.productName.toString().trim(),
        price: priceStr,
        color: row.color ? row.color.toString().trim() : undefined,
        description: row.description ? row.description.toString().trim() : undefined,
        imageUrl: row.productImage ? row.productImage.toString().trim() : undefined,
      };
      
      products.push(product);
    } catch (error) {
      errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
  
  return { products, errors };
}

/**
 * Create a sample XLSX template for product import
 */
export function createXLSXTemplate(): Buffer {
  const templateData = [
    {
      productName: 'Sample Product 1',
      price: '29.99',
      color: 'Red',
      description: 'This is a sample product description',
      barcode: 'BARCODE001',
      productImage: 'https://example.com/image1.jpg',
    },
    {
      productName: 'Sample Product 2',
      price: '49.99',
      color: 'Blue',
      description: 'Another sample product',
      barcode: 'BARCODE002',
      productImage: 'https://example.com/image2.jpg',
    },
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // productName
    { wch: 12 }, // price
    { wch: 15 }, // color
    { wch: 35 }, // description
    { wch: 15 }, // barcode
    { wch: 30 }, // productImage
  ];
  
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
