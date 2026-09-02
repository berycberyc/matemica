-- ============================================================
--  matemica — схема базы данных. Версия 1.
--  Дата: 2 сентября 2026.
--
--  Что делать: открыть Supabase → SQL Editor → New query →
--  вставить весь этот файл целиком → Run.
--  Файл можно запускать повторно: он сначала сносит свои таблицы.
-- ============================================================

drop table if exists help_requests   cascade;
drop table if exists lessons         cascade;
drop table if exists ai_notes        cascade;
drop table if exists plan_items      cascade;
drop table if exists topic_status    cascade;
drop table if exists answers         cascade;
drop table if exists diag_items      cascade;
drop table if exists diag_sessions   cascade;
drop table if exists templates       cascade;
drop table if exists options         cascade;
drop table if exists tasks           cascade;
drop table if exists topic_deps      cascade;
drop table if exists topics          cascade;
drop table if exists teacher_group   cascade;
drop table if exists parent_child    cascade;
drop table if exists users           cascade;
drop table if exists groups          cascade;


-- ------------------------------------------------------------
--  ГРУППЫ
-- ------------------------------------------------------------
create table groups (
  id          bigserial primary key,
  name        text        not null unique,   -- '08:00', '10:30', '15:00'
  start_time  time,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);


-- ------------------------------------------------------------
--  ПОЛЬЗОВАТЕЛИ — все роли в одной таблице.
--  Удаления нет: is_active = false закрывает вход, история цела.
-- ------------------------------------------------------------
create table users (
  id          bigserial primary key,
  role        text        not null check (role in ('owner','teacher','student','parent')),
  full_name   text        not null,
  login       text        not null unique,
  password    text        not null,          -- только цифры, см. проверку ниже
  lang        text        not null default 'ru' check (lang in ('ru','kk')),
  group_id    bigint      references groups(id) on delete set null,
  grade       int,                            -- класс, сейчас 6
  note        text,                           -- 'схватывает быстро', 'тихий' и т.п.
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),

  -- пароль строго цифровой: у ребёнка открывается цифровая клавиатура,
  -- раскладку переключать не надо, регистра нет
  constraint password_is_digits check (password ~ '^[0-9]{4,8}$'),
  -- логин без пробелов по краям
  constraint login_trimmed      check (login = btrim(login))
);

create index users_role_group_idx on users (role, group_id) where is_active;


-- ------------------------------------------------------------
--  СВЯЗИ. Отдельными таблицами: у родителя может быть двое детей,
--  у ребёнка двое родителей; преподаватель может вести несколько групп.
-- ------------------------------------------------------------
create table parent_child (
  parent_id bigint not null references users(id) on delete cascade,
  child_id  bigint not null references users(id) on delete cascade,
  primary key (parent_id, child_id),
  constraint parent_is_not_child check (parent_id <> child_id)
);

create table teacher_group (
  teacher_id bigint not null references users(id) on delete cascade,
  group_id   bigint not null references groups(id) on delete cascade,
  primary key (teacher_id, group_id)
);


-- ------------------------------------------------------------
--  ТЕМЫ. Первичный ключ — ord = номер блока * 100 + номер темы.
--  1.1 = 101, 4а.5 = 413, 10.5 = 1005.
--  Ключ осмысленный нарочно: в любом SQL сразу видно, о какой теме речь.
-- ------------------------------------------------------------
create table topics (
  ord           int  primary key,
  code          text not null unique,        -- '1.1', '4а.5'
  block         text not null,               -- '1', '4а', '10'
  pos           int  not null,               -- порядок внутри блока
  title_ru      text not null,
  title_kk      text,                        -- заполним после проверки терминов
  is_core       boolean not null default true,   -- ядро / расширение
  needs_figure  boolean not null default false,  -- нужен рисунок
  constraint ord_matches_code check (ord between 100 and 1099)
);

--  Карта зависимостей. Без неё спуск невозможен.
create table topic_deps (
  topic_ord  int not null references topics(ord) on delete cascade,
  depends_on int not null references topics(ord) on delete cascade,
  primary key (topic_ord, depends_on),
  constraint no_self_dep check (topic_ord <> depends_on)
);


