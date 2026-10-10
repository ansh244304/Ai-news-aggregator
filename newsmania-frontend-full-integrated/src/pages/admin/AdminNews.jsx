import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Plus, Sparkles, Trash2, Wand2 } from "lucide-react";
import api from "../../api/api";

export default function AdminNews() {
  const [n, setN] = useState([]);

  const load = () =>
    api.get("/news", { params: { page: 1, limit: 100 } }).then(({ data }) => {
      const d = data.data;
      setN(Array.isArray(d) ? d : d?.news || []);
    });

  useEffect(() => {
    load();
  }, []);

  const del = async (id) => {
    if (confirm("Delete news?")) {
      await api.delete(`/news/${id}`);
      load();
    }
  };

  const actionBtn =
    "inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-line px-2.5 text-xs font-semibold text-ink transition duration-150 hover:border-primary hover:text-primary";

  return (
    <div className="px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Admin
            </span>
            <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-ink">
              News Management
            </h1>
          </div>

          <Link
            to="/admin/news/create"
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-fg transition duration-150 hover:brightness-110"
          >
            <Plus size={16} />
            Create News
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-card">
          {n.map((x) => (
            <div
              key={x._id}
              className="flex flex-col gap-3 border-b border-line p-4 last:border-b-0 lg:flex-row lg:items-center lg:gap-4"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">
                {x.title}
              </span>

              <span className="shrink-0 text-xs text-muted">{x.category}</span>
              <span className="shrink-0 text-xs text-muted">{x.source}</span>

              <span className="flex flex-wrap gap-2 pt-1 lg:pt-0">
                <Link to={`/admin/news/edit/${x._id}`} className={actionBtn}>
                  <Pencil size={13} />
                  Edit
                </Link>

                <button
                  type="button"
                  className={actionBtn}
                  onClick={() => api.post(`/ai/news/${x._id}/analyze`)}
                >
                  <Sparkles size={13} />
                  AI
                </button>

                <button
                  type="button"
                  className={actionBtn}
                  onClick={() =>
                    api.post(`/mcq/news/${x._id}/generate`, {
                      numberOfQuestions: 5
                    })
                  }
                >
                  <Wand2 size={13} />
                  MCQ
                </button>

                <button
                  type="button"
                  className={`${actionBtn} hover:border-danger hover:text-danger`}
                  onClick={() => del(x._id)}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </span>
            </div>
          ))}

          {!n.length && (
            <p className="p-10 text-center text-sm text-muted">
              No news articles yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
