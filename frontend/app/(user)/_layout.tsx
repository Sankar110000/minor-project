import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View } from 'react-native';
import {AntDesign} from "@expo/vector-icons"
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? 'black' : 'white';
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
         tabBarStyle:{height:60},
        tabBarButton: HapticTab,
        
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
  tabBarIcon: ({ color }) => <AntDesign size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="generate_qr"
        options={{
          title: 'QR_code',
          tabBarIcon: ({ color }) => {
            return (<View  className='bottom-8 justify-center items-center overflow-hidden rounded-full w-[70px] h-[70px] bg-black dark:bg-white'> <AntDesign name="scan" size={32} color={iconColor} /> </View>)
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
           tabBarIcon: ({ color }) => <AntDesign size={28} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
