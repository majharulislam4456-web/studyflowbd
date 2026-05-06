import { useEffect, useState } from 'react';
import { ExternalLink, Link as LinkIcon } from 'lucide-react';

interface Preview {
  title?: string;
  description?: string;
  image?: string;
  publisher?: string;
}

const cache = new Map<string, Preview>();

function getDomain(url: string) {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}

export function LinkPreview({ url }: { url: string }) {
  const [data, setData] = useState<Preview | null>(cache.get(url) ?? null);
  const [loading, setLoading] = useState(!cache.has(url));

  useEffect(() => {
    if (cache.has(url)) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const json = await res.json();
        if (cancelled) return;
        if (json.status === 'success') {
          const p: Preview = {
            title: json.data?.title,
            description: json.data?.description,
            image: json.data?.image?.url,
            publisher: json.data?.publisher,
          };
          cache.set(url, p);
          setData(p);
        }
      } catch { /* ignore */ }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [url]);

  const domain = getDomain(url);
  const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 flex gap-3 items-stretch rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors overflow-hidden group"
    >
      {data?.image ? (
        <img src={data.image} alt="" className="w-20 h-20 object-cover flex-shrink-0" loading="lazy" />
      ) : (
        <div className="w-20 h-20 flex items-center justify-center bg-primary/10 flex-shrink-0">
          <LinkIcon className="w-6 h-6 text-primary/60" />
        </div>
      )}
      <div className="flex-1 min-w-0 py-2 pr-3">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-0.5">
          <img src={favicon} alt="" className="w-3 h-3" />
          <span className="truncate">{data?.publisher || domain}</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-xs font-semibold text-foreground line-clamp-1 font-bengali">
          {loading ? 'লোড হচ্ছে...' : (data?.title || domain)}
        </p>
        {data?.description && (
          <p className="text-[11px] text-muted-foreground line-clamp-2 font-bengali mt-0.5">{data.description}</p>
        )}
      </div>
    </a>
  );
}