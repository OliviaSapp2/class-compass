/**
 * Analysis Mapper Utility
 * Maps parsed analysis results to application data structures
 */

import { ParsedStudent, ParsedAnalysis } from './analysisParser';
import type { Student, ClassInsight } from './mockData';

/**
 * Maps analysis results to student risk levels and scores
 */
export function mapAnalysisToStudents(
  parsedAnalysis: ParsedAnalysis,
  existingStudents: Student[]
): Student[] {
  if (parsedAnalysis.students.length === 0) {
    return existingStudents;
  }

  // Create a map of student names to parsed data
  const analysisMap = new Map<string, ParsedStudent>();
  parsedAnalysis.students.forEach(student => {
    analysisMap.set(student.name.toLowerCase(), student);
  });

  // Update existing students with analysis data
  return existingStudents.map(student => {
    const analysisData = analysisMap.get(student.name.toLowerCase());
    
    if (!analysisData) {
      return student;
    }

    // Determine risk level based on score
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (analysisData.percentage !== undefined) {
      if (analysisData.percentage < 50) {
        riskLevel = 'high';
      } else if (analysisData.percentage < 70) {
        riskLevel = 'medium';
      } else {
        riskLevel = 'low';
      }
    } else if (analysisData.priority !== null) {
      // Use priority as fallback
      if (analysisData.priority === 1) {
        riskLevel = 'high';
      } else if (analysisData.priority === 2) {
        riskLevel = 'medium';
      }
    }

    // Determine trend based on score
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (analysisData.percentage !== undefined) {
      if (analysisData.percentage < 60) {
        trend = 'down';
      } else if (analysisData.percentage >= 80) {
        trend = 'up';
      }
    }

    return {
      ...student,
      riskLevel,
      overallScore: analysisData.percentage ?? student.overallScore,
      trend,
      lastAnalyzedAt: new Date().toISOString(),
    };
  });
}

/**
 * Extracts class insights from analysis results
 */
export function mapAnalysisToClassInsights(
  parsedAnalysis: ParsedAnalysis,
  totalStudents: number
): ClassInsight[] {
  const insights: ClassInsight[] = [];

  if (parsedAnalysis.students.length === 0) {
    return insights;
  }

  // Group weak areas by topic/subject
  const topicMap = new Map<string, {
    weakAreas: string[];
    students: ParsedStudent[];
    avgScore: number;
  }>();

  parsedAnalysis.students.forEach(student => {
    student.weakAreas.forEach(area => {
      // Extract topic from hierarchical path (e.g., "Mathematics → Number Sense → Integer Operations")
      const parts = area.split('→').map(p => p.trim());
      if (parts.length >= 2) {
        const subject = parts[0];
        const unit = parts.length > 2 ? parts[1] : parts[parts.length - 1];
        const topic = parts[parts.length - 1];
        
        const key = `${subject}::${unit}::${topic}`;
        
        if (!topicMap.has(key)) {
          topicMap.set(key, {
            weakAreas: [],
            students: [],
            avgScore: 0,
          });
        }
        
        const topicData = topicMap.get(key)!;
        if (!topicData.weakAreas.includes(area)) {
          topicData.weakAreas.push(area);
        }
        if (!topicData.students.find(s => s.name === student.name)) {
          topicData.students.push(student);
        }
      }
    });
  });

  // Convert to ClassInsight format
  topicMap.forEach((data, key) => {
    const [subject, unit, topic] = key.split('::');
    
    // Calculate average mastery (inverse of students affected)
    const studentsAffected = data.students.length;
    const avgScore = data.students.reduce((sum, s) => {
      return sum + (s.percentage ?? 50);
    }, 0) / studentsAffected;

    insights.push({
      topic,
      unit,
      subject,
      avgMastery: Math.round(avgScore),
      studentsAffected,
      totalStudents,
    });
  });

  // If no structured weak areas, create insights from student scores
  if (insights.length === 0) {
    const lowScoringStudents = parsedAnalysis.students.filter(s => 
      s.percentage !== undefined && s.percentage < 70
    );
    
    if (lowScoringStudents.length > 0) {
      const avgScore = lowScoringStudents.reduce((sum, s) => 
        sum + (s.percentage ?? 50), 0
      ) / lowScoringStudents.length;

      insights.push({
        topic: 'Overall Performance',
        unit: 'General',
        subject: 'All Subjects',
        avgMastery: Math.round(avgScore),
        studentsAffected: lowScoringStudents.length,
        totalStudents,
      });
    }
  }

  return insights;
}

/**
 * Gets summary statistics from analysis
 */
export function getAnalysisSummary(parsedAnalysis: ParsedAnalysis) {
  const students = parsedAnalysis.students;
  
  const highPriority = students.filter(s => s.priority === 1).length;
  const mediumPriority = students.filter(s => s.priority === 2).length;
  const lowPriority = students.filter(s => s.priority === null || s.priority > 2).length;

  const avgScore = students.length > 0
    ? students.reduce((sum, s) => sum + (s.percentage ?? 0), 0) / students.length
    : 0;

  const strugglingCount = students.filter(s => 
    (s.percentage !== undefined && s.percentage < 70) || s.priority !== null
  ).length;

  return {
    totalAnalyzed: students.length,
    highPriority,
    mediumPriority,
    lowPriority,
    avgScore: Math.round(avgScore),
    strugglingCount,
  };
}
