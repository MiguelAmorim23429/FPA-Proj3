import { StyleSheet, Text, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'

import Icon from 'react-native-vector-icons/Ionicons';

const Toast = (props) => {

    const toastTrigger = props.toastTrigger

    

    const mounted = useRef(false);
    const bottomAnim = useRef(new Animated.Value(-68)).current;

    useEffect(() => {
        console.log("a", mounted)
        mounted.current = true;
        console.log("b", mounted)
        console.log('CASDA', props.toastTrigger)
        const closeTimeout = setTimeout(() => {
            toastTrigger && (
                Animated.sequence([
                    Animated.timing(
                        bottomAnim,
                        {
                            toValue: 32,
                            duration: 375,
                            useNativeDriver: false,
                        }
                    ),
                    Animated.timing(
                        bottomAnim,
                        {
                            toValue: -68,
                            duration: 375,
                            useNativeDriver: false,
                            delay: 2000,
                        }
                    )
                ]).start()
            )
        }, 500);

        return () => {
            mounted.current = false;
            clearTimeout(closeTimeout)
            console.log("c", mounted)
        }
    }, [toastTrigger])

    return (
        <Animated.View style={{ ...styles.toastContainer, bottom: bottomAnim }}>
            <Icon style={styles.toastIcon} name='checkmark-circle' size={48} />
            <Text>Resultados adicionados com sucesso.</Text>
        </Animated.View>
    )
}

export default Toast

const styles = StyleSheet.create({
    toastContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        borderRadius: 48,
        width: 310,
        height: 60,
    },
    toastIcon: {
        color: '#00B23C',
        marginLeft: 8,
    }
})