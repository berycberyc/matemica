-- ============================================================
--  matemica — ещё 15 тем на трёх уровнях. Рисунки не нужны.
--  Запускать ПОСЛЕ 09. Ничего не удаляет, только добавляет.
-- ============================================================

-- тема 206, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (206, 1, 'choice', 'В сплаве медь и олово в отношении 3 : 5. Всего сплава 200 граммов. Сколько граммов меди?', 'Қорытпадағы мыс пен қалайы 3 : 5 қатынасында. Барлығы 200 грамм. Мыс неше грамм?', 75.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '125', false, 'назвал массу олова'),
    ((select id from t), 2, '120', false, 'принял отношение за 3 : 2'),
    ((select id from t), 3, '75', true, null),
    ((select id from t), 4, '40', false, 'нашёл величину одной части и остановился');

-- тема 206, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (206, 2, 'choice', 'К 30 килограммам раствора, в котором 20% соли, добавили 10 килограммов воды. Сколько процентов соли стало в растворе?', 'Құрамында 20% тұзы бар 30 килограмм ерітіндіге 10 килограмм су қосты. Ерітіндідегі тұздың пайызы қанша болды?', 15.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '25', false, 'увеличил процент вместо уменьшения'),
    ((select id from t), 2, '15', true, null),
    ((select id from t), 3, '20', false, 'решил, что процент не изменился'),
    ((select id from t), 4, '10', false, 'разделил процент пополам');

-- тема 206, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (206, 3, 'number', 'Смешали 4 килограмма раствора с 10% соли и 6 килограммов раствора с 20% соли. Сколько процентов соли в получившейся смеси?', '10% тұзы бар 4 килограмм ерітінді мен 20% тұзы бар 6 килограмм ерітіндіні араластырды. Қоспадағы тұз неше пайыз?', 16.0, 150) returning id
)
select id from t;

-- тема 207, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (207, 1, 'choice', 'На карте в масштабе 1 : 100000 расстояние между городами равно 7 сантиметрам. Сколько это километров?', '1 : 100000 масштабындағы картада қалалар арасы 7 сантиметр. Бұл неше километр?', 7.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '70', false, 'ошибся на разряд при переводе'),
    ((select id from t), 2, '700', false, 'перевёл в метры вместо километров'),
    ((select id from t), 3, '0,7', false, 'разделил вместо умножения'),
    ((select id from t), 4, '7', true, null);

-- тема 207, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (207, 2, 'choice', 'Расстояние 24 километра занимает на карте 8 сантиметров. Во сколько раз карта уменьшает настоящее расстояние?', '24 километр қашықтық картада 8 сантиметр. Карта нақты қашықтықты неше есе кішірейтеді?', 300000.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '30000', false, 'ошибся на разряд'),
    ((select id from t), 2, '300000', true, null),
    ((select id from t), 3, '200000', false, 'разделил 24 на 12 вместо 8'),
    ((select id from t), 4, '3000000', false, 'ошибся на разряд в другую сторону');

-- тема 207, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (207, 3, 'number', 'На плане в масштабе 1 : 200 участок изображён прямоугольником 5 на 8 сантиметров. Найди площадь участка в квадратных метрах.', '1 : 200 масштабындағы жоспарда телім 5-ке 8 сантиметр тіктөртбұрышпен берілген. Телімнің ауданын шаршы метрмен тап.', 160.0, 150) returning id
)
select id from t;

-- тема 408, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (408, 1, 'choice', 'Пусть a ⊕ b = 2a + b. Найди значение 3 ⊕ 4.', 'a ⊕ b = 2a + b болсын. 3 ⊕ 4 мәнін тап.', 10.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '11', false, 'посчитал a + 2b'),
    ((select id from t), 2, '7', false, 'просто сложил числа'),
    ((select id from t), 3, '10', true, null),
    ((select id from t), 4, '14', false, 'перемножил и прибавил');

