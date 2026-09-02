-- Тема 3.2: спуск от НОД и НОК упирался в пустоту. Запускать после 08.

-- 3.2, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (302, 1, 'choice', 'Сколько простых чисел среди 21, 23, 25, 27, 29?', '21, 23, 25, 27, 29 сандарының нешеуі жай сан?', 2.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '1', false, 'не заметил одно из простых'),
    ((select id from t), 2, '2', true, null),
    ((select id from t), 3, '3', false, 'принял 27 за простое'),
    ((select id from t), 4, '5', false, 'счёл простыми все нечётные');

-- 3.2, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (302, 2, 'choice', 'Разложи число 84 на простые множители. Сколько множителей получится, если считать и повторяющиеся?', '84 санын жай көбейткіштерге жікте. Қайталанатындарын да санағанда, неше көбейткіш шығады?', 4.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '12', false, 'посчитал все делители числа'),
    ((select id from t), 2, '6', false, 'включил составные делители'),
    ((select id from t), 3, '3', false, 'посчитал только различные множители'),
    ((select id from t), 4, '4', true, null);

-- 3.2, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (302, 3, 'number', 'Найди наименьшее натуральное число, у которого ровно шесть различных делителей.', 'Дәл алты түрлі бөлгіші бар ең кіші натурал санды тап.', 12.0, 150) returning id
)
select id from t;

select count(*) as всего_задач, count(distinct topic_ord) as тем from tasks;
