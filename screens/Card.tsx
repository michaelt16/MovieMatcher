import { Dimensions,View,Text,Image, StyleSheet, Button, Pressable, StatusBar } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faX, faHeart } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from "react";
import { ScrollView, Swipeable ,PanGestureHandler, TapGestureHandler} from "react-native-gesture-handler";
import Animated,{interpolate, runOnJS, runOnUI, useAnimatedGestureHandler,useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated"
import { withSpring } from "react-native-reanimated";
import {API_KEY} from "@env"
import axios from "axios";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationProp } from '@react-navigation/native';

const {width,height} = Dimensions.get("window")
const φ = (1 + Math.sqrt(5)) / 2;
const deltaX = width / 2;
const w = width - 32;
const h = w * φ;
const imageLink = "https://image.tmdb.org/t/p/w500/"

//  {
//   "genres": [
//     {
//         "id": 28,
//         "name": "Action"
//     },
//     {
//         "id": 12,
//         "name": "Adventure"
//     },
//     {
//         "id": 16,
//         "name": "Animation"
//     },
//     {
//         "id": 35,
//         "name": "Comedy"
//     },
//     {
//         "id": 80,
//         "name": "Crime"
//     },
//     {
//         "id": 99,
//         "name": "Documentary"
//     },
//     {
//         "id": 18,
//         "name": "Drama"
//     },
//     {
//         "id": 10751,
//         "name": "Family"
//     },
//     {
//         "id": 14,
//         "name": "Fantasy"
//     },
//     {
//         "id": 36,
//         "name": "History"
//     },
//     {
//         "id": 27,
//         "name": "Horror"
//     },
//     {
//         "id": 10402,
//         "name": "Music"
//     },
//     {
//         "id": 9648,
//         "name": "Mystery"
//     },
//     {
//         "id": 10749,
//         "name": "Romance"
//     },
//     {
//         "id": 878,
//         "name": "Science Fiction"
//     },
//     {
//         "id": 10770,
//         "name": "TV Movie"
//     },
//     {
//         "id": 53,
//         "name": "Thriller"
//     },
//     {
//         "id": 10752,
//         "name": "War"
//     },
//     {
//         "id": 37,
//         "name": "Western"
//     }
// ]
// }

