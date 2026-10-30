-- Correctif : « permission denied for table subscription_payments » dans la fonction usdt-payment.
-- Le rôle serveur (service_role, jamais exposé au navigateur) doit pouvoir écrire dans cette table.
-- À exécuter une fois dans Supabase -> SQL Editor.

grant select, insert, update, delete on public.subscription_payments to service_role;

-- N'exécuter ce qui suit QUE si une autre erreur « permission denied » apparaît ensuite
-- (rétablit les droits standards de Supabase pour le rôle serveur) :
-- grant usage on schema public to service_role;
-- grant all on all tables in schema public to service_role;
-- grant all on all sequences in schema public to service_role;
-- grant execute on all functions in schema public to service_role;
-- alter default privileges in schema public grant all on tables to service_role;
-- alter default privileges in schema public grant all on sequences to service_role;
