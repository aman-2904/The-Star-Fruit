-- Create a sequence starting from 100
CREATE SEQUENCE IF NOT EXISTS property_ls_seq START 100;

-- Add the sequence column and the generated ls_id column
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS property_sequence_id INTEGER DEFAULT nextval('property_ls_seq'),
ADD COLUMN IF NOT EXISTS ls_id VARCHAR(255) GENERATED ALWAYS AS ('LV' || property_sequence_id) STORED;
