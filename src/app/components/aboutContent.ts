/** Editable About Me content — swap in real posts / albums anytime. */

export type BlogPost = {
  title: string;
  date: string;
  summary: string;
  href: string;
};

export type FavoriteAlbum = {
  title: string;
  artist: string;
  /** Square cover image (local `/...` or Spotify CDN). */
  cover: string;
  /** Spotify album URL */
  href: string;
};

/**
 * Blog articles shown on About Me.
 * Example:
 * { title: "...", date: "Mar 2026", summary: "...", href: "https://..." }
 */
export const blogPosts: BlogPost[] = [];

/**
 * Favourite albums — covers render in a shelf on About Me.
 * Tip: open the album on Spotify → Share → Copy album link.
 * Cover art: right-click the cover → copy image address (i.scdn.co),
 * or drop a square JPG/PNG into /public/albums/ and use "/albums/....jpg".
 *
 * Example:
 * {
 *   title: "Discovery",
 *   artist: "Daft Punk",
 *   cover: "https://i.scdn.co/image/ab67616d0000b273...",
 *   href: "https://open.spotify.com/album/...",
 * }
 */
export const favoriteAlbums: FavoriteAlbum[] = [];
