import JsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import saveAs from 'file-saver';
import * as ExcelJS from 'exceljs';
import { MOHIMAGELOG } from 'src/assets/imageBytes.ts';

function metodo(data: any) {
    return new Promise((resolve, reject) => {
       //
    });
}

export default {
    async processReport(data: any) {
        console.log(data)
      const workbook = new ExcelJS.Workbook();
      const reportName = 'Rondas';
      workbook.creator = 'CSAUDE';
      workbook.lastModifiedBy = 'CSAUDE';
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();

      const worksheet = workbook.addWorksheet(reportName);
      const imageId = workbook.addImage({
        base64: 'data:image/pngbase64,' + MOHIMAGELOG,
        extension: 'png'
      })

    }
}
