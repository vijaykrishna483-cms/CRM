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
    college_id VARCHAR(20) NOT NULL REFERENCES colleges(college_id) ON DELETE CASCADE,
    college_batch VARCHAR(50),
    date_of_issue DATE
);


