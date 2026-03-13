"use client";

import SignUpForm from "@/components/forms/signup";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf } from "lucide-react";

const SignUpPage = () => {
  return (
    <Card
      className="w-full max-w-lg border-0"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        outline: "1px solid rgba(184,150,12,0.22)",
        borderRadius: "4px",
        boxShadow: "0 8px 64px rgba(0,0,0,0.08), 0 1px 0 rgba(184,150,12,0.18)",
      }}
    >
      <CardHeader className="items-center justify-center flex flex-col text-center pb-0 pt-10 px-10">
        {/* Brand mark */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{
            background: "linear-gradient(135deg, #166534 0%, #16a34a 100%)",
            boxShadow: "0 4px 20px rgba(22,101,52,0.35)",
          }}
        >
          <Leaf size={22} color="#ffffff" strokeWidth={2} />
        </div>

        <CardTitle
          className="text-3xl font-light uppercase tracking-[0.2em]"
          style={{ color: "#111827" }}
        >
          Create Account
        </CardTitle>
        <CardDescription
          className="text-sm tracking-wide mt-1"
          style={{
            color: "#9ca3af",
            fontFamily: "'Lato', sans-serif",
            fontWeight: 400,
          }}
        >
          Join us — it only takes a moment
        </CardDescription>
      </CardHeader>

      {/* Gold ornament divider */}
      <div className="flex items-center gap-3 px-10 my-6">
        <div
          className="h-px flex-1"
          style={{
            background: "linear-gradient(to right, transparent, #B8960C70)",
          }}
        />
        <svg width="12" height="12" viewBox="0 0 16 16" fill="#B8960C">
          <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" />
        </svg>
        <div
          className="h-px flex-1"
          style={{
            background: "linear-gradient(to left, transparent, #B8960C70)",
          }}
        />
      </div>

      <SignUpForm />
    </Card>
  );
};

export default SignUpPage;
