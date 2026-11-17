# Deorah Confession — free starter

This is a private-inbox website starter. Students can submit confessions without creating an account. Submissions are **not displayed publicly**. Only an authenticated account explicitly added to `admin_users` can read, reject, or delete submissions.

## 1. Create the free backend
1. Create a free project at https://supabase.com/.
2. In the project, open **SQL Editor**, paste all of `supabase.sql`, and run it.
3. Open **Project Settings → API** and copy the Project URL and `anon` / publishable key.
4. Paste those two values into `config.js`. Never use the `service_role` key in browser code.

## 2. Create your admin account
1. In Supabase, open **Authentication → Users** and create an admin user with your email and a strong password (or enable email sign-up temporarily and create it yourself).
2. Copy that user's UUID.
3. In SQL Editor run, replacing the example UUID:
   `insert into public.admin_users (user_id) values ('YOUR-ADMIN-USER-UUID');`
4. Keep public sign-ups disabled after creating your admin account. Do not share the admin password.

## 3. Publish free
1. Create a GitHub account if you do not already have one.
2. Upload the files in this folder to a new repository.
3. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. GitHub Pages will provide a free `github.io` address. Open `index.html` on that address to receive submissions and `/admin.html` to sign in.

## Important privacy notes
- The public page can submit but has no database read permission.
- The admin page requires Supabase authentication and an explicit admin-list entry.
- Do not put secrets or a service-role key in frontend files.
- Use a unique, strong admin password and enable multi-factor authentication in Supabase if available.
- The admin dashboard's “Copy for Instagram” button copies text. It does not publish to Instagram automatically.
- Add a short community guideline and a warning not to submit emergencies, threats, personal addresses, phone numbers, or identifying details.
- Free-tier limits and provider policies can change. Check the providers' current terms before launch.

## Files
- `index.html`: student submission page
- `admin.html`: private admin sign-in and inbox
- `supabase.sql`: database tables and access policies
- `config.js`: public Supabase project configuration
- `app.js`, `admin.js`, `styles.css`: site behavior and design
