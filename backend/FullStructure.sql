-- ============================================
-- ATTENDANCE AND LEAVE MANAGEMENT
-- ============================================

CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    check_in TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lunch_in TIMESTAMP,
    lunch_out TIMESTAMP,
    check_out TIMESTAMP,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    is_valid BOOLEAN DEFAULT TRUE,
    remarks TEXT
);

CREATE VIEW monthly_attendance_summary AS
SELECT
    employee_id,
    DATE_TRUNC('month', attendance_date) AS month,
    COUNT(*) FILTER (WHERE is_valid) AS present_days,
    COUNT(*) FILTER (WHERE NOT is_valid) AS rejected_days
FROM attendance
GROUP BY employee_id, DATE_TRUNC('month', attendance_date);

CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    date_of_leave DATE NOT NULL,
    reason TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    status_updater VARCHAR(50)
);

-- ============================================
-- USER AUTHENTICATION AND ACCESS CONTROL
-- ============================================

CREATE TABLE verticals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    route VARCHAR(200),
    component VARCHAR(200)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    vertical_id INTEGER REFERENCES verticals(id),
    position_id INTEGER REFERENCES positions(id),
    employee_id VARCHAR(20) REFERENCES employees(employee_id)
);

CREATE TABLE role_access (
    id SERIAL PRIMARY KEY,
    vertical_id INTEGER REFERENCES verticals(id),
    position_id INTEGER REFERENCES positions(id),
    page_id INTEGER REFERENCES pages(id),
    UNIQUE (vertical_id, position_id, page_id)
);

-- ============================================
-- EMPLOYEE MANAGEMENT
-- ============================================

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    employee_name VARCHAR(100) NOT NULL,
    designation VARCHAR(100),
    position VARCHAR(100),
    aadhar_number VARCHAR(20),
    pan_id VARCHAR(20),
    personal_contact VARCHAR(15),
    address_line1 TEXT,
    address_line2 TEXT,
    address_line3 TEXT,
    office_contact VARCHAR(15),
    personal_email VARCHAR(100),
    office_email VARCHAR(100),
    salary NUMERIC(12, 2),
    location VARCHAR(100)
);

CREATE TABLE employee_bank_details (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(employee_id) ON DELETE CASCADE,
    employee_name VARCHAR(100) NOT NULL,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),
    branch_ifsc VARCHAR(20),
    mmid VARCHAR(20),
    vpa VARCHAR(50)
);

-- ============================================
-- REIMBURSEMENT MANAGEMENT
-- ============================================

CREATE TABLE reimbursements (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    employee_id VARCHAR(20) NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    reimbursement_id VARCHAR(50) NOT NULL UNIQUE,
    duration VARCHAR(20),
    from_date DATE,
    to_date DATE,
    word_link VARCHAR(255),
    excel_link VARCHAR(255),
    location VARCHAR(100),
    program VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'paid', 'rejected'))
);

CREATE TABLE expenditures (
    id SERIAL PRIMARY KEY,
    reimbursement_id VARCHAR(50) NOT NULL REFERENCES reimbursements(reimbursement_id) ON DELETE CASCADE,
    expense_category VARCHAR(100),
    expense_amount NUMERIC(12, 2),
    additional_cost NUMERIC(12, 2),
    total_cost NUMERIC(12, 2),
    invoice VARCHAR(255)
);

CREATE TABLE reimbursement_reviews (
    id SERIAL PRIMARY KEY,
    reimbursement_id VARCHAR(50) NOT NULL REFERENCES reimbursements(reimbursement_id) ON DELETE CASCADE,
    review_comment TEXT,
    reimbursement_amount NUMERIC(12, 2),
    approved_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- COLLEGE MANAGEMENT
-- ============================================

CREATE TABLE colleges (
    college_id SERIAL PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL,
    college_code VARCHAR(20) UNIQUE NOT NULL,
    location VARCHAR(255),
    state VARCHAR(100)
);

CREATE TABLE college_pocs (
    poc_id SERIAL PRIMARY KEY,
    college_id INTEGER REFERENCES colleges(college_id) ON DELETE CASCADE,
    poc_name VARCHAR(255),
    poc_designation VARCHAR(100),
    poc_email VARCHAR(150),
    poc_contact VARCHAR(20),
    poc_red_email VARCHAR(250)
);

-- ============================================
-- SERVICES
-- ============================================

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(255),
    service_code VARCHAR(50) UNIQUE NOT NULL
);

