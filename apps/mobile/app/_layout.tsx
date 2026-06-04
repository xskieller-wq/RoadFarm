import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#3d4a3d" },
          headerTintColor: "#fff",
          headerTitle: "RouteFarm",
        }}
      />
    </>
  );
}
