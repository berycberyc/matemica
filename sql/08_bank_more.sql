-- ============================================================
--  matemica — добавка к банку: ещё 8 тем на трёх уровнях.
--  Запускать ПОСЛЕ 07_bank.sql. Ничего не удаляет, только добавляет.
-- ============================================================

-- тема 202, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (202, 1, 'choice', 'В корзине 60 яблок. Взяли четверть, потом треть остатка. Сколько яблок взяли во второй раз?', 'Себетте 60 алма бар. Төрттен бірін алды, содан кейін қалғанының үштен бірін алды. Екінші рет неше алма алды?', 15.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '45', false, 'назвал остаток вместо взятого'),
    ((select id from t), 2, '15', true, null),
    ((select id from t), 3, '30', false, 'разделил остаток пополам'),
    ((select id from t), 4, '20', false, 'взял треть от всех 60, а не от остатка');

-- тема 202, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (202, 2, 'choice', 'В книге 120 страниц. В первый день прочитали треть, во второй — четверть остатка. Сколько страниц осталось?', 'Кітапта 120 бет бар. Бірінші күні үштен бірін, екінші күні қалғанының төрттен бірін оқыды. Неше бет қалды?', 60.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '90', false, 'вычел четверть от всей книги'),
    ((select id from t), 2, '80', false, 'остановился после первого дня'),
    ((select id from t), 3, '20', false, 'назвал прочитанное во второй день'),
    ((select id from t), 4, '60', true, null);

-- тема 202, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (202, 3, 'number', 'Турист прошёл пятую часть пути, потом четверть остатка, потом ещё 30 километров — и оказалось, что он прошёл ровно половину пути. Найди длину всего пути в километрах.', 'Турист жолдың бестен бірін, содан кейін қалғанының төрттен бірін, содан соң тағы 30 километр жүрді — сөйтіп жолдың дәл жартысын жүріп өтті. Бүкіл жолдың ұзындығын километрмен тап.', 300.0, 150) returning id
)
select id from t;

-- тема 204, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (204, 1, 'choice', 'Цена 200 тенге выросла на 10%, а потом новая цена выросла ещё на 10%. Сколько тенге стал стоить товар?', 'Бағасы 200 теңге тауар 10%-ға қымбаттады, содан кейін жаңа баға тағы 10%-ға қымбаттады. Тауар қанша теңге болды?', 242.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '242', true, null),
    ((select id from t), 2, '240', false, 'сложил проценты и прибавил 20% сразу'),
    ((select id from t), 3, '220', false, 'поднял цену только один раз'),
    ((select id from t), 4, '400', false, 'удвоил цену');

-- тема 204, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (204, 2, 'choice', 'Число уменьшили на 20%, а потом полученное увеличили на 25%. Что стало с исходным числом? Ответ: 1 — не изменилось, 2 — стало больше, 3 — стало меньше, 4 — определить нельзя.', 'Санды 20%-ға кемітті, содан кейін шыққан нәтижені 25%-ға арттырды. Бастапқы санмен не болды? Жауап: 1 — өзгерген жоқ, 2 — үлкейді, 3 — кішірейді, 4 — анықтау мүмкін емес.', 1.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '4', false, 'решил, что без самого числа ответить нельзя'),
    ((select id from t), 2, '1', true, null),
    ((select id from t), 3, '2', false, 'сложил проценты и решил, что прибавка больше'),
    ((select id from t), 4, '3', false, 'решил, что первое уменьшение перевесит');

-- тема 204, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (204, 3, 'number', 'На вклад 5000 тенге каждый год начисляется 20% от текущей суммы. Сколько тенге будет на вкладе через два года?', '5000 теңге салымға жыл сайын ағымдағы сомадан 20% қосылады. Екі жылдан кейін салымда қанша теңге болады?', 7200.0, 150) returning id
)
select id from t;

-- тема 304, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (304, 1, 'choice', 'Какой остаток получится при делении 100 на 7?', '100 санын 7-ге бөлгенде қандай қалдық шығады?', 2.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '1', false, 'взял остаток от деления на другое число'),
    ((select id from t), 2, '14', false, 'назвал частное вместо остатка'),
    ((select id from t), 3, '2', true, null),
    ((select id from t), 4, '3', false, 'ошибся на единицу в подборе');

