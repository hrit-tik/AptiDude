/**
 * AptiDude Migration Script
 * Reads problems from local SQLite and uploads them to Supabase
 *
 * Usage:
 *   1. First run supabase_schema.sql in Supabase SQL Editor
 *   2. Set SUPABASE_SERVICE_ROLE_KEY env var or edit below
 *   3. Run: node scripts/migrate.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zkmtpphhyltvoylrsyxd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';

if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.log(`
⚠️  Service Role Key required!

Set it as an environment variable:
  $env:SUPABASE_SERVICE_ROLE_KEY = "eyJ..."
  node scripts/migrate.js

Or edit this file directly (line 14).

Find it in: Supabase Dashboard → Settings → API → service_role key
    `);
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// The 98 curated problems
const problems = [
    // QUANTITATIVE APTITUDE — EASY
    { title: 'Simple Interest Calculation', description: 'A sum of ₹5,000 is invested at a simple interest rate of 8% per annum. What is the total interest earned after 3 years?', difficulty: 'Easy', cat: 'quant', answer_type: 'mcq', options: ['₹1,200', '₹1,500', '₹1,000', '₹800'], correct_answer: '₹1,200', explanation: 'SI = P×R×T/100 = 5000×8×3/100 = ₹1,200' },
    { title: 'Percentage Increase', description: 'A shirt originally costs ₹800. If the price is increased by 25%, what is the new price?', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '1000', explanation: 'New Price = 800 + (25/100×800) = ₹1,000' },
    { title: 'Average of Numbers', description: 'Find the average of 12, 15, 18, 21, and 24.', difficulty: 'Easy', cat: 'quant', answer_type: 'mcq', options: ['17', '18', '19', '20'], correct_answer: '18', explanation: 'Average = (12+15+18+21+24)/5 = 90/5 = 18' },
    { title: 'LCM of Two Numbers', description: 'Find the LCM of 12 and 18.', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '36', explanation: '12 = 2²×3, 18 = 2×3². LCM = 2²×3² = 36' },
    { title: 'HCF of Two Numbers', description: 'Find the HCF of 24 and 36.', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '12', explanation: '24 = 2³×3, 36 = 2²×3². HCF = 2²×3 = 12' },
    { title: 'Speed Distance Time', description: 'A car travels 150 km in 3 hours. What is its average speed in km/h?', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '50', explanation: 'Speed = Distance/Time = 150/3 = 50 km/h' },
    { title: 'Fraction to Percentage', description: 'Convert 3/5 to a percentage.', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '60', explanation: '3/5 × 100 = 60%' },
    { title: 'Ratio Simplification', description: 'Simplify the ratio 45:60.', difficulty: 'Easy', cat: 'quant', answer_type: 'mcq', options: ['3:4', '4:5', '9:12', '2:3'], correct_answer: '3:4', explanation: 'GCD of 45 and 60 is 15. 45/15:60/15 = 3:4' },
    { title: 'Percentage of a Number', description: 'What is 35% of 240?', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '84', explanation: '35/100 × 240 = 84' },
    { title: 'Square Root', description: 'What is the square root of 196?', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '14', explanation: '14 × 14 = 196' },
    { title: 'Discount Calculation', description: 'A book marked at ₹500 is sold at a 20% discount. What is the selling price?', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '400', explanation: 'Discount = 20/100×500 = 100. SP = 500-100 = ₹400' },
    { title: 'Age Problem Basic', description: "The sum of ages of A and B is 50. A is 10 years older than B. What is B's age?", difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '20', explanation: 'A+B=50, A=B+10. So 2B+10=50, B=20' },
    { title: 'Unitary Method', description: 'If 5 pens cost ₹75, how much do 8 pens cost?', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '120', explanation: '1 pen = 75/5 = ₹15. 8 pens = 15×8 = ₹120' },
    { title: 'Perimeter of Rectangle', description: 'A rectangle has length 12 cm and breadth 8 cm. Find its perimeter.', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '40', explanation: 'Perimeter = 2(l+b) = 2(12+8) = 40 cm' },
    { title: 'Area of Circle', description: 'Find the area of a circle with radius 7 cm. (Use π = 22/7)', difficulty: 'Easy', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '154', explanation: 'Area = πr² = (22/7)×7² = 154 cm²' },
    // QUANTITATIVE — MEDIUM
    { title: 'Compound Interest Problem', description: 'Find the compound interest on ₹10,000 at 10% per annum for 2 years, compounded annually.', difficulty: 'Medium', cat: 'quant', answer_type: 'mcq', options: ['₹2,000', '₹2,100', '₹2,200', '₹1,900'], correct_answer: '₹2,100', explanation: 'A = P(1+R/100)^T = 10000(1.1)² = 12100. CI = 12100-10000 = ₹2,100' },
    { title: 'Profit and Loss', description: 'A trader buys an article for ₹600 and sells it for ₹750. What is the profit percentage?', difficulty: 'Medium', cat: 'quant', answer_type: 'mcq', options: ['20%', '25%', '30%', '15%'], correct_answer: '25%', explanation: 'Profit = 150. Profit% = (150/600)×100 = 25%' },
    { title: 'Ratio and Proportion', description: 'If A:B = 3:4 and B:C = 5:6, find A:B:C.', difficulty: 'Medium', cat: 'quant', answer_type: 'mcq', options: ['15:20:24', '3:4:6', '9:12:16', '5:6:8'], correct_answer: '15:20:24', explanation: 'Make B common: A:B = 15:20, B:C = 20:24. So A:B:C = 15:20:24' },
    { title: 'Train Problem', description: 'Two trains of lengths 150m and 200m are moving in the same direction at 60 km/h and 40 km/h. How long will it take the faster train to cross the slower one?', difficulty: 'Medium', cat: 'quant', answer_type: 'mcq', options: ['63 sec', '53 sec', '48 sec', '72 sec'], correct_answer: '63 sec', explanation: 'Relative speed = 20 km/h = 50/9 m/s. Total distance = 350m. Time = 350/(50/9) = 63 sec' },
    { title: 'Pipes and Cisterns', description: 'Pipe A fills a tank in 12 hours. Pipe B fills it in 15 hours. If both are opened together, how long to fill the tank?', difficulty: 'Medium', cat: 'quant', answer_type: 'mcq', options: ['6h 40min', '7h', '6h', '8h'], correct_answer: '6h 40min', explanation: 'Combined rate = 1/12+1/15 = 9/60 = 3/20. Time = 20/3 = 6h 40min' },
    { title: 'Mixtures and Alligation', description: 'Milk at ₹30/L is mixed with water to get a mixture at ₹24/L. What is the ratio of milk to water?', difficulty: 'Medium', cat: 'quant', answer_type: 'mcq', options: ['4:1', '3:1', '5:1', '2:1'], correct_answer: '4:1', explanation: 'By alligation: milk:water = 4:1' },
    { title: 'Partnership', description: 'A invests ₹50,000 for 12 months and B invests ₹40,000 for 15 months. How should they share a profit of ₹55,000?', difficulty: 'Medium', cat: 'quant', answer_type: 'mcq', options: ['₹30,000 and ₹25,000', '₹25,000 and ₹30,000', '₹28,000 and ₹27,000', '₹35,000 and ₹20,000'], correct_answer: '₹25,000 and ₹30,000', explanation: 'A:B = 600000:600000 = 1:1. Each gets ₹27,500.' },
    { title: 'Work and Time', description: 'A can do a piece of work in 20 days. B can do it in 30 days. In how many days can they finish it together?', difficulty: 'Medium', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '12', explanation: 'Combined rate = 1/20+1/30 = 1/12. Time = 12 days' },
    { title: 'Boats and Streams', description: "A boat's speed in still water is 15 km/h. The stream speed is 5 km/h. Time to go 80 km downstream?", difficulty: 'Medium', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '4', explanation: 'Downstream speed = 15+5 = 20 km/h. Time = 80/20 = 4 hours' },
    { title: 'Number System', description: 'When a number is divided by 13, the remainder is 11. What is the remainder when the same number is divided by 26?', difficulty: 'Medium', cat: 'quant', answer_type: 'mcq', options: ['11', '24', '11 or 24', 'Cannot be determined'], correct_answer: '11 or 24', explanation: 'N = 13k+11. If k is even, N mod 26 = 11. If k is odd, N mod 26 = 24.' },
    // QUANTITATIVE — HARD
    { title: 'Time and Work Complex', description: 'A can do a work in 12 days. B can do the same work in 15 days. They work together for 4 days, then A leaves. How many more days will B take to finish?', difficulty: 'Hard', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '6', explanation: "Together 4 days = 3/5 done. B alone: (2/5)/(1/15) = 6 days." },
    { title: 'Probability of Cards', description: 'Two cards are drawn from a deck of 52 cards. What is the probability that both are kings?', difficulty: 'Hard', cat: 'quant', answer_type: 'mcq', options: ['1/221', '1/169', '1/13', '2/52'], correct_answer: '1/221', explanation: 'P = (4/52)×(3/51) = 1/221' },
    { title: 'Permutations and Combinations', description: 'In how many ways can 5 people sit in a row of 3 chairs?', difficulty: 'Hard', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '60', explanation: '5P3 = 5×4×3 = 60' },
    { title: 'Quadratic Equation', description: 'If the roots of x² - 7x + k = 0 are in the ratio 2:5, find k.', difficulty: 'Hard', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '10', explanation: 'Roots are 2 and 5. k = product = 10.' },
    { title: 'Mensuration Advanced', description: 'A cone has base radius 7 cm and height 24 cm. Find its curved surface area. (Use π = 22/7)', difficulty: 'Hard', cat: 'quant', answer_type: 'numerical', options: null, correct_answer: '550', explanation: 'Slant height = 25. CSA = πrl = (22/7)×7×25 = 550 cm²' },
    // LOGICAL REASONING — EASY
    { title: 'Number Series Pattern', description: 'What comes next: 2, 6, 12, 20, 30, ?', difficulty: 'Easy', cat: 'logical', answer_type: 'numerical', options: null, correct_answer: '42', explanation: 'Differences: 4, 6, 8, 10, 12. Pattern is +2.' },
    { title: 'Odd One Out', description: 'Which one does not belong? APPLE, MANGO, CARROT, BANANA, GRAPE', difficulty: 'Easy', cat: 'logical', answer_type: 'mcq', options: ['APPLE', 'MANGO', 'CARROT', 'BANANA'], correct_answer: 'CARROT', explanation: 'CARROT is a vegetable; others are fruits.' },
    { title: 'Mirror Image', description: 'If you look at a clock in a mirror and it shows 3:15, what is the actual time?', difficulty: 'Easy', cat: 'logical', answer_type: 'mcq', options: ['8:45', '9:45', '8:15', '9:15'], correct_answer: '8:45', explanation: 'Mirror time = 12:00 - 3:15 = 8:45' },
    { title: 'Alphabet Series', description: 'What comes next: A, C, F, J, O, ?', difficulty: 'Easy', cat: 'logical', answer_type: 'mcq', options: ['T', 'U', 'V', 'S'], correct_answer: 'U', explanation: 'Differences: +2, +3, +4, +5, +6. O(15)+6 = U(21)' },
    { title: 'Coding Decoding Basic', description: 'If CAT is coded as DBU, how is DOG coded?', difficulty: 'Easy', cat: 'logical', answer_type: 'mcq', options: ['EPH', 'FOG', 'CPG', 'DPH'], correct_answer: 'EPH', explanation: 'Each letter +1. D→E, O→P, G→H = EPH' },
    { title: 'Direction Sense', description: 'A man walks 5 km North, then turns right and walks 3 km, then turns right and walks 5 km. In which direction is he from the starting point?', difficulty: 'Easy', cat: 'logical', answer_type: 'mcq', options: ['East', 'West', 'North', 'South'], correct_answer: 'East', explanation: 'Net: 3km East of start.' },
    { title: 'Calendar Problem', description: 'If January 1, 2023 was a Sunday, what day was March 1, 2023?', difficulty: 'Easy', cat: 'logical', answer_type: 'mcq', options: ['Tuesday', 'Wednesday', 'Thursday', 'Monday'], correct_answer: 'Wednesday', explanation: '59 days later. 59/7 = 8w+3d. Sunday+3 = Wednesday.' },
    { title: 'Analogy', description: 'Book : Pages :: Building : ?', difficulty: 'Easy', cat: 'logical', answer_type: 'mcq', options: ['Bricks', 'Rooms', 'Floors', 'Windows'], correct_answer: 'Floors', explanation: 'A book is made of pages; a building is made of floors.' },
    { title: 'Classification', description: 'Group the odd one out: 12, 18, 24, 25, 36', difficulty: 'Easy', cat: 'logical', answer_type: 'numerical', options: null, correct_answer: '25', explanation: '25 is not divisible by 6.' },
    { title: 'Ranking', description: 'In a class of 40 students, Ram is 15th from the top. What is his rank from the bottom?', difficulty: 'Easy', cat: 'logical', answer_type: 'numerical', options: null, correct_answer: '26', explanation: '40 - 15 + 1 = 26' },
    { title: 'Number Pattern', description: 'Find the missing number: 3, 9, 27, 81, ?', difficulty: 'Easy', cat: 'logical', answer_type: 'numerical', options: null, correct_answer: '243', explanation: 'Each number ×3. 81×3 = 243' },
    { title: 'Cube and Dice', description: 'A cube has RED on top, BLUE on bottom, GREEN on front, YELLOW on back, WHITE on left, BLACK on right. What color is opposite to GREEN?', difficulty: 'Easy', cat: 'logical', answer_type: 'mcq', options: ['RED', 'YELLOW', 'BLACK', 'BLUE'], correct_answer: 'YELLOW', explanation: 'Front opposite Back = YELLOW.' },
    // LOGICAL — MEDIUM
    { title: 'Syllogism', description: 'All dogs are animals. All animals are living beings. Which is true?\nI. All dogs are living beings.\nII. All living beings are dogs.', difficulty: 'Medium', cat: 'logical', answer_type: 'mcq', options: ['Only I', 'Only II', 'Both', 'Neither'], correct_answer: 'Only I', explanation: 'Dogs ⊂ Animals ⊂ Living beings. I is true. II is false.' },
    { title: 'Blood Relation Puzzle', description: "Pointing to a photograph, Arun says \"She is the daughter of my grandfather's only son.\" How is the girl related to Arun?", difficulty: 'Medium', cat: 'logical', answer_type: 'mcq', options: ['Daughter', 'Sister', 'Mother', 'Cousin'], correct_answer: 'Sister', explanation: "Grandfather's only son = father. Father's daughter = sister." },
    { title: 'Statement Assumption', description: '"The company has decided to hire only MBA graduates for managerial positions." Which assumption is implicit?\nI. MBA graduates are better managers.\nII. No non-MBA can be a good manager.', difficulty: 'Medium', cat: 'logical', answer_type: 'mcq', options: ['Only I', 'Only II', 'Both', 'Neither'], correct_answer: 'Only I', explanation: 'The policy assumes MBA graduates have better skills (I). II is too extreme.' },
    { title: 'Logical Venn Diagram', description: 'Which Venn diagram best represents: Doctors, Females, Mothers?', difficulty: 'Medium', cat: 'logical', answer_type: 'mcq', options: ['All three overlapping', 'Mothers inside Females, Doctors separate', 'Mothers inside Females, Doctors intersecting Females', 'All separate circles'], correct_answer: 'Mothers inside Females, Doctors intersecting Females', explanation: 'All mothers are female. Some doctors are female.' },
    { title: 'Pattern Completion', description: 'In a 3×3 grid, each row and column has 1,2,3. Row 1=[1,_,3], Row 2=[3,1,_]. Missing in row 2 col 3?', difficulty: 'Medium', cat: 'logical', answer_type: 'numerical', options: null, correct_answer: '2', explanation: 'Row 2 has 3,1. Missing = 2.' },
    { title: 'Cause and Effect', description: 'Statement: More students enrolling in online courses. Cause: Internet accessibility improved. Is this the probable cause?', difficulty: 'Medium', cat: 'logical', answer_type: 'mcq', options: ['Yes', 'No', 'Partially', 'Cannot determine'], correct_answer: 'Yes', explanation: 'Internet access directly enables online learning.' },
    { title: 'Input-Output Machine', description: 'Machine: 5→26, 3→10, 7→50. Output for 4?', difficulty: 'Medium', cat: 'logical', answer_type: 'numerical', options: null, correct_answer: '17', explanation: 'Rule: n²+1. 4²+1 = 17' },
    { title: 'Coding Decoding Advanced', description: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written?', difficulty: 'Medium', cat: 'logical', answer_type: 'mcq', options: ['ENICIDME', 'EOJDJEFM', 'FMJDJEOF', 'MEDIICNE'], correct_answer: 'ENICIDME', explanation: 'Word reversed and each letter shifted +1.' },
    // LOGICAL — HARD
    { title: 'Seating Arrangement', description: 'Eight people A-H in circle facing center. B is 3rd left of D. H is 2nd right of B. C is between A and H. G is between E and F. E is 2nd left of A. Who sits opposite A?', difficulty: 'Hard', cat: 'logical', answer_type: 'mcq', options: ['F', 'G', 'E', 'D'], correct_answer: 'F', explanation: 'Careful arrangement → F opposite A.' },
    { title: 'Logical Deduction Complex', description: 'Five houses in a row. Red is left of Blue. Green on one end. Yellow next to White. Blue in the middle. What color is the first house?', difficulty: 'Hard', cat: 'logical', answer_type: 'mcq', options: ['Green', 'Yellow', 'White', 'Red'], correct_answer: 'Green', explanation: 'Blue at 3, Red at 2, Green at position 1.' },
    { title: 'Data Sufficiency', description: 'Is x > y? Statement I: x² > y². Statement II: x > 0. Which are sufficient?', difficulty: 'Hard', cat: 'logical', answer_type: 'mcq', options: ['Statement I alone', 'Statement II alone', 'Both together', 'Neither'], correct_answer: 'Both together', explanation: 'Both needed: x>0 and |x|>|y| implies x>y.' },
    { title: 'Puzzle Complex', description: 'P scored more than Q but less than R. T scored highest. S scored more than U but less than Q. Who scored least?', difficulty: 'Hard', cat: 'logical', answer_type: 'mcq', options: ['U', 'S', 'Q', 'P'], correct_answer: 'U', explanation: 'Order: T>R>P>Q>S>U.' },
    { title: 'Mathematical Operations', description: 'If + means ×, − means ÷, × means −, ÷ means +, then 8+6−3×2÷4=?', difficulty: 'Hard', cat: 'logical', answer_type: 'numerical', options: null, correct_answer: '18', explanation: '8×6÷3−2+4 = 48/3−2+4 = 18' },
    // DATA INTERPRETATION — EASY
    { title: 'Bar Graph Reading', description: 'Revenue (lakhs): Q1=45, Q2=60, Q3=55, Q4=80. Total annual revenue?', difficulty: 'Easy', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '240', explanation: '45+60+55+80 = 240' },
    { title: 'Pie Chart Percentage', description: 'Class of 200: 30% Science, 25% Math, 20% English, rest History. How many study History?', difficulty: 'Easy', cat: 'di', answer_type: 'mcq', options: ['40', '50', '60', '45'], correct_answer: '50', explanation: 'History = 25%. 25% of 200 = 50' },
    { title: 'Table Data Sum', description: 'Monthly sales: Jan=120, Feb=150, Mar=180, Apr=200, May=160. Average monthly sales?', difficulty: 'Easy', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '162', explanation: '810/5 = 162' },
    { title: 'Percentage Change', description: 'Revenue increased from ₹80L to ₹100L. Percentage increase?', difficulty: 'Easy', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '25', explanation: '(20/80)×100 = 25%' },
    { title: 'Maximum Value', description: 'Production (tonnes): 2019=350, 2020=420, 2021=390, 2022=480, 2023=450. Highest year?', difficulty: 'Easy', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '2022', explanation: '480 in 2022 is max.' },
    { title: 'Ratio from Data', description: 'Boys=300, Girls=200. Ratio of boys to girls?', difficulty: 'Easy', cat: 'di', answer_type: 'mcq', options: ['3:2', '2:3', '5:3', '3:5'], correct_answer: '3:2', explanation: '300:200 = 3:2' },
    { title: 'Simple Comparison', description: 'Exports (₹Cr): India=250, China=800, USA=600, Japan=400. How much more does China export than India?', difficulty: 'Easy', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '550', explanation: '800-250 = 550' },
    { title: 'Line Graph Trend', description: 'Temp: Mon=30°, Tue=28°, Wed=32°, Thu=35°, Fri=33°. Highest day?', difficulty: 'Easy', cat: 'di', answer_type: 'mcq', options: ['Monday', 'Wednesday', 'Thursday', 'Friday'], correct_answer: 'Thursday', explanation: '35° on Thursday is highest.' },
    { title: 'Fraction of Total', description: 'Budget ₹10L: Education=₹2.5L, Health=₹3L, Defense=₹4.5L. Education fraction?', difficulty: 'Easy', cat: 'di', answer_type: 'mcq', options: ['1/4', '1/5', '3/10', '2/5'], correct_answer: '1/4', explanation: '2.5/10 = 1/4' },
    { title: 'Growth Calculation', description: 'Population: 2020=50,000, 2021=55,000. Growth rate?', difficulty: 'Easy', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '10', explanation: '(5000/50000)×100 = 10%' },
    // DI — MEDIUM
    { title: 'Growth Rate Analysis', description: 'Profits: ₹50L in 2020, ₹72L in 2022. Compound annual growth rate?', difficulty: 'Medium', cat: 'di', answer_type: 'mcq', options: ['15%', '20%', '22%', '18%'], correct_answer: '20%', explanation: '(1+r)² = 1.44. r = 20%.' },
    { title: 'Combined Data Analysis', description: 'Dept A: 200 employees, avg ₹40K. Dept B: 300 employees, avg ₹50K. Combined average?', difficulty: 'Medium', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '46000', explanation: '23M/500 = ₹46,000' },
    { title: 'Market Share Analysis', description: 'Total market ₹500Cr. A=30%, B=25%, C=20%. How much do "others" have?', difficulty: 'Medium', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '125', explanation: 'Others = 25% of 500 = ₹125Cr' },
    { title: 'CAGR Calculation', description: 'Investment grew from ₹10,000 to ₹14,641 in 4 years. CAGR?', difficulty: 'Medium', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '10', explanation: '(1.4641)^(1/4) = 1.1. CAGR = 10%' },
    { title: 'Comparative Growth', description: 'City A: 1M→1.331M. City B: 2M→2.42M (2020-2023). Which grew faster?', difficulty: 'Medium', cat: 'di', answer_type: 'mcq', options: ['City A', 'City B', 'Both same', 'Cannot determine'], correct_answer: 'City A', explanation: 'A: 33.1%. B: 21%. A faster.' },
    // DI — HARD
    { title: 'Multi-Table Data Analysis', description: 'Co A: 500 employees, avg ₹50K. Co B: 300 employees, avg ₹70K. Merged average?', difficulty: 'Hard', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '57500', explanation: '46M/800 = ₹57,500' },
    { title: 'Index Number Problem', description: 'Base year index=100. A: ₹50→65, B: ₹80→96. Simple aggregate index?', difficulty: 'Hard', cat: 'di', answer_type: 'mcq', options: ['123.85', '121.50', '125.00', '118.75'], correct_answer: '123.85', explanation: '(161/130)×100 = 123.85' },
    { title: 'Revenue vs Profit Analysis', description: 'Revenue ₹100Cr, Cost ₹70Cr, Tax 30% on profit. Net profit?', difficulty: 'Hard', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '21', explanation: 'Profit=30, Tax=9, Net=21Cr' },
    { title: 'Weighted Average Complex', description: 'A(40 units at ₹200), B(30 at ₹350), C(30 at ₹500). Weighted avg price?', difficulty: 'Hard', cat: 'di', answer_type: 'numerical', options: null, correct_answer: '335', explanation: '33500/100 = ₹335' },
    { title: 'Year-over-Year Analysis', description: 'Sales: 100,90,108,120,132 (2019-2023). CAGR from 2019 to 2023?', difficulty: 'Hard', cat: 'di', answer_type: 'mcq', options: ['5%', '7.2%', '8%', '10%'], correct_answer: '7.2%', explanation: '(132/100)^(1/4) ≈ 1.072' },
    // VERBAL — EASY
    { title: 'Synonym Identification', description: 'Choose the word most similar to "ELOQUENT".', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['Silent', 'Articulate', 'Confused', 'Angry'], correct_answer: 'Articulate', explanation: '"Eloquent" means fluent and articulate.' },
    { title: 'Antonym Selection', description: 'Choose the opposite of "ABUNDANT".', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['Plentiful', 'Scarce', 'Overflow', 'Surplus'], correct_answer: 'Scarce', explanation: 'Abundant = plentiful. Opposite = Scarce.' },
    { title: 'Fill in the Blank', description: 'The meeting was _____ due to lack of quorum.', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['Postponed', 'Conducted', 'Celebrated', 'Ignored'], correct_answer: 'Postponed', explanation: '"Postponed" = delayed to a later time.' },
    { title: 'Spelling Check', description: 'Which is correctly spelled?', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['Occurence', 'Occurrence', 'Occurance', 'Occurrance'], correct_answer: 'Occurrence', explanation: 'Double c, double r: Occurrence.' },
    { title: 'One Word Substitution', description: 'A person who speaks two languages fluently:', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['Multilingual', 'Bilingual', 'Polyglot', 'Monolingual'], correct_answer: 'Bilingual', explanation: 'Bi = two, lingual = languages.' },
    { title: 'Idiom Meaning', description: 'What does "Bite the bullet" mean?', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['To eat fast', 'To face a difficult situation bravely', 'To fight someone', 'To escape danger'], correct_answer: 'To face a difficult situation bravely', explanation: 'To endure a painful situation with courage.' },
    { title: 'Active to Passive Voice', description: 'Convert: "The teacher praised the students."', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['The students were praised by the teacher', 'The students are praised by the teacher', 'The students praised the teacher', 'The students had been praised'], correct_answer: 'The students were praised by the teacher', explanation: 'Object→subject, "were praised", "by the teacher".' },
    { title: 'Direct to Indirect Speech', description: 'She said, "I am going to the market." Change to indirect speech.', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['She said that she is going', 'She said that she was going to the market', 'She says she is going', 'She told she went'], correct_answer: 'She said that she was going to the market', explanation: '"am" → "was", "I" → "she".' },
    { title: 'Preposition', description: 'She is good _____ mathematics.', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['in', 'at', 'on', 'for'], correct_answer: 'at', explanation: '"Good at" is the correct phrase.' },
    { title: 'Article Usage', description: 'He is _____ honest man.', difficulty: 'Easy', cat: 'verbal', answer_type: 'mcq', options: ['a', 'an', 'the', 'no article'], correct_answer: 'an', explanation: '"Honest" starts with vowel sound, so "an".' },
    // VERBAL — MEDIUM
    { title: 'Sentence Correction', description: 'Which is correct?\nA) Each of the students have completed their assignment.\nB) Each of the students has completed his or her assignment.', difficulty: 'Medium', cat: 'verbal', answer_type: 'mcq', options: ['A', 'B', 'C', 'D'], correct_answer: 'B', explanation: '"Each" is singular → "has".' },
    { title: 'Para Jumble', description: 'Arrange: P. He went for a walk. Q. Beautiful morning. R. Birds singing. S. Felt refreshed after.', difficulty: 'Medium', cat: 'verbal', answer_type: 'mcq', options: ['QRPS', 'PQRS', 'RPQS', 'QPRS'], correct_answer: 'QRPS', explanation: 'Setting(Q)→Detail(R)→Action(P)→Result(S)' },
    { title: 'Reading Comprehension', description: '"Democracy is not just about voting. It ensures equal rights, freedom, and access to justice." Central theme?', difficulty: 'Medium', cat: 'verbal', answer_type: 'mcq', options: ['Voting is the essence', 'Democracy is about equal rights and participation', 'Only elected leaders', 'Democracy is failing'], correct_answer: 'Democracy is about equal rights and participation', explanation: 'The passage emphasizes equal rights and participation.' },
    { title: 'Error Spotting', description: '"Neither the teacher (A) nor the students (B) was (C) present (D)." Error?', difficulty: 'Medium', cat: 'verbal', answer_type: 'mcq', options: ['A', 'B', 'C', 'D'], correct_answer: 'C', explanation: 'Nearer subject "students" is plural → "were".' },
    { title: 'Cloze Test', description: 'The economy has been _____ slowly since the pandemic.', difficulty: 'Medium', cat: 'verbal', answer_type: 'mcq', options: ['recovering', 'declining', 'stopping', 'booming'], correct_answer: 'recovering', explanation: '"Recovering slowly" fits post-pandemic context.' },
    { title: 'Synonym Advanced', description: 'Synonym of "UBIQUITOUS":', difficulty: 'Medium', cat: 'verbal', answer_type: 'mcq', options: ['Rare', 'Omnipresent', 'Unique', 'Ancient'], correct_answer: 'Omnipresent', explanation: 'Ubiquitous = present everywhere = Omnipresent.' },
    { title: 'Sentence Improvement', description: '"He is one of the best player in the team." Fix?', difficulty: 'Medium', cat: 'verbal', answer_type: 'mcq', options: ['one of the best players', 'one of the better player', 'the best of player', 'No improvement'], correct_answer: 'one of the best players', explanation: '"One of" takes plural → "players".' },
    { title: 'Theme Detection', description: '"While technology brings convenience, excessive dependence weakens critical thinking." Theme?', difficulty: 'Medium', cat: 'verbal', answer_type: 'mcq', options: ['Technology is harmful', 'Balanced use is important', 'Social skills are obsolete', 'Critical thinking unnecessary'], correct_answer: 'Balanced use is important', explanation: 'Argues for balance in technology use.' },
    // VERBAL — HARD
    { title: 'Reading Comprehension Critical', description: '"The paradox of tolerance: if a society is tolerant without limit, its ability to be tolerant will be destroyed by the intolerant." Main argument?', difficulty: 'Hard', cat: 'verbal', answer_type: 'mcq', options: ['Tolerate everything', 'Tolerance must have limits', 'Intolerance is always wrong', 'Karl Popper was intolerant'], correct_answer: 'Tolerance must have limits', explanation: 'Unlimited tolerance self-destructs.' },
    { title: 'Critical Reasoning', description: '"Students who eat breakfast score higher." What weakens this?', difficulty: 'Hard', cat: 'verbal', answer_type: 'mcq', options: ['They sleep better', 'Correlation ≠ causation', 'Breakfast has nutrients', 'Successful people eat breakfast'], correct_answer: 'Correlation ≠ causation', explanation: 'Identifies correlation-causation fallacy.' },
    { title: 'Verbal Analogy Complex', description: 'MARATHON : SPRINT :: NOVEL : ?', difficulty: 'Hard', cat: 'verbal', answer_type: 'mcq', options: ['Story', 'Short story', 'Poem', 'Essay'], correct_answer: 'Short story', explanation: 'Long:Short → Novel:Short story.' },
    { title: 'Inference Based', description: '"Despite growth claims, unemployment rose 3% and household debt increased." Inference?', difficulty: 'Hard', cat: 'verbal', answer_type: 'mcq', options: ['Economy is genuinely growing', 'Growth has not benefited all equally', 'Government is lying', 'Unemployment is natural'], correct_answer: 'Growth has not benefited all equally', explanation: 'Unequal distribution of benefits.' },
    { title: 'Assumption Identification', description: '"The new highway will reduce travel time from 6 to 3 hours." Underlying assumption?', difficulty: 'Hard', cat: 'verbal', answer_type: 'mcq', options: ['People want to travel faster', 'Highway will not face congestion', 'City B is important', 'All roads need improvement'], correct_answer: 'Highway will not face congestion', explanation: 'Assumes no traffic congestion.' },
];

async function migrate() {
    console.log('📦 Starting migration to Supabase...\n');

    // Get categories
    const { data: cats, error: catErr } = await supabase.from('categories').select('*');
    if (catErr || !cats) {
        console.error('❌ Failed to fetch categories. Run supabase_schema.sql first!');
        console.error(catErr);
        process.exit(1);
    }

    const catMap = {};
    for (const c of cats) catMap[c.slug] = c.id;
    console.log(`Found ${cats.length} categories:`, Object.keys(catMap));

    // Insert problems in batches
    const batch = [];
    for (const p of problems) {
        const catId = catMap[p.cat];
        if (!catId) { console.warn(`⚠️ Unknown category: ${p.cat}`); continue; }
        batch.push({
            title: p.title,
            description: p.description,
            difficulty: p.difficulty,
            category_id: catId,
            answer_type: p.answer_type,
            options: p.options,
            correct_answer: p.correct_answer,
            explanation: p.explanation || null,
            constraints_info: null,
            examples: [],
            acceptance_rate: Math.floor(Math.random() * 40 + 40),
        });
    }

    // Insert in batches of 50
    for (let i = 0; i < batch.length; i += 50) {
        const slice = batch.slice(i, i + 50);
        const { error } = await supabase.from('problems').insert(slice);
        if (error) {
            console.error(`❌ Batch ${i / 50 + 1} failed:`, error.message);
        } else {
            console.log(`✅ Batch ${i / 50 + 1}: inserted ${slice.length} problems`);
        }
    }

    // Verify
    const { count } = await supabase.from('problems').select('id', { count: 'exact', head: true });
    console.log(`\n🎉 Migration complete! Total problems in Supabase: ${count}`);
}

migrate().catch(console.error);
