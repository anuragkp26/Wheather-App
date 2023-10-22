import { StatusBar } from "expo-status-bar";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";

import { useCallback, useEffect, useState } from "react";

import { debounce } from "lodash";
import { fetchForecast, fetchLocations } from "../api/weather";
import { weatherImages } from "../constants";

import * as Progress from "react-native-progress";

function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleSearch = (query) => {
    console.log("search qry: ", query);
    if (query.length > 2) {
      fetchLocations({ city: query }).then((data) => setLocations(data));
    } else {
      setLocations([]);
    }
  };

  const handleLocation = (loc) => {
    console.log("location : ", loc);
    setLoading(true);
    fetchForecast({ city: loc.name, days: "7" }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
    toggleSearch(!showSearch);
    setLocations([]);
  };

  useEffect(() => {
    const fetchMyweatherData = async () => {
      fetchForecast({ city: "Thiruvananthapuram", days: "7" }).then((data) => {
        setWeather(data);
        setLoading(false);
      });
      toggleSearch(false);
      setLocations([]);
    };

    fetchMyweatherData();
  }, []);

  const searchDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;

  return (
    <View className="flex-1 relative">
      <StatusBar style="light" />
      <Image
        className="absolute h-full w-full"
        source={require("../assets/images/bg.png")}
        blurRadius={70}
      />

      {loading ? (
        <View className="flex-row flex-1 justify-center items-center">
          {/* <Progress.Circle  size={40} color="#0bb3b2" indeterminate= {true} fill="#0bb3b2"/> */}
          <Text className="text-white text-3xl">Loading...</Text>
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          <View style={{ height: "7%" }} className="mx-4 relative z-50">
            <View
              className=" flex-row justify-end items-center rounded-full mt-4"
              style={{
                backgroundColor: showSearch
                  ? theme.bgWhite(0.2)
                  : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={searchDebounce}
                  placeholder="Search city"
                  placeholderTextColor={"lightgray"}
                  className="pl-6 h-10 pb-1 flex-1 text-base text-white"
                />
              ) : null}

              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{ backgroundColor: theme.bgWhite(0.3) }}
                className="rounded-full p-3 m-1"
              >
                <MagnifyingGlassIcon size={24} color="white" />
              </TouchableOpacity>
            </View>

            {locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-20 rounded-3xl">
                {locations.map((loc, index) => {
                  let showBorder = index + 1 != locations.length;
                  let borderClass = showBorder
                    ? "border-b-2 border-gray-400"
                    : "";

                  return (
                    <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                      key={index}
                      className={
                        "flex-row items-center p-2 border-0 px-4 mb-1 " +
                        borderClass
                      }
                    >
                      <MapPinIcon size={18} color="gray" />
                      <Text className="text-black text-lg ml-2">
                        {loc?.name},{loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>

          <View className="mx-4 flex justify-around flex-1 mb-2 mt-2">
            <Text className="text-white text-center text-2xl font-bold">
              {location?.name},
              <Text className="text-lg text-gray-300 font-semibold">
                {" " + location?.country}
              </Text>
            </Text>

            <View className="flex-row justify-center">
              <Image
                //source={require("../assets/images/partlycloudy.png")}
                //source= { {uri: "https:"+ current?.condition?.icon}}
                source={weatherImages[current?.condition?.text]}
                className="w-52 h-52"
              />
            </View>

            <View className="space-x-2">
              <Text className="text-center font-bold text-white text-6xl ml-6">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            <View className="flex-row justify-between mx-4">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/wind.png")}
                  className="w-6 h-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph}km/h
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/drop.png")}
                  className="w-6 h-6"
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/icons/sun.png")}
                  className="w-6 h-6"
                />
                <Text className="text-white font-semibold text-base">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-2 space-y-3">
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size={22} color={"white"} />
              <Text className="text-white text-base">Daily forecast</Text>
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.forecast?.forecastday.map((forecastday, index) => {
                let date = new Date(forecastday?.date);
                let options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", options);
                dayName = dayName.split(",")[0];

                return (
                  <View
                    key={index}
                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                  >
                    <Image
                      //source={require("../assets/images/heavyrain.png")}
                      source={{
                        uri: "https:" + forecastday?.day?.condition?.icon,
                      }}
                      className="w-12 h-12"
                    />
                    <Text className="text-white">{dayName}</Text>
                    <Text className="text-white text-xl font-semibold">
                      {forecastday?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}

export default HomeScreen;
