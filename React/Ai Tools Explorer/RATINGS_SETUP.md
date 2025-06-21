# 🎯 Ratings & Reviews System Setup

This guide will help you set up the ratings and reviews system for your AI Tools Explorer application.

## 📋 Database Setup

### 1. Create the Reviews Table

Run the following SQL commands in your Supabase SQL Editor:

```sql
-- Reviews table for AI Tools Explorer
-- This table stores user reviews and ratings for AI tools

CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES ai_tools(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tool_id) -- One review per user per tool
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read all reviews
CREATE POLICY "Users can view all reviews" ON reviews
    FOR SELECT USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can insert their own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate average rating for a tool
CREATE OR REPLACE FUNCTION get_tool_average_rating(tool_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    avg_rating DECIMAL;
BEGIN
    SELECT COALESCE(AVG(rating), 0) INTO avg_rating
    FROM reviews
    WHERE tool_id = tool_uuid;
    
    RETURN ROUND(avg_rating, 1);
END;
$$ LANGUAGE plpgsql;

-- Function to get review count for a tool
CREATE OR REPLACE FUNCTION get_tool_review_count(tool_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    review_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO review_count
    FROM reviews
    WHERE tool_id = tool_uuid;
    
    RETURN review_count;
END;
$$ LANGUAGE plpgsql;
```

### 2. Verify the Setup

After running the SQL commands, you should see:

- ✅ A new `reviews` table in your database
- ✅ Row Level Security enabled
- ✅ Proper policies for user access control
- ✅ Helper functions for calculating ratings and counts
- ✅ Automatic timestamp updates

## 🚀 Features Implemented

### 1. **Rating Component** (`src/components/Rating.jsx`)
- Interactive star rating system
- Support for half-star ratings
- Hover effects and animations
- Read-only mode for display
- Shows rating value and review count

### 2. **Review Dialog** (`src/components/ReviewDialog.jsx`)
- Modal for adding/editing reviews
- Star rating selection
- Comment text area with character limit
- Form validation
- Error handling

### 3. **Reviews List** (`src/components/ReviewsList.jsx`)
- Displays all reviews for a tool
- User avatars with initials
- Edit/delete options for user's own reviews
- Loading states and empty states
- Responsive design

### 4. **Tool Detail Page** (`src/components/ToolDetailPage.jsx`)
- Comprehensive tool information display
- Average rating and review count
- Bookmark functionality
- Write/edit review button
- Reviews sidebar
- Responsive layout

### 5. **Enhanced Tool List** (`src/components/ToolList.jsx`)
- Shows average ratings on tool cards
- Review count display
- "View Details" button for each tool
- Improved card layout

## 🎨 Key Features

### ✅ **User Experience**
- One review per user per tool
- Edit and delete own reviews
- Real-time rating updates
- Smooth animations and transitions
- Responsive design for all screen sizes

### ✅ **Security**
- Row Level Security (RLS) enabled
- Users can only modify their own reviews
- Input validation and sanitization
- Proper error handling

### ✅ **Performance**
- Database indexes for fast queries
- Efficient rating calculations
- Lazy loading of reviews
- Optimized database functions

### ✅ **Accessibility**
- Keyboard navigation support
- Screen reader friendly
- High contrast ratings
- Clear visual feedback

## 🔧 Usage

### For Users:
1. **View Ratings**: See average ratings and review counts on tool cards
2. **Write Reviews**: Click "Write Review" on any tool detail page
3. **Edit Reviews**: Use the menu (⋮) on your own reviews
4. **Delete Reviews**: Remove your reviews if needed
5. **View Details**: Click "View Details" to see full tool information and reviews

### For Developers:
- All components are reusable and customizable
- Database functions can be extended for additional features
- Styled components support dark/light mode
- TypeScript ready (just add type definitions)

## 🐛 Troubleshooting

### Common Issues:

1. **"Function not found" error**
   - Make sure you ran all the SQL commands
   - Check that the functions were created successfully

2. **"Permission denied" error**
   - Verify RLS policies are set up correctly
   - Ensure user is authenticated

3. **Ratings not showing**
   - Check browser console for errors
   - Verify database connection
   - Ensure tool IDs match between tables

4. **Reviews not loading**
   - Check network tab for failed requests
   - Verify Supabase client configuration
   - Ensure proper error handling

## 📈 Future Enhancements

Potential features to add:
- Review helpfulness voting
- Review filtering and sorting
- Review moderation system
- Review analytics dashboard
- Email notifications for new reviews
- Review templates for different tool categories

---

**Need help?** Check the Supabase documentation or create an issue in your project repository. 