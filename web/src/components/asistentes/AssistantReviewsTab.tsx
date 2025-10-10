"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface RatingBreakdown {
  stars: number;
  count: number;
  percentage: number;
}

interface AssistantReviewsTabProps {
  rating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown[];
  reviews: Review[];
}

export function AssistantReviewsTab({
  rating,
  totalReviews,
  ratingBreakdown,
  reviews,
}: AssistantReviewsTabProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{rating}</div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{totalReviews} reseñas</p>
            </div>
            
            <div className="flex-1 space-y-2">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-8">{item.stars}★</span>
                  <Progress value={item.percentage} className="flex-1" />
                  <span className="w-8 text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium">{review.userName}</h4>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm mb-2 text-muted-foreground">{review.comment}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(review.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
