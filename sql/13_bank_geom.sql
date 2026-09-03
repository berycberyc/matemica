-- ============================================================
--  matemica — геометрия: 6 тем на трёх уровнях, с рисунками.
--  Рисунок хранится текстом прямо в базе, никаких файлов.
--  Координаты вычислены по условию и проверены расчётом.
--  Запускать ПОСЛЕ 12.
-- ============================================================

-- тема 601, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (601, 1, 'choice', 'Две прямые пересекаются. Один угол отмечен. Найди смежный с ним угол в градусах.', 'Екі түзу қиылысады. Бір бұрыш белгіленген. Оған сыбайлас бұрышты градуспен тап.', 115.0, 60, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><line x1="40.0" y1="110.0" x2="280.0" y2="110.0" stroke="#14302E" stroke-width="2" stroke-linecap="round"/><line x1="109.3" y1="218.8" x2="210.7" y2="1.2" stroke="#14302E" stroke-width="2" stroke-linecap="round"/><path d="M 194.0 110.0 A 34 34 0 0 0 174.4 79.2" fill="none" stroke="#1F6F6B" stroke-width="2"/><text x="203.9" y="87.1" fill="#1F6F6B" text-anchor="middle" font-size="15">65°</text><circle cx="160" cy="110" r="3.5" fill="#14302E"/></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '130', false, 'удвоил отмеченный угол'),
    ((select id from t), 2, '65', false, 'назвал вертикальный угол вместо смежного'),
    ((select id from t), 3, '115', true, null),
    ((select id from t), 4, '25', false, 'вычел из 90 вместо 180');

-- тема 601, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (601, 2, 'choice', 'Две прямые пересекаются. Один угол отмечен. Найди сумму трёх остальных углов в градусах.', 'Екі түзу қиылысады. Бір бұрыш белгіленген. Қалған үш бұрыштың қосындысын градуспен тап.', 305.0, 90, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><line x1="40.0" y1="110.0" x2="280.0" y2="110.0" stroke="#14302E" stroke-width="2" stroke-linecap="round"/><line x1="91.2" y1="208.3" x2="228.8" y2="11.7" stroke="#14302E" stroke-width="2" stroke-linecap="round"/><path d="M 194.0 110.0 A 34 34 0 0 0 179.5 82.1" fill="none" stroke="#1F6F6B" stroke-width="2"/><text x="206.1" y="91.0" fill="#1F6F6B" text-anchor="middle" font-size="15">55°</text><circle cx="160" cy="110" r="3.5" fill="#14302E"/></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '180', false, 'решил, что три угла дают развёрнутый'),
    ((select id from t), 2, '125', false, 'нашёл только смежный угол'),
    ((select id from t), 3, '245', false, 'вычел из 300'),
    ((select id from t), 4, '305', true, null);

-- тема 601, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (601, 3, 'number', 'Две прямые пересекаются. Один угол отмечен. На сколько градусов смежный угол больше отмеченного?', 'Екі түзу қиылысады. Бір бұрыш белгіленген. Сыбайлас бұрыш белгіленген бұрыштан неше градусқа үлкен?', 124.0, 150, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><line x1="40.0" y1="110.0" x2="280.0" y2="110.0" stroke="#14302E" stroke-width="2" stroke-linecap="round"/><line x1="54.0" y1="166.3" x2="266.0" y2="53.7" stroke="#14302E" stroke-width="2" stroke-linecap="round"/><path d="M 194.0 110.0 A 34 34 0 0 0 190.0 94.0" fill="none" stroke="#1F6F6B" stroke-width="2"/><text x="210.5" y="102.4" fill="#1F6F6B" text-anchor="middle" font-size="15">28°</text><circle cx="160" cy="110" r="3.5" fill="#14302E"/></svg>') returning id
)
select id from t;

