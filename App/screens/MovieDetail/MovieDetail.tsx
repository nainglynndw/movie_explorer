import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/Store';
import _ from 'lodash';
import {fetchMovieDetail} from '../../services/MovieDetailService';
import {addMovieDetails} from '../../store/Movie/MovieSlice';
import {colors} from '../../theme/colors';
import {IMAGE_BASE_URL} from '../../utils/constants';
import {hasInternet, screenHeight, screenWidth} from '../../utils/deviceUtils';
import {
  addFavourite,
  removeFavourite,
} from '../../store/Favourites/FavouriteSlice';

const MovieDetail = (props: any) => {
  const {movieId} = props.route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const {movieDetails} = useSelector((state: RootState) => state.movies);
  const {favouriteList} = useSelector((state: RootState) => state.favourite);
  const currentMovie = _.find(movieDetails, {id: movieId});

  const loadMovies = useCallback(async () => {
    const hasInternetConnection = await hasInternet();
    if (hasInternetConnection) {
      setLoading(true);
      try {
        const movieDetails: any = await fetchMovieDetail(movieId);
        dispatch(addMovieDetails({movieDetails}));
      } catch (error) {
        console.error('Error loading movies:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [dispatch, movieId]);

  useEffect(() => {
    !currentMovie && loadMovies();
  }, [currentMovie, loadMovies]);

  const isFav = _.includes(favouriteList, movieId);
  const favIcon = isFav
    ? require('../../assets/images/heart_fill.png')
    : require('../../assets/images/heart_blank.png');
  const favStyle = isFav
    ? styles.fav
    : [styles.fav, {tintColor: colors.dark.secondary}];

  const onPressFav = () => {
    isFav
      ? dispatch(removeFavourite({favourite: movieId}))
      : dispatch(addFavourite({favourite: movieId}));
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentMovie ? (
        <View>
          <Image
            source={{uri: `${IMAGE_BASE_URL}${currentMovie.poster_path}`}}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.infoContainer}>
            <Image
              style={styles.playBtn}
              source={require('../../assets/images/play.png')}
            />
            <View style={styles.rowContainer}>
              <Text style={styles.title}>{currentMovie.title}</Text>
              <Text style={styles.releaseDate}>
                ({currentMovie.release_date})
              </Text>
              <Pressable onPress={onPressFav}>
                <Image source={favIcon} resizeMode="contain" style={favStyle} />
              </Pressable>
            </View>
            <Text style={styles.rating}>
              Rating : {Number(currentMovie.vote_average).toFixed(1)} / 10
            </Text>
            <View style={styles.rowContainer}>
              {currentMovie?.genres?.length > 0
                ? currentMovie?.genres.map((genre: {name: string}) => {
                    return (
                      <Text key={genre.name} style={styles.genre}>
                        {genre.name}
                      </Text>
                    );
                  })
                : null}
            </View>
            <Text style={styles.overview}>
              {'\t'} {'\t'}
              {currentMovie.overview}
            </Text>
          </View>
          <Pressable
            style={styles.backBtn}
            onPress={() => props.navigation.goBack()}>
            <Image
              style={styles.btnIcon}
              source={require('../../assets/images/back.png')}
            />
          </Pressable>
        </View>
      ) : loading ? (
        <View style={styles.centerView}>
          <ActivityIndicator
            animating={loading}
            size="large"
            color={colors.dark.secondary}
          />
        </View>
      ) : (
        <View style={styles.centerView}>
          <Text>There is no movie data yet!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.dark.primary,
  },
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: screenWidth,
    height: screenHeight * 0.7,
  },
  playBtn: {
    position: 'absolute',
    alignSelf: 'flex-end',
    top: -35,
    right: 10,
    width: 70,
    height: 70,
  },
  infoContainer: {
    borderRadius: 30,
    backgroundColor: colors.dark.primary,
    top: -150,
    padding: 10,
    paddingTop: 40,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.dark.secondary,
  },
  rating: {
    color: colors.dark.secondary,
    fontSize: 13,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  genre: {
    backgroundColor: colors.dark.accent,
    borderRadius: 10,
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: colors.dark.secondary,
    fontSize: 12,
  },
  releaseDate: {
    fontSize: 12,
    color: colors.vibrant.secondary,
    marginHorizontal: 10,
  },
  overview: {
    fontSize: 13,
    color: colors.dark.secondary,
  },
  fav: {
    width: 30,
    height: 30,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  btnIcon: {
    width: 50,
    height: 50,
  },
});
