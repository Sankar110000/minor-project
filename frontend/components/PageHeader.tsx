import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  iconName: string;
  iconType?: "FontAwesome5" | "Ionicons" | "MaterialCommunityIcons";
  showBackButton?: boolean;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  iconName, 
  iconType = "FontAwesome5",
  showBackButton = true 
}: PageHeaderProps) {
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-400" : "text-gray-500";

  const IconComponent = iconType === "Ionicons" ? Ionicons : 
                        iconType === "MaterialCommunityIcons" ? MaterialCommunityIcons : 
                        FontAwesome5;

  return (
    <View className="px-5 pt-4 pb-2">
      <View className="flex-row items-center mb-1">
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color="#f97316"
            />
          </TouchableOpacity>
        )}
        {/* @ts-ignore */}
        <IconComponent name={iconName} size={22} color="#f97316" />
        <Text className={`text-2xl font-bold ml-3 ${textMain}`}>
          {title}
        </Text>
      </View>
      {subtitle ? (
        <Text className={`text-sm mb-4 ml-${showBackButton ? "10" : "0"} ${textSub}`}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
