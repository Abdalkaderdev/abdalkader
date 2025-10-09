import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiTrendingUp, FiTarget, FiExternalLink, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { TARGET_KEYWORDS, SEO_STRATEGIES } from '../../utils/seoOptimizer';

interface Competitor {
  name: string;
  url: string;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  performance: {
    lighthouse: number;
    loadTime: number;
    mobileScore: number;
  };
  content: {
    wordCount: number;
    headings: string[];
    images: number;
  };
  ranking: {
    [key: string]: number;
  };
}

interface CompetitiveAnalyzerProps {
  showDetails?: boolean;
  className?: string;
}

export default function CompetitiveAnalyzer({ showDetails = false, className = '' }: CompetitiveAnalyzerProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ourRankings, setOurRankings] = useState<Record<string, number>>({});
  const [keywordGaps, setKeywordGaps] = useState<string[]>([]);

  useEffect(() => {
    // Mock competitor data - in real implementation, this would come from an API
    const mockCompetitors: Competitor[] = [
      {
        name: 'AI Portfolio Example 1',
        url: 'https://example1.com',
        strengths: ['Fast loading', 'Clean design', 'Good SEO'],
        weaknesses: ['Limited interactivity', 'No AI demos', 'Generic content'],
        keywords: ['AI developer', 'machine learning portfolio', 'ML engineer'],
        performance: { lighthouse: 85, loadTime: 2.1, mobileScore: 90 },
        content: { wordCount: 800, headings: ['About', 'Projects', 'Skills'], images: 5 },
        ranking: {
          'AI developer': 3,
          'machine learning portfolio': 5,
          'ML engineer': 8
        }
      },
      {
        name: 'AI Portfolio Example 2',
        url: 'https://example2.com',
        strengths: ['Interactive demos', 'Good content', 'Strong branding'],
        weaknesses: ['Slow loading', 'Poor mobile experience', 'Weak SEO'],
        keywords: ['ML engineer', 'AI consultant', 'deep learning expert'],
        performance: { lighthouse: 72, loadTime: 4.2, mobileScore: 65 },
        content: { wordCount: 1200, headings: ['About', 'Projects', 'Blog', 'Contact'], images: 8 },
        ranking: {
          'ML engineer': 2,
          'AI consultant': 4,
          'deep learning expert': 6
        }
      },
      {
        name: 'AI Portfolio Example 3',
        url: 'https://example3.com',
        strengths: ['Excellent SEO', 'High rankings', 'Comprehensive content'],
        weaknesses: ['Outdated design', 'No interactivity', 'Poor UX'],
        keywords: ['AI developer Jordan', 'machine learning Amman', 'TensorFlow expert'],
        performance: { lighthouse: 78, loadTime: 3.5, mobileScore: 75 },
        content: { wordCount: 2000, headings: ['About', 'Services', 'Portfolio', 'Blog', 'Contact'], images: 12 },
        ranking: {
          'AI developer Jordan': 1,
          'machine learning Amman': 2,
          'TensorFlow expert': 3
        }
      }
    ];

    setCompetitors(mockCompetitors);

    // Mock our rankings
    const mockOurRankings: Record<string, number> = {
      'AI developer Jordan': 5,
      'ML engineer portfolio': 7,
      'machine learning consultant Amman': 4,
      'AI solutions Jordan': 6,
      'TensorFlow.js developer': 8,
      'computer vision expert Jordan': 9
    };

    setOurRankings(mockOurRankings);

    // Find keyword gaps
    const allCompetitorKeywords = mockCompetitors.flatMap(c => c.keywords);
    const ourKeywords = TARGET_KEYWORDS.PRIMARY.concat(TARGET_KEYWORDS.SECONDARY);
    const gaps = allCompetitorKeywords.filter(keyword => 
      !ourKeywords.some(ourKeyword => 
        ourKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(ourKeyword.toLowerCase())
      )
    );
    setKeywordGaps([...new Set(gaps)]);
  }, []);

  const analyzeCompetitors = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsAnalyzing(false);
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRankingColor = (ourRank: number, competitorRank: number) => {
    if (ourRank < competitorRank) return 'text-green-400';
    if (ourRank === competitorRank) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRankingIcon = (ourRank: number, competitorRank: number) => {
    if (ourRank < competitorRank) return '⬆️';
    if (ourRank === competitorRank) return '➡️';
    return '⬇️';
  };

  const calculateCompetitiveScore = (): number => {
    let score = 0;
    let totalComparisons = 0;

    competitors.forEach(competitor => {
      Object.entries(competitor.ranking).forEach(([keyword, competitorRank]) => {
        const ourRank = ourRankings[keyword];
        if (ourRank) {
          if (ourRank < competitorRank) score += 2;
          else if (ourRank === competitorRank) score += 1;
          totalComparisons++;
        }
      });
    });

    return totalComparisons > 0 ? (score / (totalComparisons * 2)) * 100 : 0;
  };

  const competitiveScore = calculateCompetitiveScore();

  if (!showDetails && competitiveScore >= 70) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${className}`}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl max-w-sm max-h-96 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
              Competitive Analysis
            </h3>
          </div>
          <button
            onClick={analyzeCompetitors}
            disabled={isAnalyzing}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-xs font-semibold rounded transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {/* Competitive Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Competitive Score
            </span>
            <span className={`text-sm font-semibold ${getPerformanceColor(competitiveScore)}`}>
              {competitiveScore.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                competitiveScore >= 70 ? 'bg-green-500' : 
                competitiveScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${competitiveScore}%` }}
            />
          </div>
        </div>

        {/* Competitor Analysis */}
        <div className="space-y-3 mb-4">
          {competitors.map((competitor, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                    {competitor.name}
                  </span>
                  <a
                    href={competitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FiExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className={`text-xs font-semibold ${getPerformanceColor(competitor.performance.lighthouse)}`}>
                  {competitor.performance.lighthouse}
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-2">
                <div className="text-xs text-green-400 mb-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  Strengths:
                </div>
                <div className="flex flex-wrap gap-1">
                  {competitor.strengths.map((strength, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="mb-2">
                <div className="text-xs text-red-400 mb-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  Weaknesses:
                </div>
                <div className="flex flex-wrap gap-1">
                  {competitor.weaknesses.map((weakness, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs"
                    >
                      {weakness}
                    </span>
                  ))}
                </div>
              </div>

              {/* Keyword Rankings */}
              <div>
                <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                  Keyword Rankings:
                </div>
                <div className="space-y-1">
                  {Object.entries(competitor.ranking).slice(0, 3).map(([keyword, competitorRank]) => {
                    const ourRank = ourRankings[keyword];
                    return (
                      <div key={keyword} className="flex items-center justify-between text-xs">
                        <span className="text-gray-300 truncate" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                          {keyword}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">
                            {competitorRank}
                          </span>
                          {ourRank && (
                            <>
                              <span className="text-gray-500">vs</span>
                              <span className={`font-semibold ${getRankingColor(ourRank, competitorRank)}`}>
                                {ourRank}
                              </span>
                              <span className="text-sm">
                                {getRankingIcon(ourRank, competitorRank)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Keyword Gaps */}
        {keywordGaps.length > 0 && (
          <div className="pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Keyword Gaps:
            </div>
            <div className="flex flex-wrap gap-1">
              {keywordGaps.slice(0, 5).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
              {keywordGaps.length > 5 && (
                <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                  +{keywordGaps.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'var(--font-pp-regular)' }}>
            Recommendations:
          </div>
          <div className="space-y-1 text-xs text-gray-300">
            <div style={{ fontFamily: 'var(--font-pp-regular)' }}>
              • Target keyword gaps: {keywordGaps.slice(0, 2).join(', ')}
            </div>
            <div style={{ fontFamily: 'var(--font-pp-regular)' }}>
              • Improve page load speed
            </div>
            <div style={{ fontFamily: 'var(--font-pp-regular)' }}>
              • Add more interactive content
            </div>
            <div style={{ fontFamily: 'var(--font-pp-regular)' }}>
              • Focus on local SEO (Jordan/Amman)
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}