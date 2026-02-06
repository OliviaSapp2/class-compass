/**
 * Analysis Parser Utility
 * Parses analysis text to extract structured information for display
 */

export interface ParsedStudent {
  name: string;
  priority: number | null;
  score: string;
  scoreValue?: number;
  scoreTotal?: number;
  percentage?: number;
  weakAreas: string[];
  evidence: string[];
  patterns: string[];
}

export interface ParsedAnalysis {
  title?: string;
  description?: string;
  students: ParsedStudent[];
  rawText: string;
}

/**
 * Formats the analysis result for display
 */
export function formatAnalysisResult(result: any): string {
  if (typeof result === 'string') {
    return result;
  }
  
  if (result === null || result === undefined) {
    return 'No results available';
  }

  // Check for common Stack AI response formats
  // Handle outputs object with out-0, out-1, etc. keys
  if (result.outputs && typeof result.outputs === 'object' && !Array.isArray(result.outputs)) {
    const outputKeys = Object.keys(result.outputs).sort();
    if (outputKeys.length > 0) {
      // Get the first output (usually out-0)
      const firstOutput = result.outputs[outputKeys[0]];
      if (typeof firstOutput === 'string') {
        return firstOutput;
      }
      // If multiple outputs, join them
      return outputKeys.map((key: string) => {
        const output = result.outputs[key];
        return typeof output === 'string' ? output : JSON.stringify(output, null, 2);
      }).join('\n\n');
    }
  }

  if (result.outputs && Array.isArray(result.outputs)) {
    return result.outputs.map((output: any) => 
      typeof output === 'string' ? output : JSON.stringify(output, null, 2)
    ).join('\n\n');
  }

  if (result.output) {
    return typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2);
  }

  if (result['out-0']) {
    return typeof result['out-0'] === 'string' ? result['out-0'] : JSON.stringify(result['out-0'], null, 2);
  }

  // If it's an object, try to find text content
  if (typeof result === 'object') {
    // Look for common text fields
    const textFields = ['text', 'content', 'message', 'response', 'answer', 'result'];
    for (const field of textFields) {
      if (result[field] && typeof result[field] === 'string') {
        return result[field];
      }
    }
    
    // If no text field found, stringify the whole object
    return JSON.stringify(result, null, 2);
  }

  return String(result);
}

/**
 * Parses analysis text to extract structured information
 */
