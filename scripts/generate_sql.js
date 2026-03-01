/**
 * Generate SQL INSERTs for all questions.
 * Usage: node scripts/generate_sql.js > scripts/insert_questions.sql
 */
const path = require('path');
const fs = require('fs');

const questionsDir = path.join(__dirname, 'questions');
const files = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json'));

let sql = '-- Auto-generated SQL for Aptive questions\n';
sql += '-- Run this in Supabase SQL Editor (https://app.supabase.com → SQL Editor)\n\n';

let total = 0;

for (const file of files) {
    const questions = JSON.parse(fs.readFileSync(path.join(questionsDir, file), 'utf8'));
    const cat = path.basename(file, '.json');
    sql += `-- ===== ${cat.toUpperCase()} (${questions.length} questions) =====\n`;

    for (const q of questions) {
        const esc = (s) => s ? s.replace(/'/g, "''") : null;
        const opts = q.options ? `'${JSON.stringify(q.options).replace(/'/g, "''")}'::jsonb` : 'NULL';
        const exJson = q.examples && q.examples.length > 0
            ? `'${JSON.stringify(q.examples).replace(/'/g, "''")}'::jsonb`
            : "'[]'::jsonb";

        sql += `INSERT INTO problems (title, description, difficulty, category_id, answer_type, options, correct_answer, explanation, constraints_info, examples, acceptance_rate) VALUES (\n`;
        sql += `  '${esc(q.title)}',\n`;
        sql += `  '${esc(q.description)}',\n`;
        sql += `  '${esc(q.difficulty)}',\n`;
        sql += `  ${q.category_id},\n`;
        sql += `  '${esc(q.answer_type)}',\n`;
        sql += `  ${opts},\n`;
        sql += `  '${esc(q.correct_answer)}',\n`;
        sql += `  '${esc(q.explanation)}',\n`;
        sql += `  ${q.constraints_info ? `'${esc(q.constraints_info)}'` : 'NULL'},\n`;
        sql += `  ${exJson},\n`;
        sql += `  ${q.acceptance_rate}\n`;
        sql += `);\n\n`;
        total++;
    }
}

sql += `-- Total: ${total} questions inserted\n`;

// Write to file
const outPath = path.join(__dirname, 'insert_questions.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Generated ${total} INSERT statements → ${outPath}`);
