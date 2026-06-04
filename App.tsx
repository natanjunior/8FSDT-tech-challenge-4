import { Text, View } from 'react-native';
import { PROJECT_NAME } from '@/constants';
import './global.css';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-foreground text-lg font-semibold">
        {PROJECT_NAME}
      </Text>
    </View>
  );
}
