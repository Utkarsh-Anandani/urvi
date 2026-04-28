"use client";
import { BROWN, CORMORANT, LATO, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";
import SectionHeading from "../section-heading";
import { StarRating } from "../star-rating";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Quote, Send, ThumbsUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import FileUpload from "@/components/global/file-upload";
import { Textarea } from "@/components/ui/textarea";
import { StarRatingInput } from "../star-input";
import { useMutationData } from "@/hooks/useMutationData";
import { AddReview } from "@/actions/product";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "sonner";
import { CreateReviewBody, Review } from "@/types/product.types";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ImageData = {
  url: string;
  type: "IMAGE" | "VIDEO";
};

type Props = {
  productId: string;
  variantId?: string;
  reviews: Review[];
  reviewCount: number;
  avgRating: number;
  slug: string;
};

type RatingStats = {
  [key: number]: {
    count: number;
    percentage: number;
  };
};

const ReviewsSection = ({
  productId,
  variantId,
  reviews,
  reviewCount,
  avgRating,
  slug,
}: Props) => {
  const [writingReview, setWritingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [comment, setComment] = useState<string>("");
  const { mutate, isPending } = useMutationData(
    ["create-review"],
    AddReview,
    ["product-detail", slug],
    () => {
      setRating(0);
      setComment("");
      setImageData([]);
      setWritingReview(false);
    },
  );
  const { upload, isUploading } = useUpload();

  function getRatingStats(reviews: Review[]): RatingStats {
    const total = reviews.length;

    // Initialize all ratings (1–5)
    const stats: RatingStats = {
      1: { count: 0, percentage: 0 },
      2: { count: 0, percentage: 0 },
      3: { count: 0, percentage: 0 },
      4: { count: 0, percentage: 0 },
      5: { count: 0, percentage: 0 },
    };

    // Count ratings
    for (const review of reviews) {
      if (review.rating >= 1 && review.rating <= 5) {
        stats[review.rating].count++;
      }
    }

    // Calculate percentages
    for (const key in stats) {
      const count = stats[key as unknown as number].count;
      stats[key as unknown as number].percentage =
        total === 0 ? 0 : Math.round((count / total) * 100);
    }

    return stats;
  }

  function getRatingStatsArray(reviews: Review[]) {
    const stats = getRatingStats(reviews);

    return Object.entries(stats)
      .map(([rating, data]) => ({
        rating: Number(rating),
        ...data,
      }))
      .sort((a, b) => b.rating - a.rating);
  }

  const handleFilesUpload = async (files: File[]) => {
    try {
      if (!files?.length) return;

      const filesData = (await upload(files, "reviews")) ?? [];

      // Separate success & failed uploads
      const failedFiles = filesData.filter(
        (file) => !file?.success || !file?.fileURL,
      );

      if (failedFiles.length > 0) {
        toast(`${failedFiles.length} file(s) failed to upload`);
        return;
      }

      const data: ImageData[] = filesData.map((file) => ({
        url: file?.fileURL || "",
        type: "IMAGE",
      }));

      return data;
    } catch (error) {
      console.error("Upload error:", error);
      toast("Something went wrong during file upload");
    }
  };

  const handleFormSubmit = async () => {
    if (!comment.trim() || rating < 0 || rating > 5) {
      toast("Invalid Inputs");
      return;
    }

    const payload: CreateReviewBody = {
      rating,
      comment,
      media: imageData.length > 0 ? imageData : undefined,
      productId,
      variantId,
    };

    mutate(payload);
  };

  const stats = useMemo(() => getRatingStatsArray(reviews), [reviews]);

  return (
    <section
      className="py-6 md:py-16 px-3 md:px-6"
      style={{
        background: "#fdfaf7",
        borderTop: "1px solid #f0e6dc",
        borderBottom: "1px solid #f0e6dc",
      }}
      id="reviews"
    >
      <div className="max-w-5xl mx-auto">
        <SectionHeading>
          What Our{" "}
          <em style={{ color: ORANGE, fontStyle: "italic" }}>Customers Say</em>
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5 lg:gap-10 items-start">
          {/* Summary */}
          <div
            className="relative md:sticky md:top-20 rounded-2xl p-6 text-center"
            style={{ background: "#fff", border: `1px solid #f0e6dc` }}
          >
            <span
              style={{
                fontFamily: CORMORANT,
                fontSize: 72,
                fontWeight: 700,
                color: BROWN,
                lineHeight: 1,
                display: "block",
              }}
            >
              {avgRating.toPrecision(2)}
            </span>
            <div className="flex justify-center my-2">
              <StarRating rating={avgRating} size={20} />
            </div>
            <p
              className="text-xs mb-5"
              style={{ color: "#9a7a6e", fontFamily: LATO }}
            >
              Based on {reviewCount} reviews
            </p>

            {stats.map((s) => (
              <div key={s.rating} className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs w-7 text-right shrink-0"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  {s.rating}★
                </span>

                <Progress
                  value={s.percentage}
                  className="flex-1 h-2"
                  style={
                    {
                      background: LIGHTER_ORANGE,
                      "--progress-fill": ORANGE,
                    } as React.CSSProperties
                  }
                />

                <span
                  className="text-xs w-7 shrink-0"
                  style={{ color: "#9a7a6e", fontFamily: LATO }}
                >
                  {s.percentage}%
                </span>
              </div>
            ))}

            <Button
              onClick={() => setWritingReview(true)}
              variant="outline"
              className="w-full mt-4 text-sm font-bold"
              style={{
                borderColor: BROWN,
                color: BROWN,
                fontFamily: LATO,
                borderWidth: 2,
              }}
            >
              Write a Review
            </Button>
          </div>

          {/* Review Cards */}
          <div className="flex flex-col gap-4">
            {writingReview && (
              <Card
                className="border"
                style={{ borderColor: "#f0e6dc", background: "#fff" }}
              >
                <CardContent className="px-5 py-1">
                  <div className="flex flex-col gap-3">
                    <SectionHeading className="text-left text-2xl! mb-1!">
                      Add a{" "}
                      <em style={{ color: ORANGE, fontStyle: "italic" }}>
                        Review
                      </em>
                    </SectionHeading>
                    <StarRatingInput
                      value={rating}
                      onChange={(value: number) => setRating(value)}
                    />
                    <FileUpload
                      id="images"
                      accept="image/*"
                      variant="compact"
                      disabled={isUploading || isPending}
                      multiple
                      onChange={async (files: File[]) => {
                        const data = await handleFilesUpload(files);
                        setImageData(data || []);
                      }}
                    />
                    <div className="flex flex-row items-end gap-3">
                      <Textarea
                        value={comment}
                        disabled={isPending}
                        onChange={(e) => setComment(e.target.value)}
                        rows={5}
                        id="description"
                        name="description"
                        placeholder="The product is excellent, and the packaging is awesome..."
                      />
                      <Button
                        onClick={handleFormSubmit}
                        disabled={isPending || isUploading}
                        style={{ backgroundColor: ORANGE }}
                        className="flex items-center justify-center text-white"
                      >
                        <Send size={20} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {reviews.map((r, i) => (
              <Card
                key={i}
                className="border"
                style={{ borderColor: "#f0e6dc", background: "#fff" }}
              >
                <CardContent className="px-5 py-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p
                        className="font-bold text-sm"
                        style={{ color: BROWN, fontFamily: LATO }}
                      >
                        {r.user.firstName}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#9a7a6e", fontFamily: LATO }}
                      >
                        {r.createdAt.toDateString()}
                      </p>
                    </div>
                    <StarRating rating={r.rating} size={14} />
                  </div>

                  <div className="flex gap-2 mb-2">
                    <Quote
                      size={14}
                      style={{
                        color: LIGHTER_ORANGE,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    />
                    <p
                      className="font-bold text-sm"
                      style={{ color: BROWN, fontFamily: LATO }}
                    >
                      {r.comment}
                    </p>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                      {r.media.map((m, i) => <Dialog key={i}>
                        <DialogTrigger>
                          <img className="w-14 h-14 rounded-sm" src={m.url} alt={m.type} />
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-screen">
                          <DialogTitle className="text-2xl text-black">Image {i + 1}</DialogTitle>
                          <img className="w-full h-full" src={m.url} alt={m.type} />
                        </DialogContent>
                      </Dialog>)}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <Badge
                      variant="secondary"
                      className="text-xs gap-1"
                      style={{
                        background: "#e8f5e9",
                        color: "#2d6a4f",
                        fontFamily: LATO,
                      }}
                    >
                      <Check size={11} />
                      Verified Purchase
                    </Badge>
                    <button
                      className="flex items-center gap-1.5 text-xs transition-colors hover:text-orange-500"
                      style={{ color: "#9a7a6e", fontFamily: LATO }}
                    >
                      <ThumbsUp size={13} />
                      Helpful ({r.likes})
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
           {reviews.length === 0 && !writingReview && <div className="w-full h-full flex items-center justify-center"><h2 style={{ fontFamily: CORMORANT }} className="text-lg text-center font-semibold">No reviews yet, start by writing a review...</h2></div>}

            {/* <Button
              variant="outline"
              className="self-center px-10 mt-2 font-bold text-sm"
              style={{
                borderColor: ORANGE,
                color: ORANGE,
                fontFamily: LATO,
                borderWidth: 2,
              }}
            >
              Load More Reviews
            </Button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
