import FavYoutubeVideoModel from "../models/fav-youtube-video.model";

class VideoService {
  async getAllVideos() {
    const documents = await FavYoutubeVideoModel.find();
    return documents;
  }

  async addNewVideo(formData: any) {
    if (!formData.thumbnailUrl) {
      delete formData.thumbnailUrl;
    }

    const videoModel = new FavYoutubeVideoModel(formData);
    const document = await videoModel.save();
    return document;
  }

  async getVideoById(id: string) {
    const document = await FavYoutubeVideoModel.findById(id);
    return document;
  }

  async updateVideo(id: string, formData: any) {
    const updatedDocument = await FavYoutubeVideoModel.findByIdAndUpdate(
      id,
      formData,
      { new: true }
    );

    return updatedDocument;
  }

  async deleteVideo(id: string) {
    const deletedDocument = await FavYoutubeVideoModel.findByIdAndDelete(id);
    return deletedDocument;
  }

  async deleteAllVideos() {
    const result = await FavYoutubeVideoModel.deleteMany({});
    return result;
  }
}

export default VideoService;
