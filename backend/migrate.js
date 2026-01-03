import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();

// Parse the connection string to check if SSL is needed
const connectionString = process.env.DATABASE_URL;
const needsSSL = connectionString && (
  connectionString.includes('render.com') || 
  connectionString.includes('amazonaws.com') ||
  connectionString.includes('heroku')
);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: needsSSL ? {
    rejectUnauthorized: false
  } : false
});

const setupDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting fresh database setup...\n');
    await client.query('BEGIN');

    // ============================================
    // Drop all tables in correct order (reverse of dependencies)
    // ============================================
    console.log('🗑️  Dropping existing tables...');
    
    const dropTables = [
      'DROP TABLE IF EXISTS exam_college_map CASCADE',
      'DROP TABLE IF EXISTS exam_categories_map CASCADE',
      'DROP TABLE IF EXISTS exams CASCADE',
      'DROP TABLE IF EXISTS proposal_trainer_map CASCADE',
      'DROP TABLE IF EXISTS trainer_reviews CASCADE',
      'DROP TABLE IF EXISTS trainer_bank_details CASCADE',
      'DROP TABLE IF EXISTS trainer_services_map CASCADE',
      'DROP TABLE IF EXISTS trainers CASCADE',
      'DROP TABLE IF EXISTS proposal_files CASCADE',
      'DROP TABLE IF EXISTS proposal_plan_details CASCADE',
      'DROP TABLE IF EXISTS plan_services CASCADE',
      'DROP TABLE IF EXISTS proposal_plans CASCADE',
      'DROP TABLE IF EXISTS proposals CASCADE',
      'DROP TABLE IF EXISTS services CASCADE',
      'DROP TABLE IF EXISTS college_pocs CASCADE',
      'DROP TABLE IF EXISTS colleges CASCADE',
      'DROP TABLE IF EXISTS reimbursement_reviews CASCADE',
      'DROP TABLE IF EXISTS expenditures CASCADE',
      'DROP TABLE IF EXISTS reimbursements CASCADE',
      'DROP TABLE IF EXISTS employee_bank_details CASCADE',
      'DROP TABLE IF EXISTS leave_requests CASCADE',
      'DROP VIEW IF EXISTS monthly_attendance_summary CASCADE',
      'DROP TABLE IF EXISTS attendance CASCADE',
      'DROP TABLE IF EXISTS role_access CASCADE',
      'DROP TABLE IF EXISTS users CASCADE',
      'DROP TABLE IF EXISTS pages CASCADE',
      'DROP TABLE IF EXISTS positions CASCADE',
      'DROP TABLE IF EXISTS verticals CASCADE',
      'DROP TABLE IF EXISTS employees CASCADE'
    ];

    for (const drop of dropTables) {
      await client.query(drop);
    }
    console.log('  ✅ All existing tables dropped\n');

    // ============================================
    // Create tables in correct order
    // ============================================
    
    // 1. VERTICALS
    console.log('📝 Creating verticals table...');
    await client.query(`
      CREATE TABLE verticals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      )
    `);
    console.log('  ✅ verticals created\n');

    // 2. POSITIONS
    console.log('📝 Creating positions table...');
    await client.query(`
      CREATE TABLE positions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      )
    `);
    console.log('  ✅ positions created\n');

    // 3. PAGES
    console.log('📝 Creating pages table...');
    await client.query(`
      CREATE TABLE pages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        route VARCHAR(200),
        component VARCHAR(200)
      )
    `);
    console.log('  ✅ pages created\n');

    // 4. EMPLOYEES
    console.log('📝 Creating employees table...');
    await client.query(`
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
      )
    `);
    console.log('  ✅ employees created\n');

    // 5. USERS
    console.log('📝 Creating users table...');
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        vertical_id INTEGER REFERENCES verticals(id),
        position_id INTEGER REFERENCES positions(id),
        employee_id VARCHAR(20) REFERENCES employees(employee_id)
      )
    `);
    console.log('  ✅ users created\n');

    // 6. ROLE_ACCESS
    console.log('📝 Creating role_access table...');
    await client.query(`
      CREATE TABLE role_access (
        id SERIAL PRIMARY KEY,
        vertical_id INTEGER REFERENCES verticals(id),
        position_id INTEGER REFERENCES positions(id),
        page_id INTEGER REFERENCES pages(id),
        UNIQUE (vertical_id, position_id, page_id)
      )
    `);
    console.log('  ✅ role_access created\n');

    // 7. ATTENDANCE
    console.log('📝 Creating attendance table...');
    await client.query(`
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
      )
    `);
    console.log('  ✅ attendance created\n');

    // 8. MONTHLY_ATTENDANCE_SUMMARY VIEW
    console.log('📝 Creating monthly_attendance_summary view...');
    await client.query(`
      CREATE VIEW monthly_attendance_summary AS
      SELECT
        employee_id,
        DATE_TRUNC('month', attendance_date) AS month,
        COUNT(*) FILTER (WHERE is_valid) AS present_days,
        COUNT(*) FILTER (WHERE NOT is_valid) AS rejected_days
      FROM attendance
      GROUP BY employee_id, DATE_TRUNC('month', attendance_date)
    `);
    console.log('  ✅ monthly_attendance_summary view created\n');

    // 9. LEAVE_REQUESTS
    console.log('📝 Creating leave_requests table...');
    await client.query(`
      CREATE TABLE leave_requests (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(20) REFERENCES employees(employee_id),
        date_of_leave DATE NOT NULL,
        reason TEXT NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        comment TEXT,
        status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
        status_updater VARCHAR(50)
      )
    `);
    console.log('  ✅ leave_requests created\n');

    // 10. EMPLOYEE_BANK_DETAILS
    console.log('📝 Creating employee_bank_details table...');
    await client.query(`
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
      )
    `);
    console.log('  ✅ employee_bank_details created\n');

    // 11. REIMBURSEMENTS
    console.log('📝 Creating reimbursements table...');
    await client.query(`
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
      )
    `);
    console.log('  ✅ reimbursements created\n');

    // 12. EXPENDITURES
    console.log('📝 Creating expenditures table...');
    await client.query(`
      CREATE TABLE expenditures (
        id SERIAL PRIMARY KEY,
        reimbursement_id VARCHAR(50) NOT NULL REFERENCES reimbursements(reimbursement_id) ON DELETE CASCADE,
        expense_category VARCHAR(100),
        expense_amount NUMERIC(12, 2),
        additional_cost NUMERIC(12, 2),
        total_cost NUMERIC(12, 2),
        invoice VARCHAR(255)
      )
    `);
    console.log('  ✅ expenditures created\n');

    // 13. REIMBURSEMENT_REVIEWS
    console.log('📝 Creating reimbursement_reviews table...');
    await client.query(`
      CREATE TABLE reimbursement_reviews (
        id SERIAL PRIMARY KEY,
        reimbursement_id VARCHAR(50) NOT NULL REFERENCES reimbursements(reimbursement_id) ON DELETE CASCADE,
        review_comment TEXT,
        reimbursement_amount NUMERIC(12, 2),
        approved_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('  ✅ reimbursement_reviews created\n');

    // 14. COLLEGES
    console.log('📝 Creating colleges table...');
    await client.query(`
      CREATE TABLE colleges (
        college_id SERIAL PRIMARY KEY,
        college_name VARCHAR(255) NOT NULL,
        college_code VARCHAR(20) UNIQUE NOT NULL,
        location VARCHAR(255),
        state VARCHAR(100)
      )
    `);
    console.log('  ✅ colleges created\n');

    // 15. COLLEGE_POCS
    console.log('📝 Creating college_pocs table...');
    await client.query(`
      CREATE TABLE college_pocs (
        poc_id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(college_id) ON DELETE CASCADE,
        poc_name VARCHAR(255),
        poc_designation VARCHAR(100),
        poc_email VARCHAR(150),
        poc_contact VARCHAR(20),
        poc_red_email VARCHAR(250)
      )
    `);
    console.log('  ✅ college_pocs created\n');

    // 16. SERVICES
    console.log('📝 Creating services table...');
    await client.query(`
      CREATE TABLE services (
        service_id SERIAL PRIMARY KEY,
        service_name VARCHAR(255),
        service_code VARCHAR(50) UNIQUE NOT NULL
      )
    `);
    console.log('  ✅ services created\n');

    // 17. PROPOSALS
    console.log('📝 Creating proposals table...');
    await client.query(`
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
      )
    `);
    console.log('  ✅ proposals created\n');

    // 18. PROPOSAL_PLANS
    console.log('📝 Creating proposal_plans table...');
    await client.query(`
      CREATE TABLE proposal_plans (
        plan_id SERIAL PRIMARY KEY,
        plan_name VARCHAR(255) NOT NULL,
        plan_code VARCHAR(50) UNIQUE NOT NULL,
        duration INTEGER NOT NULL,
        zipfile_link VARCHAR(255)
      )
    `);
    console.log('  ✅ proposal_plans created\n');

    // 19. PLAN_SERVICES
    console.log('📝 Creating plan_services table...');
    await client.query(`
      CREATE TABLE plan_services (
        plan_id INTEGER NOT NULL REFERENCES proposal_plans(plan_id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL REFERENCES services(service_id) ON DELETE CASCADE,
        PRIMARY KEY (plan_id, service_id)
      )
    `);
    console.log('  ✅ plan_services created\n');

    // 20. PROPOSAL_PLAN_DETAILS
    console.log('📝 Creating proposal_plan_details table...');
    await client.query(`
      CREATE TABLE proposal_plan_details (
        id SERIAL PRIMARY KEY,
        proposal_id VARCHAR(30) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
        plan_id INTEGER REFERENCES proposal_plans(plan_id) ON DELETE CASCADE
      )
    `);
    console.log('  ✅ proposal_plan_details created\n');

    // 21. PROPOSAL_FILES
    console.log('📝 Creating proposal_files table...');
    await client.query(`
      CREATE TABLE proposal_files (
        id SERIAL PRIMARY KEY,
        proposal_id VARCHAR(100) REFERENCES proposals(proposal_id) ON DELETE CASCADE,
        zip_file_link TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        poc_red_email VARCHAR(250) NOT NULL
      )
    `);
    console.log('  ✅ proposal_files created\n');

    // 22. TRAINERS
    console.log('📝 Creating trainers table...');
    await client.query(`
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
      )
    `);
    console.log('  ✅ trainers created\n');

    // 23. TRAINER_SERVICES_MAP
    console.log('📝 Creating trainer_services_map table...');
    await client.query(`
      CREATE TABLE trainer_services_map (
        id SERIAL PRIMARY KEY,
        trainer_id VARCHAR(30) NOT NULL REFERENCES trainers(trainer_id) ON DELETE CASCADE,
        service_id INTEGER NOT NULL REFERENCES services(service_id) ON DELETE CASCADE
      )
    `);
    console.log('  ✅ trainer_services_map created\n');

    // 24. TRAINER_BANK_DETAILS
    console.log('📝 Creating trainer_bank_details table...');
    await client.query(`
      CREATE TABLE trainer_bank_details (
        id SERIAL PRIMARY KEY,
        trainer_id VARCHAR(30) NOT NULL REFERENCES trainers(trainer_id) ON DELETE CASCADE,
        bank_account_number VARCHAR(50) NOT NULL,
        bank_name VARCHAR(100),
        branch_name VARCHAR(100),
        branch_ifsc VARCHAR(20),
        mmid VARCHAR(20),
        vpa VARCHAR(50)
      )
    `);
    console.log('  ✅ trainer_bank_details created\n');

    // 25. TRAINER_REVIEWS
    console.log('📝 Creating trainer_reviews table...');
    await client.query(`
      CREATE TABLE trainer_reviews (
        id SERIAL PRIMARY KEY,
        proposal_code VARCHAR(30) NOT NULL REFERENCES proposals(proposal_code) ON DELETE CASCADE,
        trainer_id VARCHAR(30) NOT NULL REFERENCES trainers(trainer_id) ON DELETE CASCADE,
        trainer_name VARCHAR(100) NOT NULL,
        trainer_comment TEXT,
        trainer_star_rating NUMERIC(2, 1)
      )
    `);
    console.log('  ✅ trainer_reviews created\n');

    // 26. PROPOSAL_TRAINER_MAP
    console.log('📝 Creating proposal_trainer_map table...');
    await client.query(`
      CREATE TABLE proposal_trainer_map (
        proposal_id VARCHAR(30) NOT NULL REFERENCES proposals(proposal_id) ON DELETE CASCADE,
        trainer_id VARCHAR(30) NOT NULL REFERENCES trainers(trainer_id) ON DELETE CASCADE,
        PRIMARY KEY (proposal_id, trainer_id)
      )
    `);
    console.log('  ✅ proposal_trainer_map created\n');

    // 27. EXAMS
    console.log('📝 Creating exams table...');
    await client.query(`
      CREATE TABLE exams (
        id SERIAL PRIMARY KEY,
        exam_id VARCHAR(30) UNIQUE NOT NULL,
        exam_duration VARCHAR(50),
        number_of_questions INTEGER,
        exam_file VARCHAR(200)
      )
    `);
    console.log('  ✅ exams created\n');

    // 28. EXAM_CATEGORIES_MAP
    console.log('📝 Creating exam_categories_map table...');
    await client.query(`
      CREATE TABLE exam_categories_map (
        id SERIAL PRIMARY KEY,
        exam_id VARCHAR(30) NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
        category_name VARCHAR(100) NOT NULL
      )
    `);
    console.log('  ✅ exam_categories_map created\n');

    // 29. EXAM_COLLEGE_MAP
    console.log('📝 Creating exam_college_map table...');
    await client.query(`
      CREATE TABLE exam_college_map (
        id SERIAL PRIMARY KEY,
        exam_id VARCHAR(30) NOT NULL REFERENCES exams(exam_id) ON DELETE CASCADE,
        college_code VARCHAR(20) NOT NULL REFERENCES colleges(college_code) ON DELETE CASCADE,
        college_batch VARCHAR(50),
        date_of_issue DATE
      )
    `);
    console.log('  ✅ exam_college_map created\n');

    // ============================================
    // SEED DATA - Default Admin Setup
    // ============================================
    console.log('\n🌱 Seeding default data...\n');

    // 1. Insert default vertical
    console.log('📝 Creating default vertical (Management)...');
    const verticalResult = await client.query(`
      INSERT INTO verticals (name)
      VALUES ('Management')
      RETURNING id
    `);
    const verticalId = verticalResult.rows[0].id;
    console.log(`  ✅ Vertical created with ID: ${verticalId}\n`);

    // 2. Insert default position
    console.log('📝 Creating default position (Super Admin)...');
    const positionResult = await client.query(`
      INSERT INTO positions (name)
      VALUES ('Super Admin')
      RETURNING id
    `);
    const positionId = positionResult.rows[0].id;
    console.log(`  ✅ Position created with ID: ${positionId}\n`);

    // 3. Insert default employee
    console.log('📝 Creating default employee...');
    const employeeResult = await client.query(`
      INSERT INTO employees (
        employee_id, 
        employee_name, 
        designation, 
        position,
        personal_email,
        office_email,
        location
      )
      VALUES (
        'ADMIN001',
        'System Administrator',
        'Super Admin',
        'Super Admin',
        'manager@gmail.com',
        'manager@gmail.com',
        'Head Office'
      )
      RETURNING employee_id
    `);
    const employeeId = employeeResult.rows[0].employee_id;
    console.log(`  ✅ Employee created with ID: ${employeeId}\n`);

    // 4. Hash password for admin user
    console.log('📝 Creating admin user account...');
    
    // Simple hash function for password (you should use bcrypt in production)
    // For now, we'll use a pre-hashed password for 'asd'
    // This is bcrypt hash for 'asd' with salt rounds 10
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('asd', 10);

    await client.query(`
      INSERT INTO users (
        name,
        email,
        password,
        vertical_id,
        position_id,
        employee_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'System Administrator',
      'manager@gmail.com',
      hashedPassword,
      verticalId,
      positionId,
      employeeId
    ]);
    console.log('  ✅ Admin user created\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 DEFAULT ADMIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email    : manager@gmail.com');
    console.log('  Password : asd');
    console.log('  Employee : ADMIN001');
    console.log('  Vertical : Management');
    console.log('  Position : Super Admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await client.query('COMMIT');
    console.log('✨ Database setup completed successfully!\n');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error during database setup:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run the migration
setupDatabase()
  .then(() => {
    console.log('👍 Migration script finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Migration failed:', err);
    process.exit(1);
  });