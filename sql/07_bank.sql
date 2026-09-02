-- ============================================================
--  matemica — банк первого захода: 16 несущих тем на трёх уровнях.
--  Уровни 1–2 с вариантами, уровень 3 со свободным вводом.
--  Ответы посчитаны машиной, логические задачи — полным перебором.
--  Запускать после 01, 02 и 06.
-- ============================================================

delete from options where task_id in (select id from tasks where source = 'manual');
delete from tasks where source = 'manual';

-- тема 101, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (101, 1, 'choice', 'Вычисли 5/6 − 3/8.', '5/6 − 3/8 есепте.', 0.4583333333333333, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '1/3', false, 'не привёл к общему знаменателю'),
    ((select id from t), 2, '11/24', true, null),
    ((select id from t), 3, '1', false, 'вычел числители и знаменатели по отдельности'),
    ((select id from t), 4, '1/12', false, 'привёл знаменатели, а числители оставил прежними');

-- тема 101, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (101, 2, 'choice', 'Вычисли 2/3 · 9/10 + 1/5.', '2/3 · 9/10 + 1/5 есепте.', 0.8, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '4/5', true, null),
    ((select id from t), 2, '11/15', false, 'сложил раньше умножения'),
    ((select id from t), 3, '2/5', false, 'умножил только числители, знаменатели сложил'),
    ((select id from t), 4, '3/5', false, 'перемножил верно, но забыл прибавить 1/5');

-- тема 101, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (101, 3, 'number', 'Сколько существует несократимых дробей вида n/24, где n — целое и 0 < n < 24?', 'n/24 түріндегі қысқармайтын бөлшектер нешеу? Мұндағы n — бүтін сан және 0 < n < 24.', 8.0, 150) returning id
)
select id from t;

-- тема 102, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (102, 1, 'choice', 'Вычисли 2,4 · 0,25.', '2,4 · 0,25 есепте.', 0.6, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '0,6', true, null),
    ((select id from t), 2, '0,06', false, 'сдвинул запятую на разряд влево'),
    ((select id from t), 3, '0,96', false, 'разделил вместо умножения'),
    ((select id from t), 4, '6', false, 'потерял запятую на разряд');

-- тема 102, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (102, 2, 'choice', 'Вычисли 0,2 · 0,3 + 0,94.', '0,2 · 0,3 + 0,94 есепте.', 1.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '6,94', false, 'умножил как целые числа и не поставил запятую'),
    ((select id from t), 2, '1', true, null),
    ((select id from t), 3, '0,96', false, 'умножил 0,2 на 0,1'),
    ((select id from t), 4, '1,54', false, 'получил 0,6 вместо 0,06');

-- тема 102, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (102, 3, 'number', 'Запиши 0,375 несократимой дробью и в ответе укажи сумму числителя и знаменателя.', '0,375 санын қысқармайтын бөлшек түрінде жаз және жауапқа алымы мен бөлімінің қосындысын жаз.', 11.0, 150) returning id
)
select id from t;

-- тема 103, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (103, 1, 'choice', 'Вычисли: (18 + 6 : 3) · 2', 'Есепте: (18 + 6 : 3) · 2', 40.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '20', false, 'посчитал скобку верно, но забыл умножить'),
    ((select id from t), 2, '40', true, null),
    ((select id from t), 3, '22', false, 'не заметил скобки'),
    ((select id from t), 4, '16', false, 'сложил 18 и 6 раньше деления');

-- тема 103, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (103, 2, 'choice', 'Вычисли: 40 − 3 · (8 − 2 · 3) + 5', 'Есепте: 40 − 3 · (8 − 2 · 3) + 5', 39.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '29', false, 'вычел 5 вместо того, чтобы прибавить'),
    ((select id from t), 2, '79', false, 'считал слева направо'),
    ((select id from t), 3, '39', true, null),
    ((select id from t), 4, '51', false, 'прибавил произведение вместо вычитания');