-- тема 602, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (602, 1, 'choice', 'В треугольнике два угла отмечены. Найди третий угол в градусах.', 'Үшбұрышта екі бұрыш белгіленген. Үшінші бұрышты градуспен тап.', 60.0, 60, '<svg viewBox="0 0 320 253" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><polygon points="50.0,222.9 270.0,222.9 203.4,40.0" fill="#E6F0EE" stroke="#14302E" stroke-width="2" stroke-linejoin="round"/><path d="M 76.0 222.9 A 26 26 0 0 0 66.7 202.9" fill="none" stroke="#1F6F6B" stroke-width="2"/><path d="M 261.1 198.4 A 26 26 0 0 0 244.0 222.9" fill="none" stroke="#1F6F6B" stroke-width="2"/><text x="86.3" y="211.0" fill="#1F6F6B" text-anchor="middle" font-size="15">50°</text><text x="237.2" y="204.9" fill="#1F6F6B" text-anchor="middle" font-size="15">70°</text><text x="203.4" y="82.0" fill="#1F6F6B" text-anchor="middle" font-size="19">?</text><text x="36.0" y="228.9" fill="#14302E" text-anchor="middle" font-size="15">A</text><text x="284.0" y="228.9" fill="#14302E" text-anchor="middle" font-size="15">B</text><text x="203.4" y="28.0" fill="#14302E" text-anchor="middle" font-size="15">C</text></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '20', false, 'нашёл разность известных углов'),
    ((select id from t), 2, '180', false, 'назвал сумму углов треугольника'),
    ((select id from t), 3, '60', true, null),
    ((select id from t), 4, '120', false, 'сложил два известных угла');

-- тема 602, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (602, 2, 'choice', 'В треугольнике два угла отмечены. Найди третий угол в градусах.', 'Үшбұрышта екі бұрыш белгіленген. Үшінші бұрышты градуспен тап.', 105.0, 90, '<svg viewBox="0 0 320 154" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><polygon points="50.0,124.0 270.0,124.0 169.9,40.0" fill="#E6F0EE" stroke="#14302E" stroke-width="2" stroke-linejoin="round"/><path d="M 76.0 124.0 A 26 26 0 0 0 71.3 109.1" fill="none" stroke="#1F6F6B" stroke-width="2"/><path d="M 250.1 107.3 A 26 26 0 0 0 244.0 124.0" fill="none" stroke="#1F6F6B" stroke-width="2"/><text x="88.1" y="116.9" fill="#1F6F6B" text-anchor="middle" font-size="15">35°</text><text x="232.4" y="115.3" fill="#1F6F6B" text-anchor="middle" font-size="15">40°</text><text x="169.9" y="82.0" fill="#1F6F6B" text-anchor="middle" font-size="19">?</text><text x="36.0" y="130.0" fill="#14302E" text-anchor="middle" font-size="15">A</text><text x="284.0" y="130.0" fill="#14302E" text-anchor="middle" font-size="15">B</text><text x="169.9" y="28.0" fill="#14302E" text-anchor="middle" font-size="15">C</text></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '105', true, null),
    ((select id from t), 2, '75', false, 'сложил два известных угла'),
    ((select id from t), 3, '5', false, 'нашёл разность известных углов'),
    ((select id from t), 4, '145', false, 'вычел только один угол');

-- тема 602, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (602, 3, 'number', 'В треугольнике два угла отмечены. На сколько градусов наибольший угол треугольника больше наименьшего?', 'Үшбұрышта екі бұрыш белгіленген. Үшбұрыштың ең үлкен бұрышы ең кішісінен неше градусқа үлкен?', 40.0, 150, '<svg viewBox="0 0 320 362" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><polygon points="50.0,331.9 270.0,331.9 101.5,40.0" fill="#E6F0EE" stroke="#14302E" stroke-width="2" stroke-linejoin="round"/><path d="M 76.0 331.9 A 26 26 0 0 0 54.5 306.3" fill="none" stroke="#1F6F6B" stroke-width="2"/><path d="M 257.0 309.4 A 26 26 0 0 0 244.0 331.9" fill="none" stroke="#1F6F6B" stroke-width="2"/><text x="80.6" y="311.2" fill="#1F6F6B" text-anchor="middle" font-size="15">80°</text><text x="235.4" y="316.9" fill="#1F6F6B" text-anchor="middle" font-size="15">60°</text><text x="101.5" y="82.0" fill="#1F6F6B" text-anchor="middle" font-size="19">?</text><text x="36.0" y="337.9" fill="#14302E" text-anchor="middle" font-size="15">A</text><text x="284.0" y="337.9" fill="#14302E" text-anchor="middle" font-size="15">B</text><text x="101.5" y="28.0" fill="#14302E" text-anchor="middle" font-size="15">C</text></svg>') returning id
)
select id from t;

-- тема 603, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (603, 1, 'choice', 'Найди площадь прямоугольника в квадратных сантиметрах.', 'Тіктөртбұрыштың ауданын шаршы сантиметрмен тап.', 28.0, 60, '<svg viewBox="0 0 292 178" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><rect x="70" y="30" width="182" height="104" fill="#E6F0EE" stroke="#14302E" stroke-width="2"/><text x="161.0" y="162.0" fill="#1F6F6B" text-anchor="middle" font-size="15">7 см</text><text x="56.0" y="87.0" fill="#1F6F6B" text-anchor="end" font-size="15">4 см</text></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '14', false, 'удвоил одну сторону'),
    ((select id from t), 2, '11', false, 'сложил стороны'),
    ((select id from t), 3, '28', true, null),
    ((select id from t), 4, '22', false, 'нашёл периметр вместо площади');

-- тема 603, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (603, 2, 'choice', 'Найди периметр прямоугольника в сантиметрах.', 'Тіктөртбұрыштың периметрін сантиметрмен тап.', 22.0, 90, '<svg viewBox="0 0 318 152" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><rect x="70" y="30" width="208" height="78" fill="#E6F0EE" stroke="#14302E" stroke-width="2"/><text x="174.0" y="136.0" fill="#1F6F6B" text-anchor="middle" font-size="15">8 см</text><text x="56.0" y="74.0" fill="#1F6F6B" text-anchor="end" font-size="15">3 см</text></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '11', false, 'сложил стороны без удвоения'),
    ((select id from t), 2, '24', false, 'нашёл площадь вместо периметра'),
    ((select id from t), 3, '16', false, 'удвоил только длину'),
    ((select id from t), 4, '22', true, null);

-- тема 603, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (603, 3, 'number', 'Периметр прямоугольника равен 26 сантиметрам, одна сторона показана на рисунке. Найди площадь в квадратных сантиметрах.', 'Тіктөртбұрыштың периметрі 26 сантиметр, бір қабырғасы суретте көрсетілген. Ауданын шаршы сантиметрмен тап.', 36.0, 150, '<svg viewBox="0 0 344 178" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><rect x="70" y="30" width="234" height="104" fill="#E6F0EE" stroke="#14302E" stroke-width="2"/><text x="187.0" y="162.0" fill="#1F6F6B" text-anchor="middle" font-size="15">9 см</text><text x="56.0" y="87.0" fill="#1F6F6B" text-anchor="end" font-size="15">?</text></svg>') returning id
)
select id from t;

-- тема 605, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (605, 1, 'choice', 'На рисунке отмечен радиус круга. Найди диаметр в сантиметрах.', 'Суретте дөңгелектің радиусы белгіленген. Диаметрін сантиметрмен тап.', 10.0, 60, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><circle cx="160" cy="110" r="78" fill="#E6F0EE" stroke="#14302E" stroke-width="2"/><line x1="160.0" y1="110.0" x2="238.0" y2="110.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><circle cx="160" cy="110" r="3.5" fill="#14302E"/><text x="199.0" y="100.0" fill="#1F6F6B" text-anchor="middle" font-size="15">r = 5 см</text></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '25', false, 'возвёл радиус в квадрат'),
    ((select id from t), 2, '5', false, 'назвал сам радиус'),
    ((select id from t), 3, '10', true, null),
    ((select id from t), 4, '15', false, 'утроил радиус');

-- тема 605, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (605, 2, 'choice', 'Найди длину окружности в сантиметрах, приняв, что число пи примерно равно 3.', 'Пи саны шамамен 3-ке тең деп алып, шеңбердің ұзындығын сантиметрмен тап.', 42.0, 90, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><circle cx="160" cy="110" r="78" fill="#E6F0EE" stroke="#14302E" stroke-width="2"/><line x1="160.0" y1="110.0" x2="238.0" y2="110.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><circle cx="160" cy="110" r="3.5" fill="#14302E"/><text x="199.0" y="100.0" fill="#1F6F6B" text-anchor="middle" font-size="15">r = 7 см</text></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '21', false, 'умножил радиус на пи без двойки'),
    ((select id from t), 2, '42', true, null),
    ((select id from t), 3, '147', false, 'посчитал площадь вместо длины'),
    ((select id from t), 4, '14', false, 'нашёл только диаметр');

-- тема 605, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (605, 3, 'number', 'Найди площадь круга в квадратных сантиметрах, приняв, что число пи примерно равно 3.', 'Пи саны шамамен 3-ке тең деп алып, дөңгелектің ауданын шаршы сантиметрмен тап.', 108.0, 150, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><circle cx="160" cy="110" r="78" fill="#E6F0EE" stroke="#14302E" stroke-width="2"/><line x1="160.0" y1="110.0" x2="238.0" y2="110.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><circle cx="160" cy="110" r="3.5" fill="#14302E"/><text x="199.0" y="100.0" fill="#1F6F6B" text-anchor="middle" font-size="15">r = 6 см</text></svg>') returning id
)
select id from t;

-- тема 607, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (607, 1, 'choice', 'Сторона клетки равна одному сантиметру. Найди площадь фигуры в квадратных сантиметрах.', 'Тор көзінің қабырғасы бір сантиметр. Фигураның ауданын шаршы сантиметрмен тап.', 16.0, 60, '<svg viewBox="0 0 272 208" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><line x1="24.0" y1="20.0" x2="24.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="52.0" y1="20.0" x2="52.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="80.0" y1="20.0" x2="80.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="108.0" y1="20.0" x2="108.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="136.0" y1="20.0" x2="136.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="164.0" y1="20.0" x2="164.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="192.0" y1="20.0" x2="192.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="220.0" y1="20.0" x2="220.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="248.0" y1="20.0" x2="248.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="20.0" x2="248.0" y2="20.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="48.0" x2="248.0" y2="48.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="76.0" x2="248.0" y2="76.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="104.0" x2="248.0" y2="104.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="132.0" x2="248.0" y2="132.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="160.0" x2="248.0" y2="160.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="188.0" x2="248.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><polygon points="52,48 192,48 192,104 136,104 136,160 52,160" fill="#E6F0EE" stroke="#1F6F6B" stroke-width="2.5" stroke-linejoin="round"/></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '16', true, null),
    ((select id from t), 2, '20', false, 'посчитал весь охватывающий прямоугольник'),
    ((select id from t), 3, '15', false, 'потерял одну клетку при подсчёте'),
    ((select id from t), 4, '18', false, 'посчитал периметр вместо площади');

-- тема 607, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (607, 2, 'choice', 'Сторона клетки равна одному сантиметру. Найди периметр фигуры в сантиметрах.', 'Тор көзінің қабырғасы бір сантиметр. Фигураның периметрін сантиметрмен тап.', 14.0, 90, '<svg viewBox="0 0 272 208" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><line x1="24.0" y1="20.0" x2="24.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="52.0" y1="20.0" x2="52.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="80.0" y1="20.0" x2="80.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="108.0" y1="20.0" x2="108.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="136.0" y1="20.0" x2="136.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="164.0" y1="20.0" x2="164.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="192.0" y1="20.0" x2="192.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="220.0" y1="20.0" x2="220.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="248.0" y1="20.0" x2="248.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="20.0" x2="248.0" y2="20.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="48.0" x2="248.0" y2="48.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="76.0" x2="248.0" y2="76.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="104.0" x2="248.0" y2="104.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="132.0" x2="248.0" y2="132.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="160.0" x2="248.0" y2="160.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="188.0" x2="248.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><polygon points="52,48 164,48 164,132 108,132 108,76 52,76" fill="#E6F0EE" stroke="#1F6F6B" stroke-width="2.5" stroke-linejoin="round"/></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '8', false, 'посчитал площадь вместо периметра'),
    ((select id from t), 2, '14', true, null),
    ((select id from t), 3, '12', false, 'не учёл выступ'),
    ((select id from t), 4, '16', false, 'обошёл охватывающий прямоугольник');

-- тема 607, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (607, 3, 'number', 'Сторона клетки равна одному сантиметру. Найди площадь треугольника в квадратных сантиметрах.', 'Тор көзінің қабырғасы бір сантиметр. Үшбұрыштың ауданын шаршы сантиметрмен тап.', 12.0, 150, '<svg viewBox="0 0 272 208" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><line x1="24.0" y1="20.0" x2="24.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="52.0" y1="20.0" x2="52.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="80.0" y1="20.0" x2="80.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="108.0" y1="20.0" x2="108.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="136.0" y1="20.0" x2="136.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="164.0" y1="20.0" x2="164.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="192.0" y1="20.0" x2="192.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="220.0" y1="20.0" x2="220.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="248.0" y1="20.0" x2="248.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="20.0" x2="248.0" y2="20.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="48.0" x2="248.0" y2="48.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="76.0" x2="248.0" y2="76.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="104.0" x2="248.0" y2="104.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="132.0" x2="248.0" y2="132.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="160.0" x2="248.0" y2="160.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><line x1="24.0" y1="188.0" x2="248.0" y2="188.0" stroke="#D8E0DC" stroke-width="1" stroke-linecap="round"/><polygon points="52,48 220,48 220,160" fill="#E6F0EE" stroke="#1F6F6B" stroke-width="2.5" stroke-linejoin="round"/></svg>') returning id
)
select id from t;

-- тема 608, уровень 1
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (608, 1, 'choice', 'Сколько всего треугольников на рисунке?', 'Суретте барлығы неше үшбұрыш бар?', 6.0, 60, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><polygon points="40.0,180.0 280.0,180.0 160.0,40.0" fill="#E6F0EE" stroke="#14302E" stroke-width="2" stroke-linejoin="round"/><line x1="160.0" y1="40.0" x2="120.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><line x1="160.0" y1="40.0" x2="200.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '6', true, null),
    ((select id from t), 2, '3', false, 'посчитал только самые маленькие'),
    ((select id from t), 3, '4', false, 'посчитал маленькие и весь целиком'),
    ((select id from t), 4, '9', false, 'посчитал каждую пару дважды');

-- тема 608, уровень 2
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (608, 2, 'choice', 'Сколько всего треугольников на рисунке?', 'Суретте барлығы неше үшбұрыш бар?', 10.0, 90, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><polygon points="40.0,180.0 280.0,180.0 160.0,40.0" fill="#E6F0EE" stroke="#14302E" stroke-width="2" stroke-linejoin="round"/><line x1="160.0" y1="40.0" x2="100.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><line x1="160.0" y1="40.0" x2="160.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><line x1="160.0" y1="40.0" x2="220.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/></svg>') returning id
)
insert into options (task_id, pos, body, is_correct, error_code) values
    ((select id from t), 1, '16', false, 'посчитал лишние'),
    ((select id from t), 2, '10', true, null),
    ((select id from t), 3, '4', false, 'посчитал только самые маленькие'),
    ((select id from t), 4, '6', false, 'пропустил составные из трёх');

-- тема 608, уровень 3
with t as (
  insert into tasks (topic_ord, level, answer_type, stem_ru, stem_kk, answer_num, target_seconds, svg)
  values (608, 3, 'number', 'Сколько всего треугольников на рисунке?', 'Суретте барлығы неше үшбұрыш бар?', 15.0, 150, '<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg" font-family="Onest, sans-serif" font-size="15"><polygon points="40.0,180.0 280.0,180.0 160.0,40.0" fill="#E6F0EE" stroke="#14302E" stroke-width="2" stroke-linejoin="round"/><line x1="160.0" y1="40.0" x2="88.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><line x1="160.0" y1="40.0" x2="136.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><line x1="160.0" y1="40.0" x2="184.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/><line x1="160.0" y1="40.0" x2="232.0" y2="180.0" stroke="#1F6F6B" stroke-width="2" stroke-linecap="round"/></svg>') returning id
)
select id from t;

select (select count(*) from tasks) as всего_задач,
       (select count(*) from tasks where svg is not null) as с_рисунками,
       (select count(distinct topic_ord) from tasks) as тем;
