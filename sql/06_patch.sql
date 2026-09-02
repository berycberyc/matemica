-- Правка схемы под то, о чём договорились позже.

-- 1. Метка «при учителе» ставится на каждый ответ, а не на заход целиком.
alter table diag_items add column if not exists supervised boolean not null default false;

-- 2. Ответ больше не обязан быть целым и неотрицательным:
--    у ребёнка своя клавиатура с минусом, запятой и дробной чертой.
alter table tasks drop constraint if exists tasks_answer_num_check;
alter table tasks alter column answer_num type numeric;
