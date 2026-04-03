"use client";

import { useState } from "react";
import { Star, Send, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ReviewFormProps {
  propertyId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ propertyId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please leave a comment.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (!supabase) throw new Error("Supabase client not initialized");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("You must be logged in to post a review.");
        return;
      }

      const { error: insertError } = await supabase
        .from('reviews')
        .insert([
          {
            property_id: propertyId,
            user_id: session.user.id,
            user_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || "User",
            rating,
            comment,
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setRating(0);
      setComment("");
      onReviewSubmitted();
    } catch (err: any) {
      console.error("Error submitting review:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
          <Star size={24} fill="currentColor" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Thank you for your review!</h3>
        <p className="text-emerald-700 text-sm font-medium">Your feedback helps others discover amazing stays.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-[#EC5B13] font-bold text-sm hover:underline"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Write a review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Rate your experience</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform active:scale-95"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  size={32} 
                  className={`transition-colors ${
                    (hover || rating) >= star 
                      ? "fill-[#FFB400] text-[#FFB400]" 
                      : "text-gray-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Your comment</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your stay, the location, and the host..."
            className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#EC5B13] focus:border-transparent outline-none transition-all resize-none text-gray-700 font-medium placeholder:text-gray-400"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-100">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#1A1A24] hover:bg-black text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send size={18} />
              Post Review
            </>
          )}
        </button>
      </form>
    </div>
  );
}
