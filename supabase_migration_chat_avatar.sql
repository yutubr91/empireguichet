-- Ajoute la photo de profil aux messages du chat, pour affichage à côté du
-- nom quand l'agent a choisi de révéler son identité (chatShowRealName).
-- On stocke une copie de l'URL au moment de l'envoi (comme agent_name),
-- plutôt que de faire un join sur agents, pour rester cohérent avec le
-- pseudonymat : si l'agent redevient anonyme après coup, les anciens
-- messages où il avait choisi d'être visible gardent leur photo affichée
-- telle qu'elle était à ce moment-là.

alter table public.chat_messages
  add column if not exists agent_avatar_url text;
