import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator} from 'react-navigation'
import Scanner from './components/Scanner'
import Dashboard from './components/Dashboard'
import HomeScreen from './components/HomeScreen'
import DoughnutChart from './components/DoughnutChart'
import TakePicture from './components/TakePicture'
import * as api from './utils/utils'
import {
  AppLoading,
  Font,
  Constants
} from 'expo';
import { purple, white } from './utils/colors'
import VotePage from './components/VotePage'

function AppStatusBar ({ backgroundColor, ...props }) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props}/>
    </View>
  )
}

const Tabs = createMaterialTopTabNavigator({
  DoughnutChart: {
    screen: DoughnutChart,
    navigationOptions: {
      tabBarLabel: 'Chart',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-bookmarks' size={30} color={tintColor}/>,
    }
  },
  Votings: {
    screen: Dashboard,
    navigationOptions: {
      tabBarLabel: 'Votes',
      tabBarIcon: ({ tintColor }) => <FontAwesome name='plus-square' size={30} color={tintColor}/>
    }
  }
}, {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === 'ios' ? white : purple,
      shadowRadius: 6,
      shadowOpacity: 1,
      shadowColor: 'rgba(0,0,0,0.24)',
      shadowOffset: {
          width: 0,
          height: 3,
      },
    }
  }
})

const MainNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  Scanner: {
    screen: Scanner,
    navigationOptions: {
      header: null,
    },
  },
  TakePicture: {
    screen: TakePicture,
    navigationOptions: {
      header: null,
    },
  },
  VotePage: {
    screen: VotePage,
    navigationOptions: {
      header: null,
    },
  },
  Dashboard: {
    screen: Tabs,
    navigationOptions: {
      header: null,
    }
  },
})

export default class App extends React.Component {
  state = {
    candidates: [],
    isLoaded: false,
  }

  componentWillMount() {
    this.loadAssets();
  }

  componentDidMount() {
    const image_URLs = [
      "https://images.vexels.com/media/users/3/136532/isolated/preview/93b5c734e3776dd11f18ca2c42c54000-owl-round-icon-by-vexels.png",
      "http://clipart-library.com/images/LTdojebac.jpg",
      "https://cdn4.iconfinder.com/data/icons/school-education-14/512/Icon_51-512.png",
      "https://images-na.ssl-images-amazon.com/images/I/51Mwpo7I72L._SX425_.jpg"
    ]
    api.getCandidates().then(data => this.setState({
      candidates: data.map((d, index) => {
        d.push(image_URLs[index])
        return d;
      })
    }));
  }

  loadAssets = async () => {
    await Font.loadAsync({
      'FjallaOne': require('./assets/fonts/Fjalla_One/FjallaOne-Regular.ttf'),
      'ArchivoNarrow': require('./assets/fonts/Archivo_Narrow/ArchivoNarrow-Regular.ttf'),
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({ isLoaded: true });
  };

   componentWillMount() {
    this.loadAssets();
  }

  renderLoading = () => (
    <AppLoading />
  );

  renderApp() {
    
    return (
      <View style={{flex: 1}}>
        <AppStatusBar backgroundColor={purple} barStyle='light-content'/>
        <MainNavigator screenProps={{
          candidates: this.state.candidates,
        }}/>
      </View>
    );
  }

  render = () => (this.state.isLoaded && this.state.candidates.length ? this.renderApp() : this.renderLoading());
}