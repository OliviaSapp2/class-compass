// Mock data for Student Experience

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  classId: string;
  className: string;
  grade: string;
  goals: string[];
  streakDays: number;
  totalStudyMinutes: number;
}

export interface Gap {
  id: string;
  studentId: string;
  subject: string;
  unit: string;
  topic: string;
  topicPath: string;
  masteryEstimate: number;
  confidence: 'low' | 'medium' | 'high';
  evidence: Evidence[];
  commonMisconceptions: string[];
  recommendedNextSteps: string[];
  riskLevel: 'low' | 'medium' | 'high';
  identifiedAt: string;
  isNewlyIdentified: boolean;
}

export interface Evidence {
  id: string;
  type: 'quiz' | 'homework' | 'test' | 'classwork';
  name: string;
  date: string;
  score?: string;
  detail: string;
}

export interface StudyTask {
  id: string;
  topic: string;
  topicPath: string;
  microGoal: string;
  estimatedMinutes: number;
  resources: Resource[];
  practiceQuestions: PracticeQuestion[];
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: string;
  reflection?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'practice' | 'worksheet';
  url?: string;
  estimatedMinutes: number;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  hint?: string;
  answer: string;
  explanation: string;
}

export interface StudyDay {
  date: string;
  dayOfWeek: string;
  tasks: StudyTask[];
  totalMinutes: number;
  isCompleted: boolean;
}

export interface StudyWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: StudyDay[];
  focusTopics: string[];
}

export interface StudyPlan {
  id: string;
  studentId: string;
  generatedAt: string;
  settings: StudyPlanSettings;
  weeks: StudyWeek[];
  status: 'active' | 'paused' | 'completed';
  shareWithTeacher: boolean;
}

export interface StudyPlanSettings {
  minutesPerDay: number;
  daysPerWeek: number;
  targetDate?: string;
  priority: 'grades' | 'mastery' | 'upcoming_test';
  difficulty: 'gentle' | 'normal' | 'intensive';
}

export interface StudySession {
  id: string;
  taskId: string;
  startedAt: string;
  completedAt?: string;
  duration: number;
  selfAssessment?: 'got_it' | 'unsure';
  reflection?: string;
}

export interface MasteryHistory {
  topic: string;
  topicPath: string;
  history: { date: string; mastery: number }[];
}

export interface StudentProgress {
  studentId: string;
  completedTasks: number;
  totalTasks: number;
  sessions: StudySession[];
  masteryHistory: MasteryHistory[];
  weeklyStudyMinutes: { week: string; minutes: number }[];
  areasImproving: string[];
  stillNeedsWork: string[];
}

export interface StudentUpload {
  id: string;
  studentId: string;
  fileName: string;
  fileSize: string;
  category: 'lecture_notes' | 'study_guide' | 'practice_worksheet' | 'wrong_answers';
  status: 'uploaded' | 'processing' | 'analyzed';
  uploadedAt: string;
}

export interface Assessment {
  id: string;
  name: string;
  subject: string;
  date: string;
  topics: string[];
}

// Mock Data

export const mockStudentProfile: StudentProfile = {
  id: 'student-1',
  name: 'Liam Chen',
  email: 'liam.c@school.edu',
  classId: '1',
  className: 'Period 2 – 7th Grade Math',
  grade: '7th',
  goals: ['Improve fraction skills', 'Get an A on the next unit test'],
  streakDays: 5,
  totalStudyMinutes: 340,
};

