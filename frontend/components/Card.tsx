import { Ionicons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";

export const Card = ({ subject, maamName, time, present, title }: any) => {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  // ✅ Apply same theme variables as Teacher Page UI
  const cardBg = isDark ? "bg-white/10" : "bg-white";
  const borderColor = isDark ? "border-white/20" : "border-gray-300";
  const textMain = isDark ? "text-white" : "text-gray-900";
  const textSub = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <View
      className={`
        rounded-2xl p-5 mb-4 border mx-5 backdrop-blur-md
        ${cardBg} ${borderColor}
      `}
      style={{ shadowOpacity: 0.1, shadowRadius: 6 }}
    >
      {/* Subject Row */}
      <View className="flex-row items-center mb-2">
        <Ionicons
          name="book-outline"
          size={26}
          color={isDark ? "#f97316" : "#f97316"}
        />
        <Text className={`ml-3 text-xl font-medium ${textMain}`}>
          {subject}
        </Text>
      </View>

      {/* Teacher */}
      <Text className={`${textSub} text-base`}>
        👩‍🏫 Teacher:{" "}
        <Text className={`${textMain} font-medium`}>{maamName}</Text>
      </Text>

      {/* Time */}
      <Text className={`${textSub} text-base mt-1`}>
        ⏰ Time: <Text className={`${textMain} font-medium`}>{time}</Text>
      </Text>
    </View>
  );
};
