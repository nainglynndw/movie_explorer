import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {colors} from '../../../theme/colors';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store/Store';
import {useNavigation} from '@react-navigation/native';
import {
  addFavourite,
  removeFavourite,
} from '../../../store/Favourites/FavouriteSlice';
import {fetchMovieList} from '../../../services/MovieListService';
import {addMoviesList} from '../../../store/Movie/MovieSlice';
import FastImage from 'react-native-fast-image';
import {IMAGE_BASE_URL} from '../../../utils/constants';
import {hasInternet, isAndroid, screenWidth} from '../../../utils/deviceUtils';
import _ from 'lodash';
import {
  cacheDir,
  checkAndDownloadFile,
  readCacheFolder,
} from '../../../utils/fileUtils';

const MovieList = ({category}: {category: string}) => {
  const [page, setPage] = useState({
    upcomingPage: 1,
    popularPage: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigaiton = useNavigation<any>();
  const {moviesList} = useSelector((state: RootState) => state.movies);
  const {favouriteList} = useSelector((state: RootState) => state.favourite);
  const [posterPaths, setposterPaths] = useState<string[]>([]);

  const loadMovies = useCallback(async () => {
    const hasInternetConnection = await hasInternet();
    if (hasInternetConnection) {
      setLoading(true);
      try {
        const {results}: any = await fetchMovieList(category, page.currentPage);
        dispatch(addMoviesList({category, moviesList: results}));
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [category, dispatch, page.currentPage]);

  useEffect(() => {
    loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPosters = useCallback(async () => {
    const cachedPosterPaths = await readCacheFolder();
    setposterPaths([...cachedPosterPaths]);
  }, []);

  useEffect(() => {
    checkAndDownloadFile(moviesList[category], loadPosters);
  }, [category, loadPosters, moviesList]);

  const movieListItem = useCallback(
    ({item}: {item: any}) => {
      const isFav = _.includes(favouriteList, item.id);
      const favIcon = isFav
        ? require('../../../assets/images/heart_fill.png')
        : require('../../../assets/images/heart_blank.png');
      const favStyle = isFav
        ? styles.fav
        : [styles.fav, {tintColor: colors.dark.secondary}];

      const onPressMovie = () => {
        navigaiton.navigate('Detail', {
          movieId: item.id,
          moviePoster: posterUrl(),
        });
      };

      const onPressFav = () => {
        isFav
          ? dispatch(removeFavourite({favourite: item.id}))
          : dispatch(addFavourite({favourite: item.id}));
      };

      const posterUrl = () => {
        const isCached = posterPaths.find((posterPath: string) =>
          posterPath.includes(item.id),
        );
        return !isCached
          ? IMAGE_BASE_URL + item.poster_path
          : isAndroid
          ? `file://${cacheDir}${item.id}.jpg`
          : `${cacheDir}${item.id}.jpg`;
      };

      return (
        <TouchableOpacity style={styles.movieContainer} onPress={onPressMovie}>
          <FastImage
            defaultSource={require('../../../assets/images/movie_icon.png')}
            source={{
              uri: posterUrl(),
              priority: FastImage.priority.high,
            }}
            style={styles.moviePoster}
            resizeMode="contain"
          />
          <View style={styles.movieDataContainer}>
            <Text numberOfLines={2} style={styles.movieTitle}>
              {item.title}
            </Text>
            <View style={styles.rowContainer}>
              <Text style={styles.releaseDate}>{item.release_date}</Text>
              <Pressable onPress={onPressFav}>
                <Image source={favIcon} resizeMode="contain" style={favStyle} />
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [dispatch, favouriteList, navigaiton, posterPaths],
  );

  return (
    <FlatList
      initialNumToRender={6}
      maxToRenderPerBatch={1}
      columnWrapperStyle={styles.movieWrapper}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      data={moviesList[category]}
      renderItem={movieListItem}
      keyExtractor={(_, index) => index.toString()}
      onEndReachedThreshold={0.2}
      onEndReached={() => {
        setPage(prev => {
          if (category === 'upcoming') {
            return {
              ...prev,
              upcomingPage: prev.upcomingPage + 1,
              currentPage: prev.upcomingPage + 1,
            };
          } else {
            return {
              ...prev,
              popularPage: prev.popularPage + 1,
              currentPage: prev.popularPage + 1,
            };
          }
        });
        loadMovies();
      }}
      ListFooterComponent={
        !loading ? <Text style={styles.loading}>Loading...</Text> : null
      }
    />
  );
};

export default React.memo(MovieList);

const styles = StyleSheet.create({
  movieWrapper: {
    width: screenWidth,
    justifyContent: 'space-around',
  },
  movieContainer: {
    borderRadius: 10,
    borderWidth: 2,
    width: '47%',
    flex: 1,
    borderColor: colors.dark.accent,
    margin: 10,
    alignItems: 'center',
    paddingBottom: 10,
  },
  moviePoster: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  movieTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    marginBottom: 10,
    color: colors.dark.secondary,
  },
  releaseDate: {
    fontSize: 12,
    color: colors.vibrant.secondary,
  },
  movieDataContainer: {
    paddingHorizontal: 10,
    alignSelf: 'stretch',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  fav: {
    width: 22,
    height: 22,
  },
  loading: {
    alignSelf: 'center',
    color: colors.dark.secondary,
    marginBottom: 40,
  },
});
