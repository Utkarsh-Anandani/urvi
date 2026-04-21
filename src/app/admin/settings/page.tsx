import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoldDivider, PageHeader } from "../page";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BROWN, LIGHT_BROWN, LIGHT_ORANGE, ORANGE } from "@/lib/helper";

const SettingsPage = () => {
  return (
    <main className="flex-1 overflow-y-auto p-5 lg:p-7">
      <PageHeader
        title="Settings"
        subtitle="Manage your store configuration"
        action={<></>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Store Info */}
        <Card
          className="border-0 shadow-sm"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardHeader className="pt-6 px-6 pb-3">
            <CardTitle
              className="text-base font-semibold text-gray-700"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Store Information
            </CardTitle>
            <GoldDivider />
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            {[
              {
                label: "Store Name",
                placeholder: "My Eco Store",
                value: "Verdant & Gold",
              },
              {
                label: "Store Email",
                placeholder: "store@example.com",
                value: "hello@verdantgold.com",
              },
              {
                label: "Store URL",
                placeholder: "https://",
                value: "https://verdantgold.com",
              },
              {
                label: "Support Phone",
                placeholder: "+91 00000 00000",
                value: "+91 98765 43210",
              },
            ].map((f) => (
              <div key={f.label} className="space-y-1.5">
                <Label
                  className="text-xs uppercase tracking-[0.12em] font-semibold"
                  style={{ color: BROWN, fontFamily: "'Lato', sans-serif" }}
                >
                  {f.label}
                </Label>
                <Input
                  defaultValue={f.value}
                  placeholder={f.placeholder}
                  className="h-10 text-sm rounded-sm border-gray-200 bg-gray-50/60 focus-visible:ring-green-700/20 focus-visible:border-green-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
              </div>
            ))}
            <Button
              className="mt-2 h-9 text-xs uppercase tracking-wider rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                border: "none",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card
          className="border-0 shadow-sm"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardHeader className="pt-6 px-6 pb-3">
            <CardTitle
              className="text-base font-semibold text-gray-700"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Notification Preferences
            </CardTitle>
            <GoldDivider />
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            {[
              {
                label: "New Order Alerts",
                desc: "Get notified when a new order is placed",
                on: true,
              },
              {
                label: "Low Stock Warnings",
                desc: "Alert when product stock falls below 10",
                on: true,
              },
              {
                label: "Customer Sign-ups",
                desc: "Notify on every new customer registration",
                on: false,
              },
              {
                label: "Coupon Redemptions",
                desc: "Track coupon usage in real time",
                on: false,
              },
              {
                label: "Monthly Reports",
                desc: "Receive a monthly performance summary",
                on: true,
              },
            ].map((n) => (
              <div
                key={n.label}
                className="flex items-start justify-between gap-3"
              >
                <div>
                  <p
                    className="text-sm font-semibold text-gray-700"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {n.label}
                  </p>
                  <p
                    className="text-xs text-gray-400 mt-0.5"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {n.desc}
                  </p>
                </div>
                <button
                  className="relative inline-flex h-5 w-9 items-center rounded-full shrink-0 mt-0.5 transition-colors"
                  style={{ background: n.on ? ORANGE : "#d1d5db" }}
                >
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform"
                    style={{
                      transform: n.on ? "translateX(18px)" : "translateX(2px)",
                    }}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card
          className="border-0 shadow-sm"
          style={{ outline: "1px solid #f0f0f0", borderRadius: "4px" }}
        >
          <CardHeader className="pt-6 px-6 pb-3">
            <CardTitle
              className="text-base font-semibold text-gray-700"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Payment Settings
            </CardTitle>
            <GoldDivider />
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            {[
              { label: "Currency", value: "INR — Indian Rupee" },
              { label: "Payment Gateway", value: "Razorpay" },
              { label: "GST Number", value: "27AABCU9603R1ZM" },
            ].map((f) => (
              <div key={f.label} className="space-y-1.5">
                <Label
                  className="text-xs uppercase tracking-[0.12em] font-semibold"
                  style={{ color: ORANGE, fontFamily: "'Lato', sans-serif" }}
                >
                  {f.label}
                </Label>
                <Input
                  defaultValue={f.value}
                  className="h-10 text-sm rounded-sm border-gray-200 bg-gray-50/60 focus-visible:ring-green-700/20 focus-visible:border-green-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
              </div>
            ))}
            <Button
              className="mt-2 h-9 text-xs uppercase tracking-wider rounded-sm"
              style={{
                background: `linear-gradient(135deg, ${BROWN}, ${LIGHT_BROWN})`,
                border: "none",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Update Payment
            </Button>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card
          className="border-0 shadow-sm"
          style={{ outline: "1px solid #fee2e2", borderRadius: "4px" }}
        >
          <CardHeader className="pt-6 px-6 pb-3">
            <CardTitle
              className="text-base font-semibold text-red-500"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Danger Zone
            </CardTitle>
            <div className="h-px bg-red-100 mt-2" />
          </CardHeader>
          <CardContent className="px-6 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Clear All Orders
                </p>
                <p
                  className="text-xs text-gray-400 mt-0.5"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Permanently delete all order history
                </p>
              </div>
              <Button
                variant="outline"
                className="h-8 text-xs rounded-sm border-red-200 text-red-400 hover:bg-red-50"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Delete
              </Button>
            </div>
            <Separator className="bg-red-50" />
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-semibold text-gray-700"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Delete Store
                </p>
                <p
                  className="text-xs text-gray-400 mt-0.5"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  This action cannot be undone
                </p>
              </div>
              <Button
                variant="outline"
                className="h-8 text-xs rounded-sm border-red-300 text-red-500 hover:bg-red-50"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Delete Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SettingsPage;
