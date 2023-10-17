import RNFS from 'react-native-fs';
import {IMAGE_BASE_URL} from './constants';

export const getFileNameFromURL = (url: string): string => {
  const pathSegments = url.split('/');
  const lastSegment = pathSegments[pathSegments.length - 1];
  const fileName = lastSegment.split(/[?#]/)[0];
  return fileName;
};

export const cacheDir = RNFS.DocumentDirectoryPath + '/';

export const downloadFile = (
  url: string,
  id: number,
  progress?: (arg: RNFS.DownloadProgressCallbackResult) => void,
) => {
  return new Promise<string | null>((resolve, reject) => {
    const savePath = cacheDir + id + '.jpg';
    RNFS.downloadFile({
      fromUrl: url,
      toFile: savePath,
      progress: progress,
      progressDivider: 10,
    })
      .promise.then(res => {
        res.statusCode === 200 ? resolve(savePath) : resolve(null);
      })
      .catch(err => reject(err));
  });
};

export const checkAndDownloadFile = async (
  movieLists: any[],
  callback: () => void,
) => {
  try {
    const fileExistPromises = movieLists.map(async movie => {
      const savePath = cacheDir + movie.id + '.jpg';
      const remoteUrl = `${IMAGE_BASE_URL}${movie.poster_path}`;
      const fileExists = await RNFS.exists(savePath);
      if (!fileExists) {
        console.log('File not found, downloading:', savePath);
        return downloadFile(remoteUrl, movie.id);
      }
      return true;
    });
    const downloadResults = await Promise.all(fileExistPromises);
    return downloadResults;
  } catch (error) {
    console.error('Error checking file existence and downloading:', error);
    throw error;
  } finally {
    callback();
  }
};

export const readCacheFolder = async () => {
  try {
    const cachedPosterLists = await RNFS.readDir(cacheDir);
    const cleanedList = cachedPosterLists.map(file => file.path);
    return cleanedList;
  } catch (error) {
    console.error('Error reading cache folder:', error);
    throw error;
  }
};

export const extractIdFromUrl = (url: string) => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1];
  const id = fileName.split('.')[0];
  return id;
};
