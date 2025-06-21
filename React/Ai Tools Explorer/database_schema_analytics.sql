-- Analytics tables for AI Tools Explorer
-- This tracks user activity and tool usage

-- User activity tracking table
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES ai_tools(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('view', 'click', 'bookmark', 'review', 'visit_website')),
    session_id VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recently viewed tools (for quick access)
CREATE TABLE IF NOT EXISTS recently_viewed (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES ai_tools(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_count INTEGER DEFAULT 1,
    UNIQUE(user_id, tool_id)
);

-- User sessions for better analytics
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address INET,
    is_active BOOLEAN DEFAULT true
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_tool_id ON user_activity(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);

CREATE INDEX IF NOT EXISTS idx_recently_viewed_user_id ON recently_viewed(user_id);
CREATE INDEX IF NOT EXISTS idx_recently_viewed_viewed_at ON recently_viewed(viewed_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activity
CREATE POLICY "Users can view their own activity" ON user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity" ON user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for recently_viewed
CREATE POLICY "Users can view their own recently viewed" ON recently_viewed
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recently viewed" ON recently_viewed
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recently viewed" ON recently_viewed
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to track tool view
CREATE OR REPLACE FUNCTION track_tool_view(
    p_user_id UUID,
    p_tool_id UUID,
    p_session_id VARCHAR DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Insert activity record
    INSERT INTO user_activity (user_id, tool_id, activity_type, session_id, user_agent, ip_address)
    VALUES (p_user_id, p_tool_id, 'view', p_session_id, p_user_agent, p_ip_address);
    
    -- Update or insert recently viewed
    INSERT INTO recently_viewed (user_id, tool_id, viewed_at, view_count)
    VALUES (p_user_id, p_tool_id, NOW(), 1)
    ON CONFLICT (user_id, tool_id)
    DO UPDATE SET 
        viewed_at = NOW(),
        view_count = recently_viewed.view_count + 1;
END;
$$ LANGUAGE plpgsql;

-- Function to track tool click
CREATE OR REPLACE FUNCTION track_tool_click(
    p_user_id UUID,
    p_tool_id UUID,
    p_click_type VARCHAR,
    p_session_id VARCHAR DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_activity (user_id, tool_id, activity_type, session_id, user_agent, ip_address)
    VALUES (p_user_id, p_tool_id, p_click_type, p_session_id, p_user_agent, p_ip_address);
END;
$$ LANGUAGE plpgsql;

-- Function to get user's recently viewed tools
CREATE OR REPLACE FUNCTION get_recently_viewed_tools(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    tool_id UUID,
    tool_name VARCHAR,
    tool_description TEXT,
    tool_category VARCHAR,
    tool_website_url VARCHAR,
    viewed_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER,
    average_rating DECIMAL,
    review_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.description,
        t.category,
        t.website_url,
        rv.viewed_at,
        rv.view_count,
        COALESCE(get_tool_average_rating(t.id), 0) as average_rating,
        COALESCE(get_tool_review_count(t.id), 0) as review_count
    FROM recently_viewed rv
    JOIN ai_tools t ON rv.tool_id = t.id
    WHERE rv.user_id = p_user_id
    ORDER BY rv.viewed_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    total_views INTEGER,
    total_clicks INTEGER,
    total_bookmarks INTEGER,
    total_reviews INTEGER,
    unique_tools_viewed INTEGER,
    most_viewed_category VARCHAR,
    activity_days INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH activity_stats AS (
        SELECT 
            COUNT(*) FILTER (WHERE activity_type = 'view') as views,
            COUNT(*) FILTER (WHERE activity_type = 'click') as clicks,
            COUNT(*) FILTER (WHERE activity_type = 'bookmark') as bookmarks,
            COUNT(*) FILTER (WHERE activity_type = 'review') as reviews,
            COUNT(DISTINCT tool_id) as unique_tools,
            COUNT(DISTINCT DATE(created_at)) as active_days
        FROM user_activity
        WHERE user_id = p_user_id 
        AND created_at >= NOW() - INTERVAL '1 day' * p_days
    ),
    category_stats AS (
        SELECT t.category, COUNT(*) as view_count
        FROM user_activity ua
        JOIN ai_tools t ON ua.tool_id = t.id
        WHERE ua.user_id = p_user_id 
        AND ua.activity_type = 'view'
        AND ua.created_at >= NOW() - INTERVAL '1 day' * p_days
        GROUP BY t.category
        ORDER BY view_count DESC
        LIMIT 1
    )
    SELECT 
        COALESCE(as.views, 0) as total_views,
        COALESCE(as.clicks, 0) as total_clicks,
        COALESCE(as.bookmarks, 0) as total_bookmarks,
        COALESCE(as.reviews, 0) as total_reviews,
        COALESCE(as.unique_tools, 0) as unique_tools_viewed,
        cs.category as most_viewed_category,
        COALESCE(as.active_days, 0) as activity_days
    FROM activity_stats as
    LEFT JOIN category_stats cs ON true;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old activity data (keep last 90 days)
CREATE OR REPLACE FUNCTION clean_old_activity_data()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_activity 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean old data (if using pg_cron extension)
-- SELECT cron.schedule('clean-activity-data', '0 2 * * 0', 'SELECT clean_old_activity_data();'); 