import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function generate_qr() {
  return (
    <SafeAreaView>
        <Text className='text-white'>Qr code</Text>
    </SafeAreaView>
  )
}

export default generate_qr