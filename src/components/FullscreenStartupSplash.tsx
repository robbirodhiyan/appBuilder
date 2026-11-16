import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import project from '../../project.config.json';

const ART = require('../../assets/images/splash-icon.png');
const BRAND_BACKGROUND = project.branding.backgroundColor;

export default function FullscreenStartupSplash({
  children,
  ready = true,
  minVisibleMs = 850,
}: {
  children: ReactNode;
  ready?: boolean;
  minVisibleMs?: number;
}) {
  const [imageReady, setImageReady] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [nativeHidden, setNativeHidden] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const fadeStarted = useRef(false);

  useEffect(() => {
    if (!imageReady && !imageFailed) return;
    let active = true;
    void SplashScreen.hideAsync().catch((error: unknown) => {
      console.warn('[DeyKit Splash] Native splash:', error);
    }).finally(() => { if (active) setNativeHidden(true); });
    return () => { active = false; };
  }, [imageReady, imageFailed]);

  useEffect(() => {
    if (!nativeHidden) return;
    const timer = setTimeout(() => setMinimumElapsed(true), Math.max(minVisibleMs, 0));
    return () => clearTimeout(timer);
  }, [nativeHidden, minVisibleMs]);

  useEffect(() => {
    if (!ready || !contentReady || !nativeHidden || !minimumElapsed || fadeStarted.current) return;
    fadeStarted.current = true;
    Animated.timing(opacity, {
      toValue: 0, duration: 250, useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setVisible(false);
    });
  }, [ready, contentReady, nativeHidden, minimumElapsed, opacity]);

  return (
    <View style={[styles.root, { backgroundColor: BRAND_BACKGROUND }]}>
      <View style={styles.content} onLayout={() => setContentReady(true)}>{children}</View>
      {visible && (
        <Animated.View
          pointerEvents="auto"
          style={[styles.cover, { opacity, backgroundColor: BRAND_BACKGROUND }]}
        >
          <StatusBar hidden />
          {imageFailed ? (
            <View style={styles.fallback}>
              <Text style={styles.title}>{project.app.name}</Text>
            </View>
          ) : (
            <Image
              source={ART}
              resizeMode="contain"
              style={styles.image}
              fadeDuration={0}
              onLoad={() => setImageReady(true)}
              onError={() => setImageFailed(true)}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
  cover: { ...StyleSheet.absoluteFill, zIndex: 1000, elevation: 1000 },
  image: { width: '100%', height: '100%' },
  fallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: '800', fontSize: 25 },
});
