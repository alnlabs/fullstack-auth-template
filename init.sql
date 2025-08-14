-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto extension for additional cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom functions for better performance
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE mymentor_db TO mymentor_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mymentor_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mymentor_user;
