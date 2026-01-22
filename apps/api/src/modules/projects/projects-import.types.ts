export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

export interface ProjectInput {
  name?: string;
  clientName?: string;
  roleRequirements?: { role: string; count?: number; skills: string[] }[];
  knowledgeBase?: { title: string; content: string; category: string }[];
  budget?: string | number;
  startDate?: string | Date;
  dueDate?: string | Date;
  description?: string;
  status?: string;
  priority?: string;
  tags?: string[];
  title?: string;
  client?: string;
  endDate?: string | Date;
  [key: string]: unknown;
}
