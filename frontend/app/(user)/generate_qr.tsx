import { BASE_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraView } from "expo-camera";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Overlay } from "../../components/Overlay";

const generate_qr = () => {
  const [barCodeScanned, setBarCodeScanned] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={async ({ data }) => {
          const classData = JSON.parse(data);
          const now = Date.now();
          const expiry = classData.expiry;
          if (now > expiry) {
            Alert.alert("Qr code expired");
            return;
          }
          setBarCodeScanned(true);
          try {
            const userData = await AsyncStorage.getItem("user");

            if (!userData) {
              return;
            }
            const user = JSON.parse(userData);
            const classData = JSON.parse(data);
            if (!barCodeScanned) {
              const res = await axios.post(
                `${BASE_URL}/api/user/markAttendance`,
                {
                  classID: classData._id,
                  studentID: user._id,
                }
              );
              console.log(res.data);
              if (res.data.success) {
                Alert.alert("Scanned successfully");
              } else {
                Alert.alert("Error ");
              }
            }
            return;
          } catch (error) {
            console.log("Error while scanning the QR: ", error);
          }
        }}
      />
      <Overlay />
    </View>
  );
};

export default generate_qr;
