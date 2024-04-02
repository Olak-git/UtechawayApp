import { CommonActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, LogBox } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { CodeColor } from '../../assets/style';
import { setPresentation } from '../../feature/init.slice';
import { windowWidth } from '../../functions/functions';
import Item from './components/Item';
import Pagination from './components/Pagination';
import { slides } from './components/slides';

const SLIDES = slides;

interface PresentationViewProps {
    navigation: any
}
const PresentationView: React.FC<PresentationViewProps> = ({navigation}) => {

    const dispatch = useDispatch();

    const init = useSelector((state: any) => state.init);
    
    const { presentation } = init;

    const [currentIndex, setCurrentIndex] = React.useState(0)

    const goHome = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {name: 'Home'}
                ]
            })
        )
    }

    const handleOnScroll = (event: any) => {
        // Slide Width
        const slideSize = windowWidth

        // Offset Scroll
        const n = event.nativeEvent.contentOffset.x / slideSize
        const roundIndex = Math.round(n)

        // setCurrentIndex
        if(currentIndex !== roundIndex) {
            setCurrentIndex(roundIndex)
        }
    }

    const handleOnChange = () => {
        dispatch(setPresentation(true))
    }

    useEffect(() => {
        if(presentation) {
            goHome();
        }
    }, [presentation])

    return (
        <SafeAreaView style={[styles.container]}>
            <StatusBar backgroundColor={ CodeColor.code1 }  />
            <FlatList 
                data={ SLIDES }
                keyExtractor={(item) => item.id.toString()}
                renderItem={(item) => (
                    <Item item={item} />
                )}
                horizontal
                showsHorizontalScrollIndicator={ false }
                pagingEnabled
                onScroll={handleOnScroll}
            />
            {/* @ts-ignore */}
            <Pagination handleOnChange={ handleOnChange } index={ currentIndex } data={ SLIDES } />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        position: 'relative'
    }
})

export default PresentationView;