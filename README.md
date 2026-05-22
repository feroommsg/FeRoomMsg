# EL GEDADA - Engineering Works & Contracting Portfolio

A premium international-style portfolio website for an engineering workshop and contracting company. Built with Next.js, TypeScript, Tailwind CSS, and Prisma.

## Features

- **Premium Design**: Dark construction/engineering theme with gold accents
- **Bilingual**: Full English and Arabic support with RTL/LTR
- **Public Portfolio Pages**: Home, Company, Capabilities, Projects, Materials, Catalog, Partners, Contact
- **Admin Panel**: Separate professional admin interface at `/admin`
- **Content Management**: Full CRUD for all website content
- **Image Upload**: Cloudinary integration for media management
- **SEO**: Configurable SEO settings for each page

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT-based (jose)
- **Images**: Cloudinary

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudinary account (for image uploads)

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |

### Installation

```bash
# Install dependencies
npm install

# Set up database (push schema + seed data)
npm run db:setup

# Start development server
npm run dev
```

### Creating Admin User

The admin user is created automatically during the seed process using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

**Default credentials:**
- Email: `admin@elgedada.com`
- Password: `Admin@2024!`

> Change these in production by setting the environment variables.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:setup` | Push schema + seed data |

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    layout.tsx            # Root layout (RTL/LTR support)
    page.tsx              # Home page
    company/              # Company page
    capabilities/         # Capabilities page
    projects/             # Projects page
    materials/            # Materials page
    catalog/              # Catalog gallery page
    partners/             # Partners page
    contact/              # Contact page
    admin/                # Admin panel
      login/              # Admin login
      page.tsx            # Dashboard
      settings/           # Site settings
      home/               # Home content editor
      company/            # Company content editor
      capabilities/       # Capabilities editor
      projects/           # Projects CRUD
      materials/          # Materials CRUD
      catalog/            # Catalog gallery CRUD
      partners/           # Partners CRUD
      contact/            # Contact info editor
      media/              # Media library
      seo/                # SEO settings
  components/             # Reusable React components
  actions/                # Server actions (API layer)
  lib/                    # Utility functions, auth, prisma
prisma/
  schema.prisma           # Database schema
  seed.ts                 # Seed data
```

## Managing Content from Admin Panel

1. Navigate to `/admin` and log in
2. Use the sidebar to navigate between content sections
3. Each section provides:
   - **Table view** of existing items
   - **Add New** button to create items
   - **Edit** button to modify items
   - **Delete** button with confirmation
   - **Reorder** via sort order input
4. **Home Content**: Edit hero section, overview text
5. **Projects**: Upload images, set featured status
6. **Catalog**: Upload gallery images with optional overlays
7. **Media Library**: Upload and manage images
8. **SEO**: Set meta titles, descriptions, OG images

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set all environment variables in the Vercel dashboard.

### Docker

```bash
docker build -t el-gedada-portfolio .
docker run -p 3000:3000 el-gedada-portfolio
```

### Manual

```bash
npm run build
npm start
```

## Design System

- **Background**: `#0d0d0b` (near black)
- **Sections**: `#11110f` (dark)
- **Accent**: `#c9a35c` (gold)
- **Text**: `#e8e2d6` (warm off-white)
- **Typography**: Large headings, strong hierarchy, professional corporate feel
- **Images**: Full-bleed, cinematic presentation

## License

Private - All rights reserved.
