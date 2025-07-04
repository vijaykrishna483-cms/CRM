CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    in_time TIMESTAMP,
    out_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_employee
      FOREIGN KEY(employee_id)
      REFERENCES employees(employee_id)
      ON DELETE CASCADE
);

-- For fast lookup
CREATE INDEX idx_attendance_employee_date ON attendance_records (employee_id, date);
