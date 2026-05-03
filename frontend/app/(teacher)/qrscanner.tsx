import { BASE_URL } from "@/components/config";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as ScreenCapture from "expo-screen-capture";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RandomQRCode() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [qrValue, setQrValue] = useState<object | null>();
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  const [classOnGoing, setClassOnGoing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState(new Date(Date.now()));
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currClass, setCurrClass] = useState<{
    title: string;
    _id: string;
    classTeacher: any;
    total_students: any[];
    startTime: string;
    endTime: string;
  } | null>(null);
  const [teacherLocation, setTeacherLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Anti-proxy: QR expires in 4 seconds (photo-sharing is impossible in this window)
  const QR_EXPIRY_MS = 4 * 1000;
  const QR_REFRESH_MS = 2000;

  // Theme
  const bgColor = isDark ? "#030712" : "#f8fafc";
  const cardBg = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";
  const surfaceBg = isDark ? "#1f2937" : "#f1f5f9";
  const qrBgColor = isDark ? "#1f2937" : "#ffffff";

  // Helper: deduplicate students by _id (backend may push same student multiple times)
  function deduplicateStudents(classObj: any) {
    if (!classObj?.total_students) return classObj;
    const seen = new Set<string>();
    const unique = classObj.total_students.filter((s: any) => {
      const id = typeof s === "string" ? s : s._id;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    return { ...classObj, total_students: unique };
  }

  // 🔹 Generate random QR value (FUNCTIONALITY - UNTOUCHED)
  function generateRandomValue() {
    const timestamp = Date.now().toString(36);
    const randomHex = Math.floor(Math.random() * 1e16).toString(16);
    return `${timestamp}-${randomHex}`;
  }

  // 🔹 Handle Close Modal (FUNCTIONALITY - UNTOUCHED)
  const handleCloseModal = () => {
    setModalVisible(false);
    setShowPicker(false);
  };

  // 🔹 Handle Time Change (FUNCTIONALITY - UNTOUCHED, but adjusted for safety)
  const onTimeChnage = (event: any, selectedTime: any) => {
    const currentTime = selectedTime;

    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }
    // FIX NOTE: Setting the time here should trigger a re-render and update the TextInput value.
    setTime(currentTime || new Date());
    setShowPicker(false);
  };

  const handleGenerate = async () => {
    if (!title || title.trim() === "") {
      Alert.alert("Missing Title", "Please enter a class title.");
      return;
    }
    setLoading(true);
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      const body = {
        title,
        classTeacher: user?._id,
        startTime: new Date(),
        endTime: time,
      };

      const res = await axios.post(`${BASE_URL}/api/class/create`, body);
      if (res.data.success) {
        const classInfo = res.data.savedClass;
        setQrValue({
          _id: classInfo._id,
          title: classInfo.title,
          startTime: classInfo.startTime,
          endTime: classInfo.endTime,
          token: generateRandomValue(),
          expiry: Date.now() + QR_EXPIRY_MS,
          ...(teacherLocation ? { loc: teacherLocation } : {}),
        });
        setIsQrGenerated(true);
        setClassOnGoing(true);
        setModalVisible(false);
        setCurrClass(res.data.savedClass);
        await AsyncStorage.setItem(
          "currClass",
          JSON.stringify(res.data.savedClass),
        );
        Alert.alert("Success", "QR code generated successfully!");
      } else {
        Alert.alert("Error", res.data.message);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to generate QR: ${error}`);
      console.log(`Error while generating QR : ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEndClass = async () => {
    Alert.alert(
      "End Class",
      "Are you sure you want to end this class session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Class",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await axios.post(`${BASE_URL}/api/class/endClass`, {
                classID: currClass?._id,
              });
              if (res.data.success) {
                Alert.alert("Class Ended", res.data.message);
                await AsyncStorage.removeItem("currClass");
                setClassOnGoing(false);
                setIsQrGenerated(false);
                setCurrClass(null);
                setQrValue(null);
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    );
  };

  async function getData() {
    try {
      setPageLoading(true);
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const res = await axios.post(`${BASE_URL}/api/class/getCurrClass`, {
        teacherID: user._id,
      });
      if (res.data.success) {
        const cls = res.data.currClass;
        console.log("Current Class", cls.startTime.toLocaleTimeString());
        setQrValue({
          _id: cls._id,
          title: cls.title,
          startTime: cls.startTime,
          endTime: cls.endTime,
          token: generateRandomValue(),
          expiry: Date.now() + QR_EXPIRY_MS,
          ...(teacherLocation ? { loc: teacherLocation } : {}),
        });
        setCurrClass(deduplicateStudents(cls));
        setClassOnGoing(true);
        setIsQrGenerated(true);
      } else {
        setClassOnGoing(false);
        setIsQrGenerated(false);
      }
    } catch (error) {
      console.log("Error while getting the data ", error);
    } finally {
      setPageLoading(false);
    }
  }

  const refreshAttendance = async () => {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      if (!user?._id) return;

      const res = await axios.post(`${BASE_URL}/api/class/getCurrClass`, {
        teacherID: user._id,
      });
      if (res.data.success) {
        setCurrClass(deduplicateStudents(res.data.currClass));
      }
    } catch (error) {
      console.log("Error refreshing attendance:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAttendance();
    setRefreshing(false);
  };

  const handleTitleChange = (e: any) => {
    setTitle(e);
  };

  // Capture teacher's GPS location for anti-proxy verification
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setTeacherLocation({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
          });
          console.log("Teacher location captured:", loc.coords.latitude, loc.coords.longitude);
        } else {
          console.log("Location permission denied — QR will work without GPS check");
        }
      } catch (e) {
        console.log("Error getting teacher location:", e);
      }
    })();
    getData();
  }, []);

  useEffect(() => {
    let tokenInterval: NodeJS.Timeout;
    let attendanceInterval: NodeJS.Timeout;

    if (classOnGoing || isQrGenerated) {
      // Refresh QR token every 2 seconds with 4-second expiry (anti-proxy)
      tokenInterval = setInterval(() => {
        setQrValue((prev) => {
          if (!prev) return prev;
          return {
            _id: (prev as any)._id,
            title: (prev as any).title,
            startTime: (prev as any).startTime,
            endTime: (prev as any).endTime,
            token: generateRandomValue(),
            expiry: Date.now() + QR_EXPIRY_MS,
            ...(teacherLocation ? { loc: teacherLocation } : {}),
          };
        });
      }, QR_REFRESH_MS);

      // Refresh attendance data every 5 seconds
      attendanceInterval = setInterval(() => {
        refreshAttendance();
      }, 5000);
    }

    return () => {
      if (tokenInterval) clearInterval(tokenInterval);
      if (attendanceInterval) clearInterval(attendanceInterval);
    };
  }, [isQrGenerated, classOnGoing]);

  useFocusEffect(
    useCallback(() => {
      ScreenCapture.preventScreenCaptureAsync();
      const sub = ScreenCapture.addScreenshotListener(() => {
        Alert.alert("Screenshots are not allowed!");
      });
      return () => {
        sub.remove();
        ScreenCapture.allowScreenCaptureAsync();
      };
    }, [])
  );

  if (pageLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: bgColor }}
        className="justify-center items-center"
      >
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-4" style={{ color: textSub }}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#f97316"
          />
        }
      >
        {/* ──── Header ──── */}
        <View className="px-5 pt-4 pb-2">
          <Text
            className="text-2xl font-bold"
            style={{ color: textMain }}
          >
            {classOnGoing ? "Class in Session" : "Generate QR"}
          </Text>
          <Text
            className="text-sm mt-1"
            style={{ color: textSub }}
          >
            {classOnGoing
              ? "Students can scan this QR to mark attendance"
              : "Start a new class to generate attendance QR code"}
          </Text>
        </View>

        {/* ──── Ongoing Class Info ──── */}
        {classOnGoing && currClass && (
          <View className="mx-5 mt-4">
            <View
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
              }}
            >
              <LinearGradient
                colors={["#f97316", "#fb923c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 4 }}
              />
              <View className="p-5">
                <View className="flex-row items-center mb-4">
                  <View
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: "#22c55e" }}
                  />
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: "#22c55e" }}
                  >
                    LIVE SESSION
                  </Text>
                </View>

                {[
                  {
                    icon: "book-outline" as const,
                    label: "Subject",
                    value: currClass.title,
                    color: "#f97316",
                  },
                  {
                    icon: "person-outline" as const,
                    label: "Teacher",
                    value: currClass.classTeacher?.fullname || "—",
                    color: "#3b82f6",
                  },
                  {
                    icon: "time-outline" as const,
                    label: "Started",
                    value: new Date(currClass.startTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    color: "#10b981",
                  },
                  {
                    icon: "alarm-outline" as const,
                    label: "Ends at",
                    value: new Date(currClass.endTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    color: "#ef4444",
                  },
                ].map((item, index) => (
                  <View key={index} className="flex-row items-center mb-3">
                    <View
                      className="w-9 h-9 rounded-lg items-center justify-center mr-3"
                      style={{ backgroundColor: item.color + "15" }}
                    >
                      <Ionicons
                        name={item.icon}
                        size={18}
                        color={item.color}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-xs"
                        style={{ color: textSub }}
                      >
                        {item.label}
                      </Text>
                      <Text
                        className="text-base font-semibold"
                        style={{ color: textMain }}
                      >
                        {item.value}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* Student count */}
                <View
                  className="flex-row items-center justify-between rounded-xl px-4 py-3 mt-2"
                  style={{ backgroundColor: surfaceBg }}
                >
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="account-group"
                      size={20}
                      color="#f97316"
                    />
                    <Text
                      className="ml-2 text-sm font-medium"
                      style={{ color: textSub }}
                    >
                      Students Present
                    </Text>
                  </View>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: "#f97316" }}
                  >
                    {currClass.total_students?.length || 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ──── QR Code Display ──── */}
        {(classOnGoing || isQrGenerated) && qrValue ? (
          <View className="items-center mt-6 mx-5">
            <View
              className="rounded-3xl p-6 items-center"
              style={{
                backgroundColor: cardBg,
                borderWidth: 1,
                borderColor: borderColor,
                shadowColor: "#f97316",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
                elevation: 8,
              }}
            >
              <View
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: qrBgColor,
                }}
              >
                <QRCode
                  value={JSON.stringify(qrValue)}
                  size={200}
                  backgroundColor={qrBgColor}
                  color={isDark ? "white" : "black"}
                />
              </View>

              <View className="items-center mt-4 gap-1">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="refresh"
                    size={14}
                    color={textSub}
                  />
                  <Text
                    className="text-xs ml-1"
                    style={{ color: textSub }}
                  >
                    QR refreshes every 2s • Expires in 4s
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name={teacherLocation ? "map-marker-check" : "map-marker-off"}
                    size={14}
                    color={teacherLocation ? "#22c55e" : "#ef4444"}
                  />
                  <Text
                    className="text-xs ml-1"
                    style={{ color: teacherLocation ? "#22c55e" : "#ef4444" }}
                  >
                    {teacherLocation ? "GPS Lock Active — Proxy Protected" : "GPS unavailable — location check disabled"}
                  </Text>
                </View>
              </View>
            </View>

            {/* End Class Button */}
            <TouchableOpacity
              onPress={handleEndClass}
              activeOpacity={0.85}
              className="w-full mt-6"
            >
              <View
                className="flex-row items-center justify-center rounded-2xl py-4"
                style={{
                  backgroundColor: isDark
                    ? "rgba(239, 68, 68, 0.15)"
                    : "rgba(239, 68, 68, 0.08)",
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(239, 68, 68, 0.3)"
                    : "rgba(239, 68, 68, 0.2)",
                }}
              >
                <Feather name="x-circle" size={20} color="#ef4444" />
                <Text className="text-red-500 font-bold text-base ml-2">
                  End Class Session
                </Text>
              </View>
            </TouchableOpacity>

            {/* ──── Student List ──── */}
            <View className="w-full mt-8">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold" style={{ color: textMain }}>
                  Students Present ({currClass.total_students?.length || 0})
                </Text>
              </View>

              {currClass.total_students && currClass.total_students.length > 0 ? (
                <View
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  {currClass.total_students.map((student: any, index: number) => (
                    <View
                      key={student._id || `student-${index}`}
                      className={`flex-row items-center px-4 py-3 ${index < currClass.total_students.length - 1 ? "border-b" : ""
                        }`}
                      style={{ borderBottomColor: borderColor }}
                    >
                      <View
                        className="w-8 h-8 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: "#f97316" + "20" }}
                      >
                        <Text className="text-xs font-bold" style={{ color: "#f97316" }}>
                          {index + 1}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-semibold" style={{ color: textMain }}>
                          {student.fullname || "Anonymous Student"}
                        </Text>
                        <Text className="text-xs" style={{ color: textSub }}>
                          {student.email || "No email available"}
                        </Text>
                      </View>
                      <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  className="rounded-2xl p-8 items-center justify-center"
                  style={{
                    backgroundColor: cardBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderStyle: "dashed",
                  }}
                >
                  <MaterialCommunityIcons
                    name="account-search-outline"
                    size={40}
                    color={textSub}
                  />
                  <Text className="mt-3 text-sm text-center" style={{ color: textSub }}>
                    Waiting for students to scan...
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          /* ──── Empty State / Start New Class ──── */
          <View className="items-center justify-center flex-1 px-5 mt-12">
            <View
              className="w-24 h-24 rounded-3xl items-center justify-center mb-6"
              style={{
                backgroundColor: isDark
                  ? "rgba(249, 115, 22, 0.12)"
                  : "rgba(249, 115, 22, 0.08)",
              }}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={48}
                color="#f97316"
              />
            </View>

            <Text
              className="text-xl font-bold text-center mb-2"
              style={{ color: textMain }}
            >
              No Active Class
            </Text>
            <Text
              className="text-sm text-center mb-8 px-6"
              style={{ color: textSub }}
            >
              Start a new class to generate a dynamic QR code that students can
              scan to mark their attendance.
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.9}
              className="w-full"
            >
              <LinearGradient
                colors={["#f97316", "#ea580c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="rounded-2xl py-4 flex-row items-center justify-center"
                style={{
                  shadowColor: "#f97316",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={24}
                  color="white"
                />
                <Text className="text-white font-bold text-lg ml-2">
                  Start a New Class
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ──── Create Class Modal ──── */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Pressable
            className="flex-1"
            onPress={handleCloseModal}
          />

          <View
            className="rounded-t-3xl"
            style={{
              backgroundColor: cardBg,
              paddingBottom: Platform.OS === "ios" ? 40 : 24,
            }}
          >
            {/* Handle bar */}
            <View className="items-center pt-3 pb-2">
              <View
                className="w-10 h-1 rounded-full"
                style={{ backgroundColor: isDark ? "#374151" : "#d1d5db" }}
              />
            </View>

            <View className="px-6 pt-2 pb-4">
              <Text
                className="text-2xl font-bold mb-1"
                style={{ color: textMain }}
              >
                Create New Class
              </Text>
              <Text
                className="text-sm mb-6"
                style={{ color: textSub }}
              >
                Fill in the details to start a class session.
              </Text>

              {/* Title Input */}
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: textMain }}
              >
                Class Title
              </Text>
              <View
                className="rounded-xl mb-5 overflow-hidden"
                style={{
                  backgroundColor: surfaceBg,
                  borderWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <TextInput
                  className="h-14 px-4 text-base"
                  style={{ color: textMain }}
                  placeholder="e.g., Introduction to Java"
                  placeholderTextColor={textSub}
                  value={title}
                  onChangeText={handleTitleChange}
                />
              </View>

              {/* Start Time */}
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: textMain }}
              >
                Start Time
              </Text>
              <View
                className="rounded-xl mb-5 flex-row items-center px-4"
                style={{
                  backgroundColor: surfaceBg,
                  borderWidth: 1,
                  borderColor: borderColor,
                  height: 56,
                }}
              >
                <Ionicons name="time-outline" size={20} color={textSub} />
                <Text
                  className="ml-3 text-base"
                  style={{ color: textSub }}
                >
                  {new Date(Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  (Now)
                </Text>
              </View>

              {/* End Time */}
              <Text
                className="text-sm font-semibold mb-2"
                style={{ color: textMain }}
              >
                End Time
              </Text>
              <Pressable onPress={() => setShowPicker(true)}>
                <View
                  className="rounded-xl mb-6 flex-row items-center justify-between px-4"
                  style={{
                    backgroundColor: surfaceBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    height: 56,
                  }}
                >
                  <View className="flex-row items-center">
                    <Ionicons name="alarm-outline" size={20} color="#f97316" />
                    <Text
                      className="ml-3 text-base"
                      style={{ color: textMain }}
                    >
                      {time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                  <Feather name="chevron-down" size={20} color={textSub} />
                </View>
              </Pressable>

              {/* DateTimePicker */}
              {showPicker ? (
                <DateTimePicker
                  value={time}
                  mode="time"
                  // Use 'spinner' for better user experience on iOS
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onTimeChnage}
                />
              ) : null}

              {/* Buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleCloseModal}
                  className="flex-1 rounded-xl py-4 items-center"
                  style={{
                    backgroundColor: surfaceBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <Text
                    className="font-semibold text-base"
                    style={{ color: textMain }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleGenerate}
                  disabled={loading}
                  className="flex-1 overflow-hidden rounded-xl"
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={["#f97316", "#ea580c"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-4 items-center justify-center flex-row"
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="qrcode"
                          size={20}
                          color="white"
                        />
                        <Text className="text-white font-bold text-base ml-2">
                          Create
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
