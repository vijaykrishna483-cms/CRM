import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// proposalData: array of proposals
// proposalServices: object mapping proposal_id to array of services
// collegeNameMap: object mapping college_code to college_name
export const exportProposalTableToExcel = (
  proposalData,
  proposalServices,
  collegeNameMap
) => {
  if (!proposalData || proposalData.length === 0) {
    alert("No proposal data to export");
    return;
  }

  // Helper for formatting dates as in the table
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const rows = proposalData.map((item) => {
    const plansArr = (proposalServices[item.proposal_id] || []).map(
      (plan) => plan.plan_name
    );
    return {
      "College Name": collegeNameMap[item.college_code] || item.college_code,
      "Proposal Code": item.proposal_code,
      "Plans": plansArr.join(", "),
      "Status": item.status,
      "Status Date": item.issue_date ? formatDate(item.issue_date) : "",
      "Duration": item.duration,
      "Quoted Price": item.quoted_price,
      "From": item.from_date ? formatDate(item.from_date) : "",
      "To": item.to_date ? formatDate(item.to_date) : "",
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Proposals");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, "proposal_entries.xlsx");
};
