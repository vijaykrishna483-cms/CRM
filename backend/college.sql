CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- 1. Colleges Table
CREATE TABLE colleges (
    college_id VARCHAR(20) PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    state VARCHAR(100)
);

-- 2. College POCs Table (Point of Contact)
CREATE TABLE college_pocs (
    poc_id SERIAL PRIMARY KEY,
    college_id VARCHAR(20) REFERENCES colleges(college_id),
    poc_name VARCHAR(255),
    poc_designation VARCHAR(100),
    poc_email VARCHAR(150),
    poc_contact VARCHAR(20),
    poc_red_email VARCHAR(250)
);


-- 3. Proposals Table
CREATE TABLE proposals (
    proposal_id VARCHAR(30) PRIMARY KEY,            -- Internal ID (e.g., UUID or unique string)
    college_code VARCHAR(20) REFERENCES colleges(college_code),
    proposal_code VARCHAR(30) UNIQUE NOT NULL,      -- Custom code like CollegeCode04
    issue_date DATE,
    last_updated DATE,
    quoted_price NUMERIC(12,2),
    duration INTEGER, -- in days
    from_date DATE,   -- Optional
    to_date DATE,     -- Optional
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'Mail Sent', 'Follow up', 'active', 'success')),
    employee_id VARCHAR(20) REFERENCES employees(employee_id) -- New column
);



-- 4. Services Table
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
  service_name VARCHAR(255),
  service_code VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE proposal_plans (
  plan_id SERIAL PRIMARY KEY,
  plan_name VARCHAR(255) NOT NULL,
  plan_code VARCHAR(50) UNIQUE NOT NULL,
  duration INTEGER NOT NULL,
  zipfile_link VARCHAR(255)
);
-- 5. Proposal-Service Mapping Table
CREATE TABLE proposal_plan_details (
  id SERIAL PRIMARY KEY,
  proposal_id VARCHAR(30) REFERENCES proposals(proposal_id),
  plan_id INTEGER REFERENCES proposal_plans(plan_id)
);





CREATE TABLE plan_services (
  plan_id INT NOT NULL,
  service_id INT NOT NULL,
  PRIMARY KEY (plan_id, service_id),
  FOREIGN KEY (plan_id) REFERENCES proposal_plans(plan_id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE
);



CREATE TABLE proposal_files (
    id SERIAL PRIMARY KEY,
    proposal_id VARCHAR(100) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
    zip_file_link TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    poc_red_email VARCHAR(250) NOT NULL
);
