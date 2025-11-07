import { DEV_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function RandomQRCode() {
  const colorScheme = useColorScheme(); // detects system theme (dark/light)
  const [qrValue, setQrValue] = useState(JSON.stringify({}));
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  const [classOnGoing, setClassOnGoing] = useState(false);
  const [token, setToken] = useState();

  // 🔹 Generate random QR value
  function generateRandomValue() {
    const timestamp = Date.now().toString(36);
    const randomHex = Math.floor(Math.random() * 1e16).toString(16);
    return `${timestamp}-${randomHex}`;
  }

  const handleGenerate = async () => {
    try {
      Alert.alert("Genarting QR");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      const res = await axios.post(`${DEV_URL}/api/class/create`, {
        title: "Java",
        classTeacher: user?._id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      console.log(res.data);
      if (res.data.success) {
        setQrValue(
          JSON.stringify({
            ...res.data.savedClass,
            token: generateRandomValue(),
            expiry: Date.now() + 5 * 1000,
          })
        );
        setIsQrGenerated(true);
        Alert.alert("Qr code generated successfully");
      } else {
        Alert.alert(res.data.message);
      }
    } catch (error) {
      Alert.alert(`Error while generating QR : ${error}`);
    }
  };

  // 🔹 Dynamic colors based on theme
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const cardColor = isDark ? "bg-gray-800" : "bg-white";
  const qrBgColor = isDark ? "#111827" : "#ffffff"; // exact background for QRCode

  async function getData() {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const res = await axios.post(`${DEV_URL}/api/class/getCurrClass`, {
        teacherID: user._id,
      });
      console.log(res.data);
      if (res.data.success) {
        setClassOnGoing(true);
        setIsQrGenerated(true);
      }
    } catch (error) {
      console.log("Error while getting the data ", error);
    }
  }

  useEffect(() => {
    getData();
    const tokenInterval = setInterval(() => {
      setQrValue((prev) => {
        prev = JSON.parse(prev);
        return JSON.stringify({
          ...prev,
          token: generateRandomValue(),
          expiry: Date.now() + 5 * 1000,
        });
      });
    }, 2000);
  }, []);

  return (
    <View className={`flex-1 items-center justify-center ${bgColor}`}>
      <Text className={`text-2xl font-bold mb-6 ${textColor}`}>
        {isQrGenerated
          ? "Scan to Qr to mark attendance"
          : "Click to start a new class"}
      </Text>

      {/* QR Code Box */}
      {classOnGoing || isQrGenerated ? (
        <View className={`${cardColor} p-5 rounded-2xl shadow-lg`}>
          <QRCode
            value={qrValue}
            size={200}
            backgroundColor={qrBgColor}
            color={isDark ? "white" : "black"}
          />
        </View>
      ) : null}
      {/* Regenerate button */}
      {classOnGoing || isQrGenerated ? null : (
        <TouchableOpacity
          onPress={handleGenerate}
          className="mt-6 bg-orange-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold text-lg">
            Generate New QR
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