-- ------------------------------------------------------------
--  ЗАДАЧИ
-- ------------------------------------------------------------
create table tasks (
  id             bigserial primary key,
  topic_ord      int  not null references topics(ord),
  level          int  not null check (level between 1 and 3),
  answer_type    text not null check (answer_type in ('choice','number','compare')),
  stem_ru        text not null,
  stem_kk        text,
  svg            text,                        -- рисунок текстом, не ссылка
  answer_num     bigint check (answer_num >= 0),  -- ответ всегда 0 или натуральное
  answer_expr    text,                        -- как ответ посчитан: '800 + 800*25/100'
  hint_ru        text,
  hint_kk        text,
  target_seconds int  not null default 90,
  source         text not null default 'manual' check (source in ('manual','generated')),
  template_id    bigint,                      -- если задача рождена шаблоном
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),

  -- у задачи с вводом числа ответ обязан быть
  constraint number_task_has_answer
    check (answer_type <> 'number' or answer_num is not null)
);

create index tasks_topic_level_idx on tasks (topic_ord, level) where is_active;

-- ------------------------------------------------------------
--  ВАРИАНТЫ ОТВЕТА.
--  В теле варианта только цифры, без единиц измерения:
--  единицы живут в условии ('Ответ дай в сантиметрах').
--  Каждый неверный вариант несёт код ошибки — описание конкретной поломки,
--  а не слово 'неверно'. Это и есть механизм разбора причины.
-- ------------------------------------------------------------
create table options (
  id         bigserial primary key,
  task_id    bigint  not null references tasks(id) on delete cascade,
  pos        int     not null,
  body       text    not null,
  is_correct boolean not null default false,
  error_code text,

  unique (task_id, pos),
  unique (task_id, body),                    -- разные ошибки дают разные числа
  constraint error_code_rule check (
        (is_correct     and error_code is null)
     or (not is_correct and error_code is not null and btrim(error_code) <> '')
  )
);

-- ровно один верный вариант на задачу
create unique index options_one_correct_idx on options (task_id) where is_correct;
-- код ошибки внутри задачи не повторяется
create unique index options_error_unique_idx on options (task_id, error_code) where not is_correct;


-- ------------------------------------------------------------
--  ШАБЛОНЫ ГЕНЕРАТОРА.
--  В базу переезжает только шаблон, уже проверенный вне базы.
-- ------------------------------------------------------------
create table templates (
  id           bigserial primary key,
  topic_ord    int  not null references topics(ord),
  code         text not null unique,
  spec         jsonb not null,               -- рамки чисел, формулы, дистракторы
  is_promoted  boolean not null default false, -- разрешён для кнопки «Ещё задачу»
  created_at   timestamptz not null default now()
);


-- ------------------------------------------------------------
--  ДИАГНОСТИКА. Заходами примерно по 25 вопросов.
--  Прогресс пишется после каждого ответа: оборвался вайфай —
--  перезашёл и продолжил с того же вопроса.
-- ------------------------------------------------------------
create table diag_sessions (
  id          bigserial primary key,
  student_id  bigint not null references users(id) on delete cascade,
  pass_no     int    not null check (pass_no >= 1),   -- 1 — вширь, дальше вглубь
  supervised  boolean not null default false,          -- проходил при Берике
  status      text   not null default 'in_progress'
                     check (status in ('in_progress','done','abandoned')),
  started_at  timestamptz not null default now(),
  finished_at timestamptz,
  unique (student_id, pass_no)
);

create table diag_items (
  id          bigserial primary key,
  session_id  bigint not null references diag_sessions(id) on delete cascade,
  pos         int    not null,
  task_id     bigint not null references tasks(id),
  topic_ord   int    not null references topics(ord),
  given       text,                          -- что ввёл или выбрал; null = ещё не ответил
  is_correct  boolean,
  error_code  text,
  seconds     int,
  answered_at timestamptz,
  unique (session_id, pos)
);

create index diag_items_session_idx on diag_items (session_id, pos);


