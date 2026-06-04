import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { BAKERY_CATEGORIES } from "@routefarm/shared";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RouteFarm</Text>
      <Text style={styles.subtitle}>Fresh bakery from neighbors near you</Text>
      <Text style={styles.meta}>Phase 1 mobile scaffold · Expo + shared package</Text>
      <View style={styles.chips}>
        {BAKERY_CATEGORIES.slice(0, 4).map((c) => (
          <Text key={c} style={styles.chip}>
            {c}
          </Text>
        ))}
      </View>
      <Link href="/login" style={styles.link}>
        Sign in (coming soon)
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center", backgroundColor: "#f4f7f4" },
  title: { fontSize: 28, fontWeight: "700", color: "#2d3d2d" },
  subtitle: { fontSize: 16, color: "#5c5348", marginTop: 8 },
  meta: { fontSize: 12, color: "#8a8278", marginTop: 16 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 24 },
  chip: {
    backgroundColor: "#e5ede5",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    color: "#3d5c3d",
  },
  link: { marginTop: 32, fontSize: 16, color: "#5a7a5a", fontWeight: "600" },
});
