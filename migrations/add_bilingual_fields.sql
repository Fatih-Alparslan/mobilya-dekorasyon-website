-- Add bilingual fields to projects table
ALTER TABLE projects 
ADD COLUMN title_en VARCHAR(255) NULL AFTER title,
ADD COLUMN description_en TEXT NULL AFTER description;
