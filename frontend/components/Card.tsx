import { Text, View } from "react-native";
import TouchableBtn from "./TouchableBtn";


export const Card = ({ maamName, subject, time }:any) => (
  <View className="dark:bg-zinc-800 bg-white rounded-xl p-4 mb-3 shadow-md flex-row justify-between items-center px-7 mx-5 my-3">
<View>
        <Text className="text-lg font-bold dark:text-gray-100">{maamName}</Text>
    <Text className="text-base text-gray-600">{subject}</Text>
    <Text className="text-sm text-gray-400">{time}</Text>
</View>
    <TouchableBtn title={"Present"} btnStyle={"bg-yellow-500 text-white px-5 py-2 rounded"}  />
  </View>
);
