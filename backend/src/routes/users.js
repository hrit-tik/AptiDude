const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        const user = db.prepare('SELECT id, username, email, avatar_url, created_at FROM users WHERE id = ?').get(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const solvedRow = db.prepare(
            'SELECT COUNT(DISTINCT problem_id) as solved FROM submissions WHERE user_id = ? AND is_correct = 1'
        ).get(userId);

        const difficultyRows = db.prepare(`
      SELECT p.difficulty, COUNT(DISTINCT s.problem_id) as count
      FROM submissions s JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ? AND s.is_correct = 1
      GROUP BY p.difficulty
    `).all(userId);

        const accuracyRow = db.prepare(
            'SELECT COUNT(*) as total, SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct FROM submissions WHERE user_id = ?'
        ).get(userId);

        const badgeRows = db.prepare(
            'SELECT b.* FROM badges b JOIN user_badges ub ON b.id = ub.badge_id WHERE ub.user_id = ?'
        ).all(userId);

        const categoryRows = db.prepare(`
      SELECT c.name, c.slug, COUNT(DISTINCT s.problem_id) as count
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE s.user_id = ? AND s.is_correct = 1
      GROUP BY c.name, c.slug
    `).all(userId);

        const rankRow = db.prepare(`
      SELECT COUNT(*) + 1 as rank FROM (
        SELECT user_id, COUNT(DISTINCT problem_id) as solved
        FROM submissions WHERE is_correct = 1
        GROUP BY user_id
        HAVING COUNT(DISTINCT problem_id) > (
          SELECT COUNT(DISTINCT problem_id) FROM submissions WHERE user_id = ? AND is_correct = 1
        )
      )
    `).get(userId);

        const accuracy = accuracyRow.total > 0
            ? ((accuracyRow.correct / accuracyRow.total) * 100).toFixed(1)
            : 0;

        res.json({
            user,
            solved: solvedRow.solved,
            difficulty: difficultyRows,
            accuracy: parseFloat(accuracy),
            totalAttempts: accuracyRow.total,
            badges: badgeRows.map(b => ({ ...b, criteria: b.criteria ? JSON.parse(b.criteria) : {} })),
            categories: categoryRows,
            rank: rankRow.rank,
        });
    } catch (err) {
        console.error('Profile error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/users/progress
router.get('/progress', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;

        const heatmapRows = db.prepare(`
      SELECT DATE(submitted_at) as date, COUNT(*) as count,
             SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct
      FROM submissions
      WHERE user_id = ? AND submitted_at > datetime('now', '-365 days')
      GROUP BY DATE(submitted_at)
      ORDER BY date
    `).all(userId);

        const recentRows = db.prepare(`
      SELECT s.*, p.title, p.difficulty, c.name as category
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
      LIMIT 10
    `).all(userId);

        const statsRow = db.prepare(`
      SELECT
        COUNT(DISTINCT CASE WHEN is_correct = 1 THEN problem_id END) as total_solved,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_count
      FROM submissions WHERE user_id = ?
    `).get(userId);

        const diffRows = db.prepare(`
      SELECT p.difficulty, COUNT(DISTINCT s.problem_id) as count
      FROM submissions s JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ? AND s.is_correct = 1
      GROUP BY p.difficulty
    `).all(userId);

        const accuracy = statsRow.total_attempts > 0
            ? ((statsRow.correct_count / statsRow.total_attempts) * 100).toFixed(1)
            : 0;

        res.json({
            heatmap: heatmapRows,
            recentAttempts: recentRows,
            totalSolved: statsRow.total_solved,
            totalAttempts: statsRow.total_attempts,
            accuracy: parseFloat(accuracy),
            difficultyDistribution: diffRows,
        });
    } catch (err) {
        console.error('Progress error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
