import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { CameraView} from "expo-camera"
import { Overlay } from './Overlay'


const generate_qr = () => {
  
  return (
         <View style={{flex: 1}}>
          <CameraView 
          style={StyleSheet.absoluteFillObject} 
          facing='back'
          onBarcodeScanned={({data})=>{
            setTimeout(()=>{
              console.log(data)
            },5000)
          }}
          />
          <Overlay/>
         </View>
  )
}

export default generate_qr