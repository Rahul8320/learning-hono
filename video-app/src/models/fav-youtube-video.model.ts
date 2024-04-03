import { Schema, model } from "mongoose";

export interface IFavYoutubeVideoSchema {
  title: string;
  description: string;
  thumbleUrl?: string;
  watched: boolean;
  youtuberName: string;
}

const FavYoutubeVideoSchema = new Schema<IFavYoutubeVideoSchema>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    thumbleUrl: {
      type: String,
      default: "https://via.placeholder.com/1600x900.webp",
      required: false
    },
    watched: {
      type: Boolean,
      default: false,
      required: true
    },
    youtuberName: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const FavYoutubeVideoModel = model("fav-youtube-videos", FavYoutubeVideoSchema);

export default FavYoutubeVideoModel;
