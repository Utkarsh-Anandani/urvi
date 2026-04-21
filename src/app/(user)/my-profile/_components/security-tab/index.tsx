import { DeleteUserAccount } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { useMutationData } from "@/hooks/useMutationData";
import {
  LATO,
} from "@/lib/helper";
import { Shield, Trash2 } from "lucide-react";

const SecurityTab = () => {
  const { mutate, isPending } = useMutationData(["delete-user"], DeleteUserAccount, ["user-account"]);
  // const [currentPw, setCurrentPw] = useState("");
  // const [newPw, setNewPw] = useState("");
  // const [confirmPw, setConfirmPw] = useState("");
  // const [showCurrent, setShowCurrent] = useState(false);
  // const [showNew, setShowNew] = useState(false);
  // const [errors, setErrors] = useState<Record<string, string>>({});

  // const strength =
  //   newPw.length === 0
  //     ? 0
  //     : newPw.length < 6
  //       ? 1
  //       : newPw.length < 10
  //         ? 2
  //         : /[A-Z]/.test(newPw) &&
  //             /[0-9]/.test(newPw) &&
  //             /[^A-Za-z0-9]/.test(newPw)
  //           ? 4
  //           : 3;
  // const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  // const strengthColor = ["", "#e74c3c", ORANGE, LIGHT_ORANGE, "#2d6a4f"];

  // const handleChange = () => {
  //   const e: Record<string, string> = {};
  //   if (!currentPw) e.current = "Enter current password";
  //   if (newPw.length < 8) e.new = "Minimum 8 characters";
  //   if (newPw !== confirmPw) e.confirm = "Passwords don't match";
  //   setErrors(e);
  //   if (Object.keys(e).length === 0) {
  //     setCurrentPw("");
  //     setNewPw("");
  //     setConfirmPw("");
  //     onSave("Password updated successfully!");
  //   }
  // };

  // const inputStyle = (key: string) => ({
  //   borderColor: errors[key] ? "#e74c3c" : "#f0e6dc",
  //   fontFamily: LATO,
  //   color: BROWN,
  //   background: "#fdfaf7",
  //   fontSize: "14px",
  // });

  return (
    <div className="flex flex-col gap-6">
      {/* Change Password */}
      {/* <div
        className="rounded-2xl p-6"
        style={{ background: "#fff", border: "1px solid #f0e6dc" }}
      >
        <div className="flex items-center gap-2 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: LIGHTER_ORANGE, color: BROWN }}
          >
            <Lock size={16} />
          </div>
          <h3
            className="font-bold text-sm"
            style={{ color: BROWN, fontFamily: LATO }}
          >
            Change Password
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              key: "current",
              label: "Current Password",
              val: currentPw,
              set: setCurrentPw,
              show: showCurrent,
              toggle: setShowCurrent,
            },
            {
              key: "new",
              label: "New Password",
              val: newPw,
              set: setNewPw,
              show: showNew,
              toggle: setShowNew,
            },
          ].map(({ key, label, val, set, show, toggle }) => (
            <div key={key}>
              <Label
                className="text-xs font-bold uppercase tracking-widest mb-1.5 block"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {label}
              </Label>
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  style={inputStyle(key)}
                />
                <button
                  onClick={() => toggle(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#9a7a6e" }}
                >
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors[key] && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "#e74c3c", fontFamily: LATO }}
                >
                  {errors[key]}
                </p>
              )}
              {key === "new" && newPw.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all"
                        style={{
                          background:
                            i <= strength ? strengthColor[strength] : "#f0e6dc",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-xs font-bold"
                    style={{ color: strengthColor[strength], fontFamily: LATO }}
                  >
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
            </div>
          ))}

          <div>
            <Label
              className="text-xs font-bold uppercase tracking-widest mb-1.5 block"
              style={{ color: BROWN, fontFamily: LATO }}
            >
              Confirm New Password
            </Label>
            <Input
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              style={inputStyle("confirm")}
            />
            {errors.confirm && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "#e74c3c", fontFamily: LATO }}
              >
                {errors.confirm}
              </p>
            )}
          </div>

          <Button
            onClick={handleChange}
            className="h-11 font-bold text-sm uppercase tracking-wide"
            style={{
              background: `linear-gradient(135deg, ${BROWN}, ${LIGHT_BROWN})`,
              color: "#fff",
              fontFamily: LATO,
              border: "none",
            }}
          >
            <Lock size={14} className="mr-2" />
            Update Password
          </Button>
        </div>
      </div> */}

      {/* Danger zone */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "#fff8f8", border: "1.5px solid #ffc8c8" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#ffeaea", color: "#c0392b" }}
          >
            <Shield size={16} />
          </div>
          <h3
            className="font-bold text-sm"
            style={{ color: "#c0392b", fontFamily: LATO }}
          >
            Danger Zone
          </h3>
        </div>
        <p
          className="text-sm leading-6 mb-4"
          style={{ color: "#6b5a52", fontFamily: LATO }}
        >
          Deleting your account is permanent and cannot be undone. All your
          order history, saved addresses and preferences will be erased.
        </p>
        <Button
          disabled={isPending}
          onClick={mutate}
          variant="outline"
          className="h-10 font-bold text-sm"
          style={{
            borderColor: "#e74c3c",
            color: "#c0392b",
            fontFamily: LATO,
            borderWidth: 1.5,
          }}
        >
          <Trash2 size={13} className="mr-2" />
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SecurityTab;