-- тема 103, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (103, 3, 'number', 'Вычисли: 2 + 2 · (3 + 3 · (4 + 4))', 'Есепте: 2 + 2 · (3 + 3 · (4 + 4))', 56.0, 150) returning id
)
select id from t;

-- тема 104, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (104, 1, 'choice', 'Вычисли: −7 + 12 − (−5)', 'Есепте: −7 + 12 − (−5)', 10.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '14', false, 'отбросил минус у семёрки'),
    ((select id from t), 2, '10', true, null),
    ((select id from t), 3, '0', false, 'не раскрыл двойной минус'),
    ((select id from t), 4, '24', false, 'отбросил все минусы');

-- тема 104, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (104, 2, 'choice', 'Найди значение выражения |−9| + |4 − 11|.', '|−9| + |4 − 11| өрнегінің мәнін тап.', 16.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '24', false, 'снял все модули и сложил'),
    ((select id from t), 2, '7', false, 'посчитал только вторую скобку'),
    ((select id from t), 3, '2', false, 'снял модуль со второй скобки'),
    ((select id from t), 4, '16', true, null);

-- тема 104, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (104, 3, 'number', 'Вычисли: (−2) · (−3) − (−4) · 5 + (−6)', 'Есепте: (−2) · (−3) − (−4) · 5 + (−6)', 20.0, 150) returning id
)
select id from t;

-- тема 105, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (105, 1, 'choice', 'Сколько квадратных сантиметров в 3 квадратных дециметрах?', '3 шаршы дециметрде неше шаршы сантиметр бар?', 300.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '3000', false, 'умножил на 1000, как для объёма'),
    ((select id from t), 2, '300', true, null),
    ((select id from t), 3, '900', false, 'возвёл 3 в квадрат и умножил на 100'),
    ((select id from t), 4, '30', false, 'перевёл как длину');

-- тема 105, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (105, 2, 'choice', 'Сколько минут составляют 3/4 часа и ещё 90 секунд? Ответ дай в минутах.', 'Сағаттың 3/4 бөлігі мен тағы 90 секунд неше минут құрайды? Жауапты минутпен жаз.', 46.5, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '45', false, 'забыл про 90 секунд'),
    ((select id from t), 2, '46,5', true, null),
    ((select id from t), 3, '48', false, 'принял 90 секунд за 3 минуты'),
    ((select id from t), 4, '135', false, 'перевёл 3/4 часа в секунды и сложил');

-- тема 105, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (105, 3, 'number', 'Скорость 72 километра в час. Сколько метров проходит за 5 секунд?', 'Жылдамдық — сағатына 72 километр. 5 секундта неше метр жүреді?', 100.0, 150) returning id
)
select id from t;

-- тема 201, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (201, 1, 'choice', '2/5 числа равны 18. Найди это число.', 'Санның 2/5 бөлігі 18-ге тең. Осы санды тап.', 45.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '9', false, 'нашёл одну часть и остановился'),
    ((select id from t), 2, '90', false, 'умножил на 5, но не разделил на 2'),
    ((select id from t), 3, '45', true, null),
    ((select id from t), 4, '36', false, 'умножил на 2 вместо деления');

-- тема 201, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (201, 2, 'choice', 'В книге 240 страниц. Аида прочитала 3/8 книги. Сколько страниц ей осталось?', 'Кітапта 240 бет бар. Аида кітаптың 3/8 бөлігін оқыды. Оған неше бет қалды?', 150.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '210', false, 'вычел одну восьмую вместо трёх'),
    ((select id from t), 2, '30', false, 'нашёл одну восьмую'),
    ((select id from t), 3, '150', true, null),
    ((select id from t), 4, '90', false, 'назвал прочитанное вместо оставшегося');

-- тема 201, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (201, 3, 'number', 'Аида потратила 2/5 своих денег, потом треть остатка. У неё осталось 240 тенге. Сколько денег было сначала?', 'Аида ақшасының 2/5 бөлігін жұмсады, содан кейін қалғанының үштен бірін жұмсады. Оның 240 теңгесі қалды. Бастапқыда қанша ақшасы болды?', 600.0, 150) returning id
)
select id from t;

