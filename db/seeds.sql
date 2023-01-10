USE employees_db;
INSERT INTO departments (name) 
VALUES 
('Merryment'),
('Musical Enjoyment'),
('Gifts Central'),
('Feasts');
INSERT INTO roles (title, salary, department_id) 
VALUES 
('Head Decorator', 85000, 1),
('Parade Leader', 67000, 1),
('YuleTider', 65000, 1),
('Band Leader', 80000, 2),
('Carol Writer', 55000, 2),
('Tuba Player', 48000, 2),
('Head wrapper', 71000, 3),
('Finger Holder(for bow)', 45000, 3),
('Naughty List Manager', 48000, 3),
('Head chef', 78000, 4),
('Toast Master General', 70000, 4),
('Roast Beast Carver', 57000, 4);
INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES 
('CindyLou', 'Who', 1, null),
('Joaquin', 'Tall', 2, 1),
('Yule', 'Tide', 3, 1),
('Toots', 'Maytal', 4, null),
('Carol', 'King', 5, 4),
('Fat', 'Who', 6, 4),
('MC', 'Who-Who', 7, null),
('YoYo-Ma', 'Who', 8, 7),
('Mayor', 'Meer', 9, 7),
('Tony', 'Bourdain', 10, null),
('Barack', 'Whobama', 11, 10),
('Martha', 'Stewhort', 12, 10);