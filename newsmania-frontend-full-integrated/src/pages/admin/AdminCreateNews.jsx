import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Input from "../../components/ui/Input";

const FIELDS = ["title", "content", "source", "sourceUrl", "summary", "imageUrl"];

const inputClass =
  "h-11 w-full rounded-[10px] border border-line bg-bg px-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/25";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted";

export default function AdminCreateNews() {
  const [f, setF] = useState({
    title: "",
    content: "",
    source: "PIB India",
    sourceUrl: "",
    category: "National",
    publishedAt: "",
    summary: "",
    imageUrl: ""
  });
  const nav = useNavigate();

  const set = (k, v) => setF({ ...f, [k]: v });

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/news", f);
    nav("/admin/news");
  };

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-display text-3xl font-extrabold tracking-tight text-ink">
          Create News
        </h1>

        <form
          className="space-y-4 rounded-2xl border border-line bg-card p-5 sm:p-6"
          onSubmit={submit}
        >
          {FIELDS.map((k) => {
            const multiline = k === "content" || k === "summary";

            return (
              <label key={k} className="block">
                <span className={labelClass}>{k}</span>

                {multiline ? (
                  <textarea
                    rows={k === "content" ? 8 : 4}
                    value={f[k]}
                    onChange={(e) => set(k, e.target.value)}
                    className={`${inputClass} h-auto py-2.5`}
                  />
                ) : (
                  <Input
                    value={f[k]}
                    onChange={(e) => set(k, e.target.value)}
                  />
                )}
              </label>
            );
          })}

          <label className="block">
            <span className={labelClass}>Category</span>
            <select
              value={f.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass}
            >
              {[
                "National",
                "International",
                "Economy",
                "Science",
                "Technology",
                "Environment",
                "Defence",
                "Sports",
                "Polity",
                "Other"
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className={labelClass}>Published Date</span>
            <Input
              type="date"
              value={f.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Save News
          </button>
        </form>
      </div>
    </div>
  );
}
