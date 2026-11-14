
import {
    createContext,
    useContext,
    useMemo,
    useState,
    type PropsWithChildren,
} from 'react';

import { useColorScheme } from 'react-native';

import {
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider,
} from 'react-native-paper';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({
  children,
}: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const isDark =
    mode === 'system'
      ? systemScheme === 'dark'
      : mode === 'dark';

  const theme = useMemo(() => {
    const base = isDark ? MD3DarkTheme : MD3LightTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        primary: isDark ? '#93C5FD' : '#2563EB',
        secondary: isDark ? '#CBD5E1' : '#475569',
      },
    };
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('AppThemeProvider is required');
  }

  return context;
}