-- ------------------------------------------------------------
--  ОТВЕТЫ ПО ТРЕНИРОВКЕ (не диагностика).
--  source = 'extra' — кнопка «Ещё задачу». В аналитику не идёт:
--  иначе старательный будет выглядеть знающим. Но Берику показывается.
-- ------------------------------------------------------------
create table answers (
  id          bigserial primary key,
  student_id  bigint not null references users(id) on delete cascade,
  task_id     bigint not null references tasks(id),
  topic_ord   int    not null references topics(ord),
  source      text   not null check (source in ('lesson','home','extra','weekly')),
  given       text,
  is_correct  boolean,
  error_code  text,
  seconds     int,
  created_at  timestamptz not null default now(),
  counts_in_analytics boolean generated always as (source <> 'extra') stored
);

create index answers_student_topic_idx on answers (student_id, topic_ord, created_at);


-- ------------------------------------------------------------
--  УРОВЕНЬ ПО ТЕМЕ — то, из чего рисуется тепловая карта.
--  Состояние 'early' (рано) и 'fail' (не знает) — разные вещи:
--  'early' ставится, когда тема ниже провалена и спрашивать выше нечего.
-- ------------------------------------------------------------
create table topic_status (
  student_id bigint not null references users(id) on delete cascade,
  topic_ord  int    not null references topics(ord) on delete cascade,
  level      int    check (level between 0 and 3),
  state      text   not null default 'unknown'
                    check (state in ('unknown','early','fail','weak','ok')),
  evidence   text,                           -- откуда вывод
  updated_at timestamptz not null default now(),
  primary key (student_id, topic_ord)
);


-- ------------------------------------------------------------
--  ПЛАН НА НЕДЕЛЮ — по одной строке на задачу и день.
-- ------------------------------------------------------------
create table plan_items (
  id          bigserial primary key,
  student_id  bigint not null references users(id) on delete cascade,
  on_date     date   not null,
  pos         int    not null,
  task_id     bigint not null references tasks(id),
  status      text   not null default 'pending'
                     check (status in ('pending','done','skipped','cancelled')),
  assigned_by text   not null default 'ai' check (assigned_by in ('ai','teacher')),
  created_at  timestamptz not null default now(),
  unique (student_id, on_date, pos)
);

create index plan_items_day_idx on plan_items (on_date, student_id);


-- ------------------------------------------------------------
--  ЗАКЛЮЧЕНИЯ ПО ДЕТЯМ.
--  Ребёнок и родитель их не видят никогда. Отдельный экран, не урок.
-- ------------------------------------------------------------
create table ai_notes (
  id         bigserial primary key,
  student_id bigint not null references users(id) on delete cascade,
  week_start date   not null,
  body       text   not null,
  created_at timestamptz not null default now(),
  unique (student_id, week_start)
);


-- ------------------------------------------------------------
--  УРОКИ. Режим урока включается вручную кнопкой, без расписаний.
--  Пока урок открыт — ребёнок не видит, верно ли ответил.
-- ------------------------------------------------------------
create table lessons (
  id         bigserial primary key,
  group_id   bigint not null references groups(id) on delete cascade,
  on_date    date   not null,
  is_open    boolean not null default true,
  started_at timestamptz not null default now(),
  ended_at   timestamptz,
  unique (group_id, on_date)
);


-- ------------------------------------------------------------
--  «СПРОСИТЬ У УЧИТЕЛЯ». Работает и дома, и на уроке.
--  Смысл: тихий ребёнок руку не поднимет, а кнопку нажмёт.
-- ------------------------------------------------------------
create table help_requests (
  id          bigserial primary key,
  student_id  bigint not null references users(id) on delete cascade,
  task_id     bigint references tasks(id),
  context     text   not null default 'home' check (context in ('lesson','home')),
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index help_open_idx on help_requests (created_at) where resolved_at is null;


-- ------------------------------------------------------------
--  ТРИ ГРУППЫ
-- ------------------------------------------------------------
insert into groups (name, start_time) values
  ('08:00', '08:00'),
  ('10:30', '10:30'),
  ('15:00', '15:00');
