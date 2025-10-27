import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

import { router } from "expo-router";
import { BASE_URL } from "@/components/config";
import TouchableBtn from "@/components/TouchableBtn";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function RegisterScreen() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading,setIsLoading]=useState(false)

  const onSubmit = async () => {
    if (!fullname || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/user/register`, {
        fullname,
        email,
        password,
        role,
      },{withCredentials:true});

      if (response.data.success) {
      
        setFullname("")
        setEmail("")
        setPassword("")
        setIsLoading(true)
        // console.log(response.data);
        Alert.alert(response.data.message)

        await AsyncStorage.setItem("role",response.data.savedUser.role)

        setTimeout(()=>router.push("/(auth)/login"),3000)
        
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to register. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <View className="w-full  bg-white/10 dark:bg-zinc-800/20  p-6">
        <Text className="text-3xl font-bold mb-10 text-center dark:text-white">
          Register
        </Text>

        <TextInput
          value={fullname}
          onChangeText={setFullname}
          placeholder="Fullname"
          placeholderTextColor="#6b7280"
          className="border border-gray-300 rounded px-3 py-2 mb-3 dark:border-gray-700 dark:text-white"
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#6b7280"
          className="border border-gray-300 rounded px-3 py-2 mb-3 dark:border-gray-700 dark:text-white"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#6b7280"
          className="border border-gray-300 rounded px-3 py-2 mb-3 dark:border-gray-700 dark:text-white"
        />
 <View className="border border-gray-300 dark:border-gray-700 rounded bg-transparent">
      <Picker
        selectedValue={role}
        onValueChange={(value) => setRole(value)}
        style={{
          color: "black",
          fontSize: 16,
          paddingHorizontal: 2,
          backgroundColor: "transparent",
        }}
        dropdownIconColor="#d1d5db"
      >
        <Picker.Item label="Student" value="student" />
        <Picker.Item label="Teacher" value="teacher" />
      </Picker>
    </View>

        <TouchableBtn title={ isLoading?(<><ActivityIndicator size={moderateScale(15)} color={"#00A884"}/>Register...</>): "Register"}  textStyle={"text-white font-semibold"} btnStyle={"bg-blue-600 rounded py-3 items-center mt-4"}  onPress={onSubmit}/>
         
         <Text onPress={()=>router.push("/(auth)/login")} className=" text-center text-blue-900 font-semibold text-xl mt-5">If you already have an account</Text>
      </View>
    </SafeAreaView>
  );
}
