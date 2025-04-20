
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Medal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LeaderboardEntry {
  user_id: string;
  total_emissions: number;
  name: string;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Get leaderboard data first
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboard')
        .select('user_id, total_emissions')
        .order('total_emissions', { ascending: true });

      if (leaderboardError) {
        console.error('Error fetching leaderboard:', leaderboardError);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // If we have leaderboard data, fetch the corresponding profiles
      if (leaderboardData && leaderboardData.length > 0) {
        // Extract all user IDs from the leaderboard data
        const userIds = leaderboardData.map(entry => entry.user_id);
        
        // Fetch all profiles that match these user IDs in a single query
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', userIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          toast({
            title: "Warning",
            description: "Some user names may not display correctly",
            variant: "destructive"
          });
        }
        
        // Create a map of user_id to name from the profiles data
        const profileMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profileMap.set(profile.id, profile.name);
          });
        }
        
        // Combine the leaderboard data with profile names
        const combinedData = leaderboardData.map(entry => {
          // Get the name from the profileMap or use 'Anonymous User' as fallback
          const userName = profileMap.get(entry.user_id);
          return {
            user_id: entry.user_id,
            total_emissions: entry.total_emissions,
            name: userName || 'Anonymous User'
          };
        });
        
        console.log('Formatted leaderboard data:', combinedData);
        setUsers(combinedData);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error in leaderboard processing:', error);
      toast({
        title: "Error",
        description: "Something went wrong loading the leaderboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
