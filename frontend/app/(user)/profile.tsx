import { BASE_URL } from "@/components/config";
import TouchableBtn from "@/components/TouchableBtn";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function UserProfile() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [user, setUser] = useState({ email: "", id: "", role: "" });

  axios.defaults.withCredentials = true;

  const handleClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e: any) => {
    setEditedName(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token"); // removes only "token"
      await AsyncStorage.removeItem("role"); // removes only "token"

      Alert.alert("Loggedout successfully");
      setMenuVisible(false);
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Error clearing token", error);
    }
  };

  const getData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.post(
        `${BASE_URL}/api/user/getUser`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.data);
    } catch (error) {
      console.log(`Error in the axios: ${error}`);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView className="pt-10 px-5">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-black dark:text-white text-3xl font-semibold">
          Profile
        </Text>

        {/* 3-dot icon */}
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <Entypo
            name="dots-three-vertical"
            size={24}
            color="dark:white dark"
          />
        </TouchableOpacity>

        {/* Logout option (only visible when menuVisible=true) */}
        {menuVisible && (
          <TouchableOpacity
            className="absolute right-10 bg-red-600 px-4 py-2 rounded-lg shadow"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="border border-slate-400 rounded-lg overflow-hidden">
        <View className="flex-row p-4">
          <View className="flex flex-row items-center justify-around w-full px-30">
            <Image
              source={{
                uri: "https://www.cartoonize.net/wp-content/uploads/2024/05/avatar-maker-photo-to-cartoon.png",
              }}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                marginTop: 10,
                borderWidth: 1,
              }}
            />
            <View className="flex gap-3">
              <Text className="text-black dark:text-white text-3xl">
                {user?.email}
              </Text>
              <Text className="dark:text-gray-500 text-zinc-500 text-xl">
                Role: {user?.role}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {/* <TouchableBtn
        onPress={handleClick}
        title={"Edit Details"}
        btnStyle={"py-2 bg-orange-400 mt-5 w-[150] rounded-md"}
        textStyle={"text-center text-lg"}
      /> */}
      {showForm ? (
        <View className="border border-slate-500 p-4 flex-col gap-3">
          <TouchableBtn
            title={"X"}
            className="absolute right-2 top-2 text-2xl p-2"
            onPress={handleClick}
          />
          <View>
            <Text nativeID="labelUsername" className="mb-1 ms-1 text-lg">
              Username
            </Text>
            <TextInput
              placeholder="Edit ur name"
              className="border border-white rounded-lg p-3 text-xl text-white"
              aria-labelledby="labelUsername"
              value={editedName}
              onChange={handleInputChange}
            />
          </View>
          <TouchableBtn
            onPress={handleClick}
            title={"Edit"}
            btnStyle={
              "px-6 py-2 bg-orange-400 w-[70] rounded-md flex-row justify-end relative"
            }
            textStyle={"text-center text-lg"}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

export default UserProfile;
