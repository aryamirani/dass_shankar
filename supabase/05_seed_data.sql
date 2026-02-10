-- =====================================================
-- 05: Seed Data - Initial Curriculum Setup
-- =====================================================
-- Run this file FIFTH in Supabase SQL Editor
-- This populates the database with Grade 1, Grade 2, Book A, and all existing modules/exercises

-- =====================================================
-- Insert Grades
-- =====================================================
INSERT INTO grades (id, name, display_name, description, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'grade_1', 'Grade 1', 'Primary grade level', 1),
('22222222-2222-2222-2222-222222222222', 'grade_2', 'Grade 2', 'Advanced grade level', 2);

-- =====================================================
-- Insert Books (Only Book A is active initially)
-- =====================================================
-- Grade 1 Books
INSERT INTO books (id, grade_id, code, name, description, is_active, sort_order) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'A', 'Book A', 'First book of Grade 1 curriculum', TRUE, 1),
('e0e0e0e0-e0e0-e0e0-e0e0-e0e0e0e0e0e0', '11111111-1111-1111-1111-111111111111', 'E', 'Book E', 'Second book of Grade 1 curriculum', FALSE, 2),
('10101010-1010-1010-1010-101010101010', '11111111-1111-1111-1111-111111111111', 'I', 'Book I', 'Third book of Grade 1 curriculum', FALSE, 3),
('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'O', 'Book O', 'Fourth book of Grade 1 curriculum', FALSE, 4),
('00000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'U', 'Book U', 'Fifth book of Grade 1 curriculum', FALSE, 5);

-- Grade 2 Books
INSERT INTO books (id, grade_id, code, name, description, is_active, sort_order) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'A', 'Book A', 'First book of Grade 2 curriculum', TRUE, 1),
('f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0', '22222222-2222-2222-2222-222222222222', 'E', 'Book E', 'Second book of Grade 2 curriculum', FALSE, 2),
('20202020-2020-2020-2020-202020202020', '22222222-2222-2222-2222-222222222222', 'I', 'Book I', 'Third book of Grade 2 curriculum', FALSE, 3),
('00000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'O', 'Book O', 'Fourth book of Grade 2 curriculum', FALSE, 4),
('00000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'U', 'Book U', 'Fifth book of Grade 2 curriculum', FALSE, 5);

-- =====================================================
-- Insert Modules for Grade 1 - Book A
-- =====================================================
INSERT INTO modules (id, book_id, name, slug, description, icon, color, sort_order) VALUES
-- English Module
('10000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'English Module', 'vocabulary', 'Vocabulary and reading exercises', '📚', '#f6d365', 1),
-- Maths Module
('10000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Maths Module', 'maths', 'Number operations and problem solving', '📐', '#667eea', 2),
-- Computer Module
('10000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Computer Module', 'computer', 'Basic computer skills and typing', '💻', '#0f172a', 3),
-- EVS Module
('10000000-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EVS Module', 'evs', 'Environmental studies and awareness', '🌿', '#ff512f', 4),
-- Arts Module
('10000000-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Arts Module', 'arts', 'Creative arts and crafts activities', '🎨', '#e91e63', 5);

-- =====================================================
-- Insert Modules for Grade 2 - Book A
-- =====================================================
INSERT INTO modules (id, book_id, name, slug, description, icon, color, sort_order) VALUES
-- Health Module
('20000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Health Module', 'health', 'Common health problems and wellness', '❤️', '#ff9a9e', 1),
-- English Module
('20000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'English Module', 'english', 'Advanced English language skills', '📖', '#f6d365', 2),
-- Science Module
('20000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Science Module', 'science', 'Human anatomy and scientific concepts', '🔬', '#ff512f', 3);

-- =====================================================
-- Insert Exercises for Grade 1 - English Module
-- =====================================================
INSERT INTO exercises (module_id, name, slug, description, type, sort_order) VALUES
('10000000-0000-0000-0000-000000000001', 'Matching Game (at)', 'vocabularyExercise', 'Match words with "at" sound', 'game', 1),
('10000000-0000-0000-0000-000000000001', 'Matching Game (an)', 'vocabularyExerciseAn', 'Match words with "an" sound', 'game', 2),
('10000000-0000-0000-0000-000000000001', 'Matching Game (ap)', 'vocabularyExerciseAp', 'Match words with "ap" sound', 'game', 3),
('10000000-0000-0000-0000-000000000001', 'Matching Game (ag)', 'vocabularyExerciseAg', 'Match words with "ag" sound', 'game', 4),
('10000000-0000-0000-0000-000000000001', 'Matching Game (am)', 'vocabularyExerciseAM', 'Match words with "am" sound', 'game', 5),
('10000000-0000-0000-0000-000000000001', 'Matching Game (ad)', 'vocabularyExerciseAd', 'Match words with "ad" sound', 'game', 6),
('10000000-0000-0000-0000-000000000001', 'Interactive Learn (at)', 'vocabularyThree', 'Interactive learning for "at" words', 'interactive', 7),
('10000000-0000-0000-0000-000000000001', 'Interactive Learn (an)', 'vocabularyThreeAn', 'Interactive learning for "an" words', 'interactive', 8),
('10000000-0000-0000-0000-000000000001', 'Interactive Learn (ap)', 'vocabularyThreeAp', 'Interactive learning for "ap" words', 'interactive', 9),
('10000000-0000-0000-0000-000000000001', 'Interactive Learn (ag)', 'vocabularyThreeAg', 'Interactive learning for "ag" words', 'interactive', 10),
('10000000-0000-0000-0000-000000000001', 'Interactive Learn (am)', 'vocabularyThreeAM', 'Interactive learning for "am" words', 'interactive', 11),
('10000000-0000-0000-0000-000000000001', 'Interactive Learn (ad)', 'vocabularyThreeAd', 'Interactive learning for "ad" words', 'interactive', 12),
('10000000-0000-0000-0000-000000000001', 'Read Words 1', 'englishReadWords', 'Practice reading words', 'interactive', 13),
('10000000-0000-0000-0000-000000000001', 'Read Words 2', 'englishReadWords2', 'Advanced word reading', 'interactive', 14);

-- =====================================================
-- Insert Exercises for Grade 1 - Maths Module
-- =====================================================
INSERT INTO exercises (module_id, name, slug, description, type, sort_order) VALUES
('10000000-0000-0000-0000-000000000002', 'Counting', 'mathsExerciseOne', 'Learn to count objects', 'interactive', 1),
('10000000-0000-0000-0000-000000000002', 'Write the Digits', 'mathsExerciseTwo', 'Practice writing numbers', 'interactive', 2),
('10000000-0000-0000-0000-000000000002', 'Fill Missing Number', 'mathsExerciseThree', 'Complete number sequences', 'interactive', 3),
('10000000-0000-0000-0000-000000000002', 'Before and After', 'mathsExerciseFour', 'Identify numbers before and after', 'interactive', 4),
('10000000-0000-0000-0000-000000000002', 'In Between', 'mathsExerciseFive', 'Find numbers in between', 'interactive', 5),
('10000000-0000-0000-0000-000000000002', 'Ordering', 'mathsExerciseSix', 'Arrange numbers in order', 'interactive', 6),
('10000000-0000-0000-0000-000000000002', 'Place Values', 'mathsExerciseSeven', 'Understand place value concepts', 'interactive', 7),
('10000000-0000-0000-0000-000000000002', 'Calculator', 'mathsExerciseEight', 'Basic calculator operations', 'interactive', 8),
('10000000-0000-0000-0000-000000000002', 'Word Problems', 'mathsExerciseNine', 'Solve mathematical word problems', 'interactive', 9);

-- =====================================================
-- Insert Exercises for Grade 1 - Computer Module
-- =====================================================
INSERT INTO exercises (module_id, name, slug, description, type, sort_order) VALUES
('10000000-0000-0000-0000-000000000003', 'Typing Practice', 'computerKeyboard', 'Learn keyboard typing skills', 'interactive', 1);

-- =====================================================
-- Insert Exercises for Grade 1 - EVS Module
-- =====================================================
INSERT INTO exercises (module_id, name, slug, description, type, sort_order) VALUES
('10000000-0000-0000-0000-000000000004', 'Identify Objects', 'evsIdentify', 'Recognize common objects', 'interactive', 1),
('10000000-0000-0000-0000-000000000004', 'Identify Gender', 'evsGender', 'Learn about gender identification', 'interactive', 2),
('10000000-0000-0000-0000-000000000004', 'Read Labels', 'evsJams', 'Practice reading product labels', 'interactive', 3),
('10000000-0000-0000-0000-000000000004', 'Types of Bags', 'evsBags', 'Learn about different bag types', 'interactive', 4),
('10000000-0000-0000-0000-000000000004', 'Map Reading', 'evsMap', 'Basic map reading skills', 'interactive', 5);

-- =====================================================
-- Insert Exercises for Grade 2 - Health Module
-- =====================================================
INSERT INTO exercises (module_id, name, slug, description, type, sort_order) VALUES
('20000000-0000-0000-0000-000000000001', 'Common Health Problems', 'healthProblems', 'Learn about common health issues', 'interactive', 1),
('20000000-0000-0000-0000-000000000001', 'Health Quiz', 'assessment', 'Test your health knowledge', 'quiz', 2);

-- =====================================================
-- Insert Exercises for Grade 2 - English Module
-- =====================================================
INSERT INTO exercises (module_id, name, slug, description, type, sort_order) VALUES
('20000000-0000-0000-0000-000000000002', 'Word Surgery', 'englishWordGame', 'Break down and analyze words', 'game', 1),
('20000000-0000-0000-0000-000000000002', 'Word Match', 'englishPhonics', 'Match words with phonics', 'game', 2),
('20000000-0000-0000-0000-000000000002', 'Fill Blanks', 'englishFillBlanks', 'Complete sentences with correct words', 'interactive', 3);

-- =====================================================
-- Insert Exercises for Grade 2 - Science Module
-- =====================================================
INSERT INTO exercises (module_id, name, slug, description, type, sort_order) VALUES
('20000000-0000-0000-0000-000000000003', 'Identify Organs', 'scienceHuman', 'Learn about human body organs', 'interactive', 1);

-- =====================================================
-- Verification Query
-- =====================================================
-- Run this to verify everything was inserted correctly
SELECT 
    g.display_name AS grade,
    b.name AS book,
    m.name AS module,
    COUNT(e.id) AS exercise_count
FROM grades g
JOIN books b ON g.id = b.grade_id
JOIN modules m ON b.id = m.book_id
LEFT JOIN exercises e ON m.id = e.module_id
GROUP BY g.display_name, g.sort_order, b.name, b.sort_order, m.name, m.sort_order
ORDER BY g.sort_order, b.sort_order, m.sort_order;
