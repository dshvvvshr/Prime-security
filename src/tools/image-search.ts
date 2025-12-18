import { z } from 'zod';
import { braveSearchApi } from '../brave-api.js';

export const imageSearchSchema = z.object({
  q: z.string().describe('The search query for images'),
  count: z.number().min(1).max(150).optional().describe('Number of results (1-150)'),
  safesearch: z.enum(['off', 'moderate', 'strict']).optional().describe('Safe search level'),
  spellcheck: z.boolean().optional().describe('Enable spell checking'),
});

export async function imageSearch(args: z.infer<typeof imageSearchSchema>, apiKey: string) {
  const data = await braveSearchApi('images/search', args, apiKey);
  
  let output = '# Image Search Results\n\n';
  
  if (data.results && data.results.length > 0) {
    data.results.forEach((result: any, index: number) => {
      output += `### ${index + 1}. ${result.title || 'Untitled'}\n`;
      output += `**Image URL:** ${result.url || 'N/A'}\n`;
      output += `**Thumbnail:** ${result.thumbnail?.src || 'N/A'}\n`;
      output += `**Source:** ${result.source || 'N/A'}\n`;
      if (result.properties) {
        output += `**Dimensions:** ${result.properties.width || 'N/A'}x${result.properties.height || 'N/A'}\n`;
      }
      output += '\n';
    });
  } else {
    output += 'No images found.\n';
  }
  
  return {
    content: [
      {
        type: 'text',
        text: output,
      },
    ],
  };
}
