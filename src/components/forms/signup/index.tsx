"use client";

import { SignUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutationData } from "@/hooks/useMutationData";
import { SignUpBody } from "@/types/auth.types";
import { AlertCircle, Eye, EyeOff, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, SubmitEvent, useState } from "react";

type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUpForm = () => {
  const [form, setForm] = useState<SignUpForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useMutationData(
    ["signup"],
    SignUpAction,
    undefined,
    (data) => {
      if (data.status === 200 || data.status === 201) {
        router.push("/");
      }
    },
  );

  const handleChange =
    (field: keyof SignUpForm) => (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const passwordMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordMismatch) return;

    const payload: SignUpBody = {
      firstName: form.firstName,
      lastName: form?.lastName || undefined,
      email: form.email,
      password: form.password,
    };

    mutate(payload);
  };

  const inputClass =
    "h-11 text-sm rounded-sm border-gray-200 bg-gray-50/60 transition-all duration-200 " +
    "focus-visible:ring-2 focus-visible:ring-green-800/20 focus-visible:border-green-800 " +
    "placeholder:text-gray-300";
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="px-10 pb-5 space-y-5">
        {/* Name row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="firstName"
              className="text-xs uppercase tracking-[0.14em] font-semibold"
              style={{ color: "#166534", fontFamily: "'Lato', sans-serif" }}
            >
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange("firstName")}
              placeholder="Jane"
              required
              className={inputClass}
              style={{ fontFamily: "'Lato', sans-serif" }}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="lastName"
              className="text-xs uppercase tracking-[0.14em] font-semibold"
              style={{ color: "#166534", fontFamily: "'Lato', sans-serif" }}
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange("lastName")}
              placeholder="Doe"
              required
              className={inputClass}
              style={{ fontFamily: "'Lato', sans-serif" }}
              disabled={isPending}
            />
          </div>
        </div>

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
            value={form.email}
            onChange={handleChange("email")}
            placeholder="you@example.com"
            required
            className={inputClass}
            style={{ fontFamily: "'Lato', sans-serif" }}
            disabled={isPending}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs uppercase tracking-[0.14em] font-semibold"
            style={{ color: "#166534", fontFamily: "'Lato', sans-serif" }}
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              required
              className={`${inputClass} pr-11`}
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

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="confirmPassword"
            className="text-xs uppercase tracking-[0.14em] font-semibold"
            style={{ color: "#166534", fontFamily: "'Lato', sans-serif" }}
          >
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="••••••••"
              required
              className={`${inputClass} pr-11 ${
                passwordMismatch
                  ? "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-200"
                  : ""
              }`}
              style={{ fontFamily: "'Lato', sans-serif" }}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-green-700 transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {passwordMismatch && (
            <p
              className="flex items-center gap-1.5 text-xs text-red-400"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              <AlertCircle size={12} />
              Passwords do not match
            </p>
          )}
        </div>

        {/* Hint */}
        {/* <p
              className="text-xs text-gray-300 leading-relaxed"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Use 8+ characters with letters, numbers & symbols.
            </p> */}
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
            "Create Account"
          )}
        </Button>

        {/* Terms */}
        <p
          className="text-xs text-center text-gray-300 leading-relaxed"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          By signing up you agree to our{" "}
          <a
            href="#"
            style={{
              color: "#B8960C",
              textDecoration: "none",
              borderBottom: "1px solid rgba(184,150,12,0.4)",
            }}
          >
            Terms
          </a>{" "}
          &{" "}
          <a
            href="#"
            style={{
              color: "#B8960C",
              textDecoration: "none",
              borderBottom: "1px solid rgba(184,150,12,0.4)",
            }}
          >
            Privacy Policy
          </a>
        </p>

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
          Already have an account?{" "}
          <a
            href="/signin"
            className="font-semibold hover:opacity-70 transition-opacity"
            style={{
              color: "#166534",
              textDecoration: "none",
              borderBottom: "1px solid rgba(22,101,52,0.4)",
            }}
          >
            Sign in
          </a>
        </p>
      </CardFooter>
    </form>
  );
};

export default SignUpForm;