-- тема 203, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (203, 1, 'choice', '20% некоторого числа равны 35. Найди это число.', 'Бір санның 20%-ы 35-ке тең. Осы санды тап.', 175.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '7', false, 'нашёл 20% от 35 вместо обратного хода'),
    ((select id from t), 2, '15', false, 'вычел 20 из 35'),
    ((select id from t), 3, '175', true, null),
    ((select id from t), 4, '700', false, 'умножил на 20 и не разделил на 100');

-- тема 203, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (203, 2, 'choice', 'Товар стоил 600 тенге, цену снизили на 15%. Сколько тенге он стал стоить?', 'Тауар 600 теңге тұрды, бағасы 15%-ға арзандады. Ол қанша теңге болды?', 510.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '690', false, 'повысил цену вместо снижения'),
    ((select id from t), 2, '510', true, null),
    ((select id from t), 3, '585', false, 'вычел 15 тенге вместо 15 процентов'),
    ((select id from t), 4, '90', false, 'нашёл только размер скидки');

-- тема 203, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (203, 3, 'number', 'Цену подняли на 20%, а потом новую цену снизили на 20%. Товар стал стоить 960 тенге. Сколько он стоил сначала?', 'Баға 20%-ға қымбаттады, содан кейін жаңа баға 20%-ға арзандады. Тауар 960 теңге болды. Бастапқыда қанша тұрды?', 1000.0, 150) returning id
)
select id from t;

-- тема 205, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (205, 1, 'choice', 'Число 84 разделили в отношении 3 : 4. Найди большую часть.', '84 санын 3 : 4 қатынасында бөлді. Үлкен бөлігін тап.', 48.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '48', true, null),
    ((select id from t), 2, '12', false, 'нашёл одну часть'),
    ((select id from t), 3, '63', false, 'принял отношение за дробь'),
    ((select id from t), 4, '36', false, 'назвал меньшую часть');

-- тема 205, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (205, 2, 'choice', 'Мальчиков и девочек в классе 5 : 7, а девочек на 8 больше. Сколько всего учеников?', 'Сыныптағы ұлдар мен қыздар саны 5 : 7, ал қыздар 8-ге көп. Барлығы неше оқушы бар?', 48.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '24', false, 'нашёл только девочек'),
    ((select id from t), 2, '96', false, 'удвоил результат'),
    ((select id from t), 3, '48', true, null),
    ((select id from t), 4, '20', false, 'разделил 8 на разность и остановился');

-- тема 205, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (205, 3, 'number', 'В сплаве медь и олово в отношении 3 : 5. Добавили 12 килограммов меди, и отношение стало 3 : 4. Сколько килограммов олова в сплаве?', 'Қорытпадағы мыс пен қалайы 3 : 5 қатынасында. 12 килограмм мыс қосқаннан кейін қатынас 3 : 4 болды. Қорытпада неше килограмм қалайы бар?', 80.0, 150) returning id
)
select id from t;

-- тема 301, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (301, 1, 'choice', 'Даны числа 214, 345, 451, 567, 678. Сколько из них делятся на 3?', '214, 345, 451, 567, 678 сандары берілген. Олардың нешеуі 3-ке бөлінеді?', 3.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '5', false, 'посчитал все подряд'),
    ((select id from t), 2, '3', true, null),
    ((select id from t), 3, '4', false, 'принял 451 за делящееся на 3'),
    ((select id from t), 4, '2', false, 'проверял последнюю цифру');

-- тема 301, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (301, 2, 'choice', 'Число 5⋆7 делится на 3. Какая наибольшая цифра может стоять вместо звёздочки?', '5⋆7 саны 3-ке бөлінеді. Жұлдызшаның орнында тұра алатын ең үлкен цифр қандай?', 9.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '9', true, null),
    ((select id from t), 2, '8', false, 'проверял делимость самого числа на 3 по последней цифре'),
    ((select id from t), 3, '3', false, 'взял наименьшую ненулевую вместо наибольшей'),
    ((select id from t), 4, '6', false, 'остановился на предыдущей подходящей цифре');

