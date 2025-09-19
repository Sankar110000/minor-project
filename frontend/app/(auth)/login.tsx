import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { BASE_URL } from "@/components/config";
import TouchableBtn from "@/components/TouchableBtn";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // ✅ useRouter hook

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert("All fields are required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${BASE_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Save token
        await AsyncStorage.setItem("token", response.data?.token);
        await AsyncStorage.setItem("role",response.data.user.role)
       
        
        const role = await AsyncStorage.getItem("role")
        // Reset form
        setEmail("");
        setPassword("");

        // ✅ Redirect to user/teacher dashboard (example: "/(user)")
        role==="student"?router.push("/(user)"):router.push("/(teacher)")
      } else {
        Alert.alert("Login failed", response.data.message || "Try again");
      }
    } catch (error: any) {
      Alert.alert("Login Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <View className="w-full bg-white/10 dark:bg-zinc-800/20 border border-white/20 rounded-2xl shadow-lg p-6">
        <Text className="text-2xl font-bold mb-6 text-center dark:text-white">
          Login
        </Text>

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

        <TouchableBtn
          title={
            isLoading ? (
              <>
                <ActivityIndicator size={moderateScale(15)} color={"#fff"} /> Login...
              </>
            ) : (
              "Login"
            )
          }
          textStyle={"text-white font-semibold "}
          btnStyle={"bg-blue-600 rounded py-3 items-center justify-center mt-4"}
          onPress={onSubmit}
        />

        <Text
          onPress={() => router.push("/(auth)")} // example register page
          className="text-center text-blue-900 font-semibold text-xl mt-5"
        >
          Create a new account
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;
