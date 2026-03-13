"use client";
import { SignInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutationData } from "@/hooks/useMutationData";
import { SignInBody } from "@/types/auth.types";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useMutationData(
    ["signin"],
    SignInAction,
    undefined,
    (data) => {
      if (data.status === 200 || data.status === 201) {
        router.push("/");
      }
    },
  );

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: handle sign in

    const payload: SignInBody = {
      email: email,
      password: password,
    };

    mutate(payload);
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="px-10 pb-0 space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs uppercase tracking-[0.14em] font-semibold"
            style={{ color: "#166534", fontFamily: "'Lato', sans-serif" }}
          >
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="h-11 text-sm rounded-sm border-gray-200 bg-gray-50/60
                           focus-visible:ring-2 focus-visible:ring-green-800/20 focus-visible:border-green-800
                           placeholder:text-gray-300 transition-all duration-200"
            style={{ fontFamily: "'Lato', sans-serif" }}
            disabled={isPending}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs uppercase tracking-[0.14em] font-semibold"
              style={{ color: "#166534", fontFamily: "'Lato', sans-serif" }}
            >
              Password
            </Label>
            <a
              href="#"
              className="text-xs hover:opacity-70 transition-opacity"
              style={{
                color: "#B8960C",
                fontFamily: "'Lato', sans-serif",
                borderBottom: "1px solid rgba(184,150,12,0.4)",
                textDecoration: "none",
                lineHeight: "1.7",
              }}
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 text-sm rounded-sm border-gray-200 bg-gray-50/60 pr-11
                             focus-visible:ring-2 focus-visible:ring-green-800/20 focus-visible:border-green-800
                             placeholder:text-gray-300 transition-all duration-200"
              style={{ fontFamily: "'Lato', sans-serif" }}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-green-700 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-10 pt-6 pb-10 flex-col gap-4">
        <Button
          type="submit"
          className="w-full h-11 text-xs uppercase tracking-[0.18em] font-semibold rounded-sm
                         hover:opacity-90 active:scale-[0.99] transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #166534 0%, #16a34a 100%)",
            boxShadow: "0 4px 20px rgba(22,101,52,0.28)",
            fontFamily: "'Lato', sans-serif",
            border: "none",
            color: "#fff",
          }}
          disabled={isPending}
        >
          {isPending ? (
            <Loader className="animate-spin" size={16} color="#ffffff" />
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="flex items-center gap-3 w-full">
          <Separator className="flex-1 bg-gray-100" />
          <span
            className="text-xs text-gray-300"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            or
          </span>
          <Separator className="flex-1 bg-gray-100" />
        </div>

        <p
          className="text-sm text-center text-gray-400"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold hover:opacity-70 transition-opacity"
            style={{
              color: "#166534",
              textDecoration: "none",
              borderBottom: "1px solid rgba(22,101,52,0.4)",
            }}
          >
            Create one
          </a>
        </p>
      </CardFooter>
    </form>
  );
};

export default SignInForm;
