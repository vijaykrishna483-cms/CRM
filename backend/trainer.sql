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
    charge NUMERIC(12,2)
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
    trainer_star_rating NUMERIC(2,1)  -- Example: 4.5, 3.0, etc.
);