export function parseAnalysisText(text: string): ParsedAnalysis {
  // Keep original text with newlines for better parsing
  const originalLines = text.split('\n');
  const parsed: ParsedAnalysis = {
    students: [],
    rawText: text
  };

  let currentStudent: Partial<ParsedStudent> | null = null;
  let currentSection: 'weakAreas' | 'evidence' | 'patterns' | null = null;
  let inStudentBlock = false;

  // Extract title/description
  const titleMatch = text.match(/(?:Class Overview|Analysis|Report|Assessment)[:\s]*(.+?)(?:\n|$)/i);
  if (titleMatch) {
    parsed.title = titleMatch[1].trim();
  }

  // Look for description/intro
  const descMatch = text.match(/Based on.*?(?:analysis|graded work).*?[:\-]\s*(.+?)(?:\n\n|\n[A-Z]|$)/is);
  if (descMatch) {
    parsed.description = descMatch[1].trim();
  }

  for (let i = 0; i < originalLines.length; i++) {
    const line = originalLines[i].trim();
    if (!line) {
      // Empty line might indicate section break
      if (currentStudent && currentSection) {
        currentSection = null;
      }
      continue;
    }
    
    // Detect student name with priority (more flexible patterns)
    const priorityMatch = line.match(/Priority\s+(\d+)[:\.]?\s*(.+)/i) || 
                         line.match(/^(\d+)\.\s*Priority\s+(\d+)[:\.]?\s*(.+)/i);
    const nameMatch = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
    
    if (priorityMatch) {
      // Save previous student if exists
      if (currentStudent && currentStudent.name) {
        parsed.students.push(currentStudent as ParsedStudent);
      }
      
      const name = priorityMatch[2] || priorityMatch[3] || '';
      const priority = parseInt(priorityMatch[1] || priorityMatch[2] || '0');
      
      currentStudent = {
        name: name.trim(),
        priority: priority || null,
        weakAreas: [],
        evidence: [],
        patterns: []
      };
      currentSection = null;
      inStudentBlock = true;
      continue;
    } else if (nameMatch && !inStudentBlock && 
               !line.match(/Score|Weak|Evidence|Pattern|Students|Class|Overview|Analysis/i) &&
               nameMatch[1].split(' ').length >= 2) {
      // Found a student name without priority (only if we're not in a student block)
      if (currentStudent && currentStudent.name) {
        parsed.students.push(currentStudent as ParsedStudent);
      }
      currentStudent = {
        name: nameMatch[1],
        priority: null,
        weakAreas: [],
        evidence: [],
        patterns: []
      };
      currentSection = null;
      inStudentBlock = true;
      continue;
    }

    // Check if we're leaving a student block (new major section)
    if (inStudentBlock && line.match(/^(?:Students|Class|Summary|Conclusion)/i)) {
      inStudentBlock = false;
      if (currentStudent && currentStudent.name) {
        parsed.students.push(currentStudent as ParsedStudent);
        currentStudent = null;
      }
    }

    if (!currentStudent) continue;

    // Extract score (more flexible patterns)
    const scoreMatch = line.match(/Score[:\s]+(\d+)\/(\d+)\s*[–-]?\s*\((\d+)%\)/i) || 
                       line.match(/Score[:\s]+(\d+)\/(\d+)\s*\((\d+)%\)/i) ||
                       line.match(/(\d+)\/(\d+)\s*\((\d+)%\)/);
    if (scoreMatch && !currentStudent.score) {
      const score = parseInt(scoreMatch[1]);
      const total = parseInt(scoreMatch[2]);
      const percentage = parseInt(scoreMatch[3]);
      currentStudent.score = `${score}/${total} (${percentage}%)`;
      currentStudent.scoreValue = score;
      currentStudent.scoreTotal = total;
      currentStudent.percentage = percentage;
      continue;
    }

    // Detect section headers (more flexible)
    if (line.match(/Weak\s+Areas?/i) || line.match(/Weak\s+Areas?\s*\(/i)) {
      currentSection = 'weakAreas';
      continue;
    } else if (line.match(/^Evidence/i) || line.match(/Evidence:/i)) {
      currentSection = 'evidence';
      continue;
    } else if (line.match(/^Pattern/i) || line.match(/Pattern:/i) || line.match(/Pattern\s+[:\-]/i)) {
      currentSection = 'patterns';
      continue;
    }

    // Extract content based on current section
    if (currentSection === 'weakAreas') {
      // Look for hierarchical paths (e.g., "Mathematics → Number Sense → ...")
      const cleaned = line.replace(/^[-•*\d+\.\)]\s*/, '').trim();
      if (cleaned.includes('→') || cleaned.match(/^[A-Z][a-z]+(?:\s+→\s+[A-Z][a-z]+)+/)) {
        currentStudent.weakAreas!.push(cleaned);
      } else if ((line.match(/^[-•*\d+\.\)]/) || line.match(/^\*/)) && cleaned.length > 5) {
        currentStudent.weakAreas!.push(cleaned);
      } else if (cleaned.length > 10 && !cleaned.match(/^(Score|Weak|Evidence|Pattern)/i)) {
        // Try to catch weak areas that don't start with bullets
        currentStudent.weakAreas!.push(cleaned);
      }
    } else if (currentSection === 'evidence') {
      // Look for Q: patterns or specific examples
      const cleaned = line.replace(/^[-•*\d+\.\)]\s*/, '').trim();
      if (cleaned.match(/Q\d+:/i) || cleaned.includes('→') || 
          cleaned.includes('Student answered') || cleaned.includes('Correct:') ||
          cleaned.match(/answered.*\|.*Correct/i) ||
          cleaned.match(/Q\d+.*\?/i)) {
        currentStudent.evidence!.push(cleaned);
      } else if ((line.match(/^[-•*\d+\.\)]/) || line.match(/^\*/)) && cleaned.length > 10) {
        currentStudent.evidence!.push(cleaned);
      } else if (cleaned.length > 15 && cleaned.match(/[0-9]/) && !cleaned.match(/^(Score|Weak|Evidence|Pattern)/i)) {
        // Try to catch evidence lines with numbers
        currentStudent.evidence!.push(cleaned);
      }
    } else if (currentSection === 'patterns') {
      // Look for explanations
      const cleaned = line.replace(/^[-•*\d+\.\)]\s*/, '').trim();
      if (cleaned.length > 20 && !cleaned.match(/^(Score|Weak|Evidence|Pattern|Priority)/i)) {
        currentStudent.patterns!.push(cleaned);
      }
    }

    // If line starts with bullet/number and we don't have a section, try to infer
    if (!currentSection && currentStudent && line.match(/^[-•*\d+\.\)]/)) {
      const content = line.replace(/^[-•*\d+\.\)]\s*/, '').trim();
      if (content.includes('→')) {
        currentStudent.weakAreas!.push(content);
        currentSection = 'weakAreas';
      } else if (content.length > 50 && !content.match(/^(Score|Weak|Evidence|Pattern)/i)) {
        currentStudent.patterns!.push(content);
        currentSection = 'patterns';
      }
    }
  }

  // Save last student
  if (currentStudent && currentStudent.name) {
    parsed.students.push(currentStudent as ParsedStudent);
  }

  return parsed;
}
