# Run Better social sharing setup

Cross-device profiles, friend requests, and shared completed workouts use Supabase Auth and Postgres with row-level security.

1. Create a Supabase project.
2. In Project Settings → API, copy the Project URL and publishable key (older projects may call it the anon key). Never use a service-role/secret key in browser code.
3. Open SQL Editor and run [supabase-schema.sql](supabase-schema.sql).
4. In Authentication → URL Configuration, add `https://lucasboccasini.github.io/Run-Better-App/` as the Site URL and allowed redirect URL.
5. Add the Project URL and publishable key to the two constants at the top of `social.js`, then deploy.

Users can sign in by email link, choose a unique handle, search profiles by display name or handle, send/accept friend requests, and open a friend to see their most recent completed workout. Profile names save locally before connecting. Nutrition entries and sleep logs save in the current browser and are not shared.
