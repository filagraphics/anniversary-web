"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Download, ImagePlus, Loader2, ShieldCheck, Trash2, Video } from "lucide-react";
import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { sections } from "@/data/messages";
import SectionHeading from "./ui/SectionHeading";

type LocalMemory = {
  id: string;
  file: File;
  url: string;
  kind: "image" | "video";
  title: string;
  description: string;
  date: string;
};

const MAX_FILE_MB = 500;
const copy = sections.remember;

function slug(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "memory"
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MemoryUpload() {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<LocalMemory[]>([]);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [zipping, setZipping] = useState(false);

  // Release every object URL when the component goes away.
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url)), []);

  const addFiles = (list: FileList | File[]) => {
    const files = Array.from(list);
    const accepted: LocalMemory[] = [];
    let skipped = 0;
    for (const file of files) {
      const kind = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : null;
      if (!kind || file.size > MAX_FILE_MB * 1024 * 1024) {
        skipped++;
        continue;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        url: URL.createObjectURL(file),
        kind,
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        description: "",
        date: "",
      });
    }
    if (accepted.length) {
      setItems((prev) => [...prev, ...accepted]);
      setSaved(false);
    }
    setNotice(
      skipped
        ? `${skipped} file${skipped > 1 ? "s were" : " was"} skipped. Only photos and videos up to ${MAX_FILE_MB} MB can be added.`
        : null,
    );
  };

  const update = (id: string, patch: Partial<LocalMemory>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setSaved(false);
  };

  const remove = (id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
    setSaved(false);
  };

  const clearAll = () => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
    setItems([]);
    setSaved(false);
    setNotice(null);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const downloadZip = async () => {
    if (!items.length) return;
    setZipping(true);
    setNotice(null);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const folder = zip.folder("memories")!;
      const used = new Set<string>();
      const index = items.map((item, i) => {
        const ext = item.file.name.includes(".") ? item.file.name.split(".").pop() : item.kind === "image" ? "jpg" : "mp4";
        let name = `${String(i + 1).padStart(2, "0")}-${slug(item.title)}.${ext}`;
        while (used.has(name)) name = name.replace(/(\.[^.]+)$/, "-copy$1");
        used.add(name);
        folder.file(name, item.file);
        return {
          file: `memories/${name}`,
          type: item.kind,
          title: item.title,
          description: item.description,
          date: item.date,
          originalName: item.file.name,
        };
      });
      const readable = index
        .map(
          (m, i) =>
            `${i + 1}. ${m.title || "Untitled memory"}${m.date ? ` (${m.date})` : ""}\n   File: ${m.file}${
              m.description ? `\n   ${m.description}` : ""
            }`,
        )
        .join("\n\n");
      zip.file("memories.json", JSON.stringify(index, null, 2));
      zip.file("memories.txt", `Do You Remember This?\n\n${readable}\n`);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "do-you-remember-this.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setSaved(true);
    } catch {
      setNotice("Sorry, the ZIP file couldn’t be created in this browser.");
    } finally {
      setZipping(false);
    }
  };

  return (
    <section
      id="remember"
      aria-labelledby="remember-title"
      className="px-5 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading id="remember-title" eyebrow={copy.eyebrow} title={copy.title} intro={copy.intro} />

      <div className="mx-auto mt-12 max-w-4xl sm:mt-16">
        <p className="mx-auto mb-6 flex max-w-2xl items-start gap-3 rounded-xl bg-cream/70 px-4 py-3 text-sm leading-relaxed text-mocha-deep">
          <ShieldCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
          {copy.privacyNote}
        </p>

        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-rose-deep ${
            dragging ? "border-rose bg-rose/10" : "border-mocha/30 bg-white/60 hover:border-rose hover:bg-white"
          }`}
        >
          <span className="grid size-14 place-items-center rounded-full bg-cream text-mocha-deep">
            <ImagePlus aria-hidden className="size-6" />
          </span>
          <span className="font-serif text-xl text-ink">Choose photos or videos</span>
          <span className="text-sm text-mocha-deep">
            <span className="hidden sm:inline">Drag them here, or click to browse. </span>Images and videos are both welcome.
          </span>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*,video/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>

        {notice && (
          <p role="status" className="mt-4 text-center text-sm text-rose-deep">
            {notice}
          </p>
        )}

        <AnimatePresence initial={false}>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-10 flex items-baseline justify-between gap-4">
                <h3 className="font-serif text-2xl text-ink">
                  Your memories <span className="text-base text-mocha-deep">({items.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={clearAll}
                  className="min-h-11 text-sm text-mocha-deep underline-offset-4 hover:text-ink hover:underline"
                >
                  Remove all
                </button>
              </div>

              <ul className="mt-6 grid gap-6 md:grid-cols-2">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink/5"
                    >
                      <div className="relative aspect-[4/3] bg-cream">
                        {item.kind === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.url} alt={item.title || "Selected photo"} className="size-full object-cover" />
                        ) : (
                          <video src={item.url} controls playsInline preload="metadata" className="size-full bg-night object-contain">
                            <track kind="captions" />
                          </video>
                        )}
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-2.5 py-1 text-[0.68rem] tracking-wide text-ink backdrop-blur">
                          {item.kind === "video" ? <Video aria-hidden className="size-3" /> : <ImagePlus aria-hidden className="size-3" />}
                          {formatSize(item.file.size)}
                        </span>
                        <button
                          type="button"
                          onClick={() => remove(item.id)}
                          className="absolute top-2 right-2 grid size-11 place-items-center rounded-full bg-paper/90 text-ink shadow-soft backdrop-blur transition-colors hover:bg-white hover:text-rose-deep"
                          aria-label={`Remove ${item.title || "this memory"}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="space-y-3 p-4 sm:p-5">
                        <label className="block">
                          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-mocha-deep">Memory title</span>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => update(item.id, { title: e.target.value })}
                            placeholder="The day we…"
                            className="mt-1 w-full rounded-lg border border-mocha/25 bg-paper/50 px-3 py-2.5 text-base text-ink placeholder:text-mocha/60 focus:border-rose focus:outline-none"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-mocha-deep">Description</span>
                          <textarea
                            value={item.description}
                            onChange={(e) => update(item.id, { description: e.target.value })}
                            rows={2}
                            placeholder="What do you remember about it?"
                            className="mt-1 w-full resize-y rounded-lg border border-mocha/25 bg-paper/50 px-3 py-2.5 text-base text-ink placeholder:text-mocha/60 focus:border-rose focus:outline-none"
                          />
                        </label>
                        <label className="block">
                          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-mocha-deep">Date (optional)</span>
                          <input
                            type="text"
                            value={item.date}
                            onChange={(e) => update(item.id, { date: e.target.value })}
                            placeholder="Summer, a few years ago"
                            className="mt-1 w-full rounded-lg border border-mocha/25 bg-paper/50 px-3 py-2.5 text-base text-ink placeholder:text-mocha/60 focus:border-rose focus:outline-none"
                          />
                        </label>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setSaved(true)}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm tracking-wide text-paper transition-colors hover:bg-mocha-deep sm:w-auto"
                >
                  <Check aria-hidden className="size-4" />
                  Add to the collection
                </button>
                <button
                  type="button"
                  onClick={downloadZip}
                  disabled={zipping}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-ink/20 px-7 text-sm tracking-wide text-ink transition-colors hover:bg-white disabled:opacity-60 sm:w-auto"
                >
                  {zipping ? <Loader2 aria-hidden className="size-4 animate-spin" /> : <Download aria-hidden className="size-4" />}
                  {zipping ? "Preparing ZIP…" : "Download as ZIP"}
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-mocha-deep">
                Added memories stay on this page until it’s closed or refreshed. Download a ZIP to keep them.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {saved && items.length > 0 && (
            <motion.p
              role="status"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-auto mt-8 max-w-xl text-center font-hand text-3xl leading-snug text-rose-deep"
            >
              {copy.confirmation}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
