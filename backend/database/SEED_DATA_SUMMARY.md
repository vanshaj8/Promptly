# Seed Data Summary

The database has been populated with random sample data for testing and development.

## Data Overview

- **8 Brands** - Various categories (Retail, Technology, Fashion, Food, Fitness, Beauty, Home, Pet Care)
- **9 Users** - 1 Admin + 8 Brand Users
- **8 Instagram Accounts** - One connected account per brand
- **46 Comments** - Mix of OPEN, REPLIED, and HIDDEN status
- **20 Replies** - Responses to comments from brand users
- **18 Admin Activity Logs** - Various admin actions

## Brands Created

1. **Demo Brand** (Retail) - brand@demo.com
2. **TechStart Inc** (Technology) - tech@techstart.com
3. **Fashion Forward** (Fashion) - fashion@fashionforward.com
4. **Foodie Delights** (Food & Beverage) - food@foodiedelights.com
5. **FitLife Gym** (Fitness) - fitness@fitlife.com
6. **Beauty Essentials** (Beauty) - beauty@beautyessentials.com
7. **Home Decor Co** (Home & Living) - home@homedecor.com
8. **Pet Paradise** (Pet Care) - pets@petparadise.com

## User Credentials

All users have the password: **`admin123`**

- **Admin**: admin@promptly.com
- **Brand Users**: See brand list above

## Comments Distribution

- **Brand 1 (Demo Brand)**: 8 comments
- **Brand 2 (TechStart)**: 6 comments
- **Brand 3 (Fashion Forward)**: 7 comments
- **Brand 4 (Foodie Delights)**: 5 comments
- **Brand 5 (FitLife Gym)**: 6 comments
- **Brand 6 (Beauty Essentials)**: 5 comments
- **Brand 7 (Home Decor Co)**: 4 comments
- **Brand 8 (Pet Paradise)**: 5 comments

## Comment Statuses

- **OPEN**: Comments waiting for a response
- **REPLIED**: Comments that have been responded to
- **HIDDEN**: Comments that have been hidden (e.g., spam)

## Replies

20 replies have been added to various comments, showing example brand responses to customer inquiries.

## Admin Activity Logs

18 activity logs showing:
- Brand creation
- User creation
- Brand updates
- Log views

## How to Use

1. **Log in as Admin**: admin@promptly.com / admin123
   - View all brands
   - See activity logs
   - Manage brands and users

2. **Log in as Brand User**: Use any brand email / admin123
   - View only your brand's comments
   - See your Instagram account
   - Reply to comments

## Re-seeding Data

To reload the seed data:

```bash
cd backend/database
mysql -u root -p Promptly < seed_random_data.sql
```

**Note**: This will add duplicate data if run multiple times. The SQL uses `ON DUPLICATE KEY UPDATE` to handle duplicates gracefully.

## File Location

- Seed file: `backend/database/seed_random_data.sql`
- Original seed: `backend/database/seed.sql`

