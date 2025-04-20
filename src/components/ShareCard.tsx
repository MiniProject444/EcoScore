
import React from 'react';
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Instagram, Twitter, MessageSquare, Share2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface ShareCardProps {
  username: string;
  totalEmissions: number;
}

const ShareCard = ({ username, totalEmissions }: ShareCardProps) => {
  const { isAuthenticated } = useAuthStore();
  const websiteUrl = "https://ecoscore-jet.vercel.app/";
  
  if (!isAuthenticated) {
    return null;
  }

  const shareText = `I just calculated my carbon footprint with EcoScore! My monthly impact is ${totalEmissions} kg CO₂e. Join me in tracking and reducing your environmental impact! Visit: ${websiteUrl} #EcoScore #ClimateAction`;

  const handleShare = (platform: 'twitter' | 'instagram' | 'whatsapp') => {
    const encodedText = encodeURIComponent(shareText);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      instagram: `https://instagram.com/share?text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`
    };

    window.open(urls[platform], '_blank');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-primary">EcoScore</h3>
                <p className="text-sm text-muted-foreground">Carbon Footprint Report</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-lg font-medium">{username}'s Impact</p>
                <p className="text-3xl font-bold text-primary">{totalEmissions} kg CO₂e</p>
                <p className="text-sm text-muted-foreground">monthly carbon footprint</p>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>Join me in making a difference!</p>
                <p>Calculate your carbon footprint at ecoscore.com</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={() => handleShare('twitter')}>
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => handleShare('instagram')}>
              <Instagram className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => handleShare('whatsapp')}>
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareCard;
