import LoadingSpinner from 'react-native-loading-spinner-overlay';
import React,{Component} from 'react'
import {StyleSheet} from 'react-native'

export const Spinner=()=>{
    return <LoadingSpinner
          visible={true}
          textStyle={styles.spinnerTextStyle}
        />
}

const styles = StyleSheet.create({
    spinnerTextStyle:{

    }
})