import { Hono } from "hono";
import { streamText } from "hono/streaming";
import VideoService from "../services/video.service";
import { isValidObjectId } from "mongoose";

const video = new Hono();
const videoService = new VideoService();

// GET list of videos
video.get("/", async (c) => {
  try {
    const documents = await videoService.getAllVideos();
    return c.json(
      documents.map((d) => d.toObject()),
      200
    );
  } catch (err) {
    return c.json(
      {
        message: `Fetch failed with error: ${
          (err as any)?.message || "Internal server error"
        }`,
      },
      500
    );
  }
});

// GET video by id
video.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!isValidObjectId(id)) {
      return c.json({ message: `Invalid document id: ${id}` }, 400);
    }

    const document = await videoService.getVideoById(id);
    if (!document) {
      return c.json(
        { message: `Video not found with requested id: ${id}` },
        404
      );
    }
    return c.json(document.toObject(), 200);
  } catch (err) {
    return c.json(
      {
        message: `Fetch failed with error: ${
          (err as any)?.message || "Internal server error"
        }`,
      },
      500
    );
  }
});

// Get video description (using streaming)
video.get("/d/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!isValidObjectId(id)) {
      return c.json({ message: `Invalid document id: ${id}` }, 400);
    }

    const document = await videoService.getVideoById(id);
    if (!document) {
      return c.json(
        { message: `Video not found with requested id: ${id}` },
        404
      );
    }

    return streamText(c, async (stream) => {
      stream.onAbort(() => {
        console.log("Stream Aborted!");
      });

      for (let i = 0; i < document.description.length; i++) {
        await stream.write(document.description[i]);
        await stream.sleep(30);
      }
    });
  } catch (err) {
    return c.json(
      {
        message: `Fetch failed with error: ${
          (err as any)?.message || "Internal server error"
        }`,
      },
      500
    );
  }
});

// POST new video
video.post("/", async (c) => {
  try {
    const formData = await c.req.json();

    const document = await videoService.addNewVideo(formData);
    return c.json(document.toObject(), 201);
  } catch (err) {
    return c.json(
      {
        message: `Create failed with error: ${
          (err as any)?.message || "Internal server error"
        }`,
      },
      500
    );
  }
});

// Put video
video.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!isValidObjectId(id)) {
      return c.json({ message: `Invalid document id: ${id}` }, 400);
    }

    const document = await videoService.getVideoById(id);
    if (!document) {
      return c.json(
        { message: `Video not found with requested id: ${id}` },
        404
      );
    }

    const formData = await c.req.json();
    const updatedDocument = await videoService.updateVideo(id, formData);
    return c.json(updatedDocument?.toObject(), 200);
  } catch (err) {
    return c.json(
      {
        message: `Patch failed with error: ${
          (err as any)?.message || "Internal server error"
        }`,
      },
      500
    );
  }
});

// Delete video
video.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    if (!isValidObjectId(id)) {
      return c.json({ message: `Invalid document id: ${id}` }, 400);
    }

    const deletedDocument = await videoService.deleteVideo(id);
    if (!deletedDocument) {
      return c.json({ message: `Video with id: ${id} was not found!` }, 404);
    }

    return c.json(deletedDocument.toObject(), 200);
  } catch (err) {
    return c.json(
      {
        message: `Delete failed with error: ${
          (err as any)?.message || "Internal server error"
        }`,
      },
      500
    );
  }
});

// Delete all videos
video.delete("/", async (c) => {
  try {
    const result = await videoService.deleteAllVideos();
    return c.json(result, 200);
  } catch (err) {
    return c.json(
      {
        message: `Delete failed with error: ${
          (err as any)?.message || "Internal server error"
        }`,
      },
      500
    );
  }
});

export default video;
