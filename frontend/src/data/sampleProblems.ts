import { Problem, Submission, Badge } from '../lib/types';

export const sampleProblems: Problem[] = [
    {
        id: 1, title: 'Simple Interest Calculation', difficulty: 'Easy', category: 'Quantitative Aptitude', category_slug: 'quant',
        description: 'A sum of ₹5,000 is invested at a simple interest rate of 8% per annum. What is the total interest earned after 3 years?',
        answer_type: 'mcq', options: ['₹1,200', '₹1,500', '₹1,000', '₹800'], correct_answer: '₹1,200',
        explanation: 'Simple Interest = P × R × T / 100 = 5000 × 8 × 3 / 100 = ₹1,200',
        constraints_info: 'Assume simple interest formula applies throughout.',
        examples: [{ input: 'P=5000, R=8%, T=3 years', output: '₹1,200' }],
        acceptance_rate: 78.5, solved: true, created_at: '2024-01-15',
    },
    {
        id: 2, title: 'Percentage Increase', difficulty: 'Easy', category: 'Quantitative Aptitude', category_slug: 'quant',
        description: 'A shirt originally costs ₹800. If the price is increased by 25%, what is the new price?',
        answer_type: 'numerical', options: null, correct_answer: '1000',
        explanation: 'New Price = 800 + (25/100 × 800) = 800 + 200 = ₹1,000',
        constraints_info: 'Enter the numerical answer without currency symbol.',
        examples: [{ input: 'Original = ₹800, Increase = 25%', output: '1000' }],
        acceptance_rate: 82.3, solved: false, created_at: '2024-01-16',
    },
    {
        id: 3, title: 'Average of Numbers', difficulty: 'Easy', category: 'Quantitative Aptitude', category_slug: 'quant',
        description: 'Find the average of 12, 15, 18, 21, and 24.',
        answer_type: 'mcq', options: ['17', '18', '19', '20'], correct_answer: '18',
        explanation: 'Average = (12+15+18+21+24)/5 = 90/5 = 18',
        constraints_info: null, examples: [{ input: '12, 15, 18, 21, 24', output: '18' }],
        acceptance_rate: 91.2, solved: true, created_at: '2024-01-17',
    },
    {
        id: 4, title: 'Compound Interest Problem', difficulty: 'Medium', category: 'Quantitative Aptitude', category_slug: 'quant',
        description: 'Find the compound interest on ₹10,000 at 10% per annum for 2 years, compounded annually.',
        answer_type: 'mcq', options: ['₹2,000', '₹2,100', '₹2,200', '₹1,900'], correct_answer: '₹2,100',
        explanation: 'A = P(1+R/100)^T = 10000(1.1)^2 = 12100. CI = 12100-10000 = ₹2,100',
        constraints_info: 'Compounded annually.',
        examples: [{ input: 'P=10000, R=10%, T=2', output: '₹2,100' }],
        acceptance_rate: 64.8, solved: false, created_at: '2024-01-18',
    },
    {
        id: 5, title: 'Profit and Loss', difficulty: 'Medium', category: 'Quantitative Aptitude', category_slug: 'quant',
        description: 'A trader buys an article for ₹600 and sells it for ₹750. What is the profit percentage?',
        answer_type: 'mcq', options: ['20%', '25%', '30%', '15%'], correct_answer: '25%',
        explanation: 'Profit = 750-600 = 150. Profit% = (150/600)×100 = 25%',
        constraints_info: null, examples: [{ input: 'CP=600, SP=750', output: '25%' }],
        acceptance_rate: 71.5, solved: true, created_at: '2024-01-19',
    },
    {
        id: 6, title: 'Time and Work Complex', difficulty: 'Hard', category: 'Quantitative Aptitude', category_slug: 'quant',
        description: 'A can do a work in 12 days. B can do the same work in 15 days. They work together for 4 days, then A leaves. How many more days will B take to finish the remaining work?',
        answer_type: 'numerical', options: null, correct_answer: '6',
        explanation: "A's rate = 1/12, B's rate = 1/15. Together for 4 days = 4×(1/12+1/15) = 4×(9/60) = 36/60 = 3/5. Remaining = 2/5. B alone: (2/5)/(1/15) = 6 days.",
        constraints_info: 'Enter number of days as a whole number.',
        examples: [{ input: 'A=12days, B=15days, together=4days', output: '6' }],
        acceptance_rate: 42.1, solved: false, created_at: '2024-01-20',
    },
    {
        id: 7, title: 'Number Series Pattern', difficulty: 'Easy', category: 'Logical Reasoning', category_slug: 'logical',
        description: 'What comes next in the series: 2, 6, 12, 20, 30, ?',
        answer_type: 'numerical', options: null, correct_answer: '42',
        explanation: 'Differences: 4, 6, 8, 10, 12. The pattern in differences is +2. So next: 30+12 = 42.',
        constraints_info: 'Enter the next number in the series.',
        examples: [{ input: '2, 6, 12, 20, 30, ?', output: '42' }],
        acceptance_rate: 75.3, solved: false, created_at: '2024-01-21',
    },
    {
        id: 8, title: 'Odd One Out', difficulty: 'Easy', category: 'Logical Reasoning', category_slug: 'logical',
        description: 'Which one does not belong? APPLE, MANGO, CARROT, BANANA, GRAPE',
        answer_type: 'mcq', options: ['APPLE', 'MANGO', 'CARROT', 'BANANA'], correct_answer: 'CARROT',
        explanation: 'CARROT is a vegetable while the rest are fruits.',
        constraints_info: null, examples: [{ input: 'APPLE, MANGO, CARROT, BANANA, GRAPE', output: 'CARROT' }],
        acceptance_rate: 88.7, solved: true, created_at: '2024-01-22',
    },
    {
        id: 9, title: 'Syllogism', difficulty: 'Medium', category: 'Logical Reasoning', category_slug: 'logical',
        description: 'All dogs are animals. All animals are living beings. Which conclusion is definitely true?\n\nI. All dogs are living beings.\nII. All living beings are dogs.',
        answer_type: 'mcq', options: ['Only I', 'Only II', 'Both I and II', 'Neither I nor II'], correct_answer: 'Only I',
        explanation: 'Dogs ⊂ Animals ⊂ Living beings. So all dogs are living beings (I is true). But not all living beings are dogs (II is false).',
        constraints_info: null, examples: [],
        acceptance_rate: 62.4, solved: false, created_at: '2024-01-23',
    },
    {
        id: 10, title: 'Blood Relation Puzzle', difficulty: 'Medium', category: 'Logical Reasoning', category_slug: 'logical',
        description: "Pointing to a photograph, Arun says \"She is the daughter of my grandfather's only son.\" How is the girl in the photograph related to Arun?",
        answer_type: 'mcq', options: ['Daughter', 'Sister', 'Mother', 'Cousin'], correct_answer: 'Sister',
        explanation: "Grandfather's only son = Arun's father. Father's daughter = Arun's sister.",
        constraints_info: null, examples: [],
        acceptance_rate: 58.9, solved: true, created_at: '2024-01-24',
    },
    {
        id: 11, title: 'Seating Arrangement', difficulty: 'Hard', category: 'Logical Reasoning', category_slug: 'logical',
        description: 'Eight people A, B, C, D, E, F, G, H are sitting in a circle facing the center. B is 3rd to the left of D. H is 2nd to the right of B. C is between A and H. G is between E and F. E is 2nd to the left of A. Who is sitting opposite to A?',
        answer_type: 'mcq', options: ['F', 'G', 'E', 'D'], correct_answer: 'F',
        explanation: 'Arranging clockwise from D: D _ _ B _ H A C, placing E 2nd left of A, G between E and F → F is opposite to A.',
        constraints_info: 'All face the center.',
        examples: [],
        acceptance_rate: 35.6, solved: false, created_at: '2024-01-25',
    },
    {
        id: 12, title: 'Bar Graph Reading', difficulty: 'Easy', category: 'Data Interpretation', category_slug: 'di',
        description: "A company's revenue (in lakhs) over 4 quarters: Q1=45, Q2=60, Q3=55, Q4=80. What is the total annual revenue?",
        answer_type: 'numerical', options: null, correct_answer: '240',
        explanation: 'Total = 45 + 60 + 55 + 80 = 240 lakhs',
        constraints_info: 'Answer in lakhs.',
        examples: [{ input: 'Q1=45, Q2=60, Q3=55, Q4=80', output: '240' }],
        acceptance_rate: 85.2, solved: true, created_at: '2024-01-26',
    },
    {
        id: 13, title: 'Pie Chart Percentage', difficulty: 'Easy', category: 'Data Interpretation', category_slug: 'di',
        description: 'In a class of 200 students: 30% study Science, 25% study Math, 20% study English, and the rest study History. How many students study History?',
        answer_type: 'mcq', options: ['40', '50', '60', '45'], correct_answer: '50',
        explanation: 'History = 100% - 30% - 25% - 20% = 25%. Students = 25% of 200 = 50.',
        constraints_info: null, examples: [{ input: 'Total=200, Science=30%, Math=25%, English=20%', output: '50' }],
        acceptance_rate: 79.8, solved: false, created_at: '2024-01-27',
    },
    {
        id: 14, title: 'Growth Rate Analysis', difficulty: 'Medium', category: 'Data Interpretation', category_slug: 'di',
        description: 'A company had profits of ₹50L in 2020 and ₹72L in 2022. Assuming compound growth, what was the approximate annual growth rate?',
        answer_type: 'mcq', options: ['15%', '20%', '22%', '18%'], correct_answer: '20%',
        explanation: '72 = 50 × (1+r)². (1+r)² = 1.44. 1+r = 1.2. r = 20%.',
        constraints_info: 'Approximate to nearest whole percentage.',
        examples: [],
        acceptance_rate: 55.4, solved: false, created_at: '2024-01-28',
    },
    {
        id: 15, title: 'Multi-Table Data Analysis', difficulty: 'Hard', category: 'Data Interpretation', category_slug: 'di',
        description: 'Company A has 500 employees with avg salary ₹50,000. Company B has 300 employees with avg salary ₹70,000. If companies merge, what is the new average salary?',
        answer_type: 'numerical', options: null, correct_answer: '57500',
        explanation: 'Total salary = (500×50000) + (300×70000) = 25000000 + 21000000 = 46000000. Total employees = 800. Avg = 46000000/800 = ₹57,500.',
        constraints_info: 'Enter numerical answer without comma or currency symbol.',
        examples: [],
        acceptance_rate: 44.2, solved: false, created_at: '2024-01-29',
    },
    {
        id: 16, title: 'Synonym Identification', difficulty: 'Easy', category: 'Verbal Ability', category_slug: 'verbal',
        description: 'Choose the word that is most similar in meaning to "ELOQUENT".',
        answer_type: 'mcq', options: ['Silent', 'Articulate', 'Confused', 'Angry'], correct_answer: 'Articulate',
        explanation: '"Eloquent" means fluent, persuasive, and articulate in speech or writing.',
        constraints_info: null, examples: [],
        acceptance_rate: 76.1, solved: true, created_at: '2024-01-30',
    },
    {
        id: 17, title: 'Antonym Selection', difficulty: 'Easy', category: 'Verbal Ability', category_slug: 'verbal',
        description: 'Choose the word opposite in meaning to "ABUNDANT".',
        answer_type: 'mcq', options: ['Plentiful', 'Scarce', 'Overflow', 'Surplus'], correct_answer: 'Scarce',
        explanation: '"Abundant" means plentiful. Its opposite is "Scarce" meaning in short supply.',
        constraints_info: null, examples: [],
        acceptance_rate: 81.3, solved: true, created_at: '2024-01-31',
    },
    {
        id: 18, title: 'Sentence Correction', difficulty: 'Medium', category: 'Verbal Ability', category_slug: 'verbal',
        description: 'Identify the correct sentence:\n\nA) Each of the students have completed their assignment.\nB) Each of the students has completed his or her assignment.\nC) Each of the students have completed his or her assignment.\nD) Each of the student has completed their assignment.',
        answer_type: 'mcq', options: ['A', 'B', 'C', 'D'], correct_answer: 'B',
        explanation: '"Each" is singular and takes "has". The pronoun should agree in number: "his or her".',
        constraints_info: null, examples: [],
        acceptance_rate: 53.7, solved: false, created_at: '2024-02-01',
    },
    {
        id: 19, title: 'Reading Comprehension Critical', difficulty: 'Hard', category: 'Verbal Ability', category_slug: 'verbal',
        description: 'Read the passage: "The paradox of tolerance states that if a society is tolerant without limit, its ability to be tolerant will eventually be seized or destroyed by the intolerant. Karl Popper described it as the seemingly paradoxical idea that in order to maintain a tolerant society, the society must be intolerant of intolerance."\n\nWhat is the main argument of the passage?',
        answer_type: 'mcq', options: ['Society should tolerate everything', 'Tolerance must have limits to sustain itself', 'Intolerance is always wrong', 'Karl Popper was intolerant'], correct_answer: 'Tolerance must have limits to sustain itself',
        explanation: 'The passage argues that unlimited tolerance leads to destruction of tolerance itself. Hence, for tolerance to survive, it must set limits on intolerance.',
        constraints_info: null, examples: [],
        acceptance_rate: 38.9, solved: false, created_at: '2024-02-02',
    },
    {
        id: 20, title: 'Ratio and Proportion', difficulty: 'Medium', category: 'Quantitative Aptitude', category_slug: 'quant',
        description: 'If A:B = 3:4 and B:C = 5:6, find A:B:C.',
        answer_type: 'mcq', options: ['15:20:24', '3:4:6', '9:12:16', '5:6:8'], correct_answer: '15:20:24',
        explanation: 'A:B = 3:4, B:C = 5:6. Make B common: A:B = 15:20, B:C = 20:24. So A:B:C = 15:20:24.',
        constraints_info: null, examples: [],
        acceptance_rate: 59.2, solved: false, created_at: '2024-02-03',
    },
];

