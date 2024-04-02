import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Modal } from 'react-native-form-component';

interface ModalValidationFormProps {
    showM: boolean
}

export const ModalValidationForm: React.FC<ModalValidationFormProps> = (props) => {
    const { showM } = props;
    return (
        <Modal 
            show={showM}
            backgroundColor={'rgba(0,0,0,0.4)'}
            style={[ {} ]}>
            <View style={[ {flex: 1, justifyContent: 'center', alignItems: 'center'} ]}>
                <ActivityIndicator
                    size='small'
                    color={'#FFFFFF'}
                    animating />
            </View>
        </Modal>
    )
}