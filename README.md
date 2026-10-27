# EarnLink Starter

A frontend prototype for a task-and-rewards website.

## Included
- 10 task cards
- User balance
- Completed/pending counters
- 45-second task timer
- Proof video upload UI
- Responsive mobile layout
- Basic wallet/withdraw placeholder

## Important
This is a frontend prototype. Do not credit real money based only on a client-side timer or uploaded recording. In production, task completion and rewards should be verified server-side, with platform/API rules respected.

## Next build step
Connect Supabase for authentication, users, tasks, submissions, balances, withdrawals and admin approval.
\n\n## Version 2 — Authentication\n\nAdded phone/password signup and login pages and a Supabase configuration file. Before real accounts work, enable Phone authentication in Supabase and add the project URL plus browser-safe publishable/anon key to `config.js`. Never use a service-role/secret key in this public repository.\n