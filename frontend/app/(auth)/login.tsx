import { BASE_URL } from "@/components/config";
import TouchableBtn from "@/components/TouchableBtn";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router"; // ✅ useRouter hook
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale } from "react-native-size-matters";

const Login = () => {
  const router = useRouter();
  const theme = useColorScheme(); // detect dark or light mode
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
        await AsyncStorage.setItem("token", response.data?.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        await AsyncStorage.setItem("role", response.data.user.role);

        const role = await AsyncStorage.getItem("role");
        // Reset form
        setEmail("");
        setPassword("");

        // ✅ Redirect to user/teacher dashboard (example: "/(user)")
        role === "student" ? router.push("/(user)") : router.push("/(teacher)");
      } else {
        Alert.alert("Login failed", response.data.message || "Try again");
      }
    } catch (error: any) {
      Alert.alert(
        "Login Error",
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 px-6 justify-center ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
      }`}
    >
      {/* Glass card */}
      <View
        className={`rounded-3xl border p-6 shadow-2xl backdrop-blur-md ${
          theme === "dark"
            ? "bg-white/10 border-white/20"
            : "bg-white/60 border-gray-200"
        }`}
      >
        <Text
          className={`text-3xl font-bold text-center mb-8 tracking-wide ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Welcome Back 👋
        </Text>

        {/* Email input */}
        <View className="mb-5">
          <Text
            className={`text-sm mb-2 font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            className={`border rounded-2xl px-4 py-3 ${
              theme === "dark"
                ? "bg-white/10 text-white border-white/30"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          />
        </View>

        {/* Password input */}
        <View className="mb-6">
          <Text
            className={`text-sm mb-2 font-medium ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Password
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            placeholderTextColor={theme === "dark" ? "#9ca3af" : "#6b7280"}
            className={`border rounded-2xl px-4 py-3 ${
              theme === "dark"
                ? "bg-white/10 text-white border-white/30"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          />
        </View>

        {/* Button */}
        <TouchableBtn
          title={
            isLoading ? (
              <>
                <ActivityIndicator size={moderateScale(15)} color={"#fff"} />{" "}
                Login...
              </>
            ) : (
              "Login"
            )
          }
          textStyle="text-white font-semibold text-lg"
          btnStyle="bg-blue-600 rounded-2xl py-3 items-center justify-center shadow-lg"
          onPress={onSubmit}
        />

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View className="flex-1 h-[1px] bg-gray-400/30 dark:bg-white/20" />
          <Text
            className={`text-sm mx-3 ${
              theme === "dark" ? "text-white" : "text-gray-700"
            }`}
          >
            or
          </Text>
          <View className="flex-1 h-[1px] bg-gray-400/30 dark:bg-white/20" />
        </View>

        {/* Signup link */}
        <Text
          onPress={() => router.push("/(auth)")}
          className={`text-center font-semibold text-base underline ${
            theme === "dark" ? "text-indigo-300" : "text-indigo-700"
          }`}
        >
          Create a New Account
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Login;
