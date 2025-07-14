CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(employee_id),
    check_in TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lunch_in TIMESTAMP,
    lunch_out TIMESTAMP,
    check_out TIMESTAMP,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    latitude DECIMAL(10, 7),   -- Storing user location (GPS)
    longitude DECIMAL(10, 7),
    is_valid BOOLEAN DEFAULT TRUE, -- HR can toggle this
    remarks TEXT                -- HR remarks in case of invalid entry
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

