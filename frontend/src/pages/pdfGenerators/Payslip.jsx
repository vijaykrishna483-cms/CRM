import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import usePageAccess from "../../components/useAccessPage";
import api from "../../libs/apiCall";

// Number to words function (Indian format, supports decimals)
const numberToWords = (num) => {
  if (isNaN(num)) return "";
  const integerPart = Math.floor(Math.abs(num));
  const decimalPart = Math.round((Math.abs(num) - integerPart) * 100);
  const convert = (n) => {
    if (n === 0) return "Zero";
    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    ];
    const teens = [
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
      "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100)
      return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return (
        ones[Math.floor(n / 100)] +
        " Hundred " +
        (n % 100 ? convert(n % 100) : "")
      );
    if (n < 100000)
      return (
        convert(Math.floor(n / 1000)) +
        " Thousand " +
        (n % 1000 ? convert(n % 1000) : "")
      );
    if (n < 10000000)
      return (
        convert(Math.floor(n / 100000)) +
        " Lakh " +
        (n % 100000 ? convert(n % 100000) : "")
      );
    return (
      convert(Math.floor(n / 10000000)) +
      " Crore " +
      (n % 10000000 ? convert(n % 10000000) : "")
    );
  };
  let words = convert(integerPart) + " Rupees";
  if (decimalPart > 0) {
    words += " and " + convert(decimalPart) + " Paisa";
  }
  return words;
};

// Format all rupee values to 2 decimal places (e.g., 100.00)
const formatAmount = (value) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};

