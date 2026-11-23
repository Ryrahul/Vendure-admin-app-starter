/**
 * Config plugin: pins the Android NDK used by the app and all native modules.
 *
 * React Native defaults to its own NDK version; on machines with a different NDK
 * installed, Gradle would try to download it. Expo's root project plugin only sets
 * `ext.ndkVersion` when it is not defined yet, so we define it first.
 *
 *   ["./plugins/with-android-ndk-version", { "ndkVersion": "28.2.13676358" }]
 */
const { withProjectBuildGradle } = require('expo/config-plugins');

const MARKER = '// @generated with-android-ndk-version';

module.exports = function withAndroidNdkVersion(config, { ndkVersion } = {}) {
  if (!ndkVersion) return config;
  return withProjectBuildGradle(config, (cfg) => {
    let contents = cfg.modResults.contents.replace(new RegExp(`\\n?${MARKER}[\\s\\S]*?${MARKER} end\\n`), '\n');
    const block = `${MARKER}\next { ndkVersion = "${ndkVersion}" }\n${MARKER} end\n`;
    contents = contents.replace(/\nbuildscript \{/, `\n${block}\nbuildscript {`);
    cfg.modResults.contents = contents;
    return cfg;
  });
};
