import React, { Component } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Platform, StatusBar, Alert, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios'


export default class MeteorScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            meteors: {},
            
        };
    }

    componentDidMount() {
        this.getMeteors()
    }

    getMeteors = () => {
        axios
            .get("https://api.nasa.gov/neo/rest/v1/feed?api_key=z6fzgqxGL19zBIGZ4RnDegPFVIxYjomq3JnKioMu")
            .then(response => {
                this.setState({ meteors: response.data.near_earth_objects })
            })
            .catch(error => {
                Alert.alert(error.message)
            })
    }

    renderItem=({item})=>{
        let meteor = item
        let bg_img,speed,size
        if(meteor.threat_score<=30){
            bg_img=require("../assets/meteor_bg1.png")
            speed=require("../assets/meteor_speed3.gif")
            size=100
        }
        else
        if(meteor.threat_score<=75){
            bg_img=require("../assets/meteor_bg2.png")
            speed=require("../assets/meteor_speed3.gif")
            size=150
        }
        else{
            bg_img=require("../assets/meteor_bg3.png")
            speed=require("../assets/meteor_speed3.gif")
            size=200
        }

        return(
            <View>
         <ImageBackground source={bg_img} style={styles.backgroundImg2}>
            <View style={styles.getContainer}>
                <Image source={speed} style={{width:size,height:size,alignSelf:"center"}}></Image>
                <View>
                    <Text style={[styles.cardTitle,{marginTop:400,marginLeft:50}]}>{item.name}</Text>
                    <Text style={[styles.cardText,{marginTop:20,marginLeft:50}]}>closet to earth{item.close_approach_data[0].close_approach_data_full}</Text>
                    <Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}>minimum diameter(km){item.estimated.diameter.kilometers.estimated_diameter_min}</Text>
                    <Text style={[styles.cardText,{marginTop:5,marginLeft:50}]}>maximum diameter(km){item.estimated.diameter.kilometers.estimated_diameter_max}</Text>
                    <Text style={[styles.cardText,{marginTop:20,marginLeft:50}]}>velocity(kmph){item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
                    <Text style={[styles.cardText,{marginTop:20,marginLeft:50}]}>Missing earth by(km){item.close_approach_data[0].miss_distance.kilometers}</Text>

                </View>

            </View>
         </ImageBackground>
            </View>
        )
    }
    keyExtractor={item,index}=>index.toString();
    render() {
        if (Object.keys(this.state.location).length === 0) {
            return (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                    <Text>Loading</Text>
                </View>
            )
        }
        else {
            let meteor_arr=Object.keys(this.state.meteors).map(
                meteor_date=>{
                    return this.state.meteors[meteor_date]
                }
            )
            let meteors=[].concat.apply([],meteor_arr)
            meteors.forEach(function(element)
            {
                let diameter=(element.estimated_diameter.kilometers.estimated_diameter_min+element.estimated_diameter.kilometers.estimated_diameter_max)/2
                let threatScore=(diameter/element.close_approach_data[0].miss_distance.kilometers)*1000000000
                element.threat_score=threatScore
            })
            meteors.sort(function(a,b)
            {
                return b.threat_score-a.threat_score
            })
            meteors=meteors.slice(0,5)
            return(
                <View style={styles.container} ><SafeAreaView style={styles.droidSafeArea}/>
                <FlatList
                keyExtractor={this.keyExtractor}
                data={meteors}
                renderItem={this.renderItem}
                horizontal={true}/>
                </View>
            )
        }
    }
}