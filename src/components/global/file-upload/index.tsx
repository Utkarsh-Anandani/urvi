import { useRef, useState, useCallback, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  X,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { BROWN, LATO, LIGHT_ORANGE, LIGHTER_BROWN, LIGHTER_ORANGE, ORANGE } from "@/lib/helper";

// ─── Types ────────────────────────────────────────────────────────────────────
type FileStatus = "idle" | "uploading" | "done" | "error";
type UploadVariant = "default" | "compact" | "button-only";

interface FileEntry {
  id: string;
  file: File;
  status: FileStatus;
  error: string | null;
  preview: string | null;
}

interface FileIconResult {
  Icon: LucideIcon;
  color: string;
}

interface FileUploadError {
  file: File;
  message: string;
}

export interface FileUploadProps {
  // ── Native <input type="file"> props ──────────────────────────────────────
  /** Accepted file types, e.g. "image/*,application/pdf" */
  accept?: string;
  /** Allow multiple file selection */
  multiple?: boolean;
  /** Camera capture on mobile: "user" | "environment" */
  capture?: "user" | "environment";
  /** Disables the entire component */
  disabled?: boolean;
  /** Form field name (for HTML form submission) */
  name?: string;
  /** ID of the associated <form> element */
  form?: string;
  /** Mark field as required for form validation */
  required?: boolean;
  /** Native input element id */
  id?: string;
  /** Keyboard tab index */
  tabIndex?: number;
  /** Accessible label for the dropzone */
  "aria-label"?: string;

  // ── Extended props ────────────────────────────────────────────────────────
  /** Max file size in bytes (default: 10 MB) */
  maxSize?: number;
  /** Max number of files when multiple=true (default: Infinity) */
  maxFiles?: number;
  /** Dropzone headline text */
  label?: string;
  /** Hint text below label (auto-generated from accept + maxSize if omitted) */
  sublabel?: string;
  /** Show the file list below the dropzone (default: true) */
  showPreview?: boolean;
  /** Visual variant of the component */
  variant?: UploadVariant;
  /** Called with all valid File[] whenever the selection changes */
  onChange?: (files: File[]) => void;
  /** Called with only the newly added valid files */
  onFilesAdded?: (newFiles: File[]) => void;
  /** Called when a file is removed from the list */
  onFileRemoved?: (file: File) => void;
  /** Called for each file that fails validation */
  onError?: (error: FileUploadError) => void;
  /** Additional CSS classes on the root wrapper */
  className?: string;
  /** Inline styles on the root wrapper */
  style?: React.CSSProperties;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"] as const;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (file: File): FileIconResult => {
  const { type } = file;
  if (type.startsWith("image/"))  return { Icon: FileImage, color: "#0891b2" };
  if (type.startsWith("video/"))  return { Icon: FileVideo, color: "#7c3aed" };
  if (type.startsWith("audio/"))  return { Icon: FileAudio, color: "#db2777" };
  if (type === "application/pdf") return { Icon: FileText,  color: "#dc2626" };
  return { Icon: File, color: "#6b7280" };
};

const getFilePreview = (file: File): string | null =>
  file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

// ─── FileItem ─────────────────────────────────────────────────────────────────
interface FileItemProps {
  entry: FileEntry;
  onRemove: (id: string) => void;
}

const FileItem = ({ entry, onRemove }: FileItemProps) => {
  const { file, status, error, preview } = entry;
  const { Icon, color } = getFileIcon(file);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200"
      style={{
        background: status === "error" ? "#fff1f2" : "#fafafa",
        border: `1px solid ${status === "error" ? "#fecdd3" : "#f0f0f0"}`,
      }}
    >
      {/* Thumbnail or icon */}
      <div
        className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ background: `${color}12`, border: `1px solid ${color}20` }}
      >
        {preview ? (
          <img src={preview} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <Icon size={18} style={{ color }} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "#111827", fontFamily: LATO }}
        >
          {file.name}
        </p>
        <p className="text-xs text-gray-400" style={{ fontFamily: LATO }}>
          {formatBytes(file.size)}
          {error && (
            <span className="ml-2 text-red-400 font-semibold">{error}</span>
          )}
        </p>
      </div>

      {/* Status icon */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {status === "uploading" && (
          <Loader2 size={16} className="animate-spin" style={{ color: ORANGE }} />
        )}
        {status === "done" && (
          <CheckCircle2 size={16} style={{ color: LIGHT_ORANGE }} />
        )}
        {status === "error" && (
          <AlertCircle size={16} style={{ color: "#ef4444" }} />
        )}
        <button
          type="button"
          onClick={() => onRemove(entry.id)}
          className="w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── FileUpload ───────────────────────────────────────────────────────────────
const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      // Native props
      accept,
      multiple = false,
      capture,
      disabled = false,
      name,
      form,
      required,
      id,
      tabIndex,
      "aria-label": ariaLabel,

      // Extended props
      maxSize = 10 * 1024 * 1024,
      maxFiles = Infinity,
      label = "Drop files here or click to browse",
      sublabel,
      showPreview = true,
      variant = "default",
      onChange,
      onFilesAdded,
      onFileRemoved,
      onError,
      className = "",
      style,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [entries,   setEntries]   = useState<FileEntry[]>([]);
    const [dragging,  setDragging]  = useState(false);
    const [dragError, setDragError] = useState("");

    // Merge forwarded ref with local ref
    const setRefs = (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    // ── Validation ──────────────────────────────────────────────────────────
    const validateFile = (file: File): string | null => {
      if (maxSize && file.size > maxSize)
        return `File exceeds ${formatBytes(maxSize)} limit`;

      if (accept) {
        const accepted = accept.split(",").map((a) => a.trim());
        const matched = accepted.some((a) => {
          if (a.startsWith(".")) return file.name.toLowerCase().endsWith(a);
          if (a.endsWith("/*"))  return file.type.startsWith(a.replace("/*", ""));
          return file.type === a;
        });
        if (!matched) return "File type not accepted";
      }

      return null;
    };

    // ── Add files ───────────────────────────────────────────────────────────
    const addFiles = useCallback(
      (rawFiles: FileList) => {
        const fileArray = Array.from(rawFiles);
        const toAdd = multiple ? fileArray : [fileArray[0]].filter(Boolean) as File[];

        const remaining = maxFiles - entries.length;
        if (remaining <= 0) {
          setDragError(`Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} allowed.`);
          setTimeout(() => setDragError(""), 3000);
          return;
        }

        const sliced = toAdd.slice(0, remaining);

        const newEntries: FileEntry[] = sliced.map((file) => {
          const error = validateFile(file);
          return {
            id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
            file,
            status: error ? "error" : "idle",
            error: error ?? null,
            preview: getFilePreview(file),
          };
        });

        const validFiles   = newEntries.filter((e) => !e.error).map((e) => e.file);
        const invalidFiles = newEntries.filter((e) => e.error);

        invalidFiles.forEach(({ file, error }) =>
          onError?.({ file, message: error! })
        );

        setEntries((prev) => {
          const next = multiple ? [...prev, ...newEntries] : newEntries;
          onChange?.(next.filter((e) => !e.error).map((e) => e.file));
          return next;
        });

        if (validFiles.length) onFilesAdded?.(validFiles);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [entries, multiple, maxFiles, maxSize, accept, onChange, onFilesAdded, onError]
    );

    // ── Remove ──────────────────────────────────────────────────────────────
    const removeEntry = (id: string) => {
      setEntries((prev) => {
        const entry = prev.find((e) => e.id === id);
        if (entry) {
          if (entry.preview) URL.revokeObjectURL(entry.preview);
          onFileRemoved?.(entry.file);
        }
        const next = prev.filter((e) => e.id !== id);
        onChange?.(next.filter((e) => !e.error).map((e) => e.file));
        if (inputRef.current) inputRef.current.value = "";
        return next;
      });
    };

    // ── Drag events ─────────────────────────────────────────────────────────
    const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); if (!disabled) setDragging(true); };
    const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); };
    const onDrop      = (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      addFiles(e.dataTransfer.files);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
    };

    const openBrowser = () => {
      if (!disabled) inputRef.current?.click();
    };

    // ── Computed sub-label ──────────────────────────────────────────────────
    const computedSublabel =
      sublabel ??
      (accept
        ? `Accepted: ${accept.replace(/,/g, ", ")}  ·  Max ${formatBytes(maxSize)}`
        : `Any file type  ·  Max ${formatBytes(maxSize)}`);

    // ── Variant flags ───────────────────────────────────────────────────────
    const isCompact    = variant === "compact";
    const isButtonOnly = variant === "button-only";

    // ── Render ───────────────────────────────────────────────────────────────
    return (
      <div className={`w-full ${className}`} style={style}>
        {/* Hidden native input */}
        <input
          ref={setRefs}
          type="file"
          accept={accept}
          multiple={multiple}
          capture={capture}
          disabled={disabled}
          name={name}
          form={form}
          required={required}
          id={id}
          tabIndex={-1}
          aria-label={ariaLabel ?? label}
          className="sr-only"
          onChange={onInputChange}
        />

        {/* ── Button-only variant ── */}
        {isButtonOnly && (
          <Button
            type="button"
            onClick={openBrowser}
            disabled={disabled}
            className="gap-2 h-10 text-xs uppercase tracking-wider rounded-sm"
            style={{
              background: disabled
                ? "#e5e7eb"
                : `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
              border: "none",
              fontFamily: LATO,
              color: disabled ? "#9ca3af" : "#fff",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <UploadCloud size={15} />
            {multiple ? "Upload Files" : "Upload File"}
          </Button>
        )}

        {/* ── Dropzone (default + compact) ── */}
        {!isButtonOnly && (
          <div
            role="button"
            tabIndex={tabIndex ?? (disabled ? -1 : 0)}
            aria-label={ariaLabel ?? label}
            aria-disabled={disabled}
            onClick={openBrowser}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && openBrowser()
            }
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            className="relative w-full transition-all duration-200 outline-none"
            style={{
              padding: isCompact ? "16px 20px" : "32px 24px",
              borderRadius: "4px",
              border: `2px dashed ${
                disabled  ? "#e5e7eb" :
                dragging  ? BROWN     :
                dragError ? "#ef4444" :
                            `${BROWN}60`
              }`,
              background:
                disabled  ? "#f9fafb" :
                dragging  ? LIGHTER_ORANGE :
                dragError ? "#fff1f2" :
                            "#fffdf5",
              cursor: disabled ? "not-allowed" : "pointer",
              boxShadow: dragging ? `0 0 0 4px ${ORANGE}12` : "none",
            }}
          >
            {/* Inner layout */}
            <div
              className={`flex ${
                isCompact
                  ? "flex-row items-center gap-4"
                  : "flex-col items-center text-center gap-3"
              }`}
            >
              {/* Cloud icon */}
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  width:      isCompact ? 40 : 56,
                  height:     isCompact ? 40 : 56,
                  background: dragging ? `${ORANGE}18` : LIGHTER_ORANGE,
                  border:     `1px solid ${dragging ? `${ORANGE}30` : `${BROWN}30`}`,
                  transition: "all 0.2s",
                }}
              >
                <UploadCloud
                  size={isCompact ? 18 : 24}
                  style={{ color: dragging ? ORANGE : BROWN }}
                />
              </div>

              <div className={isCompact ? "flex-1 min-w-0 text-left" : ""}>
                <p
                  className="font-semibold"
                  style={{
                    fontSize:   isCompact ? "13px" : "15px",
                    color:      disabled ? "#9ca3af" : "#111827",
                    fontFamily: LATO,
                  }}
                >
                  {dragging ? "Release to upload" : label}
                </p>
                <p
                  className="mt-0.5 text-xs leading-relaxed"
                  style={{
                    color:      dragError ? "#ef4444" : "#9ca3af",
                    fontFamily: LATO,
                  }}
                >
                  {dragError || computedSublabel}
                </p>

                {/* Browse pill — default variant only */}
                {!isCompact && !disabled && (
                  <div className="mt-4 inline-flex items-center gap-2">
                    <span
                      className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                      style={{
                        background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                        color:      "#fff",
                        fontFamily: LATO,
                        boxShadow:  `0 2px 10px ${BROWN}30`,
                      }}
                    >
                      Browse Files
                    </span>
                    {multiple && maxFiles !== Infinity && (
                      <span
                        className="text-xs"
                        style={{ color: BROWN, fontFamily: LATO }}
                      >
                        up to {maxFiles} file{maxFiles > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Browse button — compact variant */}
              {isCompact && !disabled && (
                <span
                  className="flex-shrink-0 px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider"
                  style={{
                    background: `linear-gradient(135deg, ${ORANGE}, ${LIGHT_ORANGE})`,
                    color:      "#fff",
                    fontFamily: LATO,
                  }}
                >
                  Browse
                </span>
              )}
            </div>

            {/* Gold shimmer accent line */}
            {!disabled && (
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${
                    dragging ? ORANGE : BROWN
                  }60, transparent)`,
                  borderRadius: "0 0 4px 4px",
                }}
              />
            )}
          </div>
        )}

        {/* ── File list ── */}
        {showPreview && entries.length > 0 && (
          <div className="mt-3 space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: BROWN, fontFamily: LATO }}
              >
                {entries.length} file{entries.length > 1 ? "s" : ""} selected
              </span>
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    entries.forEach((e) => {
                      if (e.preview) URL.revokeObjectURL(e.preview);
                      onFileRemoved?.(e.file);
                    });
                    setEntries([]);
                    onChange?.([]);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="text-xs hover:opacity-70 transition-opacity"
                  style={{ color: "#ef4444", fontFamily: LATO }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Gold divider */}
            <div className="flex items-center gap-2">
              <div
                className="h-px flex-1"
                style={{ background: `linear-gradient(to right, transparent, ${BROWN}50)` }}
              />
              <svg width="8" height="8" viewBox="0 0 16 16" fill={BROWN}>
                <polygon points="8,0 10,6 16,6 11,10 13,16 8,12 3,16 5,10 0,6 6,6" />
              </svg>
              <div
                className="h-px flex-1"
                style={{ background: `linear-gradient(to left, transparent, ${BROWN}50)` }}
              />
            </div>

            {entries.map((entry) => (
              <FileItem key={entry.id} entry={entry} onRemove={removeEntry} />
            ))}

            {/* Total size */}
            <p
              className="text-right text-xs"
              style={{ color: "#9ca3af", fontFamily: LATO }}
            >
              Total:{" "}
              <span style={{ color: ORANGE, fontWeight: 600 }}>
                {formatBytes(entries.reduce((acc, e) => acc + e.file.size, 0))}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";
export default FileUpload;


// ─────────────────────────────────────────────────────────────────────────────
// USAGE EXAMPLES (remove in production)
// ─────────────────────────────────────────────────────────────────────────────
//
// 1. Single image upload
// <FileUpload
//   accept="image/*"
//   maxSize={5 * 1024 * 1024}
//   label="Upload a profile photo"
//   onChange={(files: File[]) => console.log(files)}
// />
//
// 2. Multiple PDF/doc upload — compact variant
// <FileUpload
//   accept=".pdf,.doc,.docx"
//   multiple
//   maxFiles={5}
//   maxSize={20 * 1024 * 1024}
//   variant="compact"
//   label="Attach documents"
//   onChange={(files: File[]) => console.log(files)}
// />
//
// 3. Button-only (no dropzone)
// <FileUpload
//   multiple
//   accept="image/*,application/pdf"
//   variant="button-only"
//   onChange={(files: File[]) => console.log(files)}
// />
//
// 4. Disabled state
// <FileUpload disabled label="Upload disabled" />
//
// 5. With all callbacks + forwarded ref
// const inputRef = useRef<HTMLInputElement>(null);
// <FileUpload
//   ref={inputRef}
//   accept="image/*"
//   multiple
//   maxFiles={3}
//   maxSize={2 * 1024 * 1024}
//   onChange={(files: File[]) => setFormFiles(files)}
//   onFilesAdded={(newFiles: File[]) => console.log("Added:", newFiles)}
//   onFileRemoved={(file: File) => console.log("Removed:", file)}
//   onError={({ file, message }: { file: File; message: string }) =>
//     toast.error(`${file.name}: ${message}`)
//   }
//   name="attachments"
//   required
//   id="attachments-input"
// />