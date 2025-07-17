-- Student Fee Management System Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    fees_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL, -- Amount in cents/smallest currency unit
    payment_method TEXT NOT NULL,
    card_last_four TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    transaction_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_transactions_student_id ON transactions(student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for students table
CREATE POLICY "Users can view their own student record" ON students
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own student record" ON students
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student record" ON students
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for transactions table
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (
        student_id IN (
            SELECT id FROM students WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (
        student_id IN (
            SELECT id FROM students WHERE user_id = auth.uid()
        )
    );

-- Allow public read access to students table for the "All Students" page
CREATE POLICY "Allow public read access to students" ON students
    FOR SELECT USING (true);

-- Create a function to get student profile with transactions
CREATE OR REPLACE FUNCTION get_student_profile(user_uuid UUID)
RETURNS TABLE (
    student_id UUID,
    student_name TEXT,
    student_email TEXT,
    fees_paid BOOLEAN,
    student_created_at TIMESTAMP WITH TIME ZONE,
    transaction_count BIGINT,
    total_paid INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.email,
        s.fees_paid,
        s.created_at,
        COUNT(t.id) as transaction_count,
        COALESCE(SUM(t.amount), 0)::INTEGER as total_paid
    FROM students s
    LEFT JOIN transactions t ON s.id = t.student_id AND t.status = 'completed'
    WHERE s.user_id = user_uuid
    GROUP BY s.id, s.name, s.email, s.fees_paid, s.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON students TO anon, authenticated;
GRANT ALL ON transactions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_student_profile(UUID) TO authenticated;

-- Insert some sample data (optional - remove in production)
-- This is just for testing purposes
/*
INSERT INTO students (user_id, name, email, fees_paid) VALUES
    ('00000000-0000-0000-0000-000000000001', 'John Doe', 'john@example.com', true),
    ('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane@example.com', false),
    ('00000000-0000-0000-0000-000000000003', 'Bob Johnson', 'bob@example.com', true),
    ('00000000-0000-0000-0000-000000000004', 'Alice Brown', 'alice@example.com', false);
*/
