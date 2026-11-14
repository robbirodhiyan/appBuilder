
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  Text,
} from 'react-native-paper';

export default function HomeScreen() {
  const [counter, setCounter] = useState(0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium">
          Offline Starter Kit
        </Text>

        <Text variant="bodyMedium">
          Expo SDK 58 + React Native Paper
        </Text>
      </View>

      <Card mode="elevated">
        <Card.Title
          title="Framework Status"
          subtitle="Environment Configuration"
        />

        <Card.Content style={styles.section}>
          <Chip>Expo SDK 58</Chip>
          <Chip>React Native Paper</Chip>
          <Chip>TypeScript</Chip>
          <Chip>Expo Router</Chip>
        </Card.Content>
      </Card>

      <Card mode="elevated">
        <Card.Title
          title="Component Testing"
          subtitle="Interactive UI"
        />

        <Card.Content style={styles.section}>
          <Text variant="titleLarge">
            Counter: {counter}
          </Text>

          <Divider />

          <Button
            mode="contained"
            onPress={() => setCounter(counter + 1)}
          >
            Tambah Counter
          </Button>

          <Button
            mode="outlined"
            onPress={() => setCounter(0)}
          >
            Reset Counter
          </Button>
        </Card.Content>
      </Card>

      <Text style={styles.footer}>
        Offline Starter Kit v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    gap: 20,
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
  },
  header: {
    gap: 6,
    marginTop: 30,
  },
  section: {
    gap: 12,
    paddingBottom: 20,
  },
  footer: {
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
});
