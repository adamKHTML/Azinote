import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerShape}>
                <Image source={require('./img/Azilog.png')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: 0,
        paddingBottom: 20,
        width: 400,

    },
    headerShape: {
        aspectRatio: 3,
        backgroundColor: '#F45B69',
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
        transform: [{ skewY: '-10deg' }],
        position: 'relative', // Permet de positionner les éléments enfants par rapport à ce conteneur
    },



});

export default Header;
