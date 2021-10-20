
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect,useState } from 'react';
import { View,
   StyleSheet,
   Text,
   ScrollView,
   Dimensions,
   ActivityIndicator,
   } from 'react-native';
import {Fontisto} from '@expo/vector-icons';

const {width : SCREEN_WIDTH} = Dimensions.get("window");
const API_KEY = "87fae6db73a8983b85ff5fcc8b3971bd";
const  icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Atmosphere : "cloudy-gusts",
  Snow : "snow",
  Rain : "rains",
  Drizzle : "rain",
  Thunderstorm : "lightning"
}
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days,setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords : {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy : 5})
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGoogleMaps : false}
      );
      setCity(location[0].city);
      const response = await fetch
      (`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
      const json = await response.json();
      console.log(json)
      setDays(json.daily);
  }
  useEffect(() => {
    getWeather();
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
      horizontal 
      pagingEnabled 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
           <View style={styles.day}>
             <ActivityIndicator color="black" style={{marginTop : 10}} size="large" />
        </View>
        ) : (
          days.map((day, index) => 
          <View key={index} style={styles.day}>
            <View style={{flexDirection: "row", alignItems : "center", justifyContent : "space-between", width : "100%", paddingRight : 30 }}>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
            </View>

            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
          )
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{
    flex : 1,
    backgroundColor : "tomato"
  },
  city : {
    flex : 1,
    backgroundColor : "tomato",
    justifyContent : "center",
    alignItems : "center"
  },
  cityName : {
    fontSize : 68,
    fontWeight : "600",
    color : "#fff"
  },
  weather : {
    
  },
  day : {
    width : SCREEN_WIDTH,
    
  },
  temp : {
    fontSize : 100,
    marginTop : 50,
    marginLeft : 10,
    color : "#fff"

  },
  description : {
    marginLeft : 20,
    fontSize : 40,
    textAlign : "left",
    color : "#fff"
  },
  tinyText : {
    fontSize : 16,
    marginLeft : 20,
    textAlign : "left",
    color : "#fff"

  }
});

