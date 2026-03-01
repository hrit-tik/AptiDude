/**
 * JSON Import Tool for Aptive
 *
 * Usage: node src/seed/import.js <path-to-json-file>
 *
 * JSON file should match the format of template.json
 */

const fs = require('fs');
const path = require('path');
const db = require('../config/db');
const initializeDatabase = require('../config/initDb');

// Ensure DB is ready
initializeDatabase();

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log(`
📥 Aptive Question Import Tool

Usage:
  node src/seed/import.js <path-to-json-file>

Example:
  node src/seed/import.js ./my_questions.json

The JSON file should be an array of objects or { "problems": [...] }
See src/seed/template.json for the expected format.
  `);
    process.exit(0);
}

const filePath = path.resolve(args[0]);

if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
}

try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    const problems = Array.isArray(data) ? data : data.problems;

    if (!Array.isArray(problems) || problems.length === 0) {
        console.error('❌ JSON must be an array of problems or { "problems": [...] }');
        process.exit(1);
    }

    const insert = db.prepare(`
    INSERT OR IGNORE INTO problems (title, description, difficulty, category_id, answer_type, options, correct_answer, explanation, constraints_info, examples, acceptance_rate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    let imported = 0;
    let skipped = 0;

    const importAll = db.transaction((problems) => {
        for (const p of problems) {
            // Validate required fields
            if (!p.title || !p.description || !p.difficulty || !p.correct_answer) {
                console.warn(`⚠️  Skipped: missing required fields in "${p.title || '(untitled)'}"`);
                skipped++;
                continue;
            }

            // Find category
            const catSlug = p.category_slug || p.category || 'quant';
            const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(catSlug);
            if (!cat) {
                console.warn(`⚠️  Skipped "${p.title}": unknown category "${catSlug}". Use: quant, logical, di, verbal`);
                skipped++;
                continue;
            }

            try {
                insert.run(
                    p.title,
                    p.description,
                    p.difficulty,
                    cat.id,
                    p.answer_type || 'mcq',
                    p.options ? JSON.stringify(p.options) : null,
                    p.correct_answer,
                    p.explanation || null,
                    p.constraints_info || null,
                    p.examples ? JSON.stringify(p.examples) : '[]',
                    p.acceptance_rate || Math.floor(Math.random() * 40 + 40)
                );
                imported++;
            } catch (e) {
                console.warn(`⚠️  Error on "${p.title}": ${e.message}`);
                skipped++;
            }
        }
    });

    importAll(problems);

    console.log(`
✅ Import complete!
   Imported: ${imported}
   Skipped:  ${skipped}
   Total in DB: ${db.prepare('SELECT COUNT(*) as count FROM problems').get().count}
  `);
} catch (err) {
    console.error('❌ Failed to parse JSON:', err.message);
    process.exit(1);
}
