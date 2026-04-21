import { BROWN } from "@/lib/helper";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler?: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
    confirm_close?: boolean;
    escape?: boolean;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export function useRazorpay() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setLoaded(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initPayment = (
    options: RazorpayOptions,
    onSuccess: (response: RazorpayResponse) => void,
    onFailure: (err?: unknown) => void,
  ) => {
    if (!loaded || !window.Razorpay) {
      onFailure("Razorpay SDK not loaded");
      return;
    }
    try {
      const rzp = new window.Razorpay({
        ...options,
        handler: onSuccess,
        modal: {
          ondismiss: () => onFailure("Payment dismissed by user"),
          confirm_close: true,
          escape: false,
        },
        theme: { color: BROWN },
      });
      rzp.open();
    } catch (err) {
      onFailure(err);
    }
  };

  return { loaded, initPayment };
}