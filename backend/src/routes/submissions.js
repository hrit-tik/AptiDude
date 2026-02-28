const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// POST /api/submissions — submit an answer
router.post('/', authenticateToken, (req, res) => {
    try {
        const { problem_id, answer, time_taken } = req.body;
        const user_id = req.user.id;

        // Get the correct answer
        const problem = db.prepare('SELECT correct_answer, explanation FROM problems WHERE id = ?').get(problem_id);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        const is_correct = answer.toString().trim().toLowerCase() === problem.correct_answer.trim().toLowerCase();

        // Save submission
        const result = db.prepare(
            'INSERT INTO submissions (user_id, problem_id, answer, is_correct, time_taken) VALUES (?, ?, ?, ?, ?)'
        ).run(user_id, problem_id, answer, is_correct ? 1 : 0, time_taken || null);

        const submission = db.prepare('SELECT * FROM submissions WHERE id = ?').get(result.lastInsertRowid);

        // Update acceptance rate
        const stats = db.prepare(
            'SELECT COUNT(*) as total, SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct FROM submissions WHERE problem_id = ?'
        ).get(problem_id);
        const acceptance_rate = ((stats.correct / stats.total) * 100).toFixed(2);
        db.prepare('UPDATE problems SET acceptance_rate = ? WHERE id = ?').run(parseFloat(acceptance_rate), problem_id);

        res.json({
            submission,
            is_correct,
            explanation: problem.explanation,
            correct_answer: problem.correct_answer,
        });
    } catch (err) {
        console.error('Submit error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/submissions — get user's submissions
router.get('/', authenticateToken, (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const rows = db.prepare(`
      SELECT s.*, p.title, p.difficulty, c.name as category
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
      LIMIT ? OFFSET ?
    `).all(req.user.id, parseInt(limit), offset);

        res.json({ submissions: rows });
    } catch (err) {
        console.error('Get submissions error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
