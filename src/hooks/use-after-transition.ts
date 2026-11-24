import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';

/**
 * False until the screen's native push transition has finished, then true.
 *
 * Mounting a big view tree in the same frame as a push delays the animation and makes it
 * hitch. Screens render a light skeleton first and mount the real body once the slide-in
 * is done. Data queries still start immediately, so nothing loads later than before.
 *
 * Screens with no push transition (a tab's root screen) are ready at once. There's a short
 * fallback timer in case `transitionEnd` never arrives (e.g. animations disabled).
 */
export function useAfterTransition(fallbackMs = 450): boolean {
  const navigation = useNavigation();
  const [ready, setReady] = useState(() => {
    const state = navigation.getState?.();
    return !state || state.index === 0 || state.type !== 'stack';
  });

  useEffect(() => {
    if (ready) return;
    const done = () => setReady(true);
    const timer = setTimeout(done, fallbackMs);
    // `transitionEnd` is a native-stack event; the base navigation type doesn't know it.
    const unsubscribe = (
      navigation as unknown as {
        addListener: (e: 'transitionEnd', cb: (e: { data?: { closing?: boolean } }) => void) => () => void;
      }
    ).addListener('transitionEnd', (e) => {
      if (!e.data?.closing) done();
    });
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [ready, navigation, fallbackMs]);

  return ready;
}
