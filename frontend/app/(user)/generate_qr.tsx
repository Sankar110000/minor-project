import { DEV_URL } from "@/components/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraView } from "expo-camera";
import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Overlay } from "../../components/Overlay";

const generate_qr = () => {
  return (
    <View style={{ flex: 1 }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={async ({ data }) => {
          try {
            const userData = await AsyncStorage.getItem("user");

            if (!userData) {
              return;
            }

            const user = JSON.parse(userData);
            const classData = JSON.parse(data);
            const res = await axios.post(`${DEV_URL}/api/user/markAttendance`, {
              classID: classData._id,
              studentID: user._id,
            });

            if (res.data.success) {
              Alert.alert("Scanned successfully");
            } else {
              Alert.alert("Error ");
            }
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