-- тема 304, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (304, 2, 'choice', 'Число при делении на 6 даёт остаток 4. Какой остаток даст это число при делении на 3?', 'Бір сан 6-ға бөлгенде қалдық 4 береді. Осы сан 3-ке бөлгенде қандай қалдық береді?', 1.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '1', true, null),
    ((select id from t), 2, '2', false, 'разделил остаток пополам'),
    ((select id from t), 3, '4', false, 'оставил прежний остаток'),
    ((select id from t), 4, '0', false, 'решил, что делится нацело');

-- тема 304, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (304, 3, 'number', 'Сегодня среда. Какой день недели будет через 100 дней? Ответ: 1 — понедельник, 2 — вторник, 3 — среда, 4 — четверг, 5 — пятница, 6 — суббота, 7 — воскресенье.', 'Бүгін — сәрсенбі. 100 күннен кейін аптаның қай күні болады? Жауап: 1 — дүйсенбі, 2 — сейсенбі, 3 — сәрсенбі, 4 — бейсенбі, 5 — жұма, 6 — сенбі, 7 — жексенбі.', 5.0, 150) returning id
)
select id from t;

-- тема 403, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (403, 1, 'choice', 'Реши уравнение |x| = 7. В ответе запиши больший корень.', '|x| = 7 теңдеуін шеш. Жауапқа үлкен түбірін жаз.', 7.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '0', false, 'решил, что модуль всегда даёт ноль'),
    ((select id from t), 2, '14', false, 'удвоил число'),
    ((select id from t), 3, '7', true, null),
    ((select id from t), 4, '49', false, 'возвёл в квадрат');

-- тема 403, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (403, 2, 'choice', 'Реши уравнение |x − 3| = 5. В ответе запиши больший корень.', '|x − 3| = 5 теңдеуін шеш. Жауапқа үлкен түбірін жаз.', 8.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '15', false, 'умножил вместо сложения'),
    ((select id from t), 2, '5', false, 'оставил правую часть без изменений'),
    ((select id from t), 3, '8', true, null),
    ((select id from t), 4, '2', false, 'вычел 3 из 5 вместо того, чтобы прибавить');

-- тема 403, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (403, 3, 'number', 'Сколько целых чисел удовлетворяют неравенству |x − 4| < 3?', '|x − 4| < 3 теңсіздігін қанша бүтін сан қанағаттандырады?', 5.0, 150) returning id
)
select id from t;

-- тема 404, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (404, 1, 'choice', 'Найди наименьшее целое число x, при котором 3x > 11.', '3x > 11 болатын ең кіші бүтін x санын тап.', 4.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '3', false, 'взял число, при котором неравенство ещё не выполняется'),
    ((select id from t), 2, '4', true, null),
    ((select id from t), 3, '33', false, 'умножил 11 на 3'),
    ((select id from t), 4, '5', false, 'перескочил через подходящее число');

-- тема 404, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (404, 2, 'choice', 'Сколько целых чисел x удовлетворяют условию 2 < x ≤ 7?', '2 < x ≤ 7 шартын қанша бүтін x саны қанағаттандырады?', 5.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '5', true, null),
    ((select id from t), 2, '6', false, 'включил двойку, хотя знак строгий'),
    ((select id from t), 3, '4', false, 'не включил семёрку, хотя знак нестрогий'),
    ((select id from t), 4, '9', false, 'сложил границы');

-- тема 404, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (404, 3, 'number', 'Найди наибольшее целое число x, при котором 5 − 2x > −3.', '5 − 2x > −3 болатын ең үлкен бүтін x санын тап.', 3.0, 150) returning id
)
select id from t;

-- тема 501, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (501, 1, 'choice', 'В клетке куры и кролики. Всего 10 голов и 28 ног. Сколько кроликов?', 'Торда тауықтар мен қояндар бар. Барлығы 10 бас және 28 аяқ. Неше қоян бар?', 4.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '7', false, 'разделил ноги на четыре'),
    ((select id from t), 2, '6', false, 'назвал число кур вместо кроликов'),
    ((select id from t), 3, '4', true, null),
    ((select id from t), 4, '5', false, 'разделил головы пополам');

