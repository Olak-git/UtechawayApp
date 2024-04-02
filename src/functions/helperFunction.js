import { Platform, PermissionsAndroid, Linking } from "react-native";

export const show_live_header_btn_copy = false

export const callable = true;

export const live = true;

export const saveMessages = false;

export const getErrorsToString = (errors) => {
    let txt = '';
    if(typeof errors == 'object') {
        const l = Object.keys(errors).length - 1;
        let i = 0;
        for(let k in errors) {
            if(txt) txt += '\n';
            txt += '-' + errors[k];
            // txt += '-' + k.replace(/_/g, ' ').replace(/(nb )|( prov)/g, '').replace(/km/g, 'distance') + ': ' + errors[k];
        }
    } else {
        txt = errors;
    }
    return txt;
}

export const isEmpty = (text) => {
    return text=='' || text==null
    return !(text!='' && text!=null);
}

export const capitalizeFirstLetter = (str) => {
    str = str.toLowerCase();
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

const MONTH = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'decembre'];

export const toTimestamp = (strDate) => {
    var datum = Date.parse(strDate);
    return datum/1000;

    // let myDate = strDate.split("-");
    // var newDate = new Date(myDate[0], myDate[1] - 1, myDate[2]);
    // return newDate.getTime();
}

export const getLocalDate = (date) => {
    const _date = date.split(' ')[0];
    const explode = _date.split('-');
    const year = explode[0];
    const month = explode[1];
    const dat = explode[2];
    return dat + ' ' + MONTH[parseInt(month) - 1] + ' ' + year;
    return (new Date(date)).toLocaleString('fr-FR', {day: '2-digit', month: 'long', year: 'numeric'});
}

export const getLocalTime = (date) => {
    return date.slice(date.split(' ')[0].length + 1, date.length - 3);
    return (new Date(date)).toLocaleString('fr-FR', {hour: '2-digit', minute: '2-digit'});
}

export const getLocalTimeStr = (h) => {
    return h.slice(0, h.length - 3);
    return (new Date('2000-00-00 ' + h)).toLocaleString('fr-FR', {hour12: false, hour: '2-digit', minute: '2-digit'});
}

export const getSqlFormatDateTime = (date) => {
    return getSqlFormatDate(date) + ' ' + getSqlFormatTime(date);
}

export const getSqlFormatDate = (date) => {
    return (new Date(date)).toLocaleDateString('ko-KR', {day: '2-digit', month: '2-digit', year: 'numeric'}).replace(/(\. )/g, '/').replace(/\./g, '');
}

export const getSqlFormatTime = (date) => {
    return (new Date(date)).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', second: '2-digit'});
}

export const formatChaineHid = (text, face, back) => text.slice(0, face) + text.slice(face, text.length-back).replace(/./g, '*') + text.slice(text.length-back, text.length);

export const clone = (obj) => Object.assign({}, obj);

export const storagePermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        // {
        //     title: 'File',
        //     message:
        //         'App needs access to your Storage Memory... ',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        // },
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Storage Permission denied')
    }).catch((error) => {
        console.log('Ask Storage permission error: ', error)
    })
})

export const readPhonePermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
        {
            title: 'Phone',
            message:
                'App needs access to your Files... ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        },
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Storage Permission denied')
    }).catch((error) => {
        console.log('Ask Storage permission error: ', error)
    })
})

export const cameraPermission = () => new Promise(async (resolve, reject) => {
    if(Platform.OS == 'ios') {
        return resolve('granted')
    }
    return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
    ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted')
        }
        return reject('Camera Permission denied')
    }).catch((error) => {
        console.log('Ask Camera permission error: ', error)
    })
})

export const openUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    
    console.log(`Link pressed: ${url}`);

    if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
    } else {
        Alert.alert(`Don't know how to open this URL: ${url}`);
    }
}

export const rs = {
    facebook: 'https://web.facebook.com/utechaway',
    twitter: 'https://twitter.com/utechaway',
    linkedin: 'https://www.linkedin.com/company/utechaway',
    a_propos: 'https://utechaway.com',
    conditions_d_utilisation: 'https://utechaway.com',
    politique_de_confidentialite: 'https://utechaway.com'
}

// const hasPermission = async () => {
//     if(Platform.OS == 'android') {
//         const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//             {
//               title: 'File',
//               message:
//                 'App needs access to your Files... ',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             return true;
//         }
//     } else {
//         return true;
//     }
//     return false
// }