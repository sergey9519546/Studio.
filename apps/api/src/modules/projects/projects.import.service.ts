import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { GenAIService } from '../../common/ai/gen-ai.service.js';

/**
 * Service responsible for handling project data ingestion from external files.
 * Adheres to the "Logic Before Syntax" philosophy by ensuring strict data validation
 * and intelligent mapping before any persistence occurs.
 */
@Injectable()
export class ProjectsImportService {
  private readonly logger = new Logger(ProjectsImportService.name);

  constructor(private readonly genAIService: GenAIService) {}

  /**
   * Parses the raw buffer from an uploaded file into a structural JSON format.
   *
   * @param buffer - The raw binary data of the uploaded file.
   * @param mimeType - The MIME type to determine parsing strategy (currently supports Excel/CSV).
   * @returns A raw array of objects representing the rows in the spreadsheet.
   */
  parseFile(buffer: Buffer, mimeType: string): Record<string, unknown>[] {
    this.logger.log(`Parsing file with MIME type: ${mimeType}`);

    try {
      // XLSX.read handles both .xlsx and .csv binary buffers.
      // cellDates: true ensures we get Date objects instead of serial numbers where possible.
      const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });

      // We strictly assume the logic resides in the first sheet.
      // Multi-sheet logic would require a "Tree/Matrix" data structure handling approach.
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error('Structural Failure: The uploaded file contains no sheets.');
      }

      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to a raw JSON list.
      const rawData = XLSX.utils.sheet_to_json(sheet);

      this.logger.log(`Successfully parsed ${rawData.length} rows from sheet "${sheetName}".`);
      return rawData as Record<string, unknown>[];
    } catch (error) {
      this.logger.error('Parsing Protocol Failed', error);
      throw new Error('Parsing Protocol Failed: ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  /**
   * Orchestrates the transformation of raw spreadsheet data into strict Project Schema objects.
   * Uses AI to perform fuzzy matching on headers, then applies deterministic sanitization.
   *
   * @param rawProjectData - The unstructured list of objects from the parser.
   * @returns A list of sanitized, schema-compliant project objects ready for database insertion.
   */
  async analyzeAndMap(rawProjectData: Record<string, unknown>[]): Promise<any[]> {
    // "Break-Proofing": Fail gracefully if input is empty.
    if (rawProjectData.length === 0) {
      this.logger.warn('Input Verification: The uploaded file contained no data rows.');
      return [];
    }

    // Extract headers to determine the "Data Shape".
    const sourceHeaders = Object.keys(rawProjectData[0]);
    this.logger.log(`Analyzing Data Shape: Detected headers [${sourceHeaders.join(', ')}]`);

    // Determine the mapping logic (AI vs Heuristic).
    const fieldMapping = await this.determineFieldMapping(sourceHeaders);
    this.logger.log(`Mapping Protocol Established: ${JSON.stringify(fieldMapping)}`);

    // Apply the transformation logic to each item in the list.
    return rawProjectData.map(row => this.applyTransformation(row, fieldMapping));
  }

  /**
   * Uses Generative AI to deduce the relationship between arbitrary CSV headers
   * and our strict Schema definitions.
   */
  private async determineFieldMapping(sourceHeaders: string[]): Promise<Record<string, string>> {
    const targetSchemaFields = ['title', 'client', 'budget', 'startDate', 'endDate', 'description', 'status'];

    // Construct a prompt that demands a strictly formatted JSON response.
    const mappingPrompt = `
      I have a dataset with these headers: ${JSON.stringify(sourceHeaders)}.
      I need to map them to these strict database fields: ${JSON.stringify(targetSchemaFields)}.
      Return ONLY a valid JSON object where keys are the CSV headers and values are the target database fields.
      If a header does not semantically match any target, ignore it.
      Example: {"Project Name": "title", "Cost": "budget"}
    `;

    try {
      const aiResponse = await this.genAIService.generateText(mappingPrompt);
      // Sanitize the response to ensure valid JSON parsing.
      const cleanJson = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (e) {
      this.logger.warn('AI Mapping Intelligence failed or returned invalid JSON. Falling back to Deterministic Heuristics.');
      return this.heuristicMapping(sourceHeaders);
    }
  }

  /**
   * A deterministic fallback strategy for field mapping when AI is unavailable or fails.
   * Uses a keyword dictionary to match headers.
   */
  private heuristicMapping(headers: string[]): Record<string, string> {
    const mapping: Record<string, string> = {};
    const keywordDictionary: Record<string, string[]> = {
      title: ['name', 'title', 'project', 'subject', 'task'],
      client: ['client', 'customer', 'company', 'brand'],
      budget: ['budget', 'cost', 'price', 'value', 'amount'],
      startDate: ['start', 'begin', 'launch'],
      endDate: ['end', 'due', 'deadline', 'delivery'],
      description: ['desc', 'description', 'details', 'brief', 'notes'],
      status: ['status', 'state', 'stage', 'progress']
    };

    for (const header of headers) {
      const normalizedHeader = header.toLowerCase();
      for (const [targetField, keywords] of Object.entries(keywordDictionary)) {
        if (keywords.some(keyword => normalizedHeader.includes(keyword))) {
          mapping[header] = targetField;
          break; // Stop checking this header once a match is found.
        }
      }
    }
    return mapping;
  }

  /**
   * Applies the mapping and performs data type enforcement (Sanitization).
   */
  private applyTransformation(row: Record<string, unknown>, mapping: Record<string, string>) {
    const transformedResult: any = {};

    for (const [sourceHeader, targetField] of Object.entries(mapping)) {
      if (row[sourceHeader] !== undefined) {
        transformedResult[targetField] = this.enforceDataType(targetField, row[sourceHeader]);
      }
    }

    return transformedResult;
  }

  /**
   * Strictly enforces data types defined in the Schema.
   * Converts loose CSV strings into precise Floats and Dates.
   */
  private enforceDataType(field: string, value: unknown): any {
    if (value === null || value === undefined) return undefined;

    // If the parser already gave us a Date object, respect it.
    if ((field === 'startDate' || field === 'endDate') && value instanceof Date) {
        return value;
    }

    const stringValue = String(value).trim();

    if (field === 'budget') {
      // Remove currency symbols and commas to extract the scalar magnitude.
      const scalarValue = parseFloat(stringValue.replace(/[^0-9.-]/g, ''));
      return isNaN(scalarValue) ? undefined : scalarValue;
    }

    if (field === 'startDate' || field === 'endDate') {
        const dateObject = new Date(stringValue);
        return isNaN(dateObject.getTime()) ? undefined : dateObject;
    }

    return stringValue;
  }
}
