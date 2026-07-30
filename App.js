import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import NfcManager, {NfcTech} from 'react-native-nfc-manager';

function App() {
  const [nfcSupported, setNfcSupported] = useState(null);
  const [nfcEnabled, setNfcEnabled] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [tagUid, setTagUid] = useState('');
  const [tagInformation, setTagInformation] = useState(null);

  useEffect(() => {
    initializeNfc();

    return () => {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  async function initializeNfc() {
    try {
      const supported = await NfcManager.isSupported();

      setNfcSupported(supported);

      if (!supported) {
        setNfcEnabled(false);
        return;
      }

      await NfcManager.start();

      const enabled = await NfcManager.isEnabled();

      setNfcEnabled(enabled);
    } catch (error) {
      console.log('NFC initialization error:', error);

      setNfcSupported(false);
      setNfcEnabled(false);
    }
  }

  async function scanNfcTag() {
    if (!nfcSupported) {
      Alert.alert(
        'NFC Not Supported',
        'This Android phone does not support NFC.',
      );
      return;
    }

    const enabled = await NfcManager.isEnabled();

    if (!enabled) {
      setNfcEnabled(false);

      Alert.alert(
        'NFC Is Disabled',
        'Please enable NFC in your Android phone settings.',
      );

      return;
    }

    setNfcEnabled(true);
    setScanning(true);
    setTagUid('');
    setTagInformation(null);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const tag = await NfcManager.getTag();

      console.log('Complete NFC tag:', tag);

      const rawUid = tag?.id || '';

      const normalizedUid = String(rawUid)
        .replace(/:/g, '')
        .replace(/-/g, '')
        .replace(/\s/g, '')
        .toUpperCase();

      setTagUid(normalizedUid || 'UID not returned');
      setTagInformation(tag);

      Alert.alert(
        'NFC Tag Scanned',
        normalizedUid
          ? `Tag UID: ${normalizedUid}`
          : 'Tag scanned, but no UID was returned.',
      );
    } catch (error) {
      console.log('NFC scan error:', error);

      Alert.alert(
        'Unable to Scan',
        'Place the phone near the NFC tag and try again.',
      );
    } finally {
      await NfcManager.cancelTechnologyRequest().catch(() => {});

      setScanning(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerSmall}>MBRLC</Text>

          <Text style={styles.headerTitle}>
            Goat NFC Identification
          </Text>

          <Text style={styles.headerDescription}>
            Scan the NFC tag attached to the goat.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.nfcIcon}>
            <Text style={styles.nfcIconText}>NFC</Text>
          </View>

          <Text style={styles.title}>Scan Goat Tag</Text>

          <Text style={styles.description}>
            Hold the back of the Android phone close to the NFC tag.
          </Text>

          <View style={styles.statusContainer}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>NFC Support</Text>

              <Text style={styles.statusValue}>
                {nfcSupported === null
                  ? 'Checking...'
                  : nfcSupported
                    ? 'Supported'
                    : 'Not Supported'}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>NFC Status</Text>

              <Text style={styles.statusValue}>
                {nfcEnabled === null
                  ? 'Checking...'
                  : nfcEnabled
                    ? 'Enabled'
                    : 'Disabled'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.scanButton,
              (!nfcSupported || !nfcEnabled || scanning) &&
                styles.disabledButton,
            ]}
            disabled={!nfcSupported || !nfcEnabled || scanning}
            onPress={scanNfcTag}>
            {scanning ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#FFFFFF" />

                <Text style={styles.scanButtonText}>
                  Waiting for NFC Tag...
                </Text>
              </View>
            ) : (
              <Text style={styles.scanButtonText}>
                Start NFC Scan
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {tagUid ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>
              Scanned NFC UID
            </Text>

            <Text selectable style={styles.resultUid}>
              {tagUid}
            </Text>
          </View>
        ) : null}

        {tagInformation ? (
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>
              NFC Tag Information
            </Text>

            <Text selectable style={styles.detailsText}>
              {JSON.stringify(tagInformation, null, 2)}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F6F3',
  },

  container: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#214E2B',
    borderRadius: 18,
    padding: 20,
    marginBottom: 15,
  },

  headerSmall: {
    color: '#CDE3D1',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },

  headerTitle: {
    marginTop: 5,
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '900',
  },

  headerDescription: {
    marginTop: 6,
    color: '#E6F0E8',
    fontSize: 14,
  },

  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D8E0D9',
  },

  nfcIcon: {
    width: 85,
    height: 85,
    borderRadius: 25,
    backgroundColor: '#E5F1E7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  nfcIconText: {
    color: '#214E2B',
    fontSize: 20,
    fontWeight: '900',
  },

  title: {
    marginTop: 15,
    color: '#1D2A20',
    fontSize: 23,
    fontWeight: '900',
  },

  description: {
    marginTop: 7,
    marginBottom: 18,
    color: '#657069',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },

  statusContainer: {
    width: '100%',
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#D8E0D9',
    paddingVertical: 12,
  },

  statusLabel: {
    color: '#657069',
    fontSize: 14,
  },

  statusValue: {
    color: '#1D2A20',
    fontSize: 14,
    fontWeight: '800',
  },

  scanButton: {
    width: '100%',
    minHeight: 52,
    marginTop: 10,
    borderRadius: 12,
    backgroundColor: '#2F6B3B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  disabledButton: {
    backgroundColor: '#A8B2AA',
  },

  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  resultCard: {
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: '#214E2B',
    padding: 17,
  },

  resultLabel: {
    color: '#CDE3D1',
    fontSize: 13,
    fontWeight: '700',
  },

  resultUid: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },

  detailsCard: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D8E0D9',
  },

  detailsTitle: {
    color: '#1D2A20',
    fontSize: 17,
    fontWeight: '900',
  },

  detailsText: {
    marginTop: 10,
    color: '#354138',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default App;