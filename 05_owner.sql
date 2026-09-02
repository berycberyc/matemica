-- Учётная запись преподавателя. Пароль поменяй на свой в Table Editor.
delete from users where role = 'owner';
insert into users (role, full_name, login, password, lang, grade)
values ('owner', 'Берик', 'berik', '20260904', 'ru', null);
