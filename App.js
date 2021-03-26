import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import ajax from './src/components/ajax';
import DealDetail from './src/components/DealDetail';
import DealList from './src/components/DealList';
import SearchBar from './src/components/SearchBar';

const App = () => {
  const [deals, setDeals] = useState([]);
  const [dealsFromSearch, setDealsFromSearch] = useState([]);
  const [currentDealId, setCurrentDealId] = useState(null);

  const titleXPos = new Animated.Value(0);

  const currentDeal = () => {
    return deals.find(deal => {
      return deal.key === currentDealId;
    });
  };

  const searchDeals = searchTerm => {
    if (searchTerm) {
      ajax.fetchDealsSearchResult(searchTerm).then(resp => {
        if (resp) {
          setDealsFromSearch(resp);
        }
      });
    } else {
      setDealsFromSearch([]);
    }
  };

  const animateTitle = (direction = 1) => {
    console.log('ANIMATED');
    const width = Dimensions.get('window').width - 155;
    Animated.timing(titleXPos, {
      toValue: direction * (width / 2),
      useNativeDriver: false,
      duration: 1000,
      easing: Easing.ease,
    }).start(({finished}) => {
      if (finished) {
        animateTitle(-1 * direction);
      }
    });
  };

  useEffect(() => {
    animateTitle();
    ajax
      .fetchInitialDeals()
      .then(resp => {
        if (resp) {
          setDeals(resp);
        }
      })
      .catch(error => console.error(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (currentDealId) {
    return (
      <DealDetail
        initialDealData={currentDeal()}
        goBack={() => {
          setCurrentDealId(null);
        }}
      />
    );
  }

  const dealsToDisplay = dealsFromSearch.length > 0 ? dealsFromSearch : deals;

  if (dealsToDisplay.length > 0) {
    return (
      <>
        <SearchBar searchDeals={searchDeals} />
        <DealList deals={dealsToDisplay} onItemPress={setCurrentDealId} />
      </>
    );
  }

  return (
    <Animated.View style={[{left: titleXPos}, styles.container]}>
      <Text style={styles.header}>BakeSale</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
  },
});
export default App;