-- тема 408, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (408, 2, 'choice', 'Пусть a ⊗ b = a · b − a − b. Найди значение 5 ⊗ 3.', 'a ⊗ b = a · b − a − b болсын. 5 ⊗ 3 мәнін тап.', 7.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '7', true, null),
    ((select id from t), 2, '23', false, 'прибавил вместо вычитания'),
    ((select id from t), 3, '15', false, 'остановился на произведении'),
    ((select id from t), 4, '2', false, 'вычел произведение из суммы');

-- тема 408, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (408, 3, 'number', 'Пусть a ⊕ b = 2a + b. Найди x, если (2 ⊕ x) ⊕ 1 = 15.', 'a ⊕ b = 2a + b болсын. (2 ⊕ x) ⊕ 1 = 15 болса, x-ті тап.', 3.0, 150) returning id
)
select id from t;

-- тема 502, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (502, 1, 'choice', 'Если раздать детям по 5 конфет, останется 8 лишних. Если по 7 — не хватит 6 конфет. Сколько детей?', 'Балаларға 5 кәмпиттен үлестірсе, 8 кәмпит артық қалады. 7 кәмпиттен үлестірсе, 6 кәмпит жетпейді. Неше бала бар?', 7.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '14', false, 'сложил 8 и 6'),
    ((select id from t), 2, '7', true, null),
    ((select id from t), 3, '8', false, 'назвал число лишних конфет'),
    ((select id from t), 4, '6', false, 'назвал нехватку');

-- тема 502, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (502, 2, 'choice', 'Если рассадить учеников по 4 за парту, девять останутся без места. Если по 6 — останется три свободных места. Сколько парт в классе?', 'Оқушыларды партаға 4-тен отырғызса, тоғызы орынсыз қалады. 6-дан отырғызса, үш орын бос қалады. Сыныпта неше парта бар?', 6.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '3', false, 'назвал число свободных мест'),
    ((select id from t), 2, '12', false, 'сложил 9 и 3'),
    ((select id from t), 3, '6', true, null),
    ((select id from t), 4, '9', false, 'назвал число оставшихся без места');

-- тема 502, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (502, 3, 'number', 'Если раздать по 3 тетради каждому, останется 25 лишних. Если по 5 — не хватит 15 тетрадей. Сколько учеников?', 'Әрқайсысына 3 дәптерден берсе, 25 дәптер артық қалады. 5 дәптерден берсе, 15 дәптер жетпейді. Неше оқушы бар?', 20.0, 150) returning id
)
select id from t;

-- тема 503, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (503, 1, 'choice', 'Отцу 40 лет, сыну 12. Через сколько лет отец будет ровно вдвое старше сына?', 'Әкесі 40 жаста, ұлы 12 жаста. Неше жылдан кейін әкесі ұлынан дәл екі есе үлкен болады?', 16.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '14', false, 'взял половину разницы возрастов'),
    ((select id from t), 2, '8', false, 'решил, что через 8 лет'),
    ((select id from t), 3, '28', false, 'нашёл разницу возрастов'),
    ((select id from t), 4, '16', true, null);

-- тема 503, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (503, 2, 'choice', 'Сейчас матери 36 лет, дочери 8. Во сколько раз мать была старше дочери четыре года назад?', 'Қазір анасы 36 жаста, қызы 8 жаста. Төрт жыл бұрын анасы қызынан неше есе үлкен болды?', 8.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '9', false, 'посчитал нынешнее отношение, а не прошлое'),
    ((select id from t), 2, '6', false, 'вычел четыре из отношения'),
    ((select id from t), 3, '8', true, null),
    ((select id from t), 4, '4', false, 'разделил разницу на возраст дочери');

-- тема 503, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (503, 3, 'number', 'Сумма возрастов брата и сестры 21 год. Три года назад брат был вдвое старше сестры. Сколько лет брату сейчас?', 'Ағасы мен қарындасының жасының қосындысы 21. Үш жыл бұрын ағасы қарындасынан екі есе үлкен болған. Ағасы қазір неше жаста?', 13.0, 150) returning id
)
select id from t;

