import { Card } from '@/components/Card';
import React from 'react';
import { FlatList, View, Text, SafeAreaView } from 'react-native';
import axios from "axios"

const data = [
  { id: '1', maamName: 'Mrs. Smith', subject: 'Math', time: '9:00 AM' },
  { id: '2', maamName: 'Ms. Johnson', subject: 'Science', time: '10:00 AM' },
  { id: '3', maamName: 'Mrs. Lee', subject: 'History', time: '11:00 AM' },
  { id: '4', maamName: 'Ms. Brown', subject: 'English', time: '12:00 PM' },
  { id: '5', maamName: 'Mrs. Taylor', subject: 'Physics', time: '1:00 PM' },
  { id: '6', maamName: 'Ms. Wilson', subject: 'Chemistry', time: '2:00 PM' },
  { id: '7', maamName: 'Mrs. White', subject: 'Biology', time: '3:00 PM' },
  { id: '8', maamName: 'Ms. Harris', subject: 'Geography', time: '4:00 PM' },
  { id: '9', maamName: 'Mrs. Clark', subject: 'Computer Science', time: '5:00 PM' },
  { id: '10', maamName: 'Ms. Lewis', subject: 'Art', time: '6:00 PM' },
];


export default function App() {
  async function getData() {
    try {
      const res = await axios.get('http://localhost:8000')
      console.log("Index rendered")
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }


  React.useEffect(() => {
    getData()
  }, [])
  return (
    <SafeAreaView className="flex-1  ">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            maamName={item.maamName}
            subject={item.subject}
            time={item.time}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
