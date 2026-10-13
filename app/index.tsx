import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>JeevDrishti</Text>
      <Text style={styles.subtitle}>
        Wildlife identification and monitoring
      </Text>
      <Text style={styles.description}>
        Identify individual animals. Record sightings. Support forest officers.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1A14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#C4F3C0',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#B7C9BE',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 23,
  },
});