export const mockGaps: Gap[] = [
  {
    id: 'gap-1',
    studentId: 'student-1',
    subject: 'Math',
    unit: 'Fractions',
    topic: 'Multiplying Fractions',
    topicPath: 'Math → Fractions → Multiplying Fractions',
    masteryEstimate: 35,
    confidence: 'high',
    evidence: [
      { id: 'e1', type: 'quiz', name: 'Quiz 3: Fraction Operations', date: '2024-01-12', score: '2/8', detail: 'Missed most multiplication problems' },
      { id: 'e2', type: 'homework', name: 'Homework 5: Mixed Practice', date: '2024-01-10', detail: 'Skipped 4 multiplication questions' },
      { id: 'e3', type: 'test', name: 'Test 2: Fractions Unit', date: '2024-01-08', score: '1/5', detail: 'Only 1 correct in multiplication section' },
    ],
    commonMisconceptions: [
      'Multiplying numerators but forgetting to multiply denominators',
      'Confusing multiplication with addition rules',
      'Not simplifying final answers',
    ],
    recommendedNextSteps: [
      'Review visual models for fraction multiplication',
      'Practice with unit fractions before mixed numbers',
      'Complete 10 basic multiplication problems daily',
    ],
    riskLevel: 'high',
    identifiedAt: '2024-01-14T10:00:00Z',
    isNewlyIdentified: false,
  },
  {
    id: 'gap-2',
    studentId: 'student-1',
    subject: 'Math',
    unit: 'Fractions',
    topic: 'Dividing Fractions',
    topicPath: 'Math → Fractions → Dividing Fractions',
    masteryEstimate: 42,
    confidence: 'medium',
    evidence: [
      { id: 'e4', type: 'quiz', name: 'Quiz 3: Fraction Operations', date: '2024-01-12', score: '3/7', detail: 'Struggled with division problems' },
      { id: 'e5', type: 'homework', name: 'Homework 6: Division Practice', date: '2024-01-11', detail: 'Incorrect "flip and multiply" steps' },
    ],
    commonMisconceptions: [
      'Forgetting to flip the second fraction',
      'Flipping the wrong fraction',
      'Not converting mixed numbers first',
    ],
    recommendedNextSteps: [
      'Practice "keep-change-flip" method',
      'Use concrete examples before abstract problems',
      'Work through 5 division problems with step-by-step guidance',
    ],
    riskLevel: 'high',
    identifiedAt: '2024-01-13T15:00:00Z',
    isNewlyIdentified: false,
  },
  {
    id: 'gap-3',
    studentId: 'student-1',
    subject: 'Math',
    unit: 'Decimals',
    topic: 'Converting Fractions to Decimals',
    topicPath: 'Math → Decimals → Converting Fractions to Decimals',
    masteryEstimate: 55,
    confidence: 'medium',
    evidence: [
      { id: 'e6', type: 'quiz', name: 'Quiz 2: Decimal Basics', date: '2024-01-09', detail: 'Confusion between terminating and repeating decimals' },
      { id: 'e7', type: 'homework', name: 'Homework 4: Conversions', date: '2024-01-07', score: '5/10', detail: 'Half correct on conversion problems' },
    ],
    commonMisconceptions: [
      'Not recognizing when decimals repeat',
      'Rounding too early in calculations',
    ],
    recommendedNextSteps: [
      'Use number line to visualize fraction-decimal equivalence',
      'Practice with common fraction-decimal pairs',
    ],
    riskLevel: 'medium',
    identifiedAt: '2024-01-12T10:00:00Z',
    isNewlyIdentified: true,
  },
  {
    id: 'gap-4',
    studentId: 'student-1',
    subject: 'Math',
    unit: 'Fractions',
    topic: 'Word Problems with Fractions',
    topicPath: 'Math → Fractions → Word Problems',
    masteryEstimate: 48,
    confidence: 'medium',
    evidence: [
      { id: 'e8', type: 'test', name: 'Test 2: Fractions Unit', date: '2024-01-08', detail: 'Struggled to identify which operation to use' },
      { id: 'e9', type: 'homework', name: 'Homework 7: Word Problems', date: '2024-01-13', score: '4/8', detail: 'Missed problems requiring multiple steps' },
    ],
    commonMisconceptions: [
      'Difficulty identifying operation from context',
      'Not drawing diagrams to visualize problems',
    ],
    recommendedNextSteps: [
      'Practice identifying key words that indicate operations',
      'Always draw a diagram before solving',
      'Break multi-step problems into smaller parts',
    ],
    riskLevel: 'medium',
    identifiedAt: '2024-01-14T11:00:00Z',
    isNewlyIdentified: true,
  },
];

