export default function getYouTubeThumbnailUrl(videoUrl) {
  // Regular expression to match the video ID in a variety of YouTube URL formats
  const videoIdMatch = videoUrl.match(
    /(?:youtube\.com\/(?:[^/]+\/.*\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/
  );

  // Default thumbnail if no video URL or invalid URL
  let thumbnailUrl = "default-thumbnail.jpg";

  if (videoIdMatch) {
    // Construct YouTube thumbnail URL using the video ID
    thumbnailUrl = `https://img.youtube.com/vi/${videoIdMatch[1]}/0.jpg`;
  }

  return thumbnailUrl;
}