-- тема 301, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (301, 3, 'number', 'Сколько трёхзначных чисел делятся и на 4, и на 6?', 'Үш таңбалы сандардың нешеуі 4-ке де, 6-ға да бөлінеді?', 75.0, 150) returning id
)
select id from t;

-- тема 303, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (303, 1, 'choice', 'Найди наименьшее общее кратное чисел 12 и 18.', '12 мен 18 сандарының ең кіші ортақ еселігін тап.', 36.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '6', false, 'назвал наибольший общий делитель'),
    ((select id from t), 2, '36', true, null),
    ((select id from t), 3, '30', false, 'сложил числа'),
    ((select id from t), 4, '216', false, 'перемножил числа');

-- тема 303, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (303, 2, 'choice', 'Найди наибольший общий делитель чисел 48 и 60.', '48 бен 60 сандарының ең үлкен ортақ бөлгішін тап.', 12.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '108', false, 'сложил числа'),
    ((select id from t), 2, '240', false, 'назвал наименьшее общее кратное'),
    ((select id from t), 3, '12', true, null),
    ((select id from t), 4, '4', false, 'нашёл общий делитель, но не наибольший');

-- тема 303, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (303, 3, 'number', 'Найди наименьшее двузначное число, которое при делении на 5 и при делении на 7 даёт остаток 3.', '5-ке де, 7-ге де бөлгенде қалдығы 3 болатын ең кіші екі таңбалы санды тап.', 38.0, 150) returning id
)
select id from t;

-- тема 401, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (401, 1, 'choice', 'Найди значение выражения 3(x + 5) − 2(x − 1) при x = 6.', 'x = 6 болғанда 3(x + 5) − 2(x − 1) өрнегінің мәнін тап.', 23.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '10', false, 'умножил только на первое слагаемое в скобках'),
    ((select id from t), 2, '43', false, 'прибавил вторую скобку вместо вычитания'),
    ((select id from t), 3, '23', true, null),
    ((select id from t), 4, '19', false, 'раскрыл вторую скобку как −2x − 2');

-- тема 401, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (401, 2, 'choice', 'Упрости 4(2a − 3) − 3(a − 4) и найди значение при a = 5.', '4(2a − 3) − 3(a − 4) өрнегін ықшамда және a = 5 болғандағы мәнін тап.', 25.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '1', false, 'получил −12 вместо +12 при раскрытии'),
    ((select id from t), 2, '18', false, 'умножил только на первое слагаемое в скобках'),
    ((select id from t), 3, '25', true, null),
    ((select id from t), 4, '31', false, 'прибавил вторую скобку вместо вычитания');

-- тема 401, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (401, 3, 'number', 'При каком значении x выражение 5(x − 2) − 3(x + 4) равно нулю?', 'x-тің қандай мәнінде 5(x − 2) − 3(x + 4) өрнегі нөлге тең болады?', 11.0, 150) returning id
)
select id from t;

-- тема 402, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (402, 1, 'choice', 'Реши уравнение 4x − 7 = 2x + 9.', '4x − 7 = 2x + 9 теңдеуін шеш.', 8.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '4', false, 'разделил 16 на 4'),
    ((select id from t), 2, '16', false, 'нашёл 2x и не разделил'),
    ((select id from t), 3, '8', true, null),
    ((select id from t), 4, '1', false, 'при переносе не поменял знак');

-- тема 402, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (402, 2, 'choice', 'Реши уравнение (x + 5) : 3 = 4.', '(x + 5) : 3 = 4 теңдеуін шеш.', 7.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '17', false, 'прибавил 5 вместо вычитания'),
    ((select id from t), 2, '7', true, null),
    ((select id from t), 3, '12', false, 'умножил на 3, но забыл вычесть 5'),
    ((select id from t), 4, '1', false, 'вычел 3 вместо умножения');

