import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportTableToExcel = (collegeData) => {
  // Prepare rows from the data
  const rows = [];

  collegeData.forEach((college) => {
    if (!college.pocs || college.pocs.length === 0) {
      rows.push({
        'College Code': college.college_code,
        'College Name': college.college_name,
        Location: college.location,
        State: college.state,
        'POC Name': 'No POCs',
        'POC Designation': '',
        'POC Contact': '',
        'POC Email': '',
      });
    } else {
      college.pocs.forEach((poc) => {
        rows.push({
          'College Code': college.college_code,
          'College Name': college.college_name,
          Location: college.location,
          State: college.state,
          'POC Name': poc.poc_name,
          'POC Designation': poc.poc_designation,
          'POC Contact': poc.poc_contact,
          'POC Email': poc.poc_email,
        });
      });
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Colleges');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

  saveAs(data, 'college_entries.xlsx');
};