interface MovieData {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export default function Card({navigation}: { navigation: NavigationProp<any> }): JSX.Element {
    const [favorited,setFavorites]= useState<MovieData[]>([])
    const [currentIndex,setCurrentIndex]= useState(0)
    const [movieData, setMovieData] = useState<MovieData|null>();
    useEffect(() => {
      axios
        .get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=878`)
        .then((resp) => resp.data)
        .then((data) => {
          console.log(data.results.length)
          if(data.results[currentIndex].poster_path !== undefined){
           setMovieData(data.results[currentIndex]);
          }
        });
    }, [currentIndex]);
    
    useEffect(() => {
      console.log(favorited); 
    }, [favorited]);

    const handleSwipeRight = () => {
        setCurrentIndex(currentIndex + 1);
        if (movieData != null) {
          setFavorites([...favorited, movieData]);
        }
      
    };
    
    const handleSwipeLeft = () => {
        setCurrentIndex(currentIndex + 1);
    };
    

    const handleSwipe =(translationX : number)=>{
      if(translationX>100){
        console.log("right")
        translateX.value = withSpring(0)
        runOnJS(handleSwipeRight)();
        
      }else if (translationX<-100){
        console.log("left")
        translateX.value = withSpring(0)
        runOnJS(handleSwipeLeft)();
        
      }
      translateX.value = withSpring(0)
      console.log("end")
      
    }
    const handlePress = ()=>{
      console.log("pressed")
      spin.value = spin.value ? 0 : 1
    }
    
    const spin = useSharedValue<number>(0)
    const frontSpinAnimation = useAnimatedStyle(()=>{
      const spinVal = interpolate(spin.value,[0,1],[0,180])
      return{
        transform:[
          {
            rotateY: withTiming(`${spinVal}deg`, { duration: 500 })
          }
        ]
      }
    })

    const backSpinAnimation = useAnimatedStyle(()=>{
      const spinVal = interpolate(spin.value,[0,1],[180,360])
      return{
        transform:[
          {
            rotateY: withTiming(`${spinVal}deg`, { duration: 500 })
          }
        ]
      }
    })
    const translateX =  useSharedValue<number>(0)
    const horizontalSwipeAnimation = useAnimatedStyle(()=>{
      return{
        transform:[{
          translateX: translateX.value 
        }],
      }
    })

    const translateY = useSharedValue<number>(0)
    const verticalSwipeAnimation = useAnimatedStyle(()=>{
      return{
        transform:[
          {
            translateY: translateY.value
          }
        ]
      }
    })

    const xGestureHandler = useAnimatedGestureHandler({
      onStart:(e)=>{
        console.log(e.translationX)
        console.log("Start")
        
      },
      onActive:(e)=>{ 
        translateX.value = e.translationX
        console.log(e.translationY)
        console.log("active")
      },
      onEnd:(e)=>{
        runOnJS(handleSwipe)(e.translationX)
      }
    })
    const handleNavigation = function (navigation:NavigationProp<any>){
      navigation.navigate('MovieTrailers',{id:movieData?.id})
      
    }
    const yGestureHandler = useAnimatedGestureHandler({
      onStart:(e)=>{
        console.log(e.translationY)
        console.log("Start")
        
      },
      onActive:(e)=>{ 
        translateY.value = e.translationY
        console.log(e.translationY)
        console.log("active")
      },
      onEnd:(e)=>{
        console.log(e.translationY)
        if (e.translationY<-100){
          console.log("up")
          translateY.value = withSpring(0,{overshootClamping:true})
          runOnJS(handleNavigation)(navigation)
        }else{
          translateY.value = withSpring(0,{overshootClamping:true})
        }
        
      
      }
    })
   
    
  
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        
      <View style={[styles.container]}>
      <View style={{flex: 1}}>
        <View style={styles.button}>
          <Button onPress={()=>{
            console.log('favorited:', favorited);

            console.log('presssed', favorited.map((movie)=>movie?.title))
            navigation.navigate('Favorites',{favorites:favorited})
          }} title="Favorites" color="#4d5d76"/>
        </View>
        
      </View>
      <TapGestureHandler numberOfTaps={1} onActivated={handlePress}>
        <Animated.View style={[styles.front,frontSpinAnimation]} >
          <PanGestureHandler onGestureEvent={xGestureHandler}>
            <Animated.Image style={[styles.poster,horizontalSwipeAnimation,verticalSwipeAnimation]}source={{ uri: imageLink + movieData?.poster_path }} ></Animated.Image>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler> 

      <TapGestureHandler numberOfTaps={1} onActivated={handlePress}>
        <Animated.View style={[styles.back,backSpinAnimation,verticalSwipeAnimation]} >
          <PanGestureHandler onGestureEvent={yGestureHandler} >
            <Animated.View style={[styles.hitbox]} >
            <Animated.Image style={[styles.poster,{opacity:0.2}]}source={{ uri: imageLink + movieData?.poster_path }} ></Animated.Image>
              <Text style={{padding:20,position:"absolute",color:"white",fontSize:20, fontWeight:"bold"}}>{movieData?.title}</Text>
              <Text style={{padding:20,paddingTop:80,position:"absolute",color:"white"}}>{movieData?.overview}</Text>
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler> 

      
      <View style={{flex: 1,flexDirection:"row",justifyContent:"space-evenly",paddingBottom:25}}>
          <View style={styles.circle}>
            <FontAwesomeIcon  icon={faX} size={32} color="#ec5288" />
          </View>
          <View style={styles.circle}>
            <FontAwesomeIcon  icon={faHeart} size={32} color="#6ee3b4" />
          </View>
      </View>
    </View>
    </GestureHandlerRootView>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#262b3f",
    },
    poster:{
      width:w,
      height:h,
      borderRadius:20
      
    },
    circle:{
      width: 64,
      height: 64,
      borderRadius: 32,
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#4d5d76",
      shadowColor: "gray",
      shadowOffset: { width: 1, height: 1 }
    },
    hitbox:{
      position:"absolute",
      width:w,
      height:h,
      backgroundColor: '#1d1d29',
      borderRadius:20,
      
    },
    button:{
    marginTop:40,
    width:100,
    height:40,
    color:"red"
    },
    front:{
      flex: 8,
      justifyContent:"center",
      alignItems:"center",
      
    },
    back:{
      position:"absolute",
      width:w,
      height:h,
      top:98,
      left:16,
      borderRadius:20,
      padding:10,
      backfaceVisibility: "hidden",
      backgroundColor:"grey"
    }
  })