export const mockStudyPlan: StudyPlan = {
  id: 'plan-1',
  studentId: 'student-1',
  generatedAt: '2024-01-15T08:00:00Z',
  settings: {
    minutesPerDay: 30,
    daysPerWeek: 5,
    priority: 'mastery',
    difficulty: 'normal',
  },
  weeks: [
    {
      weekNumber: 1,
      startDate: '2024-01-15',
      endDate: '2024-01-19',
      focusTopics: ['Multiplying Fractions'],
      days: [
        {
          date: '2024-01-15',
          dayOfWeek: 'Monday',
          totalMinutes: 30,
          isCompleted: true,
          tasks: [
            {
              id: 'task-1',
              topic: 'Multiplying Fractions',
              topicPath: 'Math → Fractions → Multiplying Fractions',
              microGoal: 'Understand the visual model for multiplying fractions',
              estimatedMinutes: 15,
              status: 'completed',
              completedAt: '2024-01-15T16:30:00Z',
              resources: [
                { id: 'r1', title: 'Visual Fraction Multiplication', type: 'video', estimatedMinutes: 5 },
                { id: 'r2', title: 'Area Model Explanation', type: 'article', estimatedMinutes: 5 },
              ],
              practiceQuestions: [
                { id: 'q1', question: 'What is 1/2 × 1/3?', hint: 'Multiply numerators, then denominators', answer: '1/6', explanation: '1×1=1 for numerator, 2×3=6 for denominator' },
                { id: 'q2', question: 'What is 2/3 × 3/4?', hint: 'Simplify after multiplying', answer: '1/2', explanation: '2×3=6, 3×4=12, then 6/12 simplifies to 1/2' },
              ],
            },
            {
              id: 'task-2',
              topic: 'Multiplying Fractions',
              topicPath: 'Math → Fractions → Multiplying Fractions',
              microGoal: 'Practice 5 basic multiplication problems',
              estimatedMinutes: 15,
              status: 'completed',
              completedAt: '2024-01-15T17:00:00Z',
              resources: [
                { id: 'r3', title: 'Practice Set: Basic Multiplication', type: 'practice', estimatedMinutes: 10 },
              ],
              practiceQuestions: [
                { id: 'q3', question: 'What is 1/4 × 2/5?', answer: '2/20 = 1/10', explanation: 'Multiply straight across, then simplify' },
                { id: 'q4', question: 'What is 3/5 × 2/3?', answer: '6/15 = 2/5', explanation: 'Multiply, then simplify by dividing by 3' },
              ],
            },
          ],
        },
        {
          date: '2024-01-16',
          dayOfWeek: 'Tuesday',
          totalMinutes: 30,
          isCompleted: true,
          tasks: [
            {
              id: 'task-3',
              topic: 'Multiplying Fractions',
              topicPath: 'Math → Fractions → Multiplying Fractions',
              microGoal: 'Learn to simplify before multiplying',
              estimatedMinutes: 30,
              status: 'completed',
              completedAt: '2024-01-16T16:45:00Z',
              resources: [
                { id: 'r4', title: 'Cross-Canceling Technique', type: 'video', estimatedMinutes: 8 },
                { id: 'r5', title: 'Simplifying Shortcuts', type: 'article', estimatedMinutes: 7 },
              ],
              practiceQuestions: [
                { id: 'q5', question: 'Simplify before multiplying: 4/5 × 5/8', answer: '1/2', explanation: 'Cancel the 5s and 4/8, leaving 1/2' },
              ],
            },
          ],
        },
        {
          date: '2024-01-17',
          dayOfWeek: 'Wednesday',
          totalMinutes: 30,
          isCompleted: false,
          tasks: [
            {
              id: 'task-4',
              topic: 'Multiplying Fractions',
              topicPath: 'Math → Fractions → Multiplying Fractions',
              microGoal: 'Practice with mixed numbers',
              estimatedMinutes: 30,
              status: 'in_progress',
              resources: [
                { id: 'r6', title: 'Converting Mixed Numbers', type: 'video', estimatedMinutes: 6 },
                { id: 'r7', title: 'Mixed Number Multiplication', type: 'practice', estimatedMinutes: 15 },
              ],
              practiceQuestions: [
                { id: 'q6', question: 'What is 1 1/2 × 2/3?', hint: 'Convert 1 1/2 to 3/2 first', answer: '1', explanation: '3/2 × 2/3 = 6/6 = 1' },
              ],
            },
          ],
        },
        {
          date: '2024-01-18',
          dayOfWeek: 'Thursday',
          totalMinutes: 30,
          isCompleted: false,
          tasks: [
            {
              id: 'task-5',
              topic: 'Multiplying Fractions',
              topicPath: 'Math → Fractions → Multiplying Fractions',
              microGoal: 'Solve real-world multiplication problems',
              estimatedMinutes: 30,
              status: 'pending',
              resources: [
                { id: 'r8', title: 'Word Problem Strategies', type: 'article', estimatedMinutes: 10 },
                { id: 'r9', title: 'Real-World Practice', type: 'practice', estimatedMinutes: 15 },
              ],
              practiceQuestions: [
                { id: 'q7', question: 'A recipe needs 2/3 cup of flour. If you want to make 1/2 of the recipe, how much flour do you need?', answer: '1/3 cup', explanation: '2/3 × 1/2 = 2/6 = 1/3' },
              ],
            },
          ],
        },
        {
          date: '2024-01-19',
          dayOfWeek: 'Friday',
          totalMinutes: 30,
          isCompleted: false,
          tasks: [
            {
              id: 'task-6',
              topic: 'Multiplying Fractions',
              topicPath: 'Math → Fractions → Multiplying Fractions',
              microGoal: 'Week 1 review and self-assessment',
              estimatedMinutes: 30,
              status: 'pending',
              resources: [
                { id: 'r10', title: 'Week 1 Review Quiz', type: 'practice', estimatedMinutes: 20 },
              ],
              practiceQuestions: [
                { id: 'q8', question: 'Self-check: Solve 5 mixed problems', answer: 'Various', explanation: 'Review all techniques learned this week' },
              ],
            },
          ],
        },
      ],
    },
    {
      weekNumber: 2,
      startDate: '2024-01-22',
      endDate: '2024-01-26',
      focusTopics: ['Dividing Fractions'],
      days: [
        {
          date: '2024-01-22',
          dayOfWeek: 'Monday',
          totalMinutes: 30,
          isCompleted: false,
          tasks: [
            {
              id: 'task-7',
              topic: 'Dividing Fractions',
              topicPath: 'Math → Fractions → Dividing Fractions',
              microGoal: 'Learn the "Keep-Change-Flip" method',
              estimatedMinutes: 30,
              status: 'pending',
              resources: [
                { id: 'r11', title: 'Division Basics', type: 'video', estimatedMinutes: 10 },
              ],
              practiceQuestions: [
                { id: 'q9', question: 'What is 1/2 ÷ 1/4?', answer: '2', explanation: 'Keep 1/2, change to ×, flip to 4/1 = 2' },
              ],
            },
          ],
        },
      ],
    },
  ],
  status: 'active',
  shareWithTeacher: false,
};

