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
    poc_contact VARCHAR(20)
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
    from_date DATE,
    to_date DATE
);


-- 4. Services Table
CREATE TABLE services (
  service_id VARCHAR(20) PRIMARY KEY,
  service_name VARCHAR(255),
  service_code VARCHAR(50) UNIQUE NOT NULL
);


-- 5. Proposal-Service Mapping Table
CREATE TABLE proposal_services (
  id SERIAL PRIMARY KEY,
  proposal_id VARCHAR(30) REFERENCES proposals(proposal_id),
  service_id INTEGER REFERENCES services(service_id)
);
