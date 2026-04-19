import { useState } from "react";
import {
  BROWN,
  CORMORANT,
  LATO,
  LIGHT_BROWN,
  LIGHTER_ORANGE,
  ORANGE,
} from "@/lib/helper";
import {
  Building2,
  Edit2,
  Home,
  Loader,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AddNewAddressType,
  GetAllAddressesReturnType,
} from "@/types/user.types";
import { useQueryData } from "@/hooks/useQueryData";
import { AddNewAddress, GetAllAddresses } from "@/actions/user";
import { toast } from "sonner";
import { useMutationData } from "@/hooks/useMutationData";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AddressesTab = () => {
  const [mode, setMode] = useState<"saved" | "new">("saved");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isFetching, isFetched } = useQueryData(["user-addresses"], () =>
    GetAllAddresses(),
  );
  const { data: addresses } = data as GetAllAddressesReturnType;

  const { mutate, isPending } = useMutationData(
    ["add-address"],
    AddNewAddress,
    ["user-addresses"],
    () => {
      toast("Success", { description: "New address added" });
      setMode("saved");
    },
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter valid 10-digit mobile";
    if (!form.line1.trim()) e.line1 = "Address line 1 is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.state.trim()) e.state = "State is required";
    if (!form.country.trim()) e.country = "Country is required";
    if (!/^\d{6}$/.test(form.postalCode))
      e.postalCode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddAddress = () => {
    if (!validate) return;

    const payload: AddNewAddressType = {
      fullName: form.fullName,
      phone: form.phone,
      line1: form.line1,
      line2: form.line2,
      city: form.city,
      state: form.state,
      country: form.country,
      postalCode: form.postalCode,
      isDefault: addresses.length === 0 ? true : false,
    };

    mutate(payload);
  };

  const inputStyle = (field: string) => ({
    borderColor: errors[field] ? "#e74c3c" : "#f0e6dc",
    fontFamily: LATO,
    color: BROWN,
    background: "#fdfaf7",
    fontSize: "14px",
  });

  const [selectedId, setSelectedId] = useState<string | null>(
    addresses && addresses.length > 0 ? addresses[0].id : null,
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Toggle */}
      <div
        className="flex rounded-xl overflow-hidden p-1 gap-1"
        style={{ background: LIGHTER_ORANGE }}
      >
        {(["saved", "new"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: mode === m ? "#fff" : "transparent",
              color: mode === m ? BROWN : LIGHT_BROWN,
              fontFamily: LATO,
              boxShadow: mode === m ? `0 2px 8px rgba(85,19,5,0.1)` : "none",
            }}
          >
            {m === "saved" ? "Saved Addresses" : "+ Add New Address"}
          </button>
        ))}
      </div>

      {mode === "saved" ? (
        <div className="flex flex-col gap-3">
            {addresses?.length ? (
              addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start gap-3 rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm"
                  style={{
                    border: `2px solid ${selectedId === addr.id ? ORANGE : "#f0e6dc"}`,
                    background: selectedId === addr.id ? "#fff9f4" : "#fdfaf7",
                  }}
                  onClick={() => setSelectedId(addr.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-bold text-sm"
                        style={{ color: BROWN, fontFamily: LATO }}
                      >
                        {addr.name}
                      </span>
                      {addr.isDefault && (
                        <Badge
                          style={{
                            background: "#e8f5e9",
                            color: "#2d6a4f",
                            fontFamily: LATO,
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "1px 8px",
                          }}
                        >
                          Default
                        </Badge>
                      )}
                    </div>
                    <p
                      className="text-sm leading-6"
                      style={{ color: "#6b5a52", fontFamily: LATO }}
                    >
                      {addr.line1}
                      {addr.line2 && `, ${addr.line2}`}, {addr.city},{" "}
                      {addr.state} – {addr.postalCode}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "#9a7a6e", fontFamily: LATO }}
                    >
                      📞 +91 {addr.phone}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm font-medium text-center">
                No saved address found, Start by adding a new address
              </div>
            )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <Label
                className="text-xs font-bold uppercase tracking-wide mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                Full Name *
              </Label>
              <Input
                placeholder="Aarav Sharma"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                style={inputStyle("fullName")}
              />
              {errors.fullName && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#e74c3c", fontFamily: LATO }}
                >
                  {errors.fullName}
                </p>
              )}
            </div>
            {/* Phone */}
            <div>
              <Label
                className="text-xs font-bold uppercase tracking-wide mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                Mobile Number *
              </Label>
              <div className="flex gap-2">
                <div
                  className="flex items-center px-3 rounded-xl text-sm font-bold shrink-0"
                  style={{
                    background: LIGHTER_ORANGE,
                    color: BROWN,
                    fontFamily: LATO,
                    border: "1.5px solid #f0e6dc",
                  }}
                >
                  +91
                </div>
                <Input
                  placeholder="9876543210"
                  value={form.phone}
                  maxLength={10}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  style={inputStyle("phone")}
                />
              </div>
              {errors.phone && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#e74c3c", fontFamily: LATO }}
                >
                  {errors.phone}
                </p>
              )}
            </div>
            {/* Line 1 */}
            <div className="col-span-2">
              <Label
                className="text-xs font-bold uppercase tracking-wide mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                Address Line 1 *
              </Label>
              <Input
                placeholder="Flat/House No., Building, Street"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                style={inputStyle("line1")}
              />
              {errors.line1 && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#e74c3c", fontFamily: LATO }}
                >
                  {errors.line1}
                </p>
              )}
            </div>
            {/* Line 2 */}
            <div className="col-span-2">
              <Label
                className="text-xs font-bold uppercase tracking-wide mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                Address Line 2{" "}
                <span style={{ color: "#9a7a6e", fontWeight: 400 }}>
                  (Optional)
                </span>
              </Label>
              <Input
                placeholder="Landmark, Area"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                style={inputStyle("line2")}
              />
            </div>
            {/* City */}
            <div>
              <Label
                className="text-xs font-bold uppercase tracking-wide mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                City *
              </Label>
              <Input
                placeholder="Indore"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                style={inputStyle("city")}
              />
              {errors.city && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#e74c3c", fontFamily: LATO }}
                >
                  {errors.city}
                </p>
              )}
            </div>
            {/* State */}
            <div>
              <Label
                className="text-xs font-bold uppercase tracking-wide mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                State *
              </Label>
              <Input
                placeholder="Madhya Pradesh"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                style={inputStyle("state")}
              />
              {errors.state && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#e74c3c", fontFamily: LATO }}
                >
                  {errors.state}
                </p>
              )}
            </div>
            {/* Country */}
            <div>
              <Label
                className="text-xs font-bold uppercase tracking-wide mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                Country *
              </Label>
              <Input
                placeholder="India"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                style={inputStyle("country")}
              />
              {errors.country && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#e74c3c", fontFamily: LATO }}
                >
                  {errors.country}
                </p>
              )}
            </div>
            {/* Pincode */}
            <div>
              <Label
                className="text-xs font-bold uppercase tracking-wide mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                Pincode *
              </Label>
              <Input
                placeholder="452001"
                value={form.postalCode}
                maxLength={6}
                onChange={(e) =>
                  setForm({
                    ...form,
                    postalCode: e.target.value.replace(/\D/g, ""),
                  })
                }
                style={inputStyle("postalCode")}
              />
              {errors.postalCode && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "#e74c3c", fontFamily: LATO }}
                >
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>
          <Button
            disabled={isPending}
            onClick={handleAddAddress}
            className="w-full h-12 font-bold text-sm tracking-wide uppercase mt-1"
            style={{
              background: `linear-gradient(135deg, ${BROWN} 0%, ${LIGHT_BROWN} 100%)`,
              color: "#fff",
              fontFamily: LATO,
              border: "none",
              boxShadow: `0 8px 24px rgba(85,19,5,0.25)`,
            }}
          >
            {isPending ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              "Save Address"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddressesTab;