-- тема 402, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (402, 3, 'number', 'Реши уравнение (2x − 1)/3 − (x − 4)/2 = 1.', '(2x − 1)/3 − (x − 4)/2 = 1 теңдеуін шеш.', -4.0, 150) returning id
)
select id from t;

-- тема 801, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (801, 1, 'choice', 'Последовательность: 3, 7, 15, 31, ... Какое число идёт следующим?', 'Тізбек: 3, 7, 15, 31, ... Келесі сан қандай?', 63.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '62', false, 'умножил на 2, но забыл прибавить 1'),
    ((select id from t), 2, '63', true, null),
    ((select id from t), 3, '39', false, 'прибавил прежнюю разность'),
    ((select id from t), 4, '47', false, 'принял последовательность за арифметическую');

-- тема 801, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (801, 2, 'choice', 'Последовательность: 2, 6, 12, 20, 30, ... Какое число стоит на седьмом месте?', 'Тізбек: 2, 6, 12, 20, 30, ... Жетінші орындағы сан қандай?', 56.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '42', false, 'назвал шестой член'),
    ((select id from t), 2, '72', false, 'назвал восьмой член'),
    ((select id from t), 3, '40', false, 'прибавлял по 10'),
    ((select id from t), 4, '56', true, null);

-- тема 801, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (801, 3, 'number', 'Последовательность: 1, 2, 4, 7, 11, 16, ... Какое число стоит на двенадцатом месте?', 'Тізбек: 1, 2, 4, 7, 11, 16, ... Он екінші орындағы сан қандай?', 67.0, 150) returning id
)
select id from t;

-- тема 804, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (804, 1, 'choice', 'Асель, Болат и Дана. Один из них съел пирог. Асель сказала: «Это не я». Болат сказал: «Это Дана». Дана сказала: «Болат говорит неправду». Правду сказал ровно один. Кто съел пирог? Ответ: 1 — Асель, 2 — Болат, 3 — Дана, 4 — определить нельзя.', 'Әсел, Болат және Дана. Олардың біреуі бәліш жеп қойған. Әсел: «Бұл мен емеспін», — деді. Болат: «Бұл — Дана», — деді. Дана: «Болат өтірік айтады», — деді. Тек біреуі ғана шындықты айтқан. Бәлішті кім жеді? Жауап: 1 — Әсел, 2 — Болат, 3 — Дана, 4 — анықтау мүмкін емес.', 1.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '4', false, 'решил, что данных не хватает'),
    ((select id from t), 2, '3', false, 'поверил прямому обвинению'),
    ((select id from t), 3, '1', true, null),
    ((select id from t), 4, '2', false, 'не сосчитал, сколько выходит правдивых фраз');

-- тема 804, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (804, 2, 'choice', 'Три коробки. На первой написано «конфеты здесь», на второй «конфет здесь нет», на третьей «конфеты в первой». Верна ровно одна надпись. Где конфеты? Ответ: 1, 2 или 3, либо 4 — определить нельзя.', 'Үш қорап. Біріншісінде «кәмпит осында», екіншісінде «кәмпит мұнда жоқ», үшіншісінде «кәмпит бірінші қорапта» деп жазылған. Тек бір жазу дұрыс. Кәмпит қайда? Жауап: 1, 2 немесе 3, әйтпесе 4 — анықтау мүмкін емес.', 3.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '4', false, 'решил, что данных не хватает'),
    ((select id from t), 2, '2', false, 'выбрал коробку по её собственной надписи'),
    ((select id from t), 3, '1', false, 'не проверил, сколько надписей окажется верными'),
    ((select id from t), 4, '3', true, null);

-- тема 804, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (804, 3, 'number', 'Пятеро друзей. Каждый из них сказал: «Среди нас ровно два честных». Честные всегда говорят правду, остальные всегда лгут. Сколько среди них честных?', 'Бес дос. Әрқайсысы: «Арамызда дәл екі адал адам бар», — деді. Адалдар әрқашан шындықты айтады, қалғандары әрқашан өтірік айтады. Олардың нешеуі адал?', 0.0, 150) returning id
)
select id from t;

