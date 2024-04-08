import React from 'react';
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native';
import WavyHeader from './Component/WavyHeader';

export default function ScreenOne() {
    return (
        <View style={styles.container}>
            <WavyHeader customStyles={styles.svgCurve} />
            <View style={styles.headerContainer}>
                <Image style={styles.headerImage} source={require('./img/Azilog.png')} />
            </View>
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
