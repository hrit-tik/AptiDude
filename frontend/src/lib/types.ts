export interface Problem {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    category: string;
    category_slug: string;
    answer_type: string;
    options: string[] | null;
    correct_answer: string;
    explanation: string;
    constraints_info: string | null;
    examples: { input: string; output: string; explanation?: string }[];
    acceptance_rate: number;
    solved?: boolean;
    created_at?: string;
}

export interface Submission {
    id: number;
    user_id: number;
    problem_id: number;
    answer: string;
    is_correct: boolean;
    time_taken: number | null;
    submitted_at: string;
    title?: string;
    difficulty?: string;
    category?: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    avatar_url: string;
    created_at: string;
}

export interface Badge {
    id: number;
    name: string;
    description: string;
    icon: string;
    criteria: Record<string, unknown>;
}

export interface ProgressData {
    heatmap: { date: string; count: number; correct: number }[];
    recentAttempts: Submission[];
    totalSolved: number;
    totalAttempts: number;
    accuracy: number;
    difficultyDistribution: { difficulty: string; count: number }[];
}

export interface ProfileData {
    user: User;
    solved: number;
    difficulty: { difficulty: string; count: number }[];
    accuracy: number;
    totalAttempts: number;
    badges: Badge[];
    categories: { name: string; slug: string; count: number }[];
    rank: number;
}

export interface ProblemsResponse {
    problems: Problem[];
    total: number;
    page: number;
    totalPages: number;
}
