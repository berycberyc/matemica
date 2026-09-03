-- Правки схемы под планировщик задач.

-- 1. Состояния тем должны совпадать с движком диагностики.
--    В схеме стояло 'weak', которого движок не знает, и не было 'ok_inferred',
--    'shaky', 'partial', которые он ставит.
alter table topic_status drop constraint if exists topic_status_state_check;
alter table topic_status add constraint topic_status_state_check
  check (state in ('unknown', 'early', 'fail', 'shaky', 'partial', 'ok', 'ok_inferred'));

-- 2. Дата закрытия темы — от неё считаются возвраты через 3, 8 и 21 день.
alter table topic_status add column if not exists closed_on date;

-- 3. Какую тему разбирали на уроке. Без этого план спорит с уроком.
alter table lessons add column if not exists topic_ord int references topics(ord);

select 'схема готова к планировщику' as итог;
