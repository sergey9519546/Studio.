# Unsplash Dataset PostgreSQL Setup Guide

## Overview
This guide provides complete instructions for setting up the Unsplash Lite Dataset in PostgreSQL. The dataset contains 5 TSV files with photo metadata, keywords, collections, conversions, and color analysis.

## Files Created
- `create_tables.sql` - Database schema creation
- `load-data-server.sql` - Server-side data loading (when PostgreSQL server can access the files directly)
- `load-data-client.sql` - Client-side data loading (for remote PostgreSQL connections)

## Prerequisites
1. PostgreSQL installed and running
2. Database created (you'll need to specify database name)
3. User with appropriate permissions
4. Dataset files extracted to: `C:\Users\serge\Videos\unsplash-research-dataset-lite-latest`

## Database Connection Details Needed
Before running the commands, you need to specify:
- **Username**: Your PostgreSQL username
- **Database**: Your database name  
- **Host**: PostgreSQL server address (localhost for local, or remote IP/hostname)

## Setup Steps

### Step 1: Create Database Tables
```bash
psql -U <username> -d <database> -a -f create_tables.sql
```

### Step 2: Load Data (Choose ONE method)

#### Option A: Server-Side Loading (Recommended if server can access the files)
```bash
psql -U <username> -d <database> -f load-data-server.sql
```

#### Option B: Client-Side Loading (For remote PostgreSQL servers)
```bash
psql -U <username> -d <database> -f load-data-client.sql
```

## Database Schema

### Tables Created:
1. **photos** - Main photo metadata (25,000+ records)
2. **keywords** - Photo-keyword relationships 
3. **collections** - Photo-collection relationships
4. **conversions** - Search conversion data
5. **colors** - Photo color analysis

### Key Features:
- Proper foreign key relationships
- Optimized indexes for common queries
- Data type optimization for performance
- Tab-separated format handling

## Verification

After loading, verify the data with:
```sql
-- Check row counts
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

-- Sample queries
SELECT COUNT(*) FROM photos WHERE photo_featured = true;
SELECT COUNT(*) FROM keywords WHERE ai_service_1_confidence > 90;
SELECT COUNT(*) FROM conversions WHERE conversion_country = 'US';
```

## Example Queries

### Find popular photos by photographer
```sql
SELECT 
    p.photographer_username,
    p.photographer_first_name,
    p.photographer_last_name,
    COUNT(*) as photo_count,
    SUM(p.stats_downloads) as total_downloads
FROM photos p
GROUP BY p.photographer_username, p.photographer_first_name, p.photographer_last_name
ORDER BY total_downloads DESC
LIMIT 10;
```

### Analyze color trends
```sql
SELECT 
    c.keyword as color_name,
    COUNT(*) as usage_count,
    AVG(c.coverage) as avg_coverage
FROM colors c
GROUP BY c.keyword
ORDER BY usage_count DESC
LIMIT 20;
```

### Find conversion patterns
```sql
SELECT 
    keyword,
    COUNT(*) as conversions,
    COUNT(DISTINCT anonymous_user_id) as unique_users,
    COUNT(DISTINCT conversion_country) as countries
FROM conversions
GROUP BY keyword
ORDER BY conversions DESC
LIMIT 10;
```

## Troubleshooting

### Common Issues:
1. **Permission Denied**: Ensure user has INSERT privileges
2. **File Not Found**: Verify path to dataset files
3. **Data Format Error**: Files are TSV (tab-separated), not CSV
4. **Connection Refused**: Check PostgreSQL service is running

### Performance Tips:
- Indexes are pre-created for common query patterns
- Consider VACUUM ANALYZE after loading for optimal performance
- For large datasets, consider partitioning strategies

## Support
If you encounter issues:
1. Check PostgreSQL logs
2. Verify file paths and permissions
3. Ensure all prerequisites are met
4. Test with a single table first (photos.sql)

---

**Note**: The dataset files use `.csv000` extension but contain tab-separated values (TSV). The scripts are configured to handle this correctly.
