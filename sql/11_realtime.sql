-- Живая связь: разрешаем базе толкать изменения этих таблиц на экран урока.
-- Без этого сайт будет работать, но с задержкой в десять секунд.

alter publication supabase_realtime add table diag_items;
alter publication supabase_realtime add table answers;
alter publication supabase_realtime add table help_requests;
alter publication supabase_realtime add table plan_items;
alter publication supabase_realtime add table lessons;

select schemaname, tablename from pg_publication_tables
 where pubname = 'supabase_realtime' order by tablename;
