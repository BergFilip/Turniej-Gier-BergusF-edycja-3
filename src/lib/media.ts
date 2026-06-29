export const normalizeMediaUrl = (value: string) => {
  let url = value.trim().replace(/\\/g, '/');
  if (!url) return '';
  url = url.replace(/^\.?\/?public\//i, '/');
  if (/^(https?:|data:|blob:|file:)/i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return url;
  if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(url)) return `https://${url}`;
  return url;
};

export const getVideoEmbedUrl = (value: string) => {
  const url = normalizeMediaUrl(value);
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsed.pathname.replace('/', '')}`;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsed.searchParams.get('v');
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      if (parsed.pathname.startsWith('/shorts/')) {
        return `https://www.youtube.com/embed/${parsed.pathname.split('/')[2]}`;
      }
      if (parsed.pathname.startsWith('/embed/')) return url;
    }

    if (host === 'vimeo.com') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    if (host === 'vdo.ninja' || host === 'obs.ninja') {
      return url;
    }
  } catch {
    return '';
  }

  return '';
};

export const getImageEmbedUrl = (value: string) => {
  const url = normalizeMediaUrl(value);
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (host === 'imgur.com' && (parsed.pathname.startsWith('/a/') || parsed.pathname.startsWith('/gallery/'))) {
      return `${url.replace(/\/$/, '')}/embed`;
    }
  } catch {
    return '';
  }

  return '';
};

export const getDirectImageUrl = (value: string) => {
  const url = normalizeMediaUrl(value);
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const pathParts = parsed.pathname.split('/').filter(Boolean);

    if (host === 'imgur.com' && pathParts.length === 1 && !/\.(jpg|jpeg|png|gif|webp)$/i.test(pathParts[0])) {
      return `https://i.imgur.com/${pathParts[0]}.jpg`;
    }
  } catch {
    return url;
  }

  return url;
};

export const isDirectVideoUrl = (value: string) => /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(normalizeMediaUrl(value));

export const isLikelyVideoUrl = (value: string) => Boolean(getVideoEmbedUrl(value)) || isDirectVideoUrl(value);
