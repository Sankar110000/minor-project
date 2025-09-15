import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const TouchableBtn = ({onPress ,textStyle,btnStyle,title}:any) => {
  return (
    <TouchableOpacity className={btnStyle} onPress={onPress}>
        <Text className={textStyle}>{title}</Text>
    </TouchableOpacity>
  )
}

export default TouchableBtn