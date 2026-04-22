import { useRef, useState } from "react";
import {
  BROWN,
  CORMORANT,
  LATO,
  LIGHT_BROWN,
  LIGHT_ORANGE,
  LIGHTER_ORANGE,
  ORANGE,
} from "@/lib/helper";
import Image from "next/image";
import {
  Calendar,
  Camera,
  Check,
  Edit2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  RefreshCw,
  Save,
  User,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Profile, UpdateUserProfileType } from "@/types/user.types";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useMutationData } from "@/hooks/useMutationData";
import { UpdateUserProfile } from "@/actions/user";
import { useUpload } from "@/hooks/useUpload";
import { toast } from "sonner";

function EditableField({
  label,
  value,
  type = "text",
  icon,
  options,
  multiline,
  onSave,
  placeholder,
}: {
  label: string;
  value: string;
  type?: string;
  icon?: React.ReactNode;
  options?: { value: string; label: string }[];
  multiline?: boolean;
  onSave: (v: string) => void;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [show, setShow] = useState(false);

  const handleSave = () => {
    onSave(draft);
    setEditing(false);
  };
  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const inputStyle = {
    borderColor: "#f0e6dc",
    fontFamily: LATO,
    color: BROWN,
    background: "#fdfaf7",
    fontSize: "14px",
  };

  return (
    <div className="group flex flex-col gap-1.5">
      <Label
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "#9a7a6e", fontFamily: LATO }}
      >
        {label}
      </Label>
      {editing ? (
        <div className="flex gap-2">
          <div className="flex-1">
            {multiline ? (
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                style={inputStyle}
                className="resize-none"
              />
            ) : options ? (
              <Select value={draft} onValueChange={setDraft}>
                <SelectTrigger style={inputStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((o) => (
                    <SelectItem
                      key={o.value}
                      value={o.value}
                      style={{ fontFamily: LATO }}
                    >
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : type === "date" ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-full text-left px-3 py-2 rounded-md border"
                    style={inputStyle}
                  >
                    {draft ? format(new Date(draft), "PPP") : "Pick a date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarPicker
                    mode="single"
                    selected={draft ? new Date(draft) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setDraft(date.toISOString());
                      }
                    }}
                    disabled={(date) => date > new Date()}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <div className="relative">
                <Input
                  value={draft}
                  type={type === "password" && !show ? "password" : "text"}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={placeholder}
                  style={inputStyle}
                />
                {type === "password" && (
                  <button
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "#9a7a6e" }}
                  >
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={handleSave}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: "#e8f5e9",
                color: "#2d6a4f",
                border: "1px solid #a8d5b5",
              }}
            >
              <Check size={15} />
            </button>
            <button
              onClick={handleCancel}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              style={{
                background: "#ffeaea",
                color: "#c0392b",
                border: "1px solid #f5c6c6",
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-text transition-all hover:shadow-sm group-hover:border-orange-200"
          style={{ background: "#fdfaf7", border: "1.5px solid #f0e6dc" }}
          onClick={() => {
            setDraft(value);
            setEditing(true);
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <span style={{ color: LIGHT_ORANGE, flexShrink: 0 }}>{icon}</span>
            )}
            <span
              className="text-sm truncate"
              style={{
                color: value ? BROWN : "#b0a09a",
                fontFamily: LATO,
                fontWeight: value ? 500 : 400,
              }}
            >
              {type === "password"
                ? "••••••••••"
                : value || placeholder || "Not set"}
            </span>
          </div>
          <Edit2
            size={13}
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: ORANGE }}
          />
        </div>
      )}
    </div>
  );
}

function AvatarUploader({
  profile,
  onUpdate,
}: {
  profile: Profile;
  onUpdate: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const { upload, isUploading } = useUpload();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const files = [file];
    const filesData = (await upload(files, "profile")) ?? [];
    if (filesData.length === 0) {
      toast("Error", { description: "Cannot update profile image" });
      return;
    }

    const url = filesData[0].fileURL;

    if(!url) {
      toast("Error", { description: "Cannot update profile image" });
      return;
    }
    toast("Success", { description: "Image uploaded successfully!!" });
    onUpdate(url);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar ring */}
      <div
        className="relative group cursor-pointer"
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
      >
        {/* Animated outer ring */}
        <div
          className="w-36 h-36 rounded-full p-1 transition-all"
          style={{
            background: dragging
              ? `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`
              : `linear-gradient(135deg, ${LIGHTER_ORANGE} 0%, ${LIGHT_ORANGE} 50%, ${ORANGE} 100%)`,
            boxShadow: `0 0 0 4px #fff, 0 0 0 6px ${LIGHTER_ORANGE}, 0 8px 32px rgba(85,19,5,0.2)`,
          }}
        >
          <div
            className="w-full h-full rounded-full overflow-hidden relative"
            style={{ background: LIGHTER_ORANGE }}
          >
            {profile.image ? (
              <Image
                src={profile.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${LIGHTER_ORANGE}, #ffe8d0)`,
                }}
              >
                <span
                  style={{
                    fontFamily: CORMORANT,
                    fontSize: 42,
                    fontWeight: 700,
                    color: BROWN,
                  }}
                >
                  {profile.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(85,19,5,0.55)" }}
            >
              <Camera size={22} color="#fff" />
              <span
                className="text-xs font-bold mt-1"
                style={{ color: "#fff", fontFamily: LATO }}
              >
                Change
              </span>
            </div>
          </div>
        </div>

        {/* Camera badge */}
        <button
          className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
          style={{
            background: ORANGE,
            color: "#fff",
            border: "2.5px solid #fff",
          }}
          onClick={(e) => {
            e.stopPropagation();
            fileRef.current?.click();
          }}
        >
          <Camera size={15} />
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
        disabled={isUploading}
      />

      <p
        className="text-xs mt-3"
        style={{ color: "#9a7a6e", fontFamily: LATO }}
      >
        Click or drag & drop to change photo
      </p>
    </div>
  );
}

const PersonalInfoTab = ({ profile }: { profile: Profile }) => {
  const [form, setForm] = useState({
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    dob: profile?.dob || new Date(),
    gender: profile.gender || "OTHERS",
    image: profile.image || "",
  });

  const { mutate, isPending } = useMutationData(
    ["update-profile"],
    UpdateUserProfile,
    ["user-profile"],
  );

  const handleSave = () => {
    const payload: UpdateUserProfileType = {
      firstName: form.firstName,
      lastName: form.lastName.trim() ? form.lastName : undefined,
      email: form.email,
      phone: form.phone.trim() ? form.phone : undefined,
      dob: form.dob ? form.dob.toString() : undefined,
      gender: form.gender.trim() ? form.gender : undefined,
      image: form.image.trim() ? form.image : undefined,
    };

    mutate(payload);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar section */}
      <div
        className="flex flex-col items-center gap-2 py-6 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${LIGHTER_ORANGE}55 0%, #fff 100%)`,
          border: "1px solid #f0e6dc",
        }}
      >
        <AvatarUploader
          profile={{ ...profile, image: form.image }}
          onUpdate={(url) => setForm((prev) => ({ ...prev, image: url }))}
        />

        <div className="text-center mt-2">
          <p
            style={{
              fontFamily: CORMORANT,
              fontSize: 22,
              fontWeight: 600,
              color: BROWN,
            }}
          >
            {form.firstName} {form.lastName}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: "#9a7a6e", fontFamily: LATO }}
          >
            Member since{" "}
            {new Date(profile.createdAt).toLocaleString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-2 gap-4">
        <EditableField
          label="First Name"
          value={form.firstName}
          icon={<User size={14} />}
          onSave={(v) => setForm((prev) => ({ ...prev, firstName: v }))}
          placeholder="First name"
        />

        <EditableField
          label="Last Name"
          value={form.lastName}
          icon={<User size={14} />}
          onSave={(v) => setForm((prev) => ({ ...prev, lastName: v }))}
          placeholder="Last name"
        />
        <div className="col-span-2">
          <EditableField
            label="Email Address"
            value={form.email}
            type="email"
            icon={<Mail size={14} />}
            onSave={(v) => setForm((prev) => ({ ...prev, email: v }))}
            placeholder="your@email.com"
          />
        </div>
        <EditableField
          label="Mobile Number"
          value={form.phone}
          type="tel"
          icon={<Phone size={14} />}
          onSave={(v) => setForm((prev) => ({ ...prev, phone: v }))}
          placeholder="10-digit mobile"
        />

        <EditableField
          label="Date of Birth"
          value={format(new Date(form.dob), "PPP")}
          type="date"
          icon={<Calendar size={14} />}
          onSave={(v) => setForm((prev) => ({ ...prev, dob: v }))}
        />
        <div className="col-span-2">
          <EditableField
            label="Gender"
            value={form.gender}
            icon={<User size={14} />}
            options={[
              { value: "MALE", label: "Male" },
              { value: "FEMALE", label: "Female" },
              { value: "OTHERS", label: "Others" },
            ]}
            //@ts-expect-error
            onSave={(v) => setForm((prev) => ({ ...prev, gender: v }))}
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={isPending}
        className="w-full h-12 font-bold text-sm uppercase tracking-wide transition-all hover:scale-[1.01]"
        style={{
          background: `linear-gradient(135deg, ${BROWN}, ${LIGHT_BROWN})`,
          color: "#fff",
          fontFamily: LATO,
          border: "none",
          boxShadow: `0 8px 24px rgba(85,19,5,0.25)`,
        }}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            Saving Changes...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Save size={14} />
            Save All Changes
          </span>
        )}
      </Button>
    </div>
  );
};

export default PersonalInfoTab;
