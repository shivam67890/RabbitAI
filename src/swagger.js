import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sales Insight Automator API',
      version: '1.0.0',
      description: 'AI-powered tool to summarize sales data and email reports.',
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/routes.js'], 
};

export const specs = swaggerJsdoc(options);