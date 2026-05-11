import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sparkles, TrendingUp, Users, ArrowRight, Shield, Zap, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/pixels/components/ui/card';
import { Button } from '@/pixels/components/ui/button';
import { Badge } from '@/pixels/components/ui/badge';
import { Separator } from '@/pixels/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/pixels/components/ui/tooltip';
import TickerSlider from '../components/TickerSlider';
import { CITY, CATEGORIES } from '@/pixels/lib/mockData';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen hero-gradient">
      {/* Ticker */}
      <TickerSlider />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          {/* Live badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-green-50 text-green-700 border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2 pulse-dot" />
            Live in {CITY.name} — {CITY.vendor_count}+ vendors already listed
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Discover Local Deals in
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> {CITY.name}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Browse 1000+ local businesses in one pixel grid. Equal pixels, equal opportunity for every business.
          </p>

          {/* City Card */}
          <Card
            className="max-w-md mx-auto cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] border-0 shadow-xl bg-white/90 backdrop-blur-sm"
            onClick={() => navigate('/pixels/city/indore')}
            data-testid="indore-city-card"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-gray-900">{CITY.name}</h2>
                  <p className="text-sm text-muted-foreground">{CITY.state}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="flex justify-center gap-3 mb-4">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                  <Users className="w-3.5 h-3.5" />
                  {CITY.vendor_count} Vendors
                </Badge>
                <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {CITY.category_count} Categories
                </Badge>
              </div>

              {/* Category color strip */}
              <div className="flex gap-1 justify-center mb-2">
                {CATEGORIES.map((cat) => (
                  <Tooltip key={cat.slug}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-6 h-2 rounded-full cursor-pointer hover:scale-125 transition-transform"
                        style={{ backgroundColor: cat.primary_color }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{cat.emoji} {cat.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>

            <CardFooter className="pt-0">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 text-base shadow-lg hover:shadow-xl transition-all">
                Explore Deals
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Separator className="my-16 max-w-3xl mx-auto" />

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-2">
                <Shield className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Equal Opportunity</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every business gets the same pixel size. No bias, no favorites — from chai tapri to tech startup, same stage, same visibility.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-2">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Hot Deals Daily</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Discover trending deals from restaurants, salons, gyms, and more across {CITY.name}. Updated by vendors in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-2">
                <MessageCircle className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Direct Connect</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tap to connect via WhatsApp instantly. No middleman, no commissions — talk directly to the business owner.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Strip */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-default">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {CITY.total_pixels.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total Pixels</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>200 pixels per category × 9 categories</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-default">
                <div className="text-3xl font-extrabold text-green-600">{CITY.category_count}</div>
                <div className="text-sm text-muted-foreground mt-1">Categories</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Fashion, Food, Medical, Spa, Gym, Events, Startups, Talents, Misc</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-default">
                <div className="text-3xl font-extrabold text-amber-600">₹499</div>
                <div className="text-sm text-muted-foreground mt-1">Starting Price/Year</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Standard pixel for Startups, Talents & Misc categories</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator className="my-16 max-w-3xl mx-auto" />

        {/* CTA */}
        <div className="text-center animate-fade-in">
          <p className="text-muted-foreground mb-5 text-lg">Are you a business owner in {CITY.name}?</p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-6 text-base shadow-xl hover:shadow-2xl transition-all"
          >
            <Zap className="w-5 h-5 mr-2" />
            Become a Vendor — Starting ₹499/year
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            No commission on sales • 1 year validity • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
