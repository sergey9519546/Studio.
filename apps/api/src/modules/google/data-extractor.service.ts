import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { docs_v1, sheets_v4 } from 'googleapis';
import { AuthenticatedUser, GoogleClientFactory } from './google-client.factory.js';

type SheetValues = NonNullable<sheets_v4.Schema$ValueRange['values']>;
type StructuralElement = docs_v1.Schema$StructuralElement;

@Injectable()
export class DataExtractorService {
  private readonly logger = new Logger(DataExtractorService.name);
  private readonly ROW_LIMIT = 500;

  constructor(private readonly clientFactory: GoogleClientFactory) { }

  /**
   * Extracts data from a Google Sheet and converts it to a Markdown table string.
   * Handles truncation for large datasets.
   */
  async extractSheetData(user: AuthenticatedUser, fileId: string): Promise<string> {
    const { sheets } = this.clientFactory.createClients(user);

    try {
      // 1. Fetch Data
      // Fetching all data from the first sheet by default (assuming A1 notation without sheet name gets first sheet in some contexts, 
      // but getting sheet name first is safer).
      const meta = await sheets.spreadsheets.get({ spreadsheetId: fileId });
      const sheetName = meta.data.sheets?.[0]?.properties?.title;

      if (!sheetName) throw new Error('No sheets found');

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: fileId,
        range: sheetName, // Get full range
        valueRenderOption: 'FORMATTED_VALUE',
      });

      let rows: SheetValues = response.data.values ?? [];

      // 2. Intelligent Cleaning
      // Remove completely empty rows
      rows = rows.filter(
        (row): row is SheetValues[number] =>
          Array.isArray(row) &&
          row.some(cell => cell !== '' && cell !== null && cell !== undefined)
      );

      if (rows.length === 0) return 'Sheet is empty.';

      // 3. Truncation Handling
      let warningNote = '';
      if (rows.length > this.ROW_LIMIT) {
        warningNote = `\n\n[Warning: Data truncated to first ${this.ROW_LIMIT} rows due to size limits.]`;
        rows = rows.slice(0, this.ROW_LIMIT);
      }

      // 4. Transform to Markdown
      return this.convertToMarkdown(rows) + warningNote;

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Sheet extraction failed: ${message}`);
      throw new BadRequestException(`Failed to extract sheet data: ${message}`);
    }
  }

  /**
   * Extracts text content from a Google Doc.
   */
  async extractDocText(user: AuthenticatedUser, fileId: string): Promise<string> {
    const { docs } = this.clientFactory.createClients(user);

    try {
      const doc = await docs.documents.get({ documentId: fileId });
      const content: StructuralElement[] = doc.data.body?.content ?? [];

      if (content.length === 0) return '';

      let fullText = '';

      // Iterate through structural elements
      content.forEach((element: StructuralElement) => {
        if (element.paragraph?.elements) {
          element.paragraph.elements.forEach(el => {
            const text = el.textRun?.content;
            if (text) {
              fullText += text;
            }
          });
          return;
        }

        if (element.table?.tableRows) {
          element.table.tableRows.forEach(row => {
            row.tableCells?.forEach(cell => {
              cell.content?.forEach(cellContent => {
                cellContent.paragraph?.elements?.forEach(el => {
                  const text = el.textRun?.content;
                  if (text) fullText += `${text} `;
                });
              });
              fullText += ' | ';
            });
            fullText += '\n';
          });
        }
      });

      return fullText.trim();

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Doc extraction failed: ${message}`);
      throw new BadRequestException(`Failed to extract doc text: ${message}`);
    }
  }

  private convertToMarkdown(rows: SheetValues): string {
    if (rows.length === 0) return '';

    const headers = rows[0].map(h => String(h || '').trim());
    const body = rows.slice(1);

    const headerRow = `| ${headers.join(' | ')} |`;
    const separator = `| ${headers.map(() => '---').join(' | ')} |`;

    const bodyRows = body.map(row => {
      // Ensure row has same length as header, pad with empty strings
      const paddedRow = [...row];
      while (paddedRow.length < headers.length) paddedRow.push('');

      const cells = paddedRow.slice(0, headers.length).map(cell => {
        const str = String(cell ?? '').trim();
        // Escape pipes to prevent breaking table
        return str.replace(/\|/g, '\\|').replace(/\n/g, ' ');
      });
      return `| ${cells.join(' | ')} |`;
    });

    return [headerRow, separator, ...bodyRows].join('\n');
  }
}
