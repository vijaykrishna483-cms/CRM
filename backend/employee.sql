CREATE TABLE employees (
    id VARCHAR(30) PRIMARY KEY,                    -- Unique ID for the employee (manual or generated)
    employee_id VARCHAR(20) UNIQUE NOT NULL,       -- Custom Employee ID like STRCHE202
    employee_name VARCHAR(100) NOT NULL,           -- Full name
    designation VARCHAR(100),                      -- Job title (e.g., MCRAF - Intern)
    aadhar_number VARCHAR(20),                     -- Aadhar number
    pan_id VARCHAR(20),                            -- PAN number
    personal_contact VARCHAR(15),                  -- Personal mobile number
    address TEXT,                                  -- Full 3-line address
    office_contact VARCHAR(15),                    -- Office phone number (optional)
    personal_email VARCHAR(100),                   -- Personal email
    office_email VARCHAR(100),                     -- Office email
    salary NUMERIC(12, 2)                          -- Salary (e.g., 10000.00)
);




CREATE TABLE employee_bank_details (
    id SERIAL PRIMARY KEY,                             -- Auto-incremented ID
    employee_id VARCHAR(20) REFERENCES employees(employee_id) ON DELETE CASCADE,
    employee_name VARCHAR(100) NOT NULL,

    bank_account_number VARCHAR(50) NOT NULL,          -- Masked or full account number
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),
    branch_ifsc VARCHAR(20),
    mmid VARCHAR(20),
    vpa VARCHAR(50)
);


CREATE TABLE reimbursements (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    employee_id VARCHAR(20) NOT NULL,
    reimbursement_id VARCHAR(50) NOT NULL,
    duration VARCHAR(20),
    from_date DATE,
    to_date DATE,
    location VARCHAR(100),
    program VARCHAR(200),
    CONSTRAINT fk_employee
        FOREIGN KEY (employee_id)
        REFERENCES employees(employee_id)
        ON DELETE CASCADE
);


CREATE TABLE expenditures (
    id SERIAL PRIMARY KEY,
    reimbursement_id VARCHAR(50) NOT NULL
      REFERENCES reimbursements(reimbursement_id) ON DELETE CASCADE,
    expense_category VARCHAR(100),
    expense_amount NUMERIC(12,2),
    additional_cost NUMERIC(12,2),
    total_cost NUMERIC(12,2),
    invoice VARCHAR(200)
);
