import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../../../theme/colors';

type THeader = {
  category: string;
  setCategory: (category: string) => void;
};

const Header = ({category, setCategory}: THeader) => {
  const focusTheme = (focusItem: string) => {
    if (category === focusItem) {
      return {bgcolor: colors.dark.accent, color: colors.dark.secondary};
    } else {
      return {bgcolor: colors.dark.primary, color: colors.dark.accent};
    }
  };
  return (
    <View style={styles.headerContainer}>
      <Pressable
        style={[
          styles.headerView,
          {
            backgroundColor: focusTheme('upcoming').bgcolor,
          },
        ]}
        onPress={() => setCategory('upcoming')}>
        <Text
          style={[
            styles.header,
            {
              color: focusTheme('upcoming').color,
            },
          ]}>
          Upcoming
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.headerView,
          {
            backgroundColor: focusTheme('popular').bgcolor,
          },
        ]}
        onPress={() => setCategory('popular')}>
        <Text
          style={[
            styles.header,
            {
              color: focusTheme('popular').color,
            },
          ]}>
          Popular
        </Text>
      </Pressable>
    </View>
  );
};

export default React.memo(Header);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.dark.accent,
    padding: 10,
    margin: 10,
  },
  header: {
    fontWeight: 'bold',
    color: colors.dark.accent,
  },
});
