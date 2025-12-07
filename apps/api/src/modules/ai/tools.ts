import { PrismaService } from '../../prisma/prisma.service';
import type { ToolDefinition } from './types';

export const getTools = (prisma: PrismaService): ToolDefinition[] => [
  {
    name: 'createProject',
    description: 'Create a new project',
    parameters: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'The title of the project' },
        description: { type: 'string', description: 'The description of the project' },
        budget: { type: 'number', description: 'The budget for the project' },
      },
      required: ['title', 'description', 'budget'],
    },
    function: async (args: Record<string, unknown>) => {
      const { title, description, budget } = args as {
        title: string;
        description: string;
        budget: number;
      };
      const project = await prisma.project.create({
        data: {
          title,
          description,
          budget,
        },
      });
      return project;
    },
  },
  {
    name: 'assignFreelancer',
    description: 'Assign a freelancer to a project',
    parameters: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'The ID of the project' },
        freelancerId: { type: 'string', description: 'The ID of the freelancer' },
        role: { type: 'string', description: 'The role of the freelancer in the project' },
      },
      required: ['projectId', 'freelancerId', 'role'],
    },
    function: async (args: Record<string, unknown>) => {
      const { projectId, freelancerId, role } = args as {
        projectId: string;
        freelancerId: string;
        role: string;
      };
      const assignment = await prisma.assignment.create({
        data: {
          projectId,
          freelancerId,
          role,
          startDate: new Date(),
          endDate: new Date(),
        },
      });
      return assignment;
    },
  },
];
