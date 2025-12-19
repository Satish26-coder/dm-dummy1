import { Course, LabSession } from './types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-101',
    title: 'Python Programming Basics',
    code: 'CS101',
    description: 'Introduction to Python syntax, loops, strings, and algorithms.',
    progress: 33,
    totalLabs: 3
  },
  {
    id: 'course-102',
    title: 'Web Development Fundamentals',
    code: 'CS102',
    description: 'Mastering HTML, CSS, and DOM manipulation for responsive design.',
    progress: 0,
    totalLabs: 1
  },
  {
    id: 'course-201',
    title: 'Database Management Systems',
    code: 'CS201',
    description: 'Learn SQL, schema design, and query optimization.',
    progress: 0,
    totalLabs: 1
  },
  {
    id: 'course-202',
    title: 'Backend Engineering',
    code: 'CS202',
    description: 'Building RESTful APIs and server-side logic.',
    progress: 0,
    totalLabs: 1
  },
   {
    id: 'course-301',
    title: 'Advanced C/C++ Programming',
    code: 'CS301',
    description: 'Pointers, memory management, and OOP concepts.',
    progress: 0,
    totalLabs: 2
  },
  {
    id: 'course-401',
    title: 'Java Object Oriented Programming',
    code: 'CS401',
    description: 'Classes, Objects, Inheritance and Polymorphism in Java.',
    progress: 0,
    totalLabs: 1
  }
];

