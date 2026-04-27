import { BASE_URL } from "@/components/config";
import UserCard from "@/components/UserCard";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import PageHeader from "@/components/PageHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

const ViewStudent = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const theme = useColorScheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-950" : "bg-gray-50";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/user/getAllStudents`);
      if (res.data.success) {
        setStudents(res.data.users);
        setFilteredStudents(res.data.users);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Network Error", "Something went wrong");
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(
        (s: any) =>
          s.fullname?.toLowerCase().includes(query.toLowerCase()) ||
          s.email?.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredStudents(filtered);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <View className={`flex-1 ${bgColor}`}>
      {/* Search + Header */}
      <PageHeader 
        title="All Students" 
        subtitle={`${filteredStudents.length} ${filteredStudents.length === 1 ? "student" : "students"} enrolled`}
        iconName="user-graduate"
      />
      <View className="px-5">

        {/* Search Bar */}
        <View
          className="flex-row items-center rounded-xl px-4 mb-2"
          style={{
            backgroundColor: isDark ? "#1f2937" : "#f1f5f9",
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#e5e7eb",
            height: 48,
          }}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDark ? "#6b7280" : "#9ca3af"}
          />
          <TextInput
            className="flex-1 ml-3 text-base"
            style={{ color: isDark ? "#f9fafb" : "#111827" }}
            placeholder="Search by name or email..."
            placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className={`mt-3 ${textSub}`}>Loading students...</Text>
        </View>
      ) : filteredStudents.length === 0 ? (
        <View className="flex-1 justify-center items-center px-8">
          <FontAwesome5 name="user-graduate" size={48} color={isDark ? "#374151" : "#d1d5db"} />
          <Text className={`text-lg font-semibold mt-4 ${textMain}`}>
            {searchQuery ? "No results found" : "No students yet"}
          </Text>
          <Text className={`text-sm mt-1 text-center ${textSub}`}>
            {searchQuery
              ? "Try a different search query"
              : "Students will appear here once they register"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              tintColor="#f97316"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          renderItem={({ item }) => <UserCard userDet={item} />}
        />
      )}
    </View>
  );
};

export default ViewStudent;
