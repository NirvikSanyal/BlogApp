# Blog API

Copy `.env.example` to `.env`, set `MONGODB_URI` and a long random `JWT_SECRET`, then run:

```sh
npm install
npm run dev
```

## Endpoints

- `POST /api/auth/signup` — `{ "name", "email", "password" }`
- `POST /api/auth/login` — `{ "email", "password" }`
- `GET /api/auth/me` — authenticated user
- `GET /api/posts` and `GET /api/posts/:id` — public
- `POST /api/posts` — authenticated; `{ "title", "body" }`
- `PUT /api/posts/:id` and `DELETE /api/posts/:id` — authenticated post owner only

For protected requests send `Authorization: Bearer <token>`.

Create and update requests accept `multipart/form-data`. The optional `image` field accepts JPG, PNG, WebP, or GIF files up to 5 MB. Send `removeImage=true` while updating to remove the current image.

## Create the administrator

Set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `.env`, then run `npm run seed:admin`.
The password is hashed before storage. Re-running the command safely updates the same account. Admins can edit or delete every post; regular users remain limited to their own posts.
