-- Unsplash Dataset Database Schema
-- This script creates the database tables for the Unsplash Lite Dataset

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS conversions CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS keywords CASCADE;
DROP TABLE IF EXISTS photos CASCADE;

-- Photos table
CREATE TABLE photos (
    photo_id VARCHAR(255) PRIMARY KEY,
    photo_url VARCHAR(2048),
    photo_image_url VARCHAR(2048),
    photo_submitted_at TIMESTAMP,
    photo_featured BOOLEAN,
    photo_width INTEGER,
    photo_height INTEGER,
    photo_aspect_ratio DECIMAL(10,2),
    photo_description TEXT,
    photographer_username VARCHAR(255),
    photographer_first_name VARCHAR(255),
    photographer_last_name VARCHAR(255),
    exif_camera_make VARCHAR(255),
    exif_camera_model VARCHAR(255),
    exif_iso INTEGER,
    exif_aperture_value VARCHAR(50),
    exif_focal_length VARCHAR(50),
    exif_exposure_time VARCHAR(50),
    photo_location_name VARCHAR(255),
    photo_location_latitude DECIMAL(10,6),
    photo_location_longitude DECIMAL(10,6),
    photo_location_country VARCHAR(100),
    photo_location_city VARCHAR(100),
    stats_views INTEGER,
    stats_downloads INTEGER,
    ai_description TEXT,
    ai_primary_landmark_name VARCHAR(255),
    ai_primary_landmark_latitude DECIMAL(10,6),
    ai_primary_landmark_longitude DECIMAL(10,6),
    ai_primary_landmark_confidence DECIMAL(5,2),
    blur_hash VARCHAR(255)
);

-- Keywords table (photo-keyword relationships)
CREATE TABLE keywords (
    photo_id VARCHAR(255) REFERENCES photos(photo_id),
    keyword VARCHAR(255),
    ai_service_1_confidence DECIMAL(5,2),
    ai_service_2_confidence DECIMAL(5,2),
    suggested_by_user BOOLEAN,
    user_suggestion_source VARCHAR(50),
    PRIMARY KEY (photo_id, keyword)
);

-- Collections table (photo-collection relationships)
CREATE TABLE collections (
    photo_id VARCHAR(255) REFERENCES photos(photo_id),
    collection_id VARCHAR(255),
    collection_title VARCHAR(255),
    photo_collected_at TIMESTAMP,
    collection_type VARCHAR(50),
    PRIMARY KEY (photo_id, collection_id)
);

-- Conversions table (search conversion data)
CREATE TABLE conversions (
    converted_at TIMESTAMP,
    conversion_type VARCHAR(50),
    keyword VARCHAR(255),
    photo_id VARCHAR(255) REFERENCES photos(photo_id),
    anonymous_user_id VARCHAR(255),
    conversion_country VARCHAR(10)
);

-- Colors table (photo color analysis)
CREATE TABLE colors (
    photo_id VARCHAR(255) REFERENCES photos(photo_id),
    hex VARCHAR(7),
    red INTEGER,
    green INTEGER,
    blue INTEGER,
    keyword VARCHAR(50),
    coverage DECIMAL(10,8),
    score DECIMAL(10,8),
    PRIMARY KEY (photo_id, hex)
);

-- Create indexes for better query performance
CREATE INDEX idx_photos_photographer ON photos(photographer_username);
CREATE INDEX idx_photos_location ON photos(photo_location_country, photo_location_city);
CREATE INDEX idx_photos_stats ON photos(stats_views, stats_downloads);
CREATE INDEX idx_keywords_keyword ON keywords(keyword);
CREATE INDEX idx_keywords_photo ON keywords(photo_id);
CREATE INDEX idx_collections_collection_id ON collections(collection_id);
CREATE INDEX idx_conversions_keyword ON conversions(keyword);
CREATE INDEX idx_conversions_photo ON conversions(photo_id);
CREATE INDEX idx_colors_photo ON colors(photo_id);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;
