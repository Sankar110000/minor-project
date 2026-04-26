import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, useColorScheme, View } from "react-native";

export const Card = ({ subject, maamName, time, present, title, studentCount }: any) => {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  const cardBg = isDark ? "#111827" : "#ffffff";
  const borderColor = isDark ? "#1f2937" : "#e5e7eb";
  const textMain = isDark ? "#f9fafb" : "#111827";
  const textSub = isDark ? "#9ca3af" : "#6b7280";

  const formattedTime = time
    ? (() => {
        try {
          const date = new Date(time);
          return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch {
          return time;
        }
      })()
    : "—";

  return (
    <View
      className="rounded-2xl mb-4 mx-5 overflow-hidden"
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor: borderColor,
      }}
    >
      {/* Top accent */}
      <View style={{ height: 3, backgroundColor: "#f97316" }} />

      <View className="p-4">
        {/* Subject Row */}
        <View className="flex-row items-center mb-3">
          <View
            className="w-10 h-10 rounded-xl items-center justify-center mr-3"
            style={{ backgroundColor: "rgba(249, 115, 22, 0.12)" }}
          >
            <Ionicons name="book-outline" size={20} color="#f97316" />
          </View>
          <View className="flex-1">
            <Text
              className="text-lg font-bold"
              style={{ color: textMain }}
              numberOfLines={1}
            >
              {subject || "Untitled"}
            </Text>
          </View>
        </View>

        {/* Details */}
        <View className="gap-2 ml-1">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="account-outline"
              size={16}
              color={textSub}
            />
            <Text className="ml-2 text-sm" style={{ color: textSub }}>
              Teacher:{" "}
              <Text style={{ color: textMain, fontWeight: "600" }}>
                {maamName || "—"}
              </Text>
            </Text>
          </View>

          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={textSub}
            />
            <Text className="ml-2 text-sm" style={{ color: textSub }}>
              Time:{" "}
              <Text style={{ color: textMain, fontWeight: "600" }}>
                {formattedTime}
              </Text>
            </Text>
          </View>

          {studentCount !== undefined && (
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="account-group-outline"
                size={16}
                color={textSub}
              />
              <Text className="ml-2 text-sm" style={{ color: textSub }}>
                Students:{" "}
                <Text style={{ color: "#f97316", fontWeight: "600" }}>
                  {studentCount}
                </Text>
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
