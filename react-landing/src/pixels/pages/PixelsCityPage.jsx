import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Users, Crown, Star, BarChart3, Info } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/pixels/components/ui/tabs';
import { Badge } from '@/pixels/components/ui/badge';
import { Card, CardContent } from '@/pixels/components/ui/card';
import { Progress } from '@/pixels/components/ui/progress';
import { Separator } from '@/pixels/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/pixels/components/ui/scroll-area';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/pixels/components/ui/tooltip';
import TickerSlider from '../components/TickerSlider';
import PixelGrid from '../components/PixelGrid';
import { CITY, CATEGORIES, generateCategoryPixels } from '@/pixels/lib/mockData';

const CityPage = () => {
  const { citySlug } = useParams();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].slug);

  // Generate grid data for active category
  const gridData = useMemo(() => {
    return generateCategoryPixels(activeCategory);
  }, [activeCategory]);

  const activeInfo = CATEGORIES.find((c) => c.slug === activeCategory);
  const fillPercent = gridData ? Math.round(((100 - gridData.available_pixels) / 100) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Ticker Slider */}
      <TickerSlider />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{CITY.name}</h1>
              <span className="text-sm text-muted-foreground">{CITY.state}</span>
            </div>
          </div>

          {/* Equal opportunity banner */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 shadow-none">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-gray-700">
                  <span className="font-semibold text-blue-600">Equal Opportunity Platform</span>
                  {' • '}
                  Every business gets the same pixel size. From chai tapri to tech startup — same stage, same visibility.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b sticky top-[38px] z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <ScrollArea className="w-full">
              <TabsList className="h-12 bg-transparent p-0 gap-1 w-max">
                {CATEGORIES.map((category) => {
                  const isActive = activeCategory === category.slug;
                  return (
                    <TabsTrigger
                      key={category.slug}
                      value={category.slug}
                      className="data-[state=active]:shadow-md px-4 py-2 rounded-lg font-semibold text-sm transition-all data-[state=active]:text-white border-0"
                      style={{
                        backgroundColor: isActive ? category.primary_color : undefined,
                        color: isActive ? 'white' : undefined,
                      }}
                      data-testid={`category-tab-${category.slug}`}
                    >
                      <span className="mr-1.5">{category.emoji}</span>
                      {category.name}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </Tabs>
        </div>
      </div>

      {/* Grid Content */}
      <div className="container mx-auto px-4 py-6">
        {gridData && (
          <>
            {/* Grid Stats */}
            <Card className="mb-5 border-0 shadow-md">
              <CardContent className="py-4 px-5">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activeInfo?.primary_color }}
                    />
                    <span className="font-semibold text-gray-900">{activeInfo?.name}</span>
                  </div>

                  <Separator orientation="vertical" className="h-5 hidden md:block" />

                  <div className="flex items-center gap-3 text-sm">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="gap-1.5 px-3 py-1 border-green-200 text-green-700 bg-green-50 cursor-default">
                          <BarChart3 className="w-3 h-3" />
                          {gridData.available_pixels}/100 Available
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open pixel slots that vendors can purchase</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="gap-1.5 px-3 py-1 border-purple-200 text-purple-700 bg-purple-50 cursor-default">
                          <Crown className="w-3 h-3" />
                          {gridData.elite_available} Elite
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Floor 1 (Rows 1-3) — Highest visibility</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="gap-1.5 px-3 py-1 border-amber-200 text-amber-700 bg-amber-50 cursor-default">
                          <Star className="w-3 h-3" />
                          {gridData.premium_available} Premium
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Floor 2 (Rows 4-6) — High visibility</p>
                      </TooltipContent>
                    </Tooltip>

                    <Badge variant="outline" className="gap-1.5 px-3 py-1 border-blue-200 text-blue-700 bg-blue-50">
                      <Info className="w-3 h-3" />
                      {gridData.standard_available} Standard
                    </Badge>
                  </div>

                  <Separator orientation="vertical" className="h-5 hidden md:block" />

                  {/* Fill progress */}
                  <div className="flex items-center gap-3 flex-1 min-w-[160px]">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{fillPercent}% filled</span>
                    <Progress value={fillPercent} className="h-2 flex-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pixel Grid */}
            <PixelGrid
              gridData={gridData}
              categorySlug={activeCategory}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CityPage;