-- тема 506, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (506, 1, 'choice', 'Машина 2 часа ехала со скоростью 60 километров в час и 3 часа со скоростью 80 километров в час. Найди среднюю скорость на всём пути.', 'Көлік 2 сағат сағатына 60 километр, 3 сағат сағатына 80 километр жылдамдықпен жүрді. Бүкіл жолдағы орташа жылдамдықты тап.', 72.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '75', false, 'округлил на глаз'),
    ((select id from t), 2, '70', false, 'взял среднее арифметическое скоростей'),
    ((select id from t), 3, '140', false, 'сложил скорости'),
    ((select id from t), 4, '72', true, null);

-- тема 506, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (506, 2, 'choice', 'Половину пути велосипедист ехал со скоростью 10 километров в час, вторую половину — 15 километров в час. Найди среднюю скорость.', 'Велосипедші жолдың жартысын сағатына 10 километр, екінші жартысын сағатына 15 километр жылдамдықпен жүрді. Орташа жылдамдықты тап.', 12.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '25', false, 'сложил скорости'),
    ((select id from t), 2, '12', true, null),
    ((select id from t), 3, '5', false, 'нашёл разность скоростей'),
    ((select id from t), 4, '12,5', false, 'взял среднее арифметическое скоростей');

-- тема 506, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (506, 3, 'number', 'Турист шёл пешком 3 часа со скоростью 5 километров в час, а потом ехал 2 часа со скоростью 20 километров в час. Найди среднюю скорость на всём пути.', 'Турист 3 сағат сағатына 5 километр жылдамдықпен жаяу жүрді, содан кейін 2 сағат сағатына 20 километр жылдамдықпен жүрді. Бүкіл жолдағы орташа жылдамдықты тап.', 11.0, 150) returning id
)
select id from t;

-- тема 507, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (507, 1, 'choice', 'Один рабочий выполняет работу за 6 дней, другой — за 12. За сколько дней они выполнят её вместе?', 'Бір жұмысшы жұмысты 6 күнде, екіншісі 12 күнде орындайды. Екеуі бірге неше күнде орындайды?', 4.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '18', false, 'сложил дни'),
    ((select id from t), 2, '4', true, null),
    ((select id from t), 3, '3', false, 'разделил меньшее число пополам'),
    ((select id from t), 4, '9', false, 'взял среднее между 6 и 12');

-- тема 507, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (507, 2, 'choice', 'Одна труба наполняет бассейн за 10 часов, вторая — за 15. За сколько часов бассейн наполнится, если открыть обе?', 'Бір құбыр бассейнді 10 сағатта, екіншісі 15 сағатта толтырады. Екеуін бірге ашса, бассейн неше сағатта толады?', 6.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '25', false, 'сложил часы'),
    ((select id from t), 2, '5', false, 'нашёл разность'),
    ((select id from t), 3, '6', true, null),
    ((select id from t), 4, '12,5', false, 'взял среднее между 10 и 15');

-- тема 507, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (507, 3, 'number', 'Двое вместе выполняют работу за 4 часа. Первый, работая один, справляется за 12 часов. За сколько часов выполнит работу второй?', 'Екеуі бірге жұмысты 4 сағатта орындайды. Біріншісі жалғыз істесе, 12 сағатта бітіреді. Екіншісі жұмысты неше сағатта орындайды?', 6.0, 150) returning id
)
select id from t;

-- тема 510, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (510, 1, 'choice', 'Поезд длиной 200 метров едет со скоростью 20 метров в секунду. За сколько секунд он проедет мимо столба?', 'Ұзындығы 200 метр пойыз секундына 20 метр жылдамдықпен жүреді. Ол бағанадан неше секундта өтеді?', 10.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '4000', false, 'перемножил длину и скорость'),
    ((select id from t), 2, '200', false, 'назвал длину поезда'),
    ((select id from t), 3, '10', true, null),
    ((select id from t), 4, '20', false, 'назвал скорость вместо времени');

-- тема 510, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (510, 2, 'choice', 'Поезд длиной 150 метров едет со скоростью 25 метров в секунду. За сколько секунд он полностью проедет мост длиной 100 метров?', 'Ұзындығы 150 метр пойыз секундына 25 метр жылдамдықпен жүреді. Ол ұзындығы 100 метр көпірден толық неше секундта өтеді?', 10.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '250', false, 'назвал общее расстояние вместо времени'),
    ((select id from t), 2, '4', false, 'взял только длину моста'),
    ((select id from t), 3, '10', true, null),
    ((select id from t), 4, '6', false, 'не прибавил длину моста');

