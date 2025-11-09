import { Card } from '@/components/Card';
import React, { useState } from 'react'
import { FlatList, Text, useColorScheme, View } from 'react-native'

const previousClass = () => {
  const classData = [
  { id: "1", maamName: "Mrs. Smith", subject: "Math", time: "9:00 AM", present: true, title: "Completed" },
  { id: "2", maamName: "Ms. Johnson", subject: "Science", time: "10:00 AM", present: true, title: "Completed" },
  { id: "3", maamName: "Mrs. Lee", subject: "History", time: "11:00 AM", present: true, title: "Completed" },
  { id: "4", maamName: "Mr. Khan", subject: "Computer Science", time: "02:00 PM", present: true, title: "Completed" },
];

const [previousClasses, setPreciousClasses]=useState(classData)
  const theme = useColorScheme();
     const bgColor = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
   return (
     <View className={`${bgColor} flex-1 p-4`}>
         <FlatList 
          data={previousClasses}
          renderItem={({item})=>(
            <Card
            
             subject={item?.subject}
            maamName={item?.maamName || "Unknown"}
            time={`${item?.time}`}
            present={item.present}
            title={item?.title}
            />
          )}
         />
          
     </View>
   )
}

export default previousClass