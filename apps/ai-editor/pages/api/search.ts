import { NextApiRequest, NextApiResponse } from 'next';
import { experiments, searchExperiments } from '../../data/experimentsData';

interface SearchRequest {
  query: string;
  category?: string;
  difficulty?: string;
  status?: string;
  limit?: number;
}

interface SearchResponse {
  results: any[];
  total: number;
  query: string;
  filters: {
    category?: string;
    difficulty?: string;
    status?: string;
  };
}

export default function handler(req: NextApiRequest, res: NextApiResponse<SearchResponse | { error: string }>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    q: query = '', 
    category = 'all', 
    difficulty = 'all', 
    status = 'all',
    limit = 20 
  } = req.query;

  try {
    // Start with all experiments
    let results = [...experiments];

    // Apply text search if query provided
    if (query && typeof query === 'string') {
      results = searchExperiments(query);
    }

    // Apply filters
    if (category && category !== 'all') {
      results = results.filter(exp => exp.category === category);
    }

    if (difficulty && difficulty !== 'all') {
      results = results.filter(exp => exp.difficulty === difficulty);
    }

    if (status && status !== 'all') {
      results = results.filter(exp => exp.status === status);
    }

    // Apply limit
    const limitedResults = results.slice(0, Number(limit));

    // Add search relevance scoring
    const scoredResults = limitedResults.map(experiment => {
      let score = 0;
      const queryLower = query.toLowerCase();

      // Title match (highest priority)
      if (experiment.title.toLowerCase().includes(queryLower)) {
        score += 10;
      }

      // Description match
      if (experiment.description.toLowerCase().includes(queryLower)) {
        score += 5;
      }

      // Tag match
      const tagMatches = experiment.tags.filter(tag => 
        tag.toLowerCase().includes(queryLower)
      ).length;
      score += tagMatches * 3;

      // Technology match
      const techMatches = experiment.technologies.filter(tech => 
        tech.toLowerCase().includes(queryLower)
      ).length;
      score += techMatches * 2;

      return {
        ...experiment,
        relevanceScore: score
      };
    });

    // Sort by relevance score
    scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    const response: SearchResponse = {
      results: scoredResults,
      total: results.length,
      query: query as string,
      filters: {
        category: category as string,
        difficulty: difficulty as string,
        status: status as string
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}