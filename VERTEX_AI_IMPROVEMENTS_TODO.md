# Vertex AI Service Improvements Todo

## Issues Identified
- [ ] Fix unused `systemPrompt` parameter in `chat` method
- [ ] Improve `generateContent` method to filter undefined values in `generationConfig`
- [ ] Consider making model parameter explicit in `chat` method
- [ ] Review type safety for `schema` parameter in `extractData`

## Implementation Plan
- [ ] 1. Add systemInstruction to startChat call when systemPrompt is provided
- [ ] 2. Refactor generationConfig creation to filter undefined values
- [ ] 3. Add optional model parameter to chat method with default
- [ ] 4. Update types if needed for better type safety
- [ ] 5. Test the changes

## Expected Benefits
- Proper utilization of systemPrompt parameter
- Cleaner API calls without undefined values
- More flexible model selection for chat
- Better type safety and developer experience
