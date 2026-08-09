# Recipe Box — Vercel edition

The same private recipe app, hosted for free on Vercel so it's reachable
from your phone and laptop at one URL, no matter which network you're on.

Two free services are used:
- **Vercel** — hosts the app and gives you a URL (e.g.
  `recipe-box-yourname.vercel.app`)
- **Upstash** — a small free database that stores your recipes (Vercel's
  functions don't have their own persistent disk, so this is where the
  data actually lives)

Neither requires a credit card for this scale of use.

## 1. Put this project on GitHub

Vercel deploys from a Git repository.

1. Create a free [GitHub](https://github.com) account if you don't have
   one.
2. Create a new empty repository (e.g. `recipe-box`).
3. Upload this project's files into it (drag-and-drop on GitHub's web
   interface works fine, or use `git push` if you're comfortable with
   Git).

## 2. Create a free database on Upstash

1. Go to [vercel.com](https://vercel.com) and sign up free (you can use
   your GitHub account to sign in, which also makes step 3 easier).
2. In your Vercel dashboard, go to the **Storage** tab → **Create
   Database** → choose **Upstash** → **Redis**.
3. Pick the free tier and create it. Vercel will offer to connect it to
   a project — you can do that in the next step instead, or now if your
   project already exists.

(You can also create the database directly at
[upstash.com](https://upstash.com) and copy the two keys it gives you
into Vercel's environment variables yourself — the Vercel Storage tab
route above just does that wiring for you automatically.)

## 3. Deploy the project on Vercel

1. In your Vercel dashboard, click **Add New → Project**.
2. Import the GitHub repository you created in step 1.
3. Under **Environment Variables**, connect the Upstash database you
   made (if you used the Storage tab route, this may already be filled
   in). You should see `UPSTASH_REDIS_REST_URL` and
   `UPSTASH_REDIS_REST_TOKEN` listed.
4. **Strongly recommended**: also add two more environment variables so
   random visitors can't view or edit your recipes, since this URL is
   publicly reachable on the internet by default:
   - `RECIPE_BOX_USER` — any username you choose
   - `RECIPE_BOX_PASS` — a password you choose
5. Click **Deploy**.

After a minute you'll get a URL like `recipe-box.vercel.app`. Open it on
your phone and your laptop — same recipes on both, saved centrally.

If you set `RECIPE_BOX_USER`/`RECIPE_BOX_PASS`, your browser will prompt
for them once per device and remember them after that.

## 4. Using it day to day

- Open the Vercel URL on your phone (Safari) and add it to your Home
  Screen for an app-like icon: Share → Add to Home Screen.
- Open the same URL on your laptop's browser — it's the same live data,
  not a copy, so changes on one show up on the other on next load.

## 5. Costs, limits, and staying free

- **Vercel Hobby plan**: free for personal, non-commercial projects —
  which this is. Comfortably covers this app's traffic.
- **Upstash free tier**: 500,000 commands/month and 256 MB storage.
  Loading the app costs 1 command; saving or editing a recipe costs 2.
  For one person's private recipe box, you would need to be extremely
  active to come anywhere near this.
- Neither service asks for a credit card at this tier. If you ever
  exceed free limits, Vercel pauses the project rather than charging
  you automatically.

## 6. If you'd rather not use GitHub

You can deploy straight from your computer instead using Vercel's
command-line tool:

```bash
npm install -g vercel
cd recipe-box-vercel
vercel
```

Follow the prompts (it'll ask to create a free account if you don't
have one) — no GitHub repository needed. You'll still add the Upstash
database and environment variables through the Vercel dashboard as in
steps 2–3.
