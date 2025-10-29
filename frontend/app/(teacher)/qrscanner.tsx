import { DEV_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useState } from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function RandomQRCode() {
  const colorScheme = useColorScheme(); // detects system theme (dark/light)
  const [qrValue, setQrValue] = useState(JSON.stringify({}));

  // 🔹 Generate random QR value
  function generateRandomValue() {
    const timestamp = Date.now().toString(36);
    const randomHex = Math.floor(Math.random() * 1e16).toString(16);
    return `QR-${timestamp}-${randomHex}`;
  }

  const handleGenerate = async () => {
    try {
      const userString: string | null = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const res = await axios.post(`${DEV_URL}/api/class/create`, {
        title: "Java",
        classTeacher: user?._id,
      });
      console.log(res.data);
      if (res.data.success) {
        setQrValue(JSON.stringify(res.data.savedClass));
      }
    } catch (error) {
      console.log("Error while generating QR : ", error);
    }
  };

  // 🔹 Dynamic colors based on theme
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const cardColor = isDark ? "bg-gray-800" : "bg-white";
  const qrBgColor = isDark ? "#111827" : "#ffffff"; // exact background for QRCode

  return (
    <View className={`flex-1 items-center justify-center ${bgColor}`}>
      <Text className={`text-2xl font-bold mb-6 ${textColor}`}>
        Scan the QR to mark attendance
      </Text>

      {/* QR Code Box */}
      <View className={`${cardColor} p-5 rounded-2xl shadow-lg`}>
        <QRCode
          value={qrValue}
          size={200}
          backgroundColor={qrBgColor}
          color={isDark ? "white" : "black"}
        />
      </View>

      {/* Generated value */}
      <Text className={`mt-4 text-sm ${textColor}`}>{qrValue}</Text>

      {/* Regenerate button */}
      <TouchableOpacity
        onPress={handleGenerate}
        className="mt-6 bg-orange-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold text-lg">
          Generate New QR
        </Text>
      </TouchableOpacity>
    </View>
  );
}
