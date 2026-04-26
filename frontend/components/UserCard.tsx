import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, useColorScheme, View } from "react-native";

const UserCard = ({ userDet }: any) => {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  const cardBg = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";

  return (
    <View
      className="rounded-2xl mb-3 overflow-hidden"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      <View className="p-4 flex-row items-center">
        {/* Avatar */}
        <View
          className="rounded-full p-[2px] mr-4"
          style={{ borderWidth: 2, borderColor: "#f97316" }}
        >
          <Image
            source={{
              uri: `https://avatar.iran.liara.run/public/boy?username=${userDet?.fullname}`,
            }}
            className="w-14 h-14 rounded-full"
          />
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <FontAwesome5 name="user-graduate" size={14} color="#f97316" />
            <Text
              className="ml-2 text-base font-bold"
              style={{ color: textMain }}
              numberOfLines={1}
            >
              {userDet?.fullname || "Unknown"}
            </Text>
          </View>

          <View className="flex-row items-center mb-0.5">
            <MaterialCommunityIcons
              name="email-outline"
              size={14}
              color={textSub}
            />
            <Text
              className="ml-2 text-sm"
              style={{ color: textSub }}
              numberOfLines={1}
            >
              {userDet?.email || "—"}
            </Text>
          </View>

          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="identifier"
              size={14}
              color={textSub}
            />
            <Text
              className="ml-2 text-xs"
              style={{ color: textSub }}
              numberOfLines={1}
            >
              {userDet?._id
                ? `${userDet._id.slice(0, 8)}...${userDet._id.slice(-4)}`
                : "—"}
            </Text>
          </View>
        </View>

        {/* Role badge */}
        <View
          className="px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: "rgba(249, 115, 22, 0.12)",
          }}
        >
          <Text
            className="text-xs font-semibold"
            style={{ color: "#f97316" }}
          >
            {userDet?.role
              ? userDet.role.charAt(0).toUpperCase() + userDet.role.slice(1)
              : "Student"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserCard;
