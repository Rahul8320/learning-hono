import { Hono } from "hono";
import { v4 as uuid } from "uuid";
import { streamText } from "hono/streaming";

let videos = [];

const app = new Hono();

app.get("/", c => c.html("<H1> Hello From Hono! </h1>"));

// get all videos
app.get("/videos", c => c.json(videos, 200));

// get all videos (using Streaming)
app.get("/stream-videos", c => {
  return streamText(c, async stream => {
    for (const video of videos) {
      await stream.writeln(JSON.stringify(video));
      await stream.sleep(1000);
    }
  });
});

// add new video
app.post("/videos", async c => {
  const { videoName, channelName, duration } = await c.req.json();
  const newVideo = {
    id: uuid(),
    videoName,
    channelName,
    duration,
    lastUpdated: new Date().toLocaleString()
  };
  videos.push(newVideo);

  return c.json(newVideo, 201);
});

// get video by id
app.get("/videos/:id", c => {
  const { id } = c.req.param();
  const video = videos.find(v => v.id === id);

  if (!video) {
    return c.json({ message: "Video not found!" }, 404);
  }

  return c.json(video, 200);
});

// update video by id
app.put("/videos/:id", async c => {
  const { id } = c.req.param();
  const video = videos.find(v => v.id === id);

  if (!video) {
    return c.json({ message: "Video not found!" }, 404);
  }

  const { videoName, channelName, duration } = await c.req.json();
  video.videoName = videoName;
  video.channelName = channelName;
  video.duration = duration;
  video.lastUpdated = new Date().toLocaleString();

  return c.json(video, 200);
});

// delete video by id
app.delete("/videos/:id", c => {
  const { id } = c.req.param();
  const filterVideos = videos.filter(v => v.id !== id);
  videos = filterVideos;

  return c.json({ message: "Video deleted successfully." }, 200);
});

// delete all videos
app.delete("/videos", c => {
  videos = [];
  return c.json({ message: "All videos deleted!" }, 200);
});

export default app;
