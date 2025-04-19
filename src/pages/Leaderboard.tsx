
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Medal } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  total_emissions: number;
  name: string;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Get leaderboard data
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('leaderboard')
          .select('user_id, total_emissions')
          .order('total_emissions', { ascending: true });

        if (leaderboardError) throw leaderboardError;
        
        // If we have leaderboard entries, get the profile data for each user
        if (leaderboardData && leaderboardData.length > 0) {
          // Get all user profiles in one query
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name')
            .in('id', leaderboardData.map(entry => entry.user_id));
            
          if (profilesError) throw profilesError;
          
          // Create a map of user_id to name for easy lookup
          const profileMap = new Map();
          profilesData?.forEach(profile => {
            profileMap.set(profile.id, profile.name);
          });
          
          // Combine the leaderboard data with profile names
          const combinedData = leaderboardData.map(entry => ({
            user_id: entry.user_id,
            total_emissions: entry.total_emissions,
            name: profileMap.get(entry.user_id) || 'Anonymous User'
          }));
          
          setUsers(combinedData);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading leaderboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Carbon Footprint Leaderboard</h1>
      <div className="max-w-2xl mx-auto space-y-4">
        {users.length === 0 ? (
          <Card className="border">
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground py-8">
                No entries in the leaderboard yet. Start tracking your carbon footprint!
              </p>
            </CardContent>
          </Card>
        ) : (
          users.map((user, index) => (
            <Card key={user.user_id} className={`${index < 3 ? 'border-2 border-primary' : ''}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 text-center">
                    {index < 3 && (
                      <Medal className={`h-6 w-6 ${
                        index === 0 ? 'text-yellow-500' :
                        index === 1 ? 'text-gray-400' :
                        'text-amber-600'
                      }`} />
                    )}
                    {index >= 3 && <span className="text-gray-500">#{index + 1}</span>}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.total_emissions.toFixed(1)} kg CO₂e
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
