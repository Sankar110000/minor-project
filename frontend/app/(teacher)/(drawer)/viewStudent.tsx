
import UserCard from '@/components/UserCard';
import { FontAwesome5} from '@expo/vector-icons';
import React, { useState } from 'react'
import { FlatList, Text, useColorScheme, View} from 'react-native'

const viewStident = () => {
  const classData = [
  { id: "1", studentName: "Niranjan",  time: "9:00 AM", },
  { id: "2", studentName: "Narayan", time: "10:00 AM", },
  { id: "3", studentName: "Banti", time: "11:00 AM", },
  { id: "4", studentName: "Soumya", time: "02:00 PM", },
  { id: "5", studentName: "Kaibalya", time: "02:00 PM", },
];
 
   const [classes, setClasses] = useState(classData);
  

   const theme = useColorScheme();
   const isDark = theme === "dark"
      const bgColor =  isDark? "bg-gray-900" : "bg-gray-100";
       const textMain = isDark ? "text-white" : "text-gray-900";
    return (
      <View className={`flex-1 px-5 py-6 ${bgColor}`}>
        <View className='flex gap-x-4 flex-row pl-3'>
          <FontAwesome5 name='user-graduate' size={28} color={"orange"}/>
            <Text className={`text-2xl font-medium mb-5 ${textMain}`}>
               All Presents Student
            </Text>
        </View>
      
            <FlatList
              data={classes}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
             <UserCard
             userDet={item}
             />
              )}
            />
          </View>
    )
}

export default viewStident