export const mockProgress: StudentProgress = {
  studentId: 'student-1',
  completedTasks: 3,
  totalTasks: 12,
  sessions: [
    { id: 's1', taskId: 'task-1', startedAt: '2024-01-15T16:00:00Z', completedAt: '2024-01-15T16:30:00Z', duration: 30, selfAssessment: 'got_it' },
    { id: 's2', taskId: 'task-2', startedAt: '2024-01-15T16:45:00Z', completedAt: '2024-01-15T17:00:00Z', duration: 15, selfAssessment: 'got_it' },
    { id: 's3', taskId: 'task-3', startedAt: '2024-01-16T16:15:00Z', completedAt: '2024-01-16T16:45:00Z', duration: 30, selfAssessment: 'unsure', reflection: 'Cross-canceling is still tricky' },
  ],
  masteryHistory: [
    {
      topic: 'Multiplying Fractions',
      topicPath: 'Math → Fractions → Multiplying Fractions',
      history: [
        { date: '2024-01-08', mastery: 25 },
        { date: '2024-01-12', mastery: 30 },
        { date: '2024-01-15', mastery: 35 },
        { date: '2024-01-16', mastery: 45 },
      ],
    },
    {
      topic: 'Dividing Fractions',
      topicPath: 'Math → Fractions → Dividing Fractions',
      history: [
        { date: '2024-01-10', mastery: 38 },
        { date: '2024-01-13', mastery: 42 },
      ],
    },
  ],
  weeklyStudyMinutes: [
    { week: 'Week 1', minutes: 120 },
    { week: 'Week 2', minutes: 90 },
    { week: 'Week 3', minutes: 75 },
    { week: 'Week 4', minutes: 55 },
  ],
  areasImproving: ['Multiplying Fractions', 'Basic Fraction Concepts'],
  stillNeedsWork: ['Dividing Fractions', 'Converting to Decimals', 'Word Problems'],
};

