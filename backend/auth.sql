CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    vertical_id INTEGER REFERENCES verticals(id),
    position_id INTEGER REFERENCES positions(id),
    employee_id VARCHAR(20) REFERENCES employees(employee_id)  -- FK to employees.employee_id
);


-- Verticals Table
CREATE TABLE verticals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Positions Table
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- Pages Table
CREATE TABLE pages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    route VARCHAR(200),               -- Nullable
    component VARCHAR(200)            -- Nullable
);


-- Role Access Table
CREATE TABLE role_access (
    id SERIAL PRIMARY KEY,
    vertical_id INTEGER REFERENCES verticals(id),
    position_id INTEGER REFERENCES positions(id),
    page_id INTEGER REFERENCES pages(id),
    UNIQUE (vertical_id, position_id, page_id)
);
