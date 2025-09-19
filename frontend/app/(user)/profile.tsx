import TouchableBtn from "@/components/TouchableBtn";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

function profile() {

  const [menuVisible,setMenuVisible]=useState(false)
  const handleClick=()=>{}

  const handleLogout= async ()=>{
      try {
   const token =  await AsyncStorage.removeItem("token"); // removes only "token"
    const role = await AsyncStorage.removeItem("role"); // removes only "token"
   /*  console.log(token);
    console.log(role); */
    
    Alert.alert("Token cleared");
    setMenuVisible(false)
    router.push("/(auth)/login")
  } catch (error) {
    console.error("Error clearing token", error);
  }
  }

  return (
    <SafeAreaView className="pt-10 px-5">
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
      <View className="border border-slate-400 rounded-lg overflow-hidden">
        <View className='flex-row p-4'>
        <View className="flex flex-row items-center justify-around w-full px-30">
            <Image
            source={{
              uri: "https://www.cartoonize.net/wp-content/uploads/2024/05/avatar-maker-photo-to-cartoon.png",
            }}
            style={{ height: 100, width: 100, borderRadius: 50, marginTop:10, borderWidth:1 }}
          />
          <View className="flex gap-3">
            <Text className="text-white text-3xl">Narayan</Text>
            <Text className="text-zinc-500 text-xl">UserId</Text>
          </View>
        </View>
          <View className='p-5'>
            <Text className='text-xl font-semibold'>Id: 1123</Text>
            <Text className='text-xl font-semibold'>Name: Teacher</Text>
            <Text className='text-xl font-semibold'>Name: Teacher</Text>
            <Text className='text-xl font-semibold'>Name: Teacher</Text>
          </View>
        </View>
      </View>
      <TouchableBtn onPress={handleClick} title={"Edit Details"} btnStyle={'px-6 py-4 bg-orange-400 mt-5 w-[150] rounded-md'} textStyle={'text-center text-lg'}/>
      <View className='border border-slate-500 p-4 flex-col gap-3'>
        <Text className='absolute right-2 top-2 text-2xl'>X</Text>
        <View>
          <Text nativeID="labelUsername" className='mb-1 ms-1 text-lg'>Username</Text>
          <TextInput placeholder="Edit ur name" className='border border-black rounded-lg p-3 text-xl' aria-labelledby="labelUsername"/>
        </View>
      <TouchableBtn onPress={handleClick} title={"Edit"} btnStyle={'px-6 py-2 bg-orange-400 w-[70] rounded-md flex-row justify-end relative'} textStyle={'text-center text-lg'}/>

      </View>
    </SafeAreaView>
  );
}

export default profile;