export const sampleSubmissions: Submission[] = [
    { id: 1, user_id: 1, problem_id: 1, answer: '₹1,200', is_correct: true, time_taken: 45, submitted_at: '2024-02-25T10:30:00Z', title: 'Simple Interest Calculation', difficulty: 'Easy', category: 'Quantitative Aptitude' },
    { id: 2, user_id: 1, problem_id: 3, answer: '18', is_correct: true, time_taken: 30, submitted_at: '2024-02-25T11:00:00Z', title: 'Average of Numbers', difficulty: 'Easy', category: 'Quantitative Aptitude' },
    { id: 3, user_id: 1, problem_id: 5, answer: '25%', is_correct: true, time_taken: 60, submitted_at: '2024-02-24T09:15:00Z', title: 'Profit and Loss', difficulty: 'Medium', category: 'Quantitative Aptitude' },
    { id: 4, user_id: 1, problem_id: 8, answer: 'CARROT', is_correct: true, time_taken: 20, submitted_at: '2024-02-24T10:00:00Z', title: 'Odd One Out', difficulty: 'Easy', category: 'Logical Reasoning' },
    { id: 5, user_id: 1, problem_id: 10, answer: 'Sister', is_correct: true, time_taken: 90, submitted_at: '2024-02-23T14:30:00Z', title: 'Blood Relation Puzzle', difficulty: 'Medium', category: 'Logical Reasoning' },
    { id: 6, user_id: 1, problem_id: 12, answer: '240', is_correct: true, time_taken: 25, submitted_at: '2024-02-23T15:00:00Z', title: 'Bar Graph Reading', difficulty: 'Easy', category: 'Data Interpretation' },
    { id: 7, user_id: 1, problem_id: 16, answer: 'Articulate', is_correct: true, time_taken: 15, submitted_at: '2024-02-22T09:00:00Z', title: 'Synonym Identification', difficulty: 'Easy', category: 'Verbal Ability' },
    { id: 8, user_id: 1, problem_id: 17, answer: 'Scarce', is_correct: true, time_taken: 12, submitted_at: '2024-02-22T09:30:00Z', title: 'Antonym Selection', difficulty: 'Easy', category: 'Verbal Ability' },
    { id: 9, user_id: 1, problem_id: 4, answer: '₹2,000', is_correct: false, time_taken: 120, submitted_at: '2024-02-21T16:00:00Z', title: 'Compound Interest Problem', difficulty: 'Medium', category: 'Quantitative Aptitude' },
    { id: 10, user_id: 1, problem_id: 11, answer: 'G', is_correct: false, time_taken: 180, submitted_at: '2024-02-20T11:00:00Z', title: 'Seating Arrangement', difficulty: 'Hard', category: 'Logical Reasoning' },
];

export const sampleBadges: Badge[] = [
    { id: 1, name: 'First Steps', description: 'Solve your first problem', icon: '🎯', criteria: { type: 'solved_count', value: 1 } },
    { id: 2, name: 'Problem Solver', description: 'Solve 10 problems', icon: '⭐', criteria: { type: 'solved_count', value: 10 } },
    { id: 5, name: 'Perfectionist', description: 'Achieve 100% accuracy on 10 problems', icon: '🎖️', criteria: { type: 'accuracy', value: 100 } },
    { id: 4, name: 'Speed Demon', description: 'Solve a problem in under 30 seconds', icon: '⚡', criteria: { type: 'speed', value: 30 } },
];

// Generate sample heatmap data for the last 365 days
export function generateHeatmapData() {
    const data: { date: string; count: number; correct: number }[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        // Generate random activity (sparse, like real usage)
        const random = Math.random();
        if (random > 0.65) {
            const count = Math.floor(Math.random() * 8) + 1;
            const correct = Math.floor(Math.random() * count) + (count > 1 ? 1 : 0);
            data.push({ date: dateStr, count, correct });
        }
    }
    return data;
}
