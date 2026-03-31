import { supabase } from "@/lib/supabase";

export async function logActivity(action: string, details: Record<string, any> = {}) {
  try {
    if (!supabase) return;

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const user = session.user;
    const role = user?.user_metadata?.role || 'user';
    const email = user?.email || 'Unknown User';
    const phone = user?.phone || user?.user_metadata?.phone || '';

    // We enhance details with the user's email so it's easy to read in the logs
    const enhancedDetails = {
      ...details,
      email: email,
      ...(phone ? { phone } : {})
    };

    // Insert into activity_logs
    const { error } = await supabase
      .from('activity_logs')
      .insert([
        {
          user_id: user.id,
          user_role: role,
          action: action,
          details: enhancedDetails
        }
      ]);

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}