-- тема 510, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (510, 3, 'number', 'Поезд длиной 180 метров проезжает мимо неподвижного наблюдателя за 12 секунд. За сколько секунд он полностью проедет туннель длиной 300 метров?', 'Ұзындығы 180 метр пойыз қозғалмай тұрған бақылаушының қасынан 12 секундта өтеді. Ол ұзындығы 300 метр туннельден толық неше секундта өтеді?', 32.0, 150) returning id
)
select id from t;

-- тема 805, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (805, 1, 'choice', 'Айдана выше Болата, а Болат выше Дины. Кто самый низкий? Ответ: 1 — Айдана, 2 — Болат, 3 — Дина, 4 — определить нельзя.', 'Айдана Болаттан ұзын, Болат Динадан ұзын. Ең кішісі кім? Жауап: 1 — Айдана, 2 — Болат, 3 — Дина, 4 — анықтау мүмкін емес.', 3.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '3', true, null),
    ((select id from t), 2, '1', false, 'назвал самого высокого'),
    ((select id from t), 3, '4', false, 'решил, что данных не хватает'),
    ((select id from t), 4, '2', false, 'выбрал среднего по росту');

-- тема 805, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (805, 2, 'choice', 'Четверо стоят в очереди: Асан, Болат, Дана, Ержан. Дана первая. Асан не первый и не последний. Болат стоит сразу за Асаном. Ержан не второй. Кто стоит последним? Ответ: 1 — Асан, 2 — Болат, 3 — Дана, 4 — Ержан.', 'Кезекте төртеу тұр: Асан, Болат, Дана, Ержан. Дана бірінші. Асан бірінші де, соңғы да емес. Болат Асаннан кейін бірден тұр. Ержан екінші емес. Соңғы кім тұр? Жауап: 1 — Асан, 2 — Болат, 3 — Дана, 4 — Ержан.', 4.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '2', false, 'не проверил условие про Ержана'),
    ((select id from t), 2, '1', false, 'не учёл, что Асан не может быть последним'),
    ((select id from t), 3, '3', false, 'перепутал первого с последним'),
    ((select id from t), 4, '4', true, null);

-- тема 805, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (805, 3, 'number', 'Пятеро сдали экзамен. Асан набрал больше Болата, но меньше Дины. Ержан набрал больше Дины. Сая набрала меньше Болата. Какое место занял Асан, если первое место у того, кто набрал больше всех?', 'Бесеуі емтихан тапсырды. Асан Болаттан көп, бірақ Динадан аз ұпай жинады. Ержан Динадан көп жинады. Сая Болаттан аз жинады. Ең көп ұпай жинаған бірінші орын алса, Асан нешінші орын алды?', 3.0, 150) returning id
)
select id from t;

-- тема 807, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (807, 1, 'choice', 'Сколько двузначных чисел можно составить из цифр 1, 2 и 3, если цифры в числе не повторяются?', '1, 2, 3 цифрларынан цифрлары қайталанбайтын неше екі таңбалы сан құрастыруға болады?', 6.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '12', false, 'посчитал и трёхзначные'),
    ((select id from t), 2, '3', false, 'посчитал только числа с единицей'),
    ((select id from t), 3, '6', true, null),
    ((select id from t), 4, '9', false, 'разрешил повторять цифры');

-- тема 807, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (807, 2, 'choice', 'Сколько трёхзначных чисел можно составить из цифр 0, 1, 2, 3, если цифры не повторяются?', '0, 1, 2, 3 цифрларынан цифрлары қайталанбайтын неше үш таңбалы сан құрастыруға болады?', 18.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '24', false, 'разрешил числу начинаться с нуля'),
    ((select id from t), 2, '18', true, null),
    ((select id from t), 3, '27', false, 'разрешил повторять цифры'),
    ((select id from t), 4, '12', false, 'потерял часть вариантов');

-- тема 807, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (807, 3, 'number', 'Сколькими способами можно рассадить четырёх человек на четыре стула?', 'Төрт адамды төрт орындыққа неше тәсілмен отырғызуға болады?', 24.0, 150) returning id
)
select id from t;

