import { Card } from "@/components/Card";
import { BASE_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraView } from "expo-camera";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Overlay } from "../../components/Overlay";

const generate_qr = () => {
  const [barCodeScanned, setBarCodeScanned] = useState(false);
  const [barCodeData, setBarCodeData] = useState();
  const [classData, setClassData] = useState();
  const [isClassEnded, setIsClassEnded] = useState(false);

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
        Alert.alert("Qr code expired");
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
          Alert.alert("Scanned successfully", "", [
            {
              style: "destructive",
            },
          ]);
        } else {
          Alert.alert("Error ");
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

  return !classData ? (
    <View style={{ flex: 1 }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={onScanned}
      />
      <Overlay />
    </View>
  ) : (
    <View className="flex-1  items-center flex-col justify-center">
      <Card
        subject={classData.title}
        maamName={classData.classTeacher.fullname}
        time={new Date(classData.endTime).toLocaleTimeString()}
      />
    </View>
  );
};

export default generate_qr;