const Payslip = () => {
  const { allowed, loading: permissionLoading } = usePageAccess("payslip");

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    designation: "",
    address1: "",
    address2: "",
    address3: "",
    address: "",
    month: "",
    panId: "",
    amount: "0.00",
    date: "",
    amountInWords: "",
    location: "",
    basic: "0.00",
    incomeTax: "0.00",
    providentFund: "0.00",
    houseRent: "0.00",
    grossEarnings: "0.00",
    totalDeductions: "0.00",
  });
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const res = await api.get("/employee");
        setEmployeeData(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch employees.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Handle employee selection and auto-fill
  const handleEmployeeSelect = (e) => {
    const employeeId = e.target.value;
    const selectedEmployee = employeeData.find(
      (emp) => emp.employee_id === employeeId
    );

    if (selectedEmployee) {
      const salary = parseFloat(selectedEmployee.salary) || 0;
      setFormData((prev) => ({
        ...prev,
        employeeName: selectedEmployee.employee_name,
        employeeId: selectedEmployee.employee_id,
        designation: selectedEmployee.designation,
        address1: selectedEmployee.address_line1 || "",
        address2: selectedEmployee.address_line2 || "",
        address3: selectedEmployee.address_line3 || "",
        month: "",
        panId: selectedEmployee.pan_id,
        location: selectedEmployee.location || "",
        basic: "0.00",
        houseRent: "0.00",
        incomeTax: "0.00",
        providentFund: "0.00",
        grossEarnings: "0.00",
        totalDeductions: "0.00",
        amount: "0.00",
        amountInWords: "",
        date: "",
        address: "",
      }));
    }
  };

  // Handle other field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // Always format rupee values to 2 decimal places
    if (
      ["basic", "houseRent", "incomeTax", "providentFund", "grossEarnings", "totalDeductions", "amount"].includes(name)
    ) {
      updatedForm[name] = formatAmount(value);
    }

    // Auto-calculate gross earnings and total deductions
    const basic = parseFloat(updatedForm.basic) || 0;
    const houseRent = parseFloat(updatedForm.houseRent) || 0;
    const incomeTax = parseFloat(updatedForm.incomeTax) || 0;
    const providentFund = parseFloat(updatedForm.providentFund) || 0;

    updatedForm.grossEarnings = formatAmount(basic + houseRent);
    updatedForm.totalDeductions = formatAmount(incomeTax + providentFund);

    // Calculate amount = grossEarnings - totalDeductions
    const gross = parseFloat(updatedForm.grossEarnings) || 0;
    const deductions = parseFloat(updatedForm.totalDeductions) || 0;
    const amount = gross - deductions;
    updatedForm.amount = formatAmount(amount);

    // Update amount in words
    updatedForm.amountInWords = numberToWords(amount);

    setFormData(updatedForm);
  };

  const handleSubmit = async () => {
    const payload = { ...formData };
    try {
      const res = await api.post("/pdf/payslip", payload, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "generated.docx";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error generating DOCX:", err);
      toast.error("Failed to generate document.");
    }
  };

  if (!allowed && !permissionLoading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center bg-white px-8 py-10 ">
          <svg
            className="w-14 h-14 text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="#fee2e2"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 9l-6 6m0-6l6 6"
              stroke="red"
              strokeWidth="2"
            />
          </svg>
          <h2 className="text-2xl font-bold text-[#6750a4] mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 text-center mb-4">
            You do not have permission to view this page.
            <br />
            Please contact the administrator if you believe this is a mistake.
          </p>
          <button
            className="mt-2 px-5 py-2 rounded-lg bg-[#6750a4] text-white font-semibold hover:bg-[#01291f] transition"
            onClick={() => (window.location.href = "/")}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  if (permissionLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f7f6fd] bg-[#fff ">
      <div className="fixed w-[100vw] z-[100]">
        <Navbar />
      </div>
      <div className="max-w-3xl mx-auto px-2 pt-[10vh]">
        <div className="p-1 md:p-2 relative overflow-hidden">
          {/* Header Section */}
          <div className="relative z-10 p-6 ">
            <h1 className="text-3xl text-[#88139a] font-bold text-center tracking-wide">
              Payslip Generator
            </h1>
            <p className="text-center text-[#88139a] mt-2">
              Create professional Payslips in seconds
            </p>
          </div>
          {/* Form Section */}
          <div className="relative z-10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Employee Select */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Select Employee
                </label>
                <select
                  value={
                    employeeData.find(
                      (emp) => emp.employee_name === formData.employeeName
                    )?.employee_id || ""
                  }
                  onChange={handleEmployeeSelect}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                  disabled={loading}
                >
                  <option value="">Select an employee</option>
                  {employeeData.map((employee) => (
                    <option
                      key={employee.employee_id}
                      value={employee.employee_id}
                    >
                      {employee.employee_name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Employee ID */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Employee ID
                </label>
                <input
                  name="employeeId"
                  placeholder="Employee ID"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Designation */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Designation
                </label>
                <input
                  name="designation"
                  placeholder="Designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Month */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Month
                </label>
                <input
                  name="month"
                  placeholder="Month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* PAN ID */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  PAN ID
                </label>
                <input
                  name="panId"
                  placeholder="PAN ID"
                  value={formData.panId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Amount (₹)
                </label>
                <input
                  name="amount"
                  type="text"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                  readOnly
                />
              </div>
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Address Line 1
                </label>
                <input
                  name="address1"
                  placeholder="Address Line 1"
                  value={formData.address1}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Address Line 2
                </label>
                <input
                  name="address2"
                  placeholder="Address Line 2"
                  value={formData.address2}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Address Line 3 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Address Line 3
                </label>
                <input
                  name="address3"
                  placeholder="Address Line 3"
                  value={formData.address3}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Location
                </label>
                <input
                  name="location"
                  placeholder="State"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Basic */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Basic
                </label>
                <input
                  name="basic"
                  type="text"
                  placeholder="Basic"
                  value={formData.basic}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Income Tax */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Income Tax
                </label>
                <input
                  name="incomeTax"
                  type="text"
                  placeholder="Income Tax"
                  value={formData.incomeTax}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Provident Fund */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Provident Fund
                </label>
                <input
                  name="providentFund"
                  type="text"
                  placeholder="Provident Fund"
                  value={formData.providentFund}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* House Rent */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  House Rent
                </label>
                <input
                  name="houseRent"
                  type="text"
                  placeholder="House Rent"
                  value={formData.houseRent}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                />
              </div>
              {/* Gross Earnings */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Gross Earnings
                </label>
                <input
                  name="grossEarnings"
                  type="text"
                  placeholder="Gross Earnings"
                  value={formData.grossEarnings}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                  readOnly
                />
              </div>
              {/* Total Deductions */}
              <div>
                <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                  Total Deductions
                </label>
                <input
                  name="totalDeductions"
                  type="text"
                  placeholder="Total Deductions"
                  value={formData.totalDeductions}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                  readOnly
                />
              </div>
            </div>
            {/* Amount in Words */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-[#4f378a] mb-1">
                Amount in Words
              </label>
              <input
                name="amountInWords"
                value={formData.amountInWords}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#7c3aed] bg-white/80"
                placeholder="Amount in words will appear here"
                readOnly
              />
            </div>
            {/* Generate Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-[#88139a] text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
              >
                Generate Payslip
              </button>
            </div>
          </div>
          {/* Footer */}
          <div className="relative z-10 bg-gray-50 p-4 text-center text-sm text-gray-500 border-t rounded-b-2xl">
            Your Payslip will be downloaded as a Word document
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payslip;
