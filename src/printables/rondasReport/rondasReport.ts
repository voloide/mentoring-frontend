import saveAs from 'file-saver';
import * as ExcelJS from 'exceljs';
import { MOHIMAGELOG } from 'src/assets/imageBytes.ts';

let logoTitle = 'MINISTÉRIO DA SAÚDE \n DIRECÇÃO NACIONAL DE SAÚDE PÚBLICA \n ';
const title = 'Relatorio da Ronda/Ciclo de Mentoria';
const reportName = 'Rondas';
const fileName = reportName.concat('_');

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';

    // Criando uma data a partir da string
    const date = new Date(dateStr);

    // Ajustando para UTC
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // getUTCMonth() é zero-indexado
    const year = date.getUTCFullYear();

    // Formatando a data no formato pt-BR
    const res = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    return res;
};

export default {
    async processAndDownloadReport(data: any, healthFacilityName: string, startDate: any, endDate: any) {
        logoTitle = logoTitle + healthFacilityName;
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'CSAUDE';
        workbook.lastModifiedBy = 'CSAUDE';
        workbook.created = new Date();
        workbook.modified = new Date();
        workbook.lastPrinted = new Date();

        const worksheet = workbook.addWorksheet(reportName);
        const imageId = workbook.addImage({
            base64: 'data:image/png;base64,' + MOHIMAGELOG,
            extension: 'png'
        });

        // Set up static cells
        const cellRepublica = worksheet.getCell('A8');
        const cellTitle = worksheet.getCell('A9');
        const cellPeriodo = worksheet.getCell('A11');

        // Get Rows
        const headerRow = worksheet.getRow(12);

        // Alignment and Border Format
        const centerAlignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        const leftAlignment = { vertical: 'middle', horizontal: 'left', wrapText: false };
        const thinBorder = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        worksheet.getCell('A1').alignment = cellRepublica.alignment = cellTitle.alignment = headerRow.alignment = centerAlignment;
        cellPeriodo.alignment = cellPeriodo.alignment = leftAlignment;

        // Assign Value to Cells
        cellRepublica.value = logoTitle;
        cellTitle.value = title;
        cellPeriodo.value = 'Periodo da Ronda/Ciclo de Mentoria: '+formatDate(startDate)+' a '+formatDate(endDate)

        // Merge cells
        worksheet.mergeCells('A1:A7');
        worksheet.mergeCells('A9:J9');
        worksheet.mergeCells('A11:B11');

        // Set column widths
        worksheet.getColumn('A').width = 40;
        worksheet.getColumn('B').width = 20;
        worksheet.getColumn('C').width = 15;
        worksheet.getColumn('D').width = 15;
        worksheet.getColumn('E').width = 40;
        worksheet.getColumn('F').width = 15;
        worksheet.getColumn('G').width = 15;
        worksheet.getColumn('H').width = 15;
        worksheet.getColumn('I').width = 15;
        worksheet.getColumn('J').width = 25;

        // Set font style
        const boldFont = { name: 'Arial', family: 2, size: 11, italic: false, bold: true };
        cellTitle.font = cellPeriodo.font = boldFont;

        // Add image
        worksheet.addImage(imageId, {
            tl: { col: 0, row: 1 },
            ext: { width: 144, height: 98 }
        });

        let startRow = 12; // Starting row for the first table

        data.rondaSummaryList.forEach((ronda, index) => {
            const generalTableData = [
                [
                    ronda.nuit,
                    ronda.mentee,
                    ronda.zeroEvaluation,
                    ronda.session1,
                    ronda.session2,
                    ronda.session3,
                    ronda.session4,
                    ronda.finalScore,
                    ronda.mentor,
                ]
            ];

            const summaryDetails = [];
            for (const key in ronda.summaryDetailsMap) {
                if (ronda.summaryDetailsMap.hasOwnProperty(key)) {
                    summaryDetails.push(ronda.summaryDetailsMap[key]);
                }
            }

            // Add general table
            worksheet.addTable({
                name: `${reportName}_${index}_General`,
                ref: `A${startRow}`,
                headerRow: true,
                totalsRow: false,
                style: {
                    showRowStripes: false,
                },
                columns: [
                    { name: 'NUIT', filterButton: false },
                    { name: 'Nome', filterButton: false },
                    { name: 'Avaliacao "Zero"', totalsRowFunction: 'none', filterButton: false },
                    { name: 'Sessao 1', totalsRowFunction: 'none', filterButton: false },
                    { name: 'Sessao 2', totalsRowFunction: 'none', filterButton: false },
                    { name: 'Sessao 3', totalsRowFunction: 'none', filterButton: false },
                    { name: 'Sessao 4', totalsRowFunction: 'none', filterButton: false },
                    { name: 'Classificacao Final', totalsRowFunction: 'none', filterButton: false },
                    { name: 'Mentor', totalsRowFunction: 'none', filterButton: false },
                    { name: 'Assinatura', totalsRowFunction: 'none', filterButton: false },
                ],
                rows: generalTableData,
            });

            // Set the starting row for the summary details table
            const summaryStartRow = startRow + generalTableData.length + 2;

            // Add summary details table
            worksheet.addTable({
                name: `${reportName}_${index}_Summary`,
                ref: `E${summaryStartRow}`,
                headerRow: true,
                totalsRow: false,
                style: {
                    showRowStripes: false,
                },
                columns: [
                    { name: 'Seccao', filterButton: false },
                    { name: 'Sessao 1', filterButton: false },
                    { name: 'Sessao 2', filterButton: false },
                    { name: 'Sessao 3', filterButton: false },
                    { name: 'Sessao 4', filterButton: false },
                    { name: 'Classificacao', filterButton: false },
                ],
                rows: summaryDetails,
            });

            // Set header background color to yellow and font color to black
            const summaryTableHeader = worksheet.getRow(summaryStartRow);
            summaryTableHeader.eachCell(cell => {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' },
                };
                cell.font = { color: { argb: 'FF000000' }, bold: true };
            });

            // Update the start row for the next iteration
            startRow = summaryStartRow + summaryDetails.length + 4; // 4 extra rows for spacing
        });

        // Generate and save the Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const fileExtension = '.xlsx';
        const blob = new Blob([buffer], { type: fileType });

        saveAs(blob, fileName + fileExtension);
    }
};
