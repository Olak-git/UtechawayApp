import React, { useEffect, useState } from 'react';
import { Pressable, Image, Text, FlatList, ScrollView, View, Keyboard, VirtualizedList } from 'react-native';
import { account, baseUri, getCurrentDate, requestPermissions } from '../../../../../functions/functions';
import tw from 'twrnc';
import MessageLeft from './MessageLeft';
import MessageRight from './MessageRight';

var date = getCurrentDate();
var show_date = false

const isEmpty = (msg: any) => {
    return !msg.texte && !msg.fichier;
}

interface RenderProps {
    item: any,
    handleSelected: any,
    onHandleImage: any,
    show_date: boolean,
    _date: string
}
const Render : React.FC<RenderProps> = ({ item, handleSelected=() => {}, onHandleImage=() => {}, show_date = false, _date }) => {
    const onHandle = () => {
        handleSelected(item.id)
    }
    return (
        <View key={ item.id.toString() } style={ tw`flex-1` }>
            { show_date && (
                <View style={[ tw`flex-1 items-center mb-3` ]}>
                    <View style={[ tw`bg-slate-100 py-2 px-3 rounded-3xl`, {width: 120} ]}>
                        <Text style={ tw`text-gray-500 text-center italic` }>{ _date == getCurrentDate() ? 'aujourd\'hui' : _date }</Text>
                    </View>
                </View>
            )}
            {!isEmpty(item) ? 
                item.expediteur == account ? 
                    <MessageRight onHandle={ onHandle } onHandleImage={ onHandleImage } key={ item.slug } msg={ item } /> :
                    <MessageLeft onHandle={ onHandle } onHandleImage={ onHandleImage } key={ item.slug } msg={ item } />
                : null
            }
        </View>
    )
}

