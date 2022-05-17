import { Injectable } from '@angular/core';
import {
  Directory,
  Filesystem,
  FilesystemDirectory,
} from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  public videos = [];
  private VIDEOS_KEY: string = 'videos';

  constructor() {}

  //Cargar videos
  async loadVideos() {
    const videoList = await Storage.get({ key: this.VIDEOS_KEY });
    this.videos = JSON.parse(videoList.value) || [];
    return this.videos;
  }

  async storevideo(blob) {
    const fileName = new Date().getTime() + '.map';
    const base64Data = (await this.convertBlobToBase64(blob)) as string;
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: blob,
      directory: Directory.Data,
    });

    this.videos.unshift(savedFile);
    console.log('my array now', this.videos);

    return Storage.set({
      key: this.VIDEOS_KEY,
      value: JSON.stringify(this.videos),
    });
  }

  //Helper function
  //Convierte un BLOB en BASE64
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async getVideoUrl(fullPath) {
    const path = fullPath.substr(fullPath.lastIndexOf('/') + 1);
    const file: any = await Filesystem.readFile({
      path: path, //123123.mp4
      directory: Directory.Data, // DATA/
    });
    return `data:video/mp4;base64,${file.path}`;
  }
}