export const mockStudentUploads: StudentUpload[] = [
  { id: 'su1', studentId: 'student-1', fileName: 'Chapter_5_Notes.pdf', fileSize: '2.1 MB', category: 'lecture_notes', status: 'analyzed', uploadedAt: '2024-01-14T10:00:00Z' },
  { id: 'su2', studentId: 'student-1', fileName: 'Fraction_Study_Guide.docx', fileSize: '856 KB', category: 'study_guide', status: 'analyzed', uploadedAt: '2024-01-13T15:30:00Z' },
  { id: 'su3', studentId: 'student-1', fileName: 'Extra_Practice_Worksheet.pdf', fileSize: '1.2 MB', category: 'practice_worksheet', status: 'processing', uploadedAt: '2024-01-15T08:00:00Z' },
];

export const mockUpcomingAssessments: Assessment[] = [
  { id: 'a1', name: 'Quiz 4: Division Review', subject: 'Math', date: '2024-01-19', topics: ['Dividing Fractions', 'Mixed Numbers'] },
  { id: 'a2', name: 'Unit 3 Test', subject: 'Math', date: '2024-01-26', topics: ['All Fraction Operations'] },
  { id: 'a3', name: 'Decimal Checkpoint', subject: 'Math', date: '2024-02-02', topics: ['Converting Fractions to Decimals', 'Decimal Operations'] },
];

// Helper functions
export function getNextTask(plan: StudyPlan): StudyTask | null {
  for (const week of plan.weeks) {
    for (const day of week.days) {
      for (const task of day.tasks) {
        if (task.status === 'pending' || task.status === 'in_progress') {
          return task;
        }
      }
    }
  }
  return null;
}

export function getTopGaps(gaps: Gap[], count: number = 3): Gap[] {
  return [...gaps]
    .sort((a, b) => a.masteryEstimate - b.masteryEstimate)
    .slice(0, count);
}

export function formatTopicPath(path: string): { subject: string; unit: string; topic: string } {
  const parts = path.split(' → ');
  return {
    subject: parts[0] || '',
    unit: parts[1] || '',
    topic: parts[2] || '',
  };
}
