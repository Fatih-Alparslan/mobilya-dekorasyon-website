-- Migration: Add featured image support to project_images table
-- Date: 2026-01-03

USE mobilyadekorasyon;

-- Add is_featured column to project_images table if it doesn't exist
SET @dbname = DATABASE();
SET @tablename = 'project_images';
SET @columnname = 'is_featured';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  'ALTER TABLE project_images ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER display_order'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Set the first image (lowest display_order) of each project as featured
UPDATE project_images pi1
INNER JOIN (
    SELECT project_id, MIN(display_order) as min_order
    FROM project_images
    GROUP BY project_id
) pi2 ON pi1.project_id = pi2.project_id AND pi1.display_order = pi2.min_order
SET pi1.is_featured = TRUE;

-- Create index for better query performance
CREATE INDEX idx_is_featured ON project_images(project_id, is_featured);

SELECT 'Migration completed successfully!' as status;