interface RenderMessageProps {
    messages: any,
    listViewRef: any, 
    setListViewRef: any,
    onHandleImage: any,
    setShowEmojiBoard: any,
    scrollv?: number
}
const RenderMessage: React.FC<RenderMessageProps> = ({ messages, listViewRef, setListViewRef = () => {}, onHandleImage = () => {}, setShowEmojiBoard = () => {}, scrollv = 0 }) => {

    // const [listViewRef, setListViewRef] = useState<any>(null);

    const [selectedId, setSelectedId] = useState(0)

    const [scrollable, setScrollable] = useState(true)

    // @ts-ignore
    const handleSelected = (id) => {
        setSelectedId(id)
    }

    Keyboard.emit = () => {
        setShowEmojiBoard(false)
    }

    Keyboard.addListener('keyboardDidShow', () => {
        // console.log('keyboardDidShow');
        scrollable ? listViewRef?.scrollToEnd({animated: true}) : null
    })

    const dismissAll = () => {
        // Keyboard.dismiss();
        setShowEmojiBoard(false);
    }

    const EmptyComponent = () => (
        <View>
            <Text style={[ tw`text-gray-400` ]}>Aucun message</Text>
        </View>
    )

    const getRender = (item: any, index: number) => {
        let _date = onDate(item.dat)
        return (
            <Render
                key={index.toString()}
                item={item}
                handleSelected={handleSelected}
                onHandleImage={onHandleImage}
                show_date={ show_date }
                // @ts-ignore
                _date={_date}
            />
        )
    }

    // @ts-ignore
    const renderItem = ({ item }) => {
        let _date = onDate(item.dat)
        return (
            <Render
                key={item.id.toString()}
                item={item}
                handleSelected={handleSelected}
                onHandleImage={onHandleImage}
                show_date={ show_date }
                // @ts-ignore
                _date={_date}
            />
        )
    }

    const onDate = ( item_date: string ) => {
        let _date;
        let visibleDate = false
        item_date = item_date.replace(/( [0-9:]+)/g, '')
        if(Date.parse(item_date) !== Date.parse(date)) {
            date = item_date;
            if(Date.parse(date) == Date.parse(getCurrentDate())) {
                visibleDate = true
                date = 'aujourd\'hui';
            }
            _date = date;
            // afficher date
            if(visibleDate) {
                date = item_date;
            }
            show_date = true
        } else {
            show_date = false
        }
        return _date
    }

    useEffect(() => {
        return () => {
            setScrollable(true)
        }
    }, [])

    return (
        scrollv == 0 ?
            <ScrollView
                nestedScrollEnabled={true}
                removeClippedSubviews={true}
                onLayout={(e) => {
                    scrollable ? listViewRef?.scrollToEnd({animated: true}) : null
                }}
                onScroll={e => {
                    scrollable ? setScrollable(false) : null
                }}
                onContentSizeChange={(width, height) => {
                    scrollable ? listViewRef?.scrollToEnd({animated: true}) : null
                }}
                onTouchEnd={e => {
                    dismissAll()
                }}
                keyboardDismissMode='none'
                contentContainerStyle={[ tw`py-2 px-4` ]}
                horizontal={false}
                showsHorizontalScrollIndicator={ false }
                showsVerticalScrollIndicator={ true }
                ref={(ref) => {
                    // listViewRef = ref;
                    setListViewRef(ref)
                }} 
            >
                { messages.length == 0 ? 
                    <View>
                        <Text style={[ tw`text-gray-400` ]}>Aucun message</Text>
                    </View> : 
                    messages.map((item: any, index: number) => getRender(item, index))
                }
            </ScrollView>

        : scrollv == 1 ?
            <FlatList
                nestedScrollEnabled={ true }
                // windowSize={5}
                removeClippedSubviews={true}
                onLayout={(e) => {
                    scrollable ? listViewRef?.scrollToEnd({animated: true}) : null
                }}
                onScroll={e => {
                    scrollable ? setScrollable(false) : null
                }}
                onContentSizeChange={(width, height) => {
                    scrollable ? listViewRef?.scrollToEnd({animated: true}) : null
                }}
                onTouchEnd={dismissAll}
                onEndReached={(e) => {
                    setScrollable(true)
                    // console.log('FIN');
                }}
                initialNumToRender={messages.length - 1}
                keyboardDismissMode='none'
                ListEmptyComponent={
                    <EmptyComponent />
                }
                contentContainerStyle={[ tw`py-2 px-4` ]}
                data={ messages }
                keyExtractor={(item, index) => index.toString()} 
                renderItem={renderItem}
                horizontal={ false }
                showsHorizontalScrollIndicator={ false }
                showsVerticalScrollIndicator={ true }
                extraData={selectedId}
                ref={(ref) => {
                    setListViewRef(ref)
                }} 
            />

        :
            <VirtualizedList
                nestedScrollEnabled={ true }
                // windowSize={5}
                removeClippedSubviews={true}
                onLayout={(e) => {
                    scrollable ? listViewRef?.scrollToEnd({animated: true}) : null
                }}
                onScroll={e => {
                    scrollable ? setScrollable(false) : null
                }}
                onContentSizeChange={(width, height) => {
                    scrollable ? listViewRef?.scrollToEnd({animated: true}) : null
                }}
                onTouchEnd={dismissAll}
                onEndReached={(e) => {
                    setScrollable(true)
                    // console.log('FIN');
                }}
                initialNumToRender={messages.length - 1}
                keyboardDismissMode='none'
                ListEmptyComponent={ 
                    <EmptyComponent />
                }
                contentContainerStyle={[ tw`py-2 px-4` ]}
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                getItemCount={data => data.length}
                getItem={(data, index) => data[index]}
                horizontal={ false }
                showsHorizontalScrollIndicator={ false }
                showsVerticalScrollIndicator={ true }
                extraData={selectedId}
                ref={(ref) => {
                    // listViewRef = ref;
                    setListViewRef(ref)
                }} 
            />
    )
}

export default RenderMessage;