-- тема 808, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (808, 1, 'choice', 'В тёмной комнате в ящике лежат носки трёх цветов. Сколько носков нужно вытащить не глядя, чтобы наверняка оказалась пара одного цвета?', 'Қараңғы бөлмедегі жәшікте үш түсті шұлықтар жатыр. Бір түсті жұп шығуы үшін көрмей неше шұлық алу керек?', 4.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '4', true, null),
    ((select id from t), 2, '2', false, 'решил, что хватит пары'),
    ((select id from t), 3, '6', false, 'умножил число цветов на два'),
    ((select id from t), 4, '3', false, 'взял число цветов');

-- тема 808, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (808, 2, 'choice', 'В классе 30 учеников. Какое наименьшее число учеников обязательно родились в один и тот же месяц?', 'Сыныпта 30 оқушы бар. Ең кемінде неше оқушы міндетті түрде бір айда туған?', 3.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '12', false, 'назвал число месяцев'),
    ((select id from t), 2, '4', false, 'округлил в другую сторону'),
    ((select id from t), 3, '3', true, null),
    ((select id from t), 4, '2', false, 'не учёл, что месяцев двенадцать');

-- тема 808, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (808, 3, 'number', 'В мешке лежат шары четырёх цветов. Сколько шаров нужно вытащить не глядя, чтобы наверняка оказалось три шара одного цвета?', 'Қапта төрт түсті шарлар жатыр. Бір түсті үш шар шығуы үшін көрмей неше шар алу керек?', 9.0, 150) returning id
)
select id from t;

-- тема 902, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (902, 1, 'choice', 'Четверо учеников получили по 5 баллов, а шестеро — по 10. Найди средний балл всех десяти.', 'Төрт оқушы 5 ұпайдан, алты оқушы 10 ұпайдан алды. Оныншысының орташа ұпайын тап.', 8.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '8', true, null),
    ((select id from t), 2, '15', false, 'сложил баллы'),
    ((select id from t), 3, '6', false, 'разделил на число видов оценок'),
    ((select id from t), 4, '7,5', false, 'взял среднее между 5 и 10');

-- тема 902, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (902, 2, 'choice', 'Смешали 3 килограмма конфет по 800 тенге и 2 килограмма по 1300 тенге. Сколько тенге стоит килограмм смеси?', '800 теңгеден 3 килограмм және 1300 теңгеден 2 килограмм кәмпитті араластырды. Қоспаның бір килограмы қанша теңге тұрады?', 1000.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '2100', false, 'сложил цены'),
    ((select id from t), 2, '1050', false, 'взял среднее между ценами'),
    ((select id from t), 3, '900', false, 'округлил на глаз'),
    ((select id from t), 4, '1000', true, null);

-- тема 902, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (902, 3, 'number', 'Средний балл десяти учеников равен 7. К ним добавились ещё пятеро со средним баллом 4. Каким стал средний балл всех пятнадцати?', 'Он оқушының орташа ұпайы 7-ге тең. Оларға орташа ұпайы 4 болатын тағы бесеуі қосылды. Он бесеуінің орташа ұпайы қандай болды?', 6.0, 150) returning id
)
select id from t;

-- тема 903, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (903, 1, 'choice', 'Дан ряд чисел: 3, 5, 6, 8, 9. Найди медиану.', 'Сандар қатары берілген: 3, 5, 6, 8, 9. Медиананы тап.', 6.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '3', false, 'назвал наименьшее число'),
    ((select id from t), 2, '6,2', false, 'нашёл среднее арифметическое'),
    ((select id from t), 3, '9', false, 'назвал наибольшее число'),
    ((select id from t), 4, '6', true, null);

-- тема 903, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (903, 2, 'choice', 'Дан ряд чисел: 4, 4, 6, 8, 10, 12. Найди медиану.', 'Сандар қатары берілген: 4, 4, 6, 8, 10, 12. Медиананы тап.', 7.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '7', true, null),
    ((select id from t), 2, '6', false, 'взял только левое из двух средних'),
    ((select id from t), 3, '8', false, 'взял только правое из двух средних'),
    ((select id from t), 4, '4', false, 'назвал моду вместо медианы');

