const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/admin/problems — add a new problem
router.post('/problems', (req, res) => {
    try {
        const { title, description, difficulty, category_slug, answer_type, options, correct_answer, explanation, constraints_info, examples } = req.body;

        if (!title || !description || !difficulty || !category_slug || !answer_type || !correct_answer) {
            return res.status(400).json({ error: 'Missing required fields: title, description, difficulty, category_slug, answer_type, correct_answer' });
        }

        // Get category ID
        const category = db.prepare('SELECT id FROM categories WHERE slug = ?').get(category_slug);
        if (!category) {
            return res.status(400).json({ error: `Invalid category: ${category_slug}. Use: quant, logical, di, verbal` });
        }

        const result = db.prepare(`
      INSERT INTO problems (title, description, difficulty, category_id, answer_type, options, correct_answer, explanation, constraints_info, examples, acceptance_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            title, description, difficulty, category.id, answer_type,
            options ? JSON.stringify(options) : null,
            correct_answer,
            explanation || null,
            constraints_info || null,
            examples ? JSON.stringify(examples) : '[]',
            Math.floor(Math.random() * 40 + 40)
        );

        const newProblem = db.prepare('SELECT * FROM problems WHERE id = ?').get(result.lastInsertRowid);
        res.status(201).json(newProblem);
    } catch (err) {
        console.error('Add problem error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT /api/admin/problems/:id — update a problem
router.put('/problems/:id', (req, res) => {
    try {
        const { id } = req.params;
        const existing = db.prepare('SELECT * FROM problems WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        const { title, description, difficulty, category_slug, answer_type, options, correct_answer, explanation, constraints_info, examples } = req.body;

        let category_id = existing.category_id;
        if (category_slug) {
            const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(category_slug);
            if (cat) category_id = cat.id;
        }

        db.prepare(`
      UPDATE problems SET title=?, description=?, difficulty=?, category_id=?, answer_type=?, options=?, correct_answer=?, explanation=?, constraints_info=?, examples=?
      WHERE id = ?
    `).run(
            title || existing.title,
            description || existing.description,
            difficulty || existing.difficulty,
            category_id,
            answer_type || existing.answer_type,
            options ? JSON.stringify(options) : existing.options,
            correct_answer || existing.correct_answer,
            explanation !== undefined ? explanation : existing.explanation,
            constraints_info !== undefined ? constraints_info : existing.constraints_info,
            examples ? JSON.stringify(examples) : existing.examples,
            id
        );

        const updated = db.prepare('SELECT * FROM problems WHERE id = ?').get(id);
        res.json(updated);
    } catch (err) {
        console.error('Update problem error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/admin/problems/:id — delete a problem
router.delete('/problems/:id', (req, res) => {
    try {
        const { id } = req.params;
        const existing = db.prepare('SELECT id FROM problems WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        db.prepare('DELETE FROM submissions WHERE problem_id = ?').run(id);
        db.prepare('DELETE FROM problems WHERE id = ?').run(id);
        res.json({ message: 'Problem deleted successfully' });
    } catch (err) {
        console.error('Delete problem error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/admin/stats — admin dashboard stats
router.get('/stats', (req, res) => {
    try {
        const problemCount = db.prepare('SELECT COUNT(*) as count FROM problems').get();
        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
        const submissionCount = db.prepare('SELECT COUNT(*) as count FROM submissions').get();
        const categoryStats = db.prepare(`
      SELECT c.name, c.slug, COUNT(p.id) as count
      FROM categories c LEFT JOIN problems p ON p.category_id = c.id
      GROUP BY c.id
    `).all();

        res.json({
            problems: problemCount.count,
            users: userCount.count,
            submissions: submissionCount.count,
            categories: categoryStats,
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /api/admin/problems/bulk — bulk import problems
router.post('/problems/bulk', (req, res) => {
    try {
        const { problems } = req.body;
        if (!Array.isArray(problems) || problems.length === 0) {
            return res.status(400).json({ error: 'Expected { problems: [...] } array' });
        }

        const insert = db.prepare(`
      INSERT INTO problems (title, description, difficulty, category_id, answer_type, options, correct_answer, explanation, constraints_info, examples, acceptance_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        let imported = 0;
        let errors = [];

        const insertMany = db.transaction((problems) => {
            for (const p of problems) {
                try {
                    const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(p.category_slug || p.category);
                    if (!cat) {
                        errors.push(`Skipped "${p.title}": invalid category "${p.category_slug || p.category}"`);
                        continue;
                    }
                    insert.run(
                        p.title, p.description, p.difficulty, cat.id, p.answer_type,
                        p.options ? JSON.stringify(p.options) : null,
                        p.correct_answer,
                        p.explanation || null,
                        p.constraints_info || null,
                        p.examples ? JSON.stringify(p.examples) : '[]',
                        p.acceptance_rate || Math.floor(Math.random() * 40 + 40)
                    );
                    imported++;
                } catch (e) {
                    errors.push(`Error on "${p.title}": ${e.message}`);
                }
            }
        });

        insertMany(problems);
        res.json({ imported, errors, total: problems.length });
    } catch (err) {
        console.error('Bulk import error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