export const MOCK_LABS: LabSession[] = [
  // CS101 Labs
  {
    id: 'lab-001',
    courseId: 'course-101',
    title: 'Exp 1: Palindrome Checker',
    type: 'single-file',
    difficulty: 'Easy',
    duration: '30 mins',
    aim: 'Write a program to check if a given string is a palindrome.',
    description: 'A palindrome is a word, number, phrase, or other sequence of symbols that reads the same backwards as forwards.',
    procedure: ['Take string input.', 'Reverse the string.', 'Compare original and reversed.', 'Return boolean result.'],
    logicHint: 'Use string slicing or built-in reverse functions.',
    status: 'reviewed', // Mocking a completed lab
    submittedAt: '2023-10-15',
    marks: 10,
    maxMarks: 10,
    facultyFeedback: 'Excellent implementation. Good variable naming.',
    files: [
      { name: 'main.py', language: 'python', content: `def is_palindrome(text):\n  return text == text[::-1]` }
    ],
    languageTemplates: {
      python: `def is_palindrome(text):\n  # Write your code here\n  pass`
    },
    testCases: [
      { id: 'tc1', input: '"racecar"', expectedOutput: 'True', isPrivate: false },
      { id: 'tc2', input: '"hello"', expectedOutput: 'False', isPrivate: false },
      { id: 'tc3', input: '"level"', expectedOutput: 'True', isPrivate: true }
    ]
  },
  {
    id: 'lab-101-2',
    courseId: 'course-101',
    title: 'Exp 2: Fibonacci Sequence',
    type: 'single-file',
    difficulty: 'Medium',
    duration: '45 mins',
    aim: 'Generate the first N numbers of the Fibonacci sequence.',
    description: 'The Fibonacci sequence is a series of numbers where a number is the addition of the last two numbers.',
    procedure: ['Accept N', 'Loop N times', 'Print sequence'],
    logicHint: 'Handle N=0 and N=1 edge cases.',
    status: 'submitted', // Submitted but not reviewed
    submittedAt: '2023-10-20',
    files: [
      { name: 'main.py', language: 'python', content: `def fib(n):\n  # code` }
    ],
    languageTemplates: { python: `def fib(n):\n pass`},
    testCases: []
  },
  
  // CS301 Labs (C)
  {
    id: 'lab-005',
    courseId: 'course-301',
    title: 'Exp 1: Pointer Swapping',
    type: 'single-file',
    difficulty: 'Medium',
    duration: '40 mins',
    aim: 'Implement a function to swap two integers using pointers.',
    description: 'Understand how memory addresses work in C by writing a function that modifies the values of variables declared in the calling function.',
    procedure: [
      'Define a function swap(int *a, int *b).',
      'Use a temporary variable to hold the value pointed to by a.',
      'Assign the value pointed to by b to the location pointed to by a.',
      'Assign the temp value to the location pointed to by b.'
    ],
    logicHint: 'Remember to dereference the pointers using * to access values.',
    status: 'pending',
    files: [
      { 
        name: 'main.c', 
        language: 'c', 
        content: `#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n  // Write your code here\n}\n\n// Note: Main function is handled by the test runner, but you can add one for testing.\nint main() {\n  int x = 5, y = 10;\n  swap(&x, &y);\n  printf("%d %d", x, y);\n  return 0;\n}` 
      }
    ],
    languageTemplates: {
        c: `#include <stdio.h>\n\nvoid swap(int *a, int *b) {\n  // Write your code here\n}`
    },
    testCases: [
      { id: 'tc1', input: 'x=10, y=20', expectedOutput: 'x=20, y=10', isPrivate: false },
      { id: 'tc2', input: 'x=-5, y=5', expectedOutput: 'x=5, y=-5', isPrivate: false },
      { id: 'tc3', input: 'x=0, y=0', expectedOutput: 'x=0, y=0', isPrivate: true }
    ]
  },
  
  // CS301 Labs (C++)
  {
    id: 'lab-006',
    courseId: 'course-301',
    title: 'Exp 2: Class Basics',
    type: 'single-file',
    difficulty: 'Medium',
    duration: '50 mins',
    aim: 'Create a Student class in C++.',
    description: 'Implement a class with private members name and age, and public methods to set and get them.',
    procedure: ['Define class Student', 'Add private vars', 'Add public setters/getters'],
    logicHint: 'Use std::string for name.',
    status: 'pending',
    files: [
      {
        name: 'main.cpp',
        language: 'cpp',
        content: `#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Student {\n  // Your code\n};`
      }
    ],
    testCases: []
  },

  // CS401 Labs (Java)
  {
    id: 'lab-007',
    courseId: 'course-401',
    title: 'Exp 1: Inheritance',
    type: 'single-file',
    difficulty: 'Medium',
    duration: '60 mins',
    aim: 'Demonstrate single inheritance in Java.',
    description: 'Create a superclass Animal and subclass Dog that overrides the speak method.',
    procedure: ['Create class Animal with method speak()', 'Create class Dog extends Animal', 'Override speak() to print "Woof"'],
    logicHint: 'Use @Override annotation.',
    status: 'pending',
    files: [
      {
        name: 'Main.java',
        language: 'java',
        content: `public class Main {\n  public static void main(String[] args) {\n    // Test code\n  }\n}\n\nclass Animal {\n  void speak() { System.out.println("Generic Sound"); }\n}`
      }
    ],
    testCases: []
  },

  // CS102 Labs (Frontend)
  {
    id: 'lab-002',
    courseId: 'course-102',
    title: 'Exp 1: Personal Portfolio Landing',
    type: 'frontend',
    difficulty: 'Medium',
    duration: '60 mins',
    aim: 'Create a personal portfolio landing page using HTML and CSS.',
    description: 'Design a responsive landing page with a Header (Name), About Section, and a Contact Button.',
    procedure: [
      'Create an <h1> tag with id="name" containing your name.',
      'Create a <div class="about"> with a short bio.',
      'Add a <button id="contact">Contact Me</button>.',
      'Style the button to have a blue background in styles.css.'
    ],
    logicHint: 'Use Flexbox for layout and hex codes for colors.',
    status: 'pending',
    files: [
      { 
        name: 'index.html', 
        language: 'html', 
        content: `<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>Portfolio</title>\n</head>\n<body>\n    <!-- Add your code here -->\n</body>\n</html>` 
      },
      { 
        name: 'styles.css', 
        language: 'css', 
        content: `body {\n    font-family: sans-serif;\n}\n/* Add your styles here */` 
      },
      {
        name: 'script.js',
        language: 'javascript',
        content: `// Add interactivity if needed`
      }
    ],
    testCases: [
      { id: 'tc1', input: 'Check if h1 tag exists with id="name"', expectedOutput: 'True', isPrivate: false },
      { id: 'tc2', input: 'Check if element with id="contact" has background-color blue (or hex equivalent)', expectedOutput: 'True', isPrivate: false },
      { id: 'tc3', input: 'Check if class "about" contains text', expectedOutput: 'True', isPrivate: true }
    ]
  },

  // CS201 Labs (Database)
  {
    id: 'lab-003',
    courseId: 'course-201',
    title: 'Exp 1: Employee Database Query',
    type: 'database',
    difficulty: 'Medium',
    duration: '45 mins',
    aim: 'Write SQL queries to retrieve employee data.',
    description: 'You have a table named "employees" with columns: id, name, department, salary. Write a query to find high earners.',
    procedure: [
      'Analyze the schema provided.',
      'Write a SELECT query to get names of employees in "IT" department.',
      'Filter for salary > 50000.'
    ],
    logicHint: 'Use WHERE clause with AND operator.',
    status: 'pending',
    files: [
      { 
        name: 'query.sql', 
        language: 'sql', 
        content: `-- Write your SQL query here\nSELECT * FROM employees;` 
      },
      {
        name: 'schema.sql',
        language: 'sql',
        content: `CREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(50),\n  department VARCHAR(50),\n  salary INT\n);\n-- Hidden Mock Data will be used for testing\n` 
      }
    ],
    testCases: [
      { id: 'tc1', input: 'Select name from employees where department="IT"', expectedOutput: '["John", "Jane"]', isPrivate: false },
      { id: 'tc2', input: 'Select count(*) from employees', expectedOutput: '10', isPrivate: false }
    ]
  },

  // CS202 Labs (Backend)
  {
    id: 'lab-004',
    courseId: 'course-202',
    title: 'Exp 1: Node.js API Endpoint',
    type: 'backend',
    difficulty: 'Hard',
    duration: '60 mins',
    aim: 'Create a REST API endpoint that returns a JSON object.',
    description: 'Implement a function handler(req, res) that responds to GET /api/status with { "status": "ok", "uptime": 100 }.',
    procedure: ['Parse request', 'Check path', 'Return JSON'],
    logicHint: 'Check req.method and req.url.',
    status: 'pending',
    files: [
      { 
        name: 'server.js', 
        language: 'javascript', 
        content: `function handler(req) {\n  // Return { statusCode: 200, body: ... }\n  return { statusCode: 404, body: "Not Found" };\n}` 
      }
    ],
    testCases: [
      { id: 'tc1', input: 'GET /api/status', expectedOutput: '{"status": "ok", "uptime": 100}', isPrivate: false },
      { id: 'tc2', input: 'POST /api/status', expectedOutput: '404 Not Found', isPrivate: true }
    ]
  }
];

export const MOCK_PROJECTS: LabSession[] = [
    {
        id: 'proj-001',
        title: 'My E-Commerce Site',
        type: 'frontend',
        difficulty: 'Hard',
        duration: 'Self-paced',
        aim: 'Build a store',
        description: 'Independent Project',
        procedure: [],
        logicHint: '',
        status: 'pending',
        files: [
            { name: 'index.html', language: 'html', content: '<h1>My Store</h1>' },
            { name: 'style.css', language: 'css', content: 'body { background: #111; color: white; }' },
            { name: 'app.js', language: 'javascript', content: '' }
        ],
        testCases: []
    }
]
