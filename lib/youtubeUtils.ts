/**
 * Extracted YouTube video ID from various URL formats
 * Handles:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 */
export function getYouTubeId(url: string | undefined): string | null {
    if (!url) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Returns a robust YouTube embed URL
 */
export function getYouTubeEmbedUrl(url: string | undefined, options: { autoplay?: boolean; mute?: boolean; loop?: boolean; controls?: boolean; disablekb?: boolean } = {}): string | null {
    const videoId = getYouTubeId(url);
    if (!videoId) return null;

    let embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;

    if (options.autoplay) embedUrl += '&autoplay=1';
    if (options.mute) embedUrl += '&mute=1';
    if (options.loop) embedUrl += `&loop=1&playlist=${videoId}`;
    if (options.controls === false) embedUrl += '&controls=0';
    if (options.disablekb) embedUrl += '&disablekb=1';

    return embedUrl;
}
