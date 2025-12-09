# Fix Confluence Service TypeScript Error

## Objective
Fix the TypeScript error "'error' is of type 'unknown'" in the Confluence service file.

## Tasks
- [ ] Analyze the current code to understand the error
- [ ] Fix TypeScript error in validatePageAccess method (line 65)
- [ ] Fix TypeScript error in getPageMetadata method 
- [ ] Verify the changes work correctly

## Steps
1. Read the current confluence.service.ts file
2. Identify all places where 'error.message' is accessed without proper typing
3. Implement proper error handling with type guards
4. Test the changes
