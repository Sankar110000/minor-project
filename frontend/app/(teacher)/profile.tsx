import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const profile = () => {

    const [menuVisible,setMenuVisible]=useState(false)
     const handleLogout= async ()=>{
      try {
      const token =  await AsyncStorage.removeItem("token"); // removes only "token"
    const role = await AsyncStorage.removeItem("role"); // removes only "token"
    // console.log(token);
    // console.log(role);
    Alert.alert("Token cleared");
    setMenuVisible(false)
    router.push("/(auth)/login")
  } catch (error) {
    console.error("Error clearing token", error);
  }
  }
  return (
    <SafeAreaView>
       <View className="flex-row justify-between items-center mb-6">
      <Text className="text-white text-3xl font-semibold">Profile</Text>

      {/* 3-dot icon */}
      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
        <Entypo name="dots-three-vertical" size={24} color="white" />
      </TouchableOpacity>

      {/* Logout option (only visible when menuVisible=true) */}
      {menuVisible && (
        <TouchableOpacity
          className="absolute right-5  bg-red-600 px-4 py-2 rounded-lg shadow"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      )}
    </View>
    </SafeAreaView>
  )
}

export default profile