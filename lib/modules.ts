export interface Module {
  slug: string;
  title: string;
  description: string;
  duration: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const MODULES: Module[] = [
  {
    slug: 'naming',
    title: 'Naming Conventions',
    description: 'Learn what to call things — and what NOT to call them',
    duration: '3 min',
    order: 1,
  },
  {
    slug: 'talk-tracks',
    title: 'Talk Tracks',
    description: 'How to position V6 to prospects and existing customers',
    duration: '5 min',
    order: 2,
  },
  {
    slug: 'platform-tour',
    title: 'Platform Overview',
    description: 'Key features and navigation in the Checkit Platform',
    duration: '5 min',
    order: 3,
  },
  {
    slug: 'objections',
    title: 'Objection Handling',
    description: 'Common pushback and how to respond',
    duration: '5 min',
    order: 4,
  },
  {
    slug: 'migration',
    title: 'Migration Messaging',
    description: 'How to talk about the transition for existing customers',
    duration: '3 min',
    order: 5,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is "Nova UI"?',
    options: [
      'The new customer-facing platform name',
      'Internal label for the new UI/UX layer',
      'A replacement for Control Center',
      'A new product line',
    ],
    correctAnswer: 1,
    explanation: 'Nova UI is an internal label only. Customers should never hear this term.',
  },
  {
    id: 'q2',
    question: 'A prospect asks what platform they\'ll use. What do you say?',
    options: [
      '"You\'ll log into Control Center"',
      '"Nova is our new platform"',
      '"You\'ll access the Checkit Platform"',
      '"CAM is where you manage everything"',
    ],
    correctAnswer: 2,
    explanation: 'The customer-facing name is simply "Checkit Platform" — no Control Center, Nova, or CAM/CWM.',
  },
  {
    id: 'q3',
    question: 'How should existing customers view the V6 transition?',
    options: [
      'As a mandatory upgrade with a hard cutoff',
      'As a migration with beta access and feedback runway',
      'As a replacement of Control Center with Nova',
      'As a new product they need to purchase',
    ],
    correctAnswer: 1,
    explanation: 'Position as a migration with runway: beta → feedback → optional adoption → planned switchover.',
  },
  {
    id: 'q4',
    question: 'Which phrase should you AVOID?',
    options: [
      '"The Checkit Platform is where you manage users and teams"',
      '"Control Center is now Nova"',
      '"When you log in, you\'ll see your dashboard"',
      '"Asset Intelligence can be enabled as an add-on"',
    ],
    correctAnswer: 1,
    explanation: 'Never say "Control Center is now Nova" — both terms should be phased out externally.',
  },
  {
    id: 'q5',
    question: 'What does V6 represent?',
    options: [
      'A new product being sold separately',
      'An internal/operational marker for the platform release',
      'The name customers should use',
      'A competitor comparison',
    ],
    correctAnswer: 1,
    explanation: 'V6 is primarily an internal/marketing version marker — a "line in the sand" for the release.',
  },
  {
    id: 'q6',
    question: 'Which is the correct naming for the mobile apps?',
    options: [
      'Nova Mobile App',
      'Checkit Mobile App (iOS/Android)',
      'Control Center Mobile',
      'CAM Mobile App',
    ],
    correctAnswer: 1,
    explanation: 'Apps are called "Checkit Mobile App" with the platform specified (iOS/Android).',
  },
  {
    id: 'q7',
    question: 'For NEW prospects, what explanation is required about Control Center vs Nova?',
    options: [
      'Full history of the platform evolution',
      'Detailed comparison between old and new',
      'None — just demo/sell Checkit (Platform + apps + devices)',
      'Explanation of CAM/CWM terminology',
    ],
    correctAnswer: 2,
    explanation: 'New prospects don\'t need legacy context. Just demo Checkit.',
  },
  {
    id: 'q8',
    question: 'What\'s the correct way to describe hardware?',
    options: [
      'Nova Sensors and Smart Devices',
      'Control Center Hardware Suite',
      'Sensors, Handhelds, Hubs, Repeaters (plainly described)',
      'CAM Hardware Line',
    ],
    correctAnswer: 2,
    explanation: 'Hardware should stay plainly described — no extra naming layers.',
  },
  {
    id: 'q9',
    question: 'Where is "Control Center" acceptable to mention?',
    options: [
      'In sales demos to new prospects',
      'In customer-facing release notes',
      'Nowhere externally — it\'s legacy terminology to phase out',
      'In mobile app names',
    ],
    correctAnswer: 2,
    explanation: 'Control Center is legacy terminology we should phase out of external communications.',
  },
  {
    id: 'q10',
    question: 'How should release notes be structured?',
    options: [
      'By Nova version number',
      'By Control Center update date',
      'By component (Platform / iOS / Android) with clear change logs + dates',
      'By CAM/CWM module',
    ],
    correctAnswer: 2,
    explanation: 'Release notes should be structured by component with clear change logs and dates.',
  },
];

export const PASSING_SCORE = 80; // 80% to pass
