-- Create function to generate default shelves for new users
CREATE OR REPLACE FUNCTION create_default_shelves()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default shelves for the new user
  INSERT INTO shelves (id, user_id, type) VALUES
    (gen_random_uuid(), NEW.id, 'TBR'),
    (gen_random_uuid(), NEW.id, 'READ'),
    (gen_random_uuid(), NEW.id, 'DNF'),
    (gen_random_uuid(), NEW.id, 'READING');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create default shelves when a user is inserted
CREATE TRIGGER trigger_create_default_shelves
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_shelves();
