
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { StudentData } from '../types';
import { calculateTotal, getGradeInfo, calculateAverage, getStudentTotalScore, getTotalPossibleScore } from '../utils';

export const generateExcel = async (data: StudentData) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Report Card', {
    pageSetup: { paperSize: 9, orientation: 'portrait' } // 9 is A4
  });

  // --- STYLES ---
  // Explicitly set black color for boldFont to avoid default/gray issues
  const boldFont = { name: 'Arial', bold: true, size: 10, color: { argb: 'FF000000' } };
  const headerFont = { name: 'Arial', bold: true, size: 14, color: { argb: 'FFCC0000' } }; // Red
  const subHeaderFont = { name: 'Arial', size: 9, color: { argb: 'FF000000' } };
  const tableHeaderFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } }; // Light Blue
  const grayFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } };
  
  const centerAlign: Partial<ExcelJS.Alignment> = { vertical: 'middle', horizontal: 'center' };
  const leftAlign: Partial<ExcelJS.Alignment> = { vertical: 'middle', horizontal: 'left' };
  const borderStyle: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };

  // --- HEADER ---
  sheet.mergeCells('A1:F1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'LAURASTEPHENS SCHOOL';
  titleCell.font = headerFont;
  titleCell.alignment = centerAlign;

  sheet.mergeCells('A2:F2');
  const addrCell = sheet.getCell('A2');
  addrCell.value = 'LauraStephens Road, Lekki Scheme II, Lekki-Epe Expressway, Lagos.';
  addrCell.font = subHeaderFont;
  addrCell.alignment = centerAlign;

  sheet.mergeCells('A3:F3');
  const termCell = sheet.getCell('A3');
  termCell.value = `REPORT FOR ${data.term.toUpperCase()} TERM ${data.session} SESSION`;
  termCell.font = { ...boldFont, size: 11, color: { argb: 'FF000000' } };
  termCell.alignment = centerAlign;
  termCell.fill = grayFill;
  termCell.border = { bottom: { style: 'medium' } };

  // --- STUDENT INFO ---
  sheet.addRow([]); // Spacer
  
  const addInfoRow = (label1: string, val1: string, label2: string, val2: string) => {
    const row = sheet.addRow([label1, val1, '', label2, val2, '']);
    row.getCell(1).font = boldFont;
    row.getCell(4).font = boldFont;
    row.getCell(2).alignment = { horizontal: 'left' };
    row.getCell(5).alignment = { horizontal: 'left' };
  }
  
  addInfoRow('NAME OF PUPIL:', data.fullName, 'AGE:', data.age.toString());
  addInfoRow('CLASS:', data.className, 'SEX:', data.gender);
  addInfoRow('NUMBER ON ROLL:', data.rollNumber, 'NEXT TERM:', data.nextTermBegins);
  addInfoRow('SCHOOL OPENED:', data.schoolOpened.toString(), 'PRESENT:', data.timesPresent.toString());

  sheet.addRow([]); // Spacer

  // --- ACADEMIC TABLE ---
  const headerRow = sheet.addRow(['SUBJECT AREAS', 'CA (40)', 'EXAM (60)', 'TOTAL (100)', 'GRADE', 'REMARK']);
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.font = boldFont;
    cell.fill = tableHeaderFill;
    cell.border = borderStyle;
    cell.alignment = centerAlign;
  });
  
  // Set column widths
  sheet.getColumn(1).width = 35;
  sheet.getColumn(2).width = 10;
  sheet.getColumn(3).width = 12;
  sheet.getColumn(4).width = 14;
  sheet.getColumn(5).width = 10;
  sheet.getColumn(6).width = 20;

  // Render Subjects
  const renderSubject = (s: any) => {
    const total = calculateTotal(s.caScore, s.examScore);
    const info = getGradeInfo(total);
    // Explicitly black font for data
    const row = sheet.addRow([s.name, s.caScore || 0, s.examScore || 0, total, info.grade, info.remark]);
    row.eachCell((cell, colNumber) => {
      cell.font = { name: 'Arial', size: 10, color: { argb: 'FF000000' } };
      cell.border = borderStyle;
      cell.alignment = colNumber === 1 || colNumber === 6 ? leftAlign : centerAlign;
    });
  };

  const primeHeader = sheet.addRow(['PRIME AREAS OF LEARNING']);
  sheet.mergeCells(`A${primeHeader.number}:F${primeHeader.number}`);
  primeHeader.font = { ...boldFont, italic: true, color: { argb: 'FF000000' } };
  primeHeader.getCell(1).fill = grayFill;
  primeHeader.getCell(1).border = borderStyle;

  data.subjects.filter(s => s.category === 'Prime').forEach(renderSubject);
  
  const specHeader = sheet.addRow(['SPECIFIC AREAS OF LEARNING']);
  sheet.mergeCells(`A${specHeader.number}:F${specHeader.number}`);
  specHeader.font = { ...boldFont, italic: true, color: { argb: 'FF000000' } };
  specHeader.getCell(1).fill = grayFill;
  specHeader.getCell(1).border = borderStyle;

  data.subjects.filter(s => s.category === 'Specific').forEach(renderSubject);

  // Totals
  const studentTotal = getStudentTotalScore(data.subjects);
  const possible = getTotalPossibleScore(data.subjects);
  const avg = calculateAverage(data.subjects);
  
  const totalRow = sheet.addRow(['TOTAL SCORE:', '', '', `${studentTotal}/${possible}`, 'AVERAGE:', `${avg}%`]);
  totalRow.font = { ...boldFont, color: { argb: 'FF000000' } };
  totalRow.eachCell(cell => {
    cell.border = borderStyle;
    cell.fill = grayFill;
  });
  totalRow.getCell(1).alignment = { horizontal: 'right' };

  sheet.addRow([]);

  // --- CONDUCT ---
  const conductHeader = sheet.addRow(['CONDUCT ASSESSMENT', 'A', 'B', 'C', 'D', 'E', 'F']);
  conductHeader.font = { ...boldFont, color: { argb: 'FF000000' } }; // Explicitly black
  conductHeader.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCC0000' } } as ExcelJS.Fill; // Red background
    cell.border = borderStyle;
    cell.alignment = centerAlign;
  });

  data.conducts.forEach(c => {
    const rowData = [c.name];
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(g => {
      rowData.push(c.rating === g ? '✓' : '');
    });
    const row = sheet.addRow(rowData);
    row.getCell(1).font = { ...boldFont, color: { argb: 'FF000000' } };
    row.getCell(1).border = borderStyle;
    for(let i=2; i<=7; i++) {
        row.getCell(i).border = borderStyle;
        row.getCell(i).alignment = centerAlign;
        row.getCell(i).font = { bold: true, color: { argb: 'FF000000' } };
    }
  });

  sheet.addRow([]);

  // --- REMARKS ---
  sheet.addRow(["CLASS TEACHER'S REMARK:"]).font = boldFont;
  sheet.mergeCells(`A${sheet.rowCount}:F${sheet.rowCount}`);
  
  const trRow = sheet.addRow([data.teacherRemark]);
  sheet.mergeCells(`A${sheet.rowCount}:F${sheet.rowCount}`);
  trRow.height = 40;
  trRow.getCell(1).font = { name: 'Arial', size: 10, color: { argb: 'FF000000' } };
  trRow.getCell(1).alignment = { wrapText: true, vertical: 'top' };
  trRow.getCell(1).border = { bottom: { style: 'thin' } };

  sheet.addRow(["HEAD OF PRESCHOOL'S REMARK:"]).font = boldFont;
  sheet.mergeCells(`A${sheet.rowCount}:F${sheet.rowCount}`);
  
  const hrRow = sheet.addRow([data.headRemark]);
  sheet.mergeCells(`A${sheet.rowCount}:F${sheet.rowCount}`);
  hrRow.height = 30;
  hrRow.getCell(1).font = { name: 'Arial', size: 10, color: { argb: 'FF000000' } };
  hrRow.getCell(1).alignment = { wrapText: true, vertical: 'top' };
  hrRow.getCell(1).border = { bottom: { style: 'thin' } };

  // Generate
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${data.fullName.replace(/\s+/g, '_') || 'Student'}_Report.xlsx`);
};
