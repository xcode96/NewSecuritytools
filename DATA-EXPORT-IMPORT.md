# Data Export/Import Guide

This guide explains how to export and import all your data using JSON.

## 📤 Export Data

Export all data from TypeScript files to JSON:

```bash
npm run export-data
```

This will create a `data-export/` folder with JSON files:
- `tools.json`
- `books.json`
- `useful-links.json`
- `platforms.json`
- `certifications.json`
- `downloads.json`
- `frameworks.json`
- `breach-services.json`
- `youtubers.json`

## 📥 Import Data

Import JSON data into Supabase:

```bash
npm run import-data
```

**Prerequisites:**
1. Run the SQL migration first (`migration_resources.sql`)
2. Make sure your `.env` file has correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 🔄 Workflow

### Backup Current Data
```bash
npm run export-data
```

### Seed Supabase Database
1. Run SQL migration in Supabase SQL Editor
2. Run import script:
```bash
npm run import-data
```

### Edit JSON and Re-import
1. Edit JSON files in `data-export/`
2. Run import:
```bash
npm run import-data
```

## ⚠️ Important Notes

- The import script does NOT delete existing data by default
- To replace data, uncomment the delete line in `scripts/importData.ts`
- Data is imported in batches of 100 items
- Check console for any import errors

## 📁 File Structure

```
testings-main/
├── scripts/
│   ├── exportData.ts    # Export script
│   └── importData.ts    # Import script
└── data-export/         # Generated JSON files
    ├── tools.json
    ├── books.json
    └── ...
```