-- ============================================
-- PROPOSAL MANAGEMENT
-- ============================================

CREATE TABLE proposals (
    proposal_id VARCHAR(30) PRIMARY KEY,
    college_code VARCHAR(20) REFERENCES colleges(college_code) ON DELETE CASCADE,
    proposal_code VARCHAR(30) UNIQUE NOT NULL,
    issue_date DATE,
    last_updated DATE,
    quoted_price NUMERIC(12, 2),
    duration INTEGER,
    from_date DATE,
    to_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'Mail Sent', 'Follow up', 'active', 'success')),
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    location VARCHAR(100)
);

CREATE TABLE proposal_plans (
    plan_id SERIAL PRIMARY KEY,
    plan_name VARCHAR(255) NOT NULL,
    plan_code VARCHAR(50) UNIQUE NOT NULL,
    duration INTEGER NOT NULL,
    zipfile_link VARCHAR(255)
);

CREATE TABLE plan_services (
    plan_id INTEGER NOT NULL REFERENCES proposal_plans(plan_id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(service_id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, service_id)
);

CREATE TABLE proposal_plan_details (
    id SERIAL PRIMARY KEY,
    proposal_id VARCHAR(30) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES proposal_plans(plan_id) ON DELETE CASCADE
);

CREATE TABLE proposal_files (
    id SERIAL PRIMARY KEY,
    proposal_id VARCHAR(100) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
    zip_file_link TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    poc_red_email VARCHAR(250) NOT NULL
);

-- ============================================
-- TRAINER MANAGEMENT
-- ============================================

CREATE TABLE trainers (
    id SERIAL PRIMARY KEY,
    trainer_id VARCHAR(30) UNIQUE NOT NULL,
    trainer_name VARCHAR(100) NOT NULL,
    aadhar_id VARCHAR(20),
    pan_id VARCHAR(20),
    contact_number VARCHAR(15),
    email VARCHAR(100),
    status TEXT,
    location VARCHAR(100),
    address_line1 TEXT,
    address_line2 TEXT,
    address_line3 TEXT,
    charge NUMERIC(12, 2),
    employment_type VARCHAR(20) CHECK (employment_type IN ('Freelancer', 'Full Time'))
);

CREATE TABLE trainer_services_map (
    id SERIAL PRIMARY KEY,
    trainer_id VARCHAR(30) NOT NULL REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(service_id) ON DELETE CASCADE
);

CREATE TABLE trainer_bank_details (
    id SERIAL PRIMARY KEY,
    trainer_id VARCHAR(30) NOT NULL REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    bank_account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(100),
    branch_name VARCHAR(100),
    branch_ifsc VARCHAR(20),
    mmid VARCHAR(20),
    vpa VARCHAR(50)
);

CREATE TABLE trainer_reviews (
    id SERIAL PRIMARY KEY,
    proposal_code VARCHAR(30) NOT NULL REFERENCES proposals(proposal_code) ON DELETE CASCADE,
    trainer_id VARCHAR(30) NOT NULL REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    trainer_name VARCHAR(100) NOT NULL,
    trainer_comment TEXT,
    trainer_star_rating NUMERIC(2, 1)
);

CREATE TABLE proposal_trainer_map (
    proposal_id VARCHAR(30) NOT NULL REFERENCES proposals(proposal_id) ON DELETE CASCADE,
    trainer_id VARCHAR(30) NOT NULL REFERENCES trainers(trainer_id) ON DELETE CASCADE,
    PRIMARY KEY (proposal_id, trainer_id)
);

-- ============================================
-- EXAM MANAGEMENT
-- ============================================

CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    exam_id VARCHAR(30) UNIQUE NOT NULL,
    exam_duration VARCHAR(50),
    number_of_questions INTEGER,
    exam_file VARCHAR(200)
);

CREATE TABLE exam_categories_map (
    id SERIAL PRIMARY KEY,
    exam_id VARCHAR(30) NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE exam_college_map (
    id SERIAL PRIMARY KEY,
    exam_id VARCHAR(30) NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
    college_code VARCHAR(20) NOT NULL REFERENCES colleges(college_code) ON DELETE CASCADE,
    college_batch VARCHAR(50),
    date_of_issue DATE
);