import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { BASE_URL } from "@/components/config";
import TouchableBtn from "@/components/TouchableBtn";
import { moderateScale } from "react-native-size-matters";

export default function RegisterScreen() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const scheme = useColorScheme(); // Detect dark or light mode

  const onSubmit = async () => {
    if (!fullname || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/user/register`,
        { fullname, email, password, role },
        { withCredentials: true }
      );

      if (response.data.success) {
        setFullname("");
        setEmail("");
        setPassword("");
        Alert.alert(response.data.message);
        setTimeout(() => router.push("/(auth)/login"), 2500);
      } else {
        Alert.alert("Error", response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDark = scheme === "dark";
  const bgGradient = isDark
    ? "bg-gray-900"
    : "bg-gray-100";

  const cardBg = isDark
            ? "bg-white/10 border-white/20"
            : "bg-white/60 border-gray-200"
        
  const textColor = isDark ? "text-white" : "text-gray-900";
  const placeholderColor = isDark ? "#9ca3af" : "#6b7280"

  return (
    <SafeAreaView className={`flex-1 ${bgGradient}`}>
      
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className={`w-full rounded-2xl border p-6 shadow-2xl backdrop-blur-md ${cardBg}`}>
          <Text
            className={`text-3xl font-extrabold text-center mb-8 ${
              isDark ? "text-blue-400" : "text-blue-700"
            }`}
          >
            Create Account
          </Text>

          {/* Fullname Input */}
          <TextInput
            value={fullname}
            onChangeText={setFullname}
            placeholder="Full Name"
            placeholderTextColor={placeholderColor}
            className={`border rounded-lg px-4 py-3 mb-4 text-base ${textColor} ${
              isDark ? "bg-white/10 text-white border-white/30"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          />

          {/* Email Input */}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={placeholderColor}
            className={`border rounded-lg px-4 py-3 mb-4 text-base ${textColor} ${
              isDark ? "bg-white/10 text-white border-white/30"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          />

          {/* Password Input */}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor={placeholderColor}
            className={`border rounded-lg px-4 py-3 mb-4 text-base ${textColor} ${
              isDark ? "bg-white/10 text-white border-white/30"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          />

          {/* Role Picker */}
          <View
            className={`border rounded-lg  px-3 mb-4 ${
              isDark ? "bg-white/10 text-white border-white/30"
                : "bg-white text-gray-900 border-gray-300"
            }`}
          >
            <Picker
              selectedValue={role}
              onValueChange={(value) => setRole(value)}
              style={{
                color: isDark ? "white" : "black",
                fontSize: 16,
              }}
              dropdownIconColor={isDark ? "#9ca3af" : "#4b5563"}
            >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Teacher" value="teacher" />
            </Picker>
          </View>

          {/* Register Button */}
          <TouchableBtn
            title={
              isLoading ? (
                <ActivityIndicator size={moderateScale(18)} color="#fff" />
              ) : (
                "Register"
              )
            }
            textStyle="text-white text-lg font-semibold"
            btnStyle="bg-blue-600 rounded-xl py-3 items-center mt-2"
            onPress={onSubmit}
          />

          {/* Already have an account */}
          <Text
            onPress={() => router.push("/(auth)/login")}
            className={`text-center mt-6 font-semibold ${
              isDark ? "text-blue-400" : "text-blue-700"
            }`}
          >
            Already have an account? Login
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
