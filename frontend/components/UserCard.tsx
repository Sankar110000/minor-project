import { FontAwesome5 } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, useColorScheme, View } from 'react-native'

const UserCard = ({userDet}:any) => {
    const theme = useColorScheme();
       const isDark = theme === "dark"
          const bgColor =  isDark? "bg-gray-900" : "bg-gray-100";
           const textMain = isDark ? "text-white" : "text-gray-900";
  return (
       <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl mb-4 flex-row items-center shadow-lg border border-neutral-200 dark:border-neutral-700">
  
 
  <Image
    source={{ uri:`https://avatar.iran.liara.run/public/boy?username=${userDet.studentName}` }}
    className="w-16 h-16 rounded-full mr-4 border-2 border-orange-500"
  />


  <View className="flex flex-col">
    
  
    <View className="flex-row items-center">
      <FontAwesome5 name="user-graduate" size={18} color="#f97316" />
      <Text className={`ml-2 text-lg font-semibold ${textMain}`}>
        {userDet.studentName}
      </Text>
    </View>

    <View className="flex flex-row items-center mt-1">
      <Text className="text-sm opacity-70">
         ⏰ <Text className={`${textMain} font-medium`}>{userDet.time}</Text>
      </Text>
    </View>

  </View>
</View>
  )
}

export default UserCard