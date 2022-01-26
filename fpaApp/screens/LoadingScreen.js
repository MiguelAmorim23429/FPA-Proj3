import React from 'react'
import { StyleSheet,  View, Image, ActivityIndicator } from 'react-native'

const LoadingScreen = () => {
    return (
        
        <View style={[styles.container, styles.vertical]}>
            <Image
                style={styles.imageTeste}
                source={require('C:/Users/Pedro/Documents/GitHub/FPA-Proj3/fpaApp/assets/fpa-logo.png')}
            />
            <ActivityIndicator animating={true} hidesWhenStopped={false} size={100} color='#5A79BA'/>
        </View>
    )
}

export default LoadingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vertical: {
        padding: 10,
    },
    imageTeste: {
        width: 293.3,
        height: 200,
    },
})
