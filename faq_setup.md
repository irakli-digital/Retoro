# FAQ Setup Guide

## Prerequisites

1. Existing Neon PostgreSQL database (same as blog setup)
2. Database connection configured in `.env.local`

## Setup Steps

1. **Run the FAQ table creation**
   Execute the FAQ table schema in your Neon console:
   ```sql
   -- Copy the FAQ table creation from schema.sql and run in Neon SQL editor
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Access FAQ page**
   Visit: `http://localhost:3000/faq`

## FAQ Features

- **Bilingual Support**: Georgian (primary) and English content
- **Category Organization**: FAQs can be organized by categories
- **Collapsible Interface**: Accordion-style Q&A for better UX
- **Tabbed Navigation**: Filter FAQs by category when categories exist
- **Server-Side Rendering**: Excellent SEO and performance
- **Dark Mode**: Consistent with site theme
- **Responsive Design**: Works on all devices

## Database Structure

The FAQ table includes:
- `question` / `question_ka`: Question text in English/Georgian
- `answer` / `answer_ka`: Answer content (supports HTML)
- `category` / `category_ka`: Optional category for organization
- `sort_order`: Control display order within categories
- `published`: Boolean to control visibility
- `created_at` / `updated_at`: Timestamps

## Adding FAQs

Insert FAQs directly into your Neon database:

```sql
INSERT INTO faqs (
  question, question_ka, 
  answer, answer_ka, 
  category, category_ka, 
  sort_order, published
) VALUES (
  'What is Mypen?',
  'რა არის Mypen?',
  '<p>Mypen is an AI-powered writing assistant that helps you create high-quality content efficiently.</p>',
  '<p>Mypen არის AI-ზე დაფუძნებული წერის ასისტენტი, რომელიც გეხმარებათ ეფექტურად შექმნათ მაღალი ხარისხის კონტენტი.</p>',
  'General',
  'ზოგადი',
  1,
  true
);
```

## Content Management

Currently, FAQs are managed directly in the database. Each FAQ supports:
- Rich HTML content in answers
- Category-based organization
- Custom sort ordering
- Publication control

## FAQ Categories

Categories are automatically discovered from existing FAQs. When categories exist:
- A tabbed interface appears for filtering
- "ყველა" (All) tab shows all FAQs
- Individual category tabs show filtered FAQs

Without categories, a simple accordion interface is displayed.

## Performance

- Uses Next.js `unstable_cache` for optimal performance
- 60-second revalidation ensures fresh content
- Server-side rendering for excellent SEO
- Efficient database queries with proper indexing