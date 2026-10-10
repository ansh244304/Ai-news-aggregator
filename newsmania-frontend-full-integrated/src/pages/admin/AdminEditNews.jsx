import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import Input from "../../components/ui/Input";

const labelClass =
  "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted";

export default function AdminEditNews() {
  const { id } = useParams();
  const [f, setF] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get(`/news/${id}`).then(({ data }) => setF(data.data || data));
  }, [id]);

  if (!f) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-bg text-muted">
        Loading...
      </div>
    );
  }

  const set = (k, v) => setF({ ...f, [k]: v });

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 font-display text-3xl font-extrabold tracking-tight text-ink">
          Edit News
        </h1>

        <form
          className="space-y-4 rounded-2xl border border-line bg-card p-5 sm:p-6"
          onSubmit={async (e) => {
            e.preventDefault();
            await api.put(`/news/${id}`, f);
            nav("/admin/news");
          }}
        >
          <label className="block">
            <span className={labelClass}>Title</span>
            <Input
              value={f.title || ""}
              onChange={(e) => set("title", e.target.value)}
            />
          </label>

          <label className="block">
            <span className={labelClass}>Content</span>
            <textarea
              rows={12}
              value={f.content || ""}
              onChange={(e) => set("content", e.target.value)}
              className="w-full rounded-[10px] border border-line bg-bg px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </label>

          <label className="block">
            <span className={labelClass}>Summary</span>
            <textarea
              rows={5}
              value={f.summary || ""}
              onChange={(e) => set("summary", e.target.value)}
              className="w-full rounded-[10px] border border-line bg-bg px-3 py-2.5 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-11 items-center rounded-[10px] bg-primary px-5 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
