-- Метка «при учителе» ставится на каждый ответ, а не на заход целиком.
alter table diag_items add column if not exists supervised boolean not null default false;
