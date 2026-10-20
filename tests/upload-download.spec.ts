import ExcelJS from 'exceljs';
import { test, expect } from '@playwright/test';

function readExcelFile(worksheet: any, searchValue: any) {
    const output = {
        row: -1,
        column: -1,
    };
    worksheet.eachRow((row: any, rowNumber: any) => {
        row.eachCell((cell: any, colNumber: any) => {
            if (cell.value === searchValue) {
                output.row = rowNumber;
                output.column = colNumber;
            }
        });
    });
    return output;
}



async function updateCellValue(searchValue: any, newValue: any, change: any, filePath: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet: any = workbook.getWorksheet('Sheet1');
    const output = readExcelFile(worksheet, searchValue);

    // Update the value of a specific cell (e.g., A1)
    const cell = worksheet.getCell(output.row + (change.rowChange || 0), output.column + (change.columnChange || 0));
    cell.value = newValue;

    // Save the changes to the Excel file
    await workbook.xlsx.writeFile(filePath);
    console.log('Cell value updated successfully');
}

// updateCellValue("Mango", 350, { rowChange: 0, columnChange: 2 }, "/Users/gaurav/Downloads/excelDownloadTest.xlsx");

test.skip("Upload and Download Validations", async ({ page }) => {

    const textSearch = "Mango";
    const updatedValue = 350
    await page.goto("https://rahulshettyacademy.com/upload-download-test/");
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    await downloadPromise;
    await updateCellValue(textSearch, updatedValue, { rowChange: 0, columnChange: 2 }, "/Users/gaurav/Downloads/download.xlsx");

    await page.locator("#fileinput").click()
    await page.locator("#fileinput").setInputFiles("/Users/gaurav/Downloads/download.xlsx");
    const textLocator = page.getByText(textSearch);
    const desiredRow = page.getByRole('row').filter({ has: textLocator });
    await expect(desiredRow.locator("#cell-4-undefined")).toContainText(String(updatedValue));

});
