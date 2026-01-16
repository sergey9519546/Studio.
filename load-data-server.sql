-- Unsplash Dataset Data Loading Script (Server-Side)
-- This script loads data from TSV files on the PostgreSQL server
-- Make sure the {path} placeholder is set to C:\Users\serge\Videos\unsplash-research-dataset-lite-latest

-- Set the path (replace {path} with the actual server path)
-- For example: SET data_path = 'C:/Users/serge/Videos/unsplash-research-dataset-lite-latest';
SET data_path = 'C:/Users/serge/Videos/unsplash-research-dataset-lite-latest';

-- Load photos data
COPY photos (
    photo_id,
    photo_url,
    photo_image_url,
    photo_submitted_at,
    photo_featured,
    photo_width,
    photo_height,
    photo_aspect_ratio,
    photo_description,
    photographer_username,
    photographer_first_name,
    photographer_last_name,
    exif_camera_make,
    exif_camera_model,
    exif_iso,
    exif_aperture_value,
    exif_focal_length,
    exif_exposure_time,
    photo_location_name,
    photo_location_latitude,
    photo_location_longitude,
    photo_location_country,
    photo_location_city,
    stats_views,
    stats_downloads,
    ai_description,
    ai_primary_landmark_name,
    ai_primary_landmark_latitude,
    ai_primary_landmark_longitude,
    ai_primary_landmark_confidence,
    blur_hash
) FROM :'data_path'/'photos.csv000' WITH (FORMAT csv, DELIMITER E'\t', HEADER true);

-- Load keywords data
COPY keywords (
    photo_id,
    keyword,
    ai_service_1_confidence,
    ai_service_2_confidence,
    suggested_by_user,
    user_suggestion_source
) FROM :'data_path'/'keywords.csv000' WITH (FORMAT csv, DELIMITER E'\t', HEADER true);

-- Load collections data
COPY collections (
    photo_id,
    collection_id,
    collection_title,
    photo_collected_at,
    collection_type
) FROM :'data_path'/'collections.csv000' WITH (FORMAT csv, DELIMITER E'\t', HEADER true);

-- Load conversions data
COPY conversions (
    converted_at,
    conversion_type,
    keyword,
    photo_id,
    anonymous_user_id,
    conversion_country
) FROM :'data_path'/'conversions.csv000' WITH (FORMAT csv, DELIMITER E'\t', HEADER true);

-- Load colors data
COPY colors (
    photo_id,
    hex,
    red,
    green,
    blue,
    keyword,
    coverage,
    score
) FROM :'data_path'/'colors.csv000' WITH (FORMAT csv, DELIMITER E'\t', HEADER true);

-- Show loading statistics
SELECT
    'photos' as table_name,
    COUNT(*) as row_count
FROM photos
UNION ALL
SELECT
    'keywords' as table_name,
    COUNT(*) as row_count
FROM keywords
UNION ALL
SELECT
    'collections' as table_name,
    COUNT(*) as row_count
FROM collections
UNION ALL
SELECT
    'conversions' as table_name,
    COUNT(*) as row_count
FROM conversions
UNION ALL
SELECT
    'colors' as table_name,
    COUNT(*) as row_count
FROM colors;
