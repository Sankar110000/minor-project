import { Card } from "@/components/Card";
import { BASE_URL } from "@/components/config";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Overlay } from "../../components/Overlay";

const GenerateQR = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const [barCodeScanned, setBarCodeScanned] = useState(false);
  const [barCodeData, setBarCodeData] = useState();
  const [classData, setClassData] = useState<any>();
  const [isClassEnded, setIsClassEnded] = useState(false);

  const bgColor = isDark ? "#030712" : "#f8fafc";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";
  const cardBg = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";

  const onScanned = async ({ data }: { data: any }) => {
    try {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        return;
      }
      const user = JSON.parse(userData);
      const scannedData = JSON.parse(data);

      console.log("Type of end time", typeof scannedData.endTime);
      const now = new Date(Date.now());
      const expiry = new Date(scannedData?.expiry);
      console.log("Date now", now.toTimeString());
      console.log("End time", expiry.toTimeString());
      if (now > expiry) {
        Alert.alert("QR Expired", "This QR code has expired. Please ask your teacher to refresh.");
        return;
      }
      setClassData(scannedData);
      setBarCodeScanned(true);
      if (!barCodeScanned) {
        const res = await axios.post(`${BASE_URL}/api/user/markAttendance`, {
          classID: scannedData?._id,
          studentID: user._id,
        });
        console.log("Response data", res.data);
        if (res.data.success) {
          await AsyncStorage.setItem(
            "currClass",
            JSON.stringify(res.data?.currClass),
          );
          Alert.alert(
            "Attendance Marked ✅",
            "Your attendance has been recorded successfully!",
            [{ style: "destructive" }],
          );
        } else {
          Alert.alert("Error", "Failed to mark attendance. Please try again.");
        }
      }
      return;
    } catch (error) {
      console.log("Error while scanning the QR: ", error);
    }
  };

  useEffect(() => {
    async function fetchCurrClass() {
      try {
        const clasString = await AsyncStorage.getItem("currClass");
        if (!clasString) {
          return;
        }
        const classData = JSON.parse(clasString);
        console.log(classData._id);
        const res = await axios.get(
          `${BASE_URL}/api/class/getClassById?classId=${classData?._id}`,
        );
        if (res.data?.success) {
          if (new Date(Date.now()) >= new Date(res.data.class.endTime)) {
            console.log("Called");
            setIsClassEnded(true);
            await AsyncStorage.removeItem("currClass");
          } else {
            setClassData(res.data?.class);
          }
        }
      } catch (error) {
        console.log("Error while feching useing useEffect: ", error);
      }
    }
    fetchCurrClass();
  }, []);

  // ──── Camera / Scanner View ────
  if (!classData) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={onScanned}
        />
        <Overlay />

        {/* Top instruction bar */}
        <SafeAreaView className="absolute top-0 left-0 right-0">
          <View
            className="mx-5 mt-2 rounded-2xl px-5 py-4 flex-row items-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={24}
              color="#f97316"
            />
            <View className="ml-3 flex-1">
              <Text className="text-white font-bold text-base">
                Scan QR Code
              </Text>
              <Text className="text-white/70 text-xs mt-0.5">
                Point your camera at the QR code displayed by your teacher
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ──── Class Info View (after scanning) ────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <View className="flex-1 items-center justify-center px-5">
        {/* Success badge */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{
            backgroundColor: isDark
              ? "rgba(34, 197, 94, 0.15)"
              : "rgba(34, 197, 94, 0.1)",
          }}
        >
          <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
        </View>

        <Text
          className="text-xl font-bold mb-2"
          style={{ color: textMain }}
        >
          Attendance Marked!
        </Text>
        <Text
          className="text-sm mb-6 text-center"
          style={{ color: textSub }}
        >
          You are now checked in for this class session.
        </Text>

        {/* Class Card */}
        <View className="w-full">
          <Card
            subject={classData.title}
            maamName={classData.classTeacher?.fullname}
            time={new Date(classData.endTime).toLocaleTimeString()}
          />
        </View>

        {/* Scan Again */}
        <TouchableOpacity
          onPress={() => {
            setClassData(undefined);
            setBarCodeScanned(false);
          }}
          className="mt-4 rounded-xl px-6 py-3"
          style={{
            backgroundColor: isDark
              ? "rgba(249, 115, 22, 0.12)"
              : "rgba(249, 115, 22, 0.08)",
            borderWidth: 1,
            borderColor: isDark
              ? "rgba(249, 115, 22, 0.3)"
              : "rgba(249, 115, 22, 0.2)",
          }}
        >
          <Text className="text-orange-500 font-semibold text-base">
            Scan Again
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GenerateQR;
