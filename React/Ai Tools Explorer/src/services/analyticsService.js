import { supabase } from '../supabaseClient';

class AnalyticsService {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userAgent = navigator.userAgent;
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async trackToolView(toolId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('track_tool_view', {
        p_user_id: user.id,
        p_tool_id: toolId,
        p_session_id: this.sessionId,
        p_user_agent: this.userAgent
      });
    } catch (error) {
      console.error('Error tracking tool view:', error);
    }
  }

  async trackToolClick(toolId, clickType) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('track_tool_click', {
        p_user_id: user.id,
        p_tool_id: toolId,
        p_click_type: clickType,
        p_session_id: this.sessionId,
        p_user_agent: this.userAgent
      });
    } catch (error) {
      console.error('Error tracking tool click:', error);
    }
  }

  async getRecentlyViewedTools(limit = 10) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase.rpc('get_recently_viewed_tools', {
        p_user_id: user.id,
        p_limit: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching recently viewed tools:', error);
      return [];
    }
  }

  async getUserActivitySummary(days = 30) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase.rpc('get_user_activity_summary', {
        p_user_id: user.id,
        p_days: days
      });

      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Error fetching user activity summary:', error);
      return null;
    }
  }

  async getActivityHistory(days = 30, limit = 50) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_activity')
        .select(`
          *,
          ai_tools (
            id,
            name,
            category,
            website_url
          )
        `)
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching activity history:', error);
      return [];
    }
  }

  async getMostViewedCategories(days = 30, limit = 5) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_activity')
        .select(`
          ai_tools (
            category
          )
        `)
        .eq('user_id', user.id)
        .eq('activity_type', 'view')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Count categories
      const categoryCounts = {};
      data.forEach(activity => {
        const category = activity.ai_tools?.category;
        if (category) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });

      // Convert to array and sort
      return Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching most viewed categories:', error);
      return [];
    }
  }

  async getActivityByDay(days = 7) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_activity')
        .select('created_at, activity_type')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by day
      const dailyActivity = {};
      data.forEach(activity => {
        const date = new Date(activity.created_at).toDateString();
        if (!dailyActivity[date]) {
          dailyActivity[date] = { views: 0, clicks: 0, bookmarks: 0, reviews: 0 };
        }
        dailyActivity[date][activity.activity_type + 's']++;
      });

      return Object.entries(dailyActivity).map(([date, counts]) => ({
        date,
        ...counts
      }));
    } catch (error) {
      console.error('Error fetching daily activity:', error);
      return [];
    }
  }

  // Track specific actions
  async trackBookmark(toolId) {
    await this.trackToolClick(toolId, 'bookmark');
  }

  async trackReview(toolId) {
    await this.trackToolClick(toolId, 'review');
  }

  async trackWebsiteVisit(toolId) {
    await this.trackToolClick(toolId, 'visit_website');
  }

  async trackToolClick(toolId) {
    await this.trackToolClick(toolId, 'click');
  }
}

export const analyticsService = new AnalyticsService(); 