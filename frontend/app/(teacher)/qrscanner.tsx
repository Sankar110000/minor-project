import { DEV_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function RandomQRCode() {
  const colorScheme = useColorScheme();
  const [qrValue, setQrValue] = useState<object | null>();
  const [isQrGenerated, setIsQrGenerated] = useState(false);
  const [classOnGoing, setClassOnGoing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState();
  const [time, setTime] = useState(new Date(Date.now()));
  const [showPicker, setShowPicker] = useState(false);
  const [currClass, setCurrClass] = useState<{
    title: string;
    _id: string;
    classTeacher: "";
    total_students: [];
    startTime: string;
    endTime: string;
  } | null>({
    title: "",
    _id: "",
    classTeacher: "",
    total_students: [],
    startTime: new Date().toLocaleTimeString(),
    endTime: new Date().toLocaleTimeString(),
  });

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

  // 🔹 Handle Generate (FUNCTIONALITY - UNTOUCHED)
  const handleGenerate = async () => {
    try {
      Alert.alert("Genarting QR");
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      const body = {
        title,
        classTeacher: user?._id,
        endTime: time,
      };

      const res = await axios.post(`${DEV_URL}/api/class/create`, body);

      if (res.data.success) {
        setQrValue({
          ...res.data.savedClass,
          token: generateRandomValue(),
          expiry: Date.now() + 5 * 1000,
        });
        setIsQrGenerated(true);
        setModalVisible(false);
        Alert.alert("Qr code generated successfully");
      } else {
        Alert.alert(res.data.message);
      }
    } catch (error) {
      Alert.alert(`Error while generating QR : ${error}`);
    }
  };

  const handleEndClass = async () => {
    try {
      const res = await axios.post(`${DEV_URL}/api/class/endClass`, {
        classID: currClass?._id,
      });
      if (res.data.success) {
        console.log(res.data);
        Alert.alert(res.data.message);
        setClassOnGoing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 🔹 Dynamic colors based on theme (FUNCTIONALITY - UNTOUCHED)
  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-gray-100";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const cardColor = isDark ? "bg-gray-800" : "bg-white";
  const qrBgColor = isDark ? "#111827" : "#ffffff";

  // 🔹 Get Data (FUNCTIONALITY - UNTOUCHED)
  async function getData() {
    try {
      const userString = await AsyncStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const res = await axios.post(`${DEV_URL}/api/class/getCurrClass`, {
        teacherID: user._id,
      });
      if (res.data.success) {
        setQrValue({
          ...res.data.currClass,
          token: generateRandomValue(),
          expiry: Date.now() + 5 * 1000,
        });
        setCurrClass(res.data.currClass);
        setClassOnGoing(true);
        setIsQrGenerated(true);
      } else {
        setClassOnGoing(false);
        setIsQrGenerated(false);
      }
    } catch (error) {
      console.log("Error while getting the data ", error);
    }
  }

  // 🔹 Handle Title Change (FUNCTIONALITY - UNTOUCHED)
  const handleTitleChange = (e: any) => {
    setTitle(e);
  };

  // 🔹 useEffect (FUNCTIONALITY - UNTOUCHED)
  useEffect(() => {
    getData();
    if (isQrGenerated) {
      const tokenInterval = setInterval(() => {
        setQrValue((prev) => {
          return {
            ...prev,
            token: generateRandomValue(),
            expiry: Date.now() + 5 * 1000,
          };
        });
      }, 2000);
      return () => clearInterval(tokenInterval);
    }
  }, [isQrGenerated, classOnGoing]);

  return (
    <View className={`flex-1 items-center justify-center ${bgColor} p-6`}>
      {/* 📊 On Going Class Status */}
      <View
        className={`mb-8 ${cardColor} p-4 rounded-xl shadow-md w-full max-w-sm`}
      >
        <Text className="text-xl font-semibold dark:text-gray-200 mb-2 border-b border-gray-300 dark:border-gray-700 pb-2">
          On Going Class
        </Text>
        <View className="space-y-1">
          {classOnGoing ? (
            <>
              <Text className="dark:text-white text-base">
                <Text className="font-medium">Subject:</Text>{" "}
                {currClass && currClass.title}
              </Text>
              <Text className="dark:text-white text-base">
                <Text className="font-medium">Teacher:</Text>{" "}
                {currClass && currClass.classTeacher?.fullname}
              </Text>
              <Text className="dark:text-white text-base">
                <Text className="font-medium">Start time:</Text>{" "}
                {currClass && currClass.startTime}
              </Text>
              <Text className="dark:text-white text-base">
                <Text className="font-medium">End time:</Text>{" "}
                {currClass && currClass.endTime}
              </Text>
            </>
          ) : (
            <Text className="dark:text-gray-400 text-base">
              No ongoing classes found.
            </Text>
          )}
        </View>
      </View>

      <Text className={`text-2xl font-bold mb-6 ${textColor}`}>
        {isQrGenerated
          ? "Scan QR to mark attendance"
          : "Click to start a new class"}
      </Text>

      {/* QR Code Box */}
      {classOnGoing || isQrGenerated ? (
        <View className={`${cardColor} p-5 rounded-2xl shadow-2xl mb-8`}>
          <QRCode
            value={JSON.stringify(qrValue)}
            size={200}
            backgroundColor={qrBgColor}
            color={isDark ? "white" : "black"}
          />
        </View>
      ) : null}

      {classOnGoing || isQrGenerated ? (
        <TouchableOpacity
          className="mt-6 bg-red-600 px-8 py-4 rounded-xl shadow-lg"
          onPress={handleEndClass} // Assuming you will add this function later
        >
          <Text className="text-white font-bold text-xl">End Class</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="mt-6 bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl shadow-lg"
        >
          <Text className="text-white font-bold text-xl">
            Start a new class
          </Text>
        </TouchableOpacity>
      )}

      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          {/* Centered View / Background Overlay */}
          <View className="flex-1 justify-center items-center bg-black/70">
            {/* Modal Content View */}
            <View className="bg-white rounded-2xl p-6 items-center shadow-2xl w-[90%] max-w-md">
              {/* Close Button (Moved to top right for standard UI) */}
              <Pressable
                className="rounded-full w-8 h-8 items-center justify-center absolute top-2 right-2 bg-gray-200"
                onPress={handleCloseModal}
              >
                <Text className="text-gray-700 font-bold">X</Text>
              </Pressable>

              <Text className="text-2xl font-extrabold text-gray-800 mb-6 mt-4">
                Create New Class
              </Text>

              {/* Title Input */}
              <Text className="w-full text-sm font-medium text-gray-700 mb-1">
                Class Title
              </Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-lg mb-4 px-4 w-full text-lg focus:border-blue-500"
                placeholder="e.g., Introduction to Java"
                value={title}
                onChangeText={handleTitleChange}
              />

              {/* End time Input/Picker Trigger */}
              <Text className="w-full text-sm font-medium text-gray-700 mb-1">
                End Time
              </Text>
              {/* FIX: Use Pressable wrapper to reliably trigger the picker */}
              <Pressable className="w-full" onPress={() => setShowPicker(true)}>
                <TextInput
                  className="h-12 border border-gray-300 rounded-lg mb-4 px-4 w-full text-lg bg-gray-50 text-gray-800"
                  placeholder="Tap to select end time"
                  value={time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  // Crucial Fix: Disable editing so keyboard doesn't conflict with onPress
                  editable={false}
                />
              </Pressable>

              {/* DateTimePicker */}
              {showPicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  // Use 'spinner' for better user experience on iOS
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={onTimeChnage}
                />
              )}

              {/* Start time Read-Only Input */}
              <Text className="w-full text-sm font-medium text-gray-700 mb-1">
                Start Time (Now)
              </Text>
              <TextInput
                className="h-12 border border-gray-300 rounded-lg mb-6 px-4 w-full text-lg bg-gray-100 text-gray-500"
                value={new Date(Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                editable={false}
              />

              {/* Submit Button */}
              <Pressable
                className="rounded-xl py-3 px-6 bg-blue-600 hover:bg-blue-700 w-full shadow-md"
                onPress={handleGenerate}
              >
                <Text className="text-white font-bold text-xl text-center">
                  Create Class
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
