import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type LocationsParamList = {
  Locations: undefined;
};

export type LocationsStackParamProps<T extends keyof LocationsParamList> = {
  navigation: StackNavigationProp<LocationsParamList, T>;
  route: RouteProp<LocationsParamList, T>;
};