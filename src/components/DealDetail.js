import React, {Component} from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Image,
  Linking,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {priceDisplay} from '../util';
import ajax from './ajax';

export class DealDetail extends Component {
  state = {
    deal: this.props.initialDealData,
    isComplete: false,
    imageIndex: 0,
  };

  imageXPos = new Animated.Value(0);

  imagePanResponser = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      console.log('Moving', gs.dx);
      this.imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get('window').width;

      if (Math.abs(gs.dx) < this.width * 0.4) {
        // swipe left
        const direction = Math.sign(gs.dx);
        // -1 for swipe left,1 for swipe right
        Animated.timing(this.imageXPos, {
          toValue: direction * this.width,
          duration: 250,
          useNativeDriver: false,
        }).start(() => this.handleSwipe(-1 * direction));
      } else {
        Animated.spring(this.imageXPos, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }

      console.log('Release');
    },
  });

  handleSwipe = indexDirection => {
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      Animated.spring(this.imageXPos, {
        toValue: 0,
        useNativeDriver: false,
      }).start();

      return;
    }

    this.setState(
      prevState => {
        return {
          imageIndex: prevState.imageIndex + indexDirection,
        };
      },
      () => {
        // animate the next image
        this.imageXPos.setValue(indexDirection * this.width);
        Animated.spring(this.imageXPos, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      },
    );
  };

  openDealUrl = () => {
    Linking.openURL(this.state.deal.url);
  };

  componentDidMount() {
    ajax.fetchDealDetail(this.state.deal.key).then(fullDeal => {
      if (fullDeal) {
        this.setState({
          deal: fullDeal,
          isComplete: true,
        });
      }
    });
  }
  render() {
    const {deal} = this.state;
    return (
      <View style={styles.deal}>
        <TouchableOpacity onPress={this.props.goBack}>
          <Text style={styles.backLink}>Back</Text>
        </TouchableOpacity>
        <View>
          <Animated.Image
            {...this.imagePanResponser.panHandlers}
            source={{uri: deal.media[this.state.imageIndex]}}
            style={[{left: this.imageXPos}, styles.image]}
          />
          <Text style={styles.title}> {deal.title} </Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.info}>
              <View style={styles.footer}>
                <View>
                  <Text style={styles.price}> {priceDisplay(deal.price)} </Text>
                  <Text style={styles.cause}> {deal.cause.name} </Text>
                </View>
                {this.state.isComplete ? (
                  <View>
                    <Image
                      source={{uri: deal.user.avatar}}
                      style={styles.avatar}
                    />
                    <Text>{deal.user.name}</Text>
                  </View>
                ) : null}
              </View>
            </View>
            {this.state.isComplete ? (
              <View style={styles.description}>
                <Text>{deal.description}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
        <Button
          title="Buy this Deal"
          onPress={this.openDealUrl}
          style={styles.btn}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  deal: {
    marginHorizontal: 12,
    marginVertical: 20,
    flex: 1,
    height: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(237,149,45,0.4)',
    padding: 10,
  },
  info: {
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  cause: {},
  price: {
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
  },
  description: {
    padding: 10,
    borderWidth: 1,
    margin: 5,
    borderColor: '#bbb',
  },
  backLink: {
    marginBottom: 5,
    color: '#22f',
  },
  scrollView: {
    height: '50%',
    marginBottom: 10,
  },
  btn: {
    bottom: 1,
  },
});

export default DealDetail;
