import { PrismaService } from '../../prisma/prisma.service';

export const getTools = (prisma: PrismaService) => [
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
    function: async ({ title, description, budget }) => {
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
    function: async ({ projectId, freelancerId, role }) => {
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