-- тема 903, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (903, 3, 'number', 'В ряду чисел 2, 5, 5, 8 и x медиана равна 5, а среднее арифметическое равно 6. Найди x.', '2, 5, 5, 8 және x сандар қатарында медиана 5-ке, арифметикалық орта 6-ға тең. x-ті тап.', 10.0, 150) returning id
)
select id from t;

-- тема 904, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (904, 1, 'choice', 'Продажи по дням: понедельник 12, вторник 18, среда 9, четверг 21. Сколько продано за все четыре дня?', 'Күндер бойынша сатылым: дүйсенбі 12, сейсенбі 18, сәрсенбі 9, бейсенбі 21. Төрт күнде барлығы неше сатылды?', 60.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '21', false, 'назвал наибольший день'),
    ((select id from t), 2, '48', false, 'потерял одно слагаемое'),
    ((select id from t), 3, '60', true, null),
    ((select id from t), 4, '15', false, 'нашёл среднее за день');

-- тема 904, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (904, 2, 'choice', 'Продажи по дням: понедельник 12, вторник 18, среда 9, четверг 21. Сколько процентов всех продаж пришлось на четверг?', 'Күндер бойынша сатылым: дүйсенбі 12, сейсенбі 18, сәрсенбі 9, бейсенбі 21. Барлық сатылымның неше пайызы бейсенбіге тиесілі?', 35.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '21', false, 'назвал само число продаж'),
    ((select id from t), 2, '35', true, null),
    ((select id from t), 3, '25', false, 'разделил на число дней'),
    ((select id from t), 4, '30', false, 'округлил на глаз');

-- тема 904, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (904, 3, 'number', 'Продажи по дням: понедельник 12, вторник 18, среда 9, четверг 21. В пятницу продали столько, что среднее за пять дней стало равно 15. Сколько продали в пятницу?', 'Күндер бойынша сатылым: дүйсенбі 12, сейсенбі 18, сәрсенбі 9, бейсенбі 21. Жұмада сонша сатылды, сөйтіп бес күндегі орташа сан 15-ке тең болды. Жұмада неше сатылды?', 15.0, 150) returning id
)
select id from t;

-- тема 905, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (905, 1, 'choice', 'В мешке 3 белых и 7 чёрных шаров. Какова вероятность вытащить белый шар? Ответ дай в процентах.', 'Қапта 3 ақ және 7 қара шар бар. Ақ шар шығу ықтималдығы қандай? Жауапты пайызбен жаз.', 30.0, 60) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '3', false, 'назвал число белых шаров'),
    ((select id from t), 2, '43', false, 'разделил белые на чёрные'),
    ((select id from t), 3, '30', true, null),
    ((select id from t), 4, '70', false, 'назвал вероятность чёрного');

-- тема 905, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (905, 2, 'choice', 'В коробке 5 красных, 3 синих и 12 зелёных карандашей. Какова вероятность взять не зелёный карандаш? Ответ дай в процентах.', 'Қорапта 5 қызыл, 3 көк және 12 жасыл қарындаш бар. Жасыл емес қарындаш алу ықтималдығы қандай? Жауапты пайызбен жаз.', 40.0, 90) returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '8', false, 'назвал число не зелёных'),
    ((select id from t), 2, '60', false, 'нашёл вероятность зелёного'),
    ((select id from t), 3, '25', false, 'разделил на число цветов'),
    ((select id from t), 4, '40', true, null);

-- тема 905, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds)
  values (905, 3, 'number', 'Из чисел от 1 до 20 наугад выбирают одно. Какова вероятность, что оно делится на 3 или на 5? Ответ дай в процентах.', '1-ден 20-ға дейінгі сандардан кездейсоқ біреуін таңдайды. Оның 3-ке немесе 5-ке бөліну ықтималдығы қандай? Жауапты пайызбен жаз.', 45.0, 150) returning id
)
select id from t;

select (select count(*) from tasks) as всего_задач,
       (select count(distinct topic_ord) from tasks) as тем;
