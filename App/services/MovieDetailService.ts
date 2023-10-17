import {API_READ_ACCESS_TOKEN} from '../utils/constants';
import Toast from 'react-native-toast-message';
import {BASE_URL} from '../utils/constants';

export const fetchMovieDetail = (id: number) => {
  const url = `${BASE_URL}${id}?language=en-US`;
  return new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        Authorization: `Bearer ${API_READ_ACCESS_TOKEN}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          Toast.show({
            type: 'error',
            text1: 'Fetch Error',
            text2: 'Network response was not ok',
          });
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Fetch Error',
          text2: 'Fetching Movies data from server has error',
        });
        reject(error);
      });
  });
};
