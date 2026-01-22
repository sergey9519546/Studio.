import { BadRequestException, Injectable } from '@nestjs/common';
import { parse as parseCsv } from 'csv-parse/sync';
import * as xlsx from 'xlsx';
import { MulterFile, ProjectInput } from './projects-import.types.js';

@Injectable()
export class ProjectsImportService {
  async parseFile(file: MulterFile): Promise<ProjectInput[]> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const fileType = this.getFileType(file);
    const rows = await this.parseRows(file, fileType);

    if (rows.length === 0) {
      return [];
    }

    return this.normalizeRows(rows);
  }

  private getFileType(file: MulterFile): string {
    const mimeType = file.mimetype.toLowerCase();
    const filename = file.originalname.toLowerCase();

    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || filename.endsWith('.xlsx') || filename.endsWith('.xls')) {
      return 'excel';
    }
    if (mimeType.includes('csv') || filename.endsWith('.csv')) {
      return 'csv';
    }
    if (mimeType.includes('json') || filename.endsWith('.json')) {
      return 'json';
    }
    if (mimeType.includes('document') || filename.endsWith('.docx') || filename.endsWith('.doc')) {
      return 'document';
    }
    return 'text';
  }

  private async parseRows(file: MulterFile, fileType: string): Promise<Record<string, unknown>[]> {
    switch (fileType) {
      case 'excel':
        return this.parseExcel(file);
      case 'csv':
        return this.parseCsv(file);
      case 'json':
        return this.parseJson(file);
      case 'document':
      case 'text':
      default:
        throw new BadRequestException(`Unsupported file type for structured import: ${file.originalname}`);
    }
  }

  private parseExcel(file: MulterFile): Record<string, unknown>[] {
    const workbook = xlsx.read(file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return [];
    }

    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });
  }

  private parseCsv(file: MulterFile): Record<string, unknown>[] {
    const fileContent = file.buffer.toString('utf-8');
    return parseCsv(fileContent, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      trim: true,
      relax_column_count: true,
    }) as Record<string, unknown>[];
  }

  private parseJson(file: MulterFile): Record<string, unknown>[] {
    const fileContent = file.buffer.toString('utf-8');
    const parsed = JSON.parse(fileContent) as unknown;

    if (Array.isArray(parsed)) {
      return parsed as Record<string, unknown>[];
    }

    if (parsed && typeof parsed === 'object') {
      const typed = parsed as { rows?: unknown; data?: unknown };
      if (Array.isArray(typed.rows)) {
        return typed.rows as Record<string, unknown>[];
      }
      if (Array.isArray(typed.data)) {
        return typed.data as Record<string, unknown>[];
      }
      return [parsed as Record<string, unknown>];
    }

    throw new BadRequestException('JSON file did not contain an object or array of rows.');
  }

  private normalizeRows(rows: Record<string, unknown>[]): ProjectInput[] {
    const headers = Array.from(new Set(rows.flatMap(row => Object.keys(row))));
    const mapping = this.getHeuristicMapping(headers);

    return rows
      .map(row => {
        const mapped = this.applyImportMapping(row, mapping);
        return this.sanitizeImportedRow(mapped);
      })
      .filter(row => Object.keys(row).length > 0);
  }

  private getHeuristicMapping(headers: string[]) {
    const synonyms: Record<string, string[]> = {
      title: ['project name', 'project title', 'title', 'name', 'project'],
      client: ['client', 'client name', 'customer', 'customer name', 'account'],
      description: ['description', 'brief', 'summary', 'overview', 'details'],
      status: ['status', 'state', 'phase'],
      budget: ['budget', 'cost', 'price', 'amount', 'estimate'],
      startDate: ['start date', 'start', 'kickoff', 'begin date', 'begin'],
      endDate: ['end date', 'end', 'finish date', 'completion date'],
      dueDate: ['due date', 'deadline', 'delivery date', 'target date'],
      roleRequirements: ['roles', 'role requirements', 'requirements', 'deliverables', 'team'],
      tags: ['tags', 'labels', 'categories'],
    };

    const mapping: Record<string, string> = {};
    for (const header of headers) {
      const normalized = this.normalizeHeader(header);
      for (const [field, patterns] of Object.entries(synonyms)) {
        if (patterns.some(pattern => normalized === this.normalizeHeader(pattern))) {
          mapping[header] = field;
          break;
        }
      }
    }

    return mapping;
  }

  private normalizeHeader(header: string) {
    return header.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  private applyImportMapping(item: Record<string, unknown>, mapping: Record<string, string>) {
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(item)) {
      const target = mapping[key];
      if (target) {
        mapped[target] = value;
      } else {
        mapped[key] = value;
      }
    }
    return mapped;
  }

  private sanitizeImportedRow(row: Record<string, unknown>): ProjectInput {
    const sanitized: ProjectInput = { ...row };

    if (sanitized.budget !== undefined) {
      sanitized.budget = this.parseBudget(sanitized.budget);
    }

    if (sanitized.startDate) {
      sanitized.startDate = this.parseDate(sanitized.startDate);
    }

    if (sanitized.endDate) {
      sanitized.endDate = this.parseDate(sanitized.endDate);
    }

    if (sanitized.dueDate) {
      sanitized.dueDate = this.parseDate(sanitized.dueDate);
    }

    for (const key of Object.keys(sanitized)) {
      const value = sanitized[key];
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      }
    }

    if (sanitized.tags && typeof sanitized.tags === 'string') {
      sanitized.tags = sanitized.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    }

    return sanitized;
  }

  private parseBudget(value: unknown): number | undefined {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string') {
      const cleaned = value.replace(/[^0-9().-]+/g, '');
      const parsed = parseFloat(cleaned.replace(/[()]/g, ''));
      if (Number.isNaN(parsed)) {
        return undefined;
      }
      return cleaned.includes('(') && cleaned.includes(')') ? -Math.abs(parsed) : parsed;
    }
    return undefined;
  }

  private parseDate(value: unknown): Date | undefined {
    if (!value) {
      return undefined;
    }
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }
    if (typeof value === 'number' && Number.isFinite(value)) {
      const dateCode = xlsx.SSF.parse_date_code(value);
      if (dateCode) {
        return new Date(Date.UTC(dateCode.y, dateCode.m - 1, dateCode.d, dateCode.H, dateCode.M, dateCode.S));
      }
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    if (typeof value === 'string') {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    return undefined;
  }
}
