import { Card } from "@/components/Card";
import { BASE_URL } from "@/components/config";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraView } from "expo-camera";
import * as Location from "expo-location";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  Alert,
  RefreshControl,
  ScrollView,
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

  const [refreshing, setRefreshing] = useState(false);

  const [barCodeScanned, setBarCodeScanned] = useState(false);
  const [barCodeData, setBarCodeData] = useState();
  const [classData, setClassData] = useState<any>();
  const [isClassEnded, setIsClassEnded] = useState(false);

  // Ref to prevent duplicate scan processing
  const isProcessingScan = useRef(false);

  const bgColor = isDark ? "#030712" : "#f8fafc";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";
  const cardBg = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";

  // Anti-proxy: maximum allowed distance in meters between student and teacher
  const MAX_DISTANCE_METERS = 100;

  // Haversine formula to calculate distance between two GPS coordinates
  function getDistanceMeters(
    lat1: number, lng1: number,
    lat2: number, lng2: number
  ): number {
    const R = 6371e3; // Earth radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCurrClass();
    setRefreshing(false);
  };

  // Reset state when screen gains focus — so after teacher ends class,
  // student sees the scanner again on next visit / refresh
  useFocusEffect(
    useCallback(() => {
      fetchCurrClass();
    }, [])
  );

  const onScanned = async ({ data }: { data: any }) => {
    // Prevent duplicate processing using ref (state is async and unreliable here)
    if (isProcessingScan.current || barCodeScanned) {
      return;
    }
    isProcessingScan.current = true;

    try {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        isProcessingScan.current = false;
        return;
      }
      const user = JSON.parse(userData);
      const scannedData = JSON.parse(data);

      console.log("Type of end time", typeof scannedData.endTime);
      const now = Date.now();
      const expiry = scannedData?.expiry;
      console.log("Date now", new Date(now).toTimeString());
      console.log("Expiry", new Date(expiry).toTimeString());

      if (now > expiry) {
        Alert.alert("QR Expired", "This QR code has expired. Please ask your teacher to refresh.");
        isProcessingScan.current = false;
        return;
      }

      // ── Anti-proxy: GPS proximity check ──
      if (scannedData?.loc) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Location Required",
              "Please enable location permission to mark attendance. This prevents proxy attendance."
            );
            isProcessingScan.current = false;
            return;
          }
          const studentLoc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          const distance = getDistanceMeters(
            scannedData.loc.lat,
            scannedData.loc.lng,
            studentLoc.coords.latitude,
            studentLoc.coords.longitude
          );
          console.log(`Distance from teacher: ${distance.toFixed(1)}m`);
          if (distance > MAX_DISTANCE_METERS) {
            Alert.alert(
              "Proxy Detected 🚫",
              `You must be within ${MAX_DISTANCE_METERS}m of the classroom to mark attendance. You are ${Math.round(distance)}m away.`
            );
            isProcessingScan.current = false;
            return;
          }
        } catch (locErr) {
          console.log("Location check error:", locErr);
          Alert.alert(
            "Location Error",
            "Could not verify your location. Please ensure GPS is enabled and try again."
          );
          isProcessingScan.current = false;
          return;
        }
      }

      setBarCodeScanned(true);
      setClassData(scannedData);

      const res = await axios.post(`${BASE_URL}/api/user/markAttendance`, {
        classID: scannedData?._id,
        studentID: user._id,
        token: scannedData?.token,
      });
      console.log("Response data", res.data);
      if (res.data.success) {
        await AsyncStorage.setItem(
          "currClass",
          JSON.stringify(res.data?.currClass),
        );
        // Fetch the full class data (with populated classTeacher) so the Card shows correctly
        try {
          const classRes = await axios.get(
            `${BASE_URL}/api/class/getClassById?classId=${scannedData._id}`,
          );
          if (classRes.data?.success) {
            setClassData(classRes.data.class);
          }
        } catch (e) {
          console.log("Error fetching full class data after scan:", e);
        }
        Alert.alert(
          "Attendance Marked ✅",
          "Your attendance has been recorded successfully!",
          [{ style: "destructive" }],
        );
      } else {
        Alert.alert("Error", res.data?.message || "Failed to mark attendance. Please try again.");
      }
    } catch (error) {
      console.log("Error while scanning the QR: ", error);
      isProcessingScan.current = false;
      setBarCodeScanned(false);
    }
  };

  async function fetchCurrClass() {
    try {
      const clasString = await AsyncStorage.getItem("currClass");
      if (!clasString) {
        // No saved class — reset to scanner view
        setClassData(undefined);
        setBarCodeScanned(false);
        isProcessingScan.current = false;
        setIsClassEnded(false);
        return;
      }
      const savedClass = JSON.parse(clasString);
      console.log(savedClass._id);
      const res = await axios.get(
        `${BASE_URL}/api/class/getClassById?classId=${savedClass?._id}`,
      );
      if (res.data?.success) {
        const classInfo = res.data.class;
        // Check if the class has ended (endTime passed OR class is marked as ended)
        const classEnded = classInfo.isEnded === true ||
          new Date(Date.now()) >= new Date(classInfo.endTime);

        if (classEnded) {
          console.log("Class ended — resetting to scanner");
          setIsClassEnded(true);
          setClassData(undefined);
          setBarCodeScanned(false);
          isProcessingScan.current = false;
          await AsyncStorage.removeItem("currClass");
        } else {
          setClassData(classInfo);
          setBarCodeScanned(true);
        }
      } else {
        // Class not found — it was probably deleted or ended
        setClassData(undefined);
        setBarCodeScanned(false);
        isProcessingScan.current = false;
        await AsyncStorage.removeItem("currClass");
      }
    } catch (error) {
      console.log("Error while fetching using useEffect: ", error);
      // On error, reset to scanner so user isn't stuck
      setClassData(undefined);
      setBarCodeScanned(false);
      isProcessingScan.current = false;
    }
  }

  useEffect(() => {
    fetchCurrClass();
  }, []);


  // ──── Camera / Scanner View ────
  if (!classData) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={barCodeScanned ? undefined : onScanned}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }} >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#f97316"
          />
        }
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
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
            maamName={classData.classTeacher?.fullname || classData.classTeacher}
            time={classData.startTime}
          />
        </View>

        {/* Scan Again */}
        <TouchableOpacity
          onPress={() => {
            setClassData(undefined);
            setBarCodeScanned(false);
            isProcessingScan.current = false;
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default GenerateQR;
