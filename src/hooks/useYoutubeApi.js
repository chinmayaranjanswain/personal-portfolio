import { useState, useEffect } from 'react';

const YOUTUBE_CHANNEL_HANDLE = '@devchinmaya';
const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@devchinmaya';

// YouTube Data API key — set this to enable live stats
// Get one free at: https://console.cloud.google.com/apis/credentials
// Enable "YouTube Data API v3" in your Google Cloud project
const YOUTUBE_API_KEY = 'AIzaSyAyDfyY9DPJKgBZAh_XZL2FM4jPfQgnIbQ';

export function useYoutubeStats() {
  const [stats, setStats] = useState({
    subscribers: '—',
    views: '—',
    videos: '—',
    channelName: 'Dev Chinmaya',
    channelUrl: YOUTUBE_CHANNEL_URL,
    handle: YOUTUBE_CHANNEL_HANDLE,
    avatar: '',
  });

  useEffect(() => {
    if (!YOUTUBE_API_KEY) return;

    (async () => {
      try {
        // Search for channel by handle
        const searchRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${YOUTUBE_CHANNEL_HANDLE}&type=channel&key=${YOUTUBE_API_KEY}`
        );
        if (!searchRes.ok) return;
        const searchData = await searchRes.json();
        const channelId = searchData.items?.[0]?.snippet?.channelId;
        if (!channelId) return;

        // Fetch channel stats
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const channel = data.items?.[0];
        if (!channel) return;

        const s = channel.statistics;
        setStats({
          subscribers: formatCount(s.subscriberCount),
          views: formatCount(s.viewCount),
          videos: s.videoCount,
          channelName: channel.snippet.title,
          channelUrl: YOUTUBE_CHANNEL_URL,
          handle: YOUTUBE_CHANNEL_HANDLE,
          avatar: channel.snippet.thumbnails?.medium?.url || '',
        });
      } catch (e) {
        console.log('YouTube stats fetch failed');
      }
    })();
  }, []);

  return stats;
}

function formatCount(num) {
  const n = parseInt(num);
  if (isNaN(n)) return num;
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}
