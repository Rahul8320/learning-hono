import FavYoutubeVideoModel from "../models/fav-youtube-video.model";

class VideoService {
  async getAllVideos() {
    const documents = await FavYoutubeVideoModel.find();
    return documents;
  }

  async addNewVideo(formData: any) {
    const videoModel = new FavYoutubeVideoModel(formData);
    const document = await videoModel.save();
    return document;
  }
}

export default VideoService;
