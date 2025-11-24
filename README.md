# Handover 🤝

**Handover** is a developer-first CMS boilerplate that bridges the gap between static sites and complex CMSs. It allows you to code a custom website layout while giving non-technical clients a secure "Admin" dashboard to update text, swap images, and tweak specific theme colors without touching the code or breaking the layout.

## Core Philosophy

**"Content is separate from Structure."**

- **You (The Developer)** control the Layout (HTML/CSS/Structure).
- **The Client** controls the Content (Text, Images, Color Variables).

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/handover.git my-client-site
cd my-client-site
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```bash
# .env
ADMIN_PASSWORD=your_secure_password
REQUIRE_AUTH=true
```

### 3. Run Locally

```bash
npm run dev
```

- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🛠️ Development Workflow

### 1. Define Your Content Schema

The heart of Handover is `content.json`. This file defines what your client can edit.

```json
// content.json
{
  "hero": {
    "title": "Welcome to My Site",
    "image": "/uploads/hero.jpg"
  },
  "theme": {
    "primary_color": "#3b82f6"
  }
}
```

### 2. Build Your Layout

In your Next.js pages (e.g., `app/page.tsx`), fetch the content and render it.

```tsx
import { getContent } from "@/lib/content";

export default async function Page() {
  const content = await getContent();

  return (
    <h1 style={{ color: content.theme.primary_color }}>
      {content.hero.title}
    </h1>
  );
}
```

### 3. Add New Editable Fields

To add a new section (e.g., "Testimonials"):

1.  **Update `content.json`**: Add the initial data structure.
    ```json
    "testimonials": {
      "quote": "Great service!",
      "author": "Jane Doe"
    }
    ```
2.  **Update `lib/content.ts`**: Add the type definition (optional but recommended for TypeScript).
3.  **Update Admin UI**: Edit `app/admin/DashboardClient.tsx` to add inputs for the new fields.

```tsx
{/* Testimonials Section */}
<section>
  <h2>Testimonials</h2>
  <input 
    value={content.testimonials.quote} 
    onChange={(e) => handleChange('testimonials', 'quote', e.target.value)} 
  />
</section>
```

---

## 📦 Deployment

1.  **Build**: `npm run build`
2.  **Start**: `npm start`

**Note**: Since Handover writes to the local filesystem (`content.json` and `public/uploads`), it is best suited for:
-   **VPS / Docker** (DigitalOcean, Hetzner, Railway with persistent volume).
-   **Not suitable for Vercel/Netlify** out of the box (as they have ephemeral filesystems). *To support serverless, you would need to swap the `lib/content.ts` adapter to read/write from an external DB or S3.*

---

## 🎨 Customization

-   **Styling**: Uses Tailwind CSS. Modify `globals.css` or `tailwind.config.ts`.
-   **Theme**: The `app/layout.tsx` injects CSS variables from `content.json` into the `:root`, allowing dynamic theming.

```css
/* globals.css */
.btn-primary {
  background-color: var(--primary); /* Controlled by Admin */
}
```
