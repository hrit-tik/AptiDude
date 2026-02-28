const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { optionalAuth } = require('../middleware/auth');

// GET /api/problems — list all problems with optional filters
router.get('/', optionalAuth, (req, res) => {
    try {
        const { difficulty, category, status, search, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const params = [];
        const conditions = [];

        if (difficulty) {
            conditions.push('p.difficulty = ?');
            params.push(difficulty);
        }
        if (category) {
            conditions.push('c.slug = ?');
            params.push(category);
        }
        if (search) {
            conditions.push('p.title LIKE ?');
            params.push(`%${search}%`);
        }
        if (req.user && status) {
            if (status === 'solved') {
                conditions.push('EXISTS (SELECT 1 FROM submissions s WHERE s.problem_id = p.id AND s.user_id = ? AND s.is_correct = 1)');
                params.push(req.user.id);
            } else if (status === 'unsolved') {
                conditions.push('NOT EXISTS (SELECT 1 FROM submissions s WHERE s.problem_id = p.id AND s.user_id = ? AND s.is_correct = 1)');
                params.push(req.user.id);
            }
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const countRow = db.prepare(`SELECT COUNT(*) as count FROM problems p LEFT JOIN categories c ON p.category_id = c.id ${where}`).get(...params);
        const total = countRow.count;

        let solvedSubquery = '';
        if (req.user) {
            solvedSubquery = `, EXISTS (SELECT 1 FROM submissions s WHERE s.problem_id = p.id AND s.user_id = ${req.user.id} AND s.is_correct = 1) as solved`;
        }

        const rows = db.prepare(`
      SELECT p.id, p.title, p.difficulty, p.answer_type, p.acceptance_rate, p.created_at,
             c.name as category, c.slug as category_slug
             ${solvedSubquery}
      FROM problems p
      LEFT JOIN categories c ON p.category_id = c.id
      ${where}
      ORDER BY p.id ASC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

        res.json({
            problems: rows.map(r => ({ ...r, solved: r.solved === 1 })),
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (err) {
        console.error('Get problems error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/problems/:id — get single problem
router.get('/:id', optionalAuth, (req, res) => {
    try {
        const { id } = req.params;
        const problem = db.prepare(`
      SELECT p.*, c.name as category, c.slug as category_slug
      FROM problems p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(id);

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Parse JSON fields
        problem.options = problem.options ? JSON.parse(problem.options) : null;
        problem.examples = problem.examples ? JSON.parse(problem.examples) : [];

        // Check if user has solved it
        if (req.user) {
            const sub = db.prepare(
                'SELECT * FROM submissions WHERE problem_id = ? AND user_id = ? ORDER BY submitted_at DESC LIMIT 1'
            ).get(id, req.user.id);
            problem.userSubmission = sub || null;
        }

        res.json(problem);
    } catch (err) {
        console.error('Get problem error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
