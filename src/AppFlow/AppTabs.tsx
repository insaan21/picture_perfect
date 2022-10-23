import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppParamList } from './AppParamList';
import { Picture } from './PictureTab/Picture';
import { Locations } from './LocationsTab/Locations';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons/faLocationDot'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { Text } from 'react-native';

interface AppTabsProps {}

const Tabs = createBottomTabNavigator<AppParamList>();

export const AppTabs: React.FC<AppTabsProps> = ({}) => {
  return (
    <Tabs.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Locations':
              return <FontAwesomeIcon icon={ faLocationDot } size={size} color={color} />;
            case 'Camera':
              return <FontAwesomeIcon icon={ faCamera } size={size} color={color} />;
          }
        },
        tabBarLabel: ({focused, color}) => (
          <Text style={{color: focused ? '#fff' : color, fontSize: 10}}>{route.name}</Text>
        ),
        tabBarStyle: {borderTopWidth: 0, backgroundColor: route.name == 'Camera' ? "#000" : "rgb(18, 18, 18)"},
        headerStyle: {borderBottomWidth: 0},
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name='Locations' options={{headerStyle: {shadowColor: 'transparent'}}} component={Locations} />
      <Tabs.Screen name='Camera' options={{headerShown: false, headerStyle: {shadowColor: 'transparent'}}} component={Picture} />
    </Tabs.Navigator>
  );
}