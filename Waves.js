import * as React from 'react'
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import WavyHeader from './Component/WavyHeader';
import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat';


export default function ScreenOne() {
    let [fontsLoaded] = useFonts({
        Montserrat_400Regular,
    });

    if (!fontsLoaded) {
        return null;
    }
    return (
        <View style={styles.container}>
            <WavyHeader customStyles={styles.svgCurve} />
            <View style={styles.headerContainer}>
                <Image style={styles.headerImage} source={require('./img/Azilog.png')} />
            </View>
            <Text style={{ fontFamily: 'Montserrat_400Regular' }}>Lorem ipsum dolor sit amet consectetur adipisicing elit. In ad repudiandae, sed consectetur delectus voluptatibus sunt aliquam voluptatum nobis ducimus assumenda, dolorem labore esse voluptatem? Quis provident nobis qui error?</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        marginTop: 50,
        marginHorizontal: 10,
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    svgCurve: {
        position: 'absolute',
        width: Dimensions.get('window').width,
    },
    headerImage: {
        width: 125,
        height: 125,
        resizeMode: 'contain',
    },
});