-- тема 806, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (806, 1, 'choice', 'В классе 30 учеников. Английский изучают 18, китайский 15, оба языка 8. Сколько не изучают ни одного из этих языков?', 'Сыныпта 30 оқушы. Ағылшын тілін 18, қытай тілін 15, екеуін де 8 оқушы оқиды. Осы тілдердің бірде-бірін нешеуі оқымайды?', 5.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '3', false, 'забыл про пересечение'),
    ((select id from t), 2, '25', false, 'назвал изучающих хотя бы один язык'),
    ((select id from t), 3, '8', false, 'назвал изучающих оба'),
    ((select id from t), 4, '5', true, null);

-- тема 806, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (806, 2, 'choice', 'В группе 20 детей. Футболом занимаются 14, шахматами 11, и каждый занимается хотя бы одним. Сколько занимаются и тем, и другим?', 'Топта 20 бала. Футболмен 14, шахматпен 11 бала айналысады, әрқайсысы кемінде біреуімен айналысады. Екеуімен де нешеуі айналысады?', 5.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '9', false, 'вычел из 20 только шахматистов'),
    ((select id from t), 2, '5', true, null),
    ((select id from t), 3, '3', false, 'вычел меньшее из большего'),
    ((select id from t), 4, '25', false, 'сложил и не вычел общее число');

-- тема 806, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (806, 3, 'number', 'В классе 30 учеников. Математику любят 18, физику 15, химию 12. Математику и физику 8, физику и химию 6, математику и химию 7, все три предмета 3. Сколько учеников не любят ни одного из этих предметов?', 'Сыныпта 30 оқушы. Математиканы 18, физиканы 15, химияны 12 оқушы ұнатады. Математика мен физиканы 8, физика мен химияны 6, математика мен химияны 7, үш пәнді де 3 оқушы ұнатады. Бірде-бір пәнді нешеу ұнатпайды?', 3.0, 150) returning id
)
select id from t;

-- тема 901, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (901, 1, 'choice', 'Среднее арифметическое пяти чисел равно 12. Четыре из них: 8, 10, 15 и 11. Найди пятое число.', 'Бес санның арифметикалық ортасы 12-ге тең. Олардың төртеуі: 8, 10, 15 және 11. Бесінші санды тап.', 16.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '16', true, null),
    ((select id from t), 2, '44', false, 'назвал сумму четырёх'),
    ((select id from t), 3, '11', false, 'взял среднее четырёх известных'),
    ((select id from t), 4, '12', false, 'назвал само среднее');

-- тема 901, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (901, 2, 'choice', 'Средний балл пяти учеников равен 4. Пришёл шестой ученик с баллом 10. Каким стал средний балл?', 'Бес оқушының орташа ұпайы 4-ке тең. Ұпайы 10 болатын алтыншы оқушы қосылды. Орташа ұпай қандай болды?', 5.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '5', true, null),
    ((select id from t), 2, '4', false, 'решил, что среднее не изменилось'),
    ((select id from t), 3, '7', false, 'взял среднее между 4 и 10'),
    ((select id from t), 4, '6', false, 'разделил сумму на 5');

-- тема 901, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (901, 3, 'number', 'Среднее арифметическое пяти чисел равно 20. Одно из чисел увеличили на 15, а другое уменьшили на 5. Каким стало среднее арифметическое?', 'Бес санның арифметикалық ортасы 20-ға тең. Сандардың біреуін 15-ке арттырды, екіншісін 5-ке кемітті. Арифметикалық орта қандай болды?', 22.0, 150) returning id
)
select id from t;

select (select count(*) from tasks) as задач,
       (select count(*) from tasks where answer_type = 'number') as со_вводом,
       (select count(distinct topic_ord) from tasks) as тем;
