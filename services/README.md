microservices.  

query for creating bot on supabase:
INSERT INTO 
users 
(id, email, username, name, "isOnboarded", "emailVerified", "updatedAt")
VALUES
('00000000-0000-0000-0000-000000000001', 'nodbot@nod.internal', 'nodbot', 'Nod', true, true, now())

BOT_USER_ID=00000000-0000-0000-0000-00000000000