-- тема 501, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (501, 2, 'choice', 'В клетке куры и кролики. Всего 20 голов и 56 ног. Сколько кур?', 'Торда тауықтар мен қояндар бар. Барлығы 20 бас және 56 аяқ. Неше тауық бар?', 12.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '12', true, null),
    ((select id from t), 2, '10', false, 'разделил головы пополам'),
    ((select id from t), 3, '14', false, 'разделил ноги на четыре'),
    ((select id from t), 4, '8', false, 'назвал число кроликов вместо кур');

-- тема 501, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (501, 3, 'number', 'В коробке пауки и жуки. У паука 8 ног, у жука 6 ног. Всего 12 существ и 86 ног. Сколько пауков?', 'Қорапта өрмекшілер мен қоңыздар бар. Өрмекшінің 8 аяғы, қоңыздың 6 аяғы бар. Барлығы 12 жәндік және 86 аяқ. Неше өрмекші бар?', 7.0, 150) returning id
)
select id from t;

-- тема 504, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (504, 1, 'choice', 'Расстояние между городами 300 километров. Навстречу друг другу выехали две машины со скоростями 60 и 40 километров в час. Через сколько часов они встретятся?', 'Қалалар арасы 300 километр. Бір-біріне қарсы сағатына 60 және 40 километр жылдамдықпен екі көлік шықты. Неше сағаттан кейін кездеседі?', 3.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '5', false, 'разделил расстояние на одну из скоростей'),
    ((select id from t), 2, '6', false, 'разделил на разность скоростей'),
    ((select id from t), 3, '3', true, null),
    ((select id from t), 4, '2', false, 'ошибся в сумме скоростей');

-- тема 504, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (504, 2, 'choice', 'Пешеход вышел со скоростью 5 километров в час. Через два часа за ним следом выехал велосипедист со скоростью 15 километров в час. Через сколько часов после своего выезда велосипедист догонит пешехода?', 'Жаяу адам сағатына 5 километр жылдамдықпен шықты. Екі сағаттан кейін оның соңынан сағатына 15 километр жылдамдықпен велосипедші шықты. Велосипедші шыққаннан кейін неше сағаттан соң жаяу адамды қуып жетеді?', 1.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '2', false, 'взял время, на которое пешеход вышел раньше'),
    ((select id from t), 2, '3', false, 'разделил расстояние на скорость пешехода'),
    ((select id from t), 3, '5', false, 'сложил скорости вместо вычитания'),
    ((select id from t), 4, '1', true, null);

-- тема 504, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (504, 3, 'number', 'Расстояние между городами 290 километров. Из первого города выехала машина со скоростью 50 километров в час. Через час навстречу ей из второго города выехала другая машина со скоростью 70 километров в час. Через сколько часов после своего выезда вторая машина встретит первую?', 'Қалалар арасы 290 километр. Бірінші қаладан сағатына 50 километр жылдамдықпен көлік шықты. Бір сағаттан кейін оған қарсы екінші қаладан сағатына 70 километр жылдамдықпен басқа көлік шықты. Екінші көлік шыққаннан кейін неше сағаттан соң кездеседі?', 2.0, 150) returning id
)
select id from t;

-- тема 803, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (803, 1, 'choice', 'Найди сумму всех натуральных чисел от 1 до 10.', '1-ден 10-ға дейінгі барлық натурал сандардың қосындысын тап.', 55.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '100', false, 'умножил 10 на 10'),
    ((select id from t), 2, '55', true, null),
    ((select id from t), 3, '45', false, 'сложил числа от 1 до 9'),
    ((select id from t), 4, '50', false, 'округлил до круглого числа');

-- тема 803, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (803, 2, 'choice', 'Найди сумму всех нечётных чисел от 1 до 19.', '1-ден 19-ға дейінгі барлық тақ сандардың қосындысын тап.', 100.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '190', false, 'сложил все числа подряд, а не только нечётные'),
    ((select id from t), 2, '81', false, 'взял квадрат числа 9'),
    ((select id from t), 3, '100', true, null),
    ((select id from t), 4, '90', false, 'потерял одно слагаемое');

-- тема 803, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (803, 3, 'number', 'Из суммы всех чисел от 1 до 100 вычли сумму всех чисел от 1 до 50. Какое число получилось?', '1-ден 100-ге дейінгі сандардың қосындысынан 1-ден 50-ге дейінгі сандардың қосындысын алып тастады. Қандай сан шықты?', 3775.0, 150) returning id
)
select id from t;

select (select count(*) from tasks) as всего_задач,
       (select count(distinct topic_ord) from tasks) as тем;
