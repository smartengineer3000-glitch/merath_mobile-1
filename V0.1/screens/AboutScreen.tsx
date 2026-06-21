import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useAppTheme } from '../lib/context/ThemeProvider';
import type { Theme } from '../lib/design/theme';

interface FeatureItemProps {
  title: string;
  description: string;
  theme: Theme;
}

interface MethodItemProps {
  name: string;
  scholar: string;
  theme: Theme;
}

interface CaseItemProps {
  name: string;
  description: string;
  theme: Theme;
}

function FeatureItem({ title, description, theme }: FeatureItemProps) {
  const styles = createStyles(theme);
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

function MethodItem({ name, scholar, theme }: MethodItemProps) {
  const styles = createStyles(theme);
  return (
    <View style={styles.methodItem}>
      <Text style={styles.methodName}>{name}</Text>
      <Text style={styles.methodScholar}>({scholar})</Text>
    </View>
  );
}

function CaseItem({ name, description, theme }: CaseItemProps) {
  const styles = createStyles(theme);
  return (
    <View style={styles.caseItem}>
      <Text style={styles.caseName}>{name}</Text>
      <Text style={styles.caseDescription}>{description}</Text>
    </View>
  );
}

export default function AboutScreen() {
  const { theme } = useAppTheme();
  const appVersion = Constants.expoConfig?.version ?? '1.1.3';
  const styles = createStyles(theme);

  const features = [
    {
      title: 'Islamic Inheritance Calculator',
      description: 'Calculate inheritance shares according to Islamic law',
    },
    {
      title: 'Multi-Madhhab Support',
      description: 'Supports Hanafi, Maliki, Shafi\'i, and Hanbali schools',
    },
    {
      title: 'Comprehensive Heirs',
      description: 'All types of heirs: spouses, children, parents, siblings',
    },
    {
      title: 'Real-time Calculations',
      description: 'Instant calculation with immediate feedback',
    },
    {
      title: 'Export & Share',
      description: 'Export results and share with family',
    },
    {
      title: 'Educational Content',
      description: 'Learn about Islamic inheritance laws',
    },
  ];

  const madhabs = [
    { name: 'Hanafi', scholar: 'Imam Abu Hanifa' },
    { name: 'Maliki', scholar: 'Imam Malik' },
    { name: 'Shafi\'i', scholar: 'Imam Shafi\'i' },
    { name: 'Hanbali', scholar: 'Imam Ahmad ibn Hanbal' },
  ];

  const specialCases = [
    { name: 'Umm Walad', description: 'Rules for freed concubines' },
    { name: 'Dhawu al-Arham', description: 'Inheritance by blood relation' },
    { name: 'Radd (Return)', description: 'Estate returned to heirs' },
    { name: 'Aul (Increase)', description: 'Portions increased when needed' },
  ];

  const handleContact = (type: string) => {
    let url = '';
    switch (type) {
      case 'email':
        url = 'mailto:support@merath.app';
        break;
      case 'website':
        url = 'https://merath.app';
        break;
      case 'github':
        url = 'https://github.com/merath';
        break;
    }
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="star-crescent" size={48} color={theme.colors.primary.main} />
        <Text style={styles.title}>Merath</Text>
        <Text style={styles.subtitle}>Islamic Inheritance Calculator</Text>
        <Text style={styles.version}>Version {appVersion}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            title={feature.title}
            description={feature.description}
            theme={theme}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Supported Madhabs</Text>
        {madhabs.map((madhab, index) => (
          <MethodItem
            key={index}
            name={madhab.name}
            scholar={madhab.scholar}
            theme={theme}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Cases</Text>
        {specialCases.map((case_, index) => (
          <CaseItem
            key={index}
            name={case_.name}
            description={case_.description}
            theme={theme}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Islamic Inheritance</Text>
        <Text style={styles.description}>
          Islamic inheritance law (Fara&apos;id) is based on the Quran and Sunnah.
          It ensures fair distribution of wealth among heirs according to prescribed shares.
        </Text>
        <Text style={styles.description}>
          This calculator follows the traditional Islamic inheritance rules for all Sunni schools.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact('email')}
        >
          <MaterialCommunityIcons name="email" size={24} color={theme.colors.primary.main} />
          <Text style={styles.contactButtonText}>Email Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact('website')}
        >
          <MaterialCommunityIcons name="web" size={24} color={theme.colors.primary.main} />
          <Text style={styles.contactButtonText}>Visit Website</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact('github')}
        >
          <MaterialCommunityIcons name="github" size={24} color={theme.colors.primary.main} />
          <Text style={styles.contactButtonText}>GitHub</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          شكراً لاستخدامك تطبيق حاسبة المواريث الشرعية
        </Text>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
      padding: theme.spacing.md,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xxxl,
      paddingTop: theme.spacing.md,
    },
    title: {
      ...theme.typography.display.medium,
      color: theme.colors.primary.main,
      marginTop: theme.spacing.md,
    },
    subtitle: {
      ...theme.typography.headline.small,
      color: theme.colors.neutral.main,
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    version: {
      ...theme.typography.label.medium,
      color: theme.colors.neutral.light400,
      marginTop: theme.spacing.xs,
    },
    section: {
      marginBottom: theme.spacing.xxxl,
    },
    sectionTitle: {
      ...theme.typography.headline.large,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.md,
    },
    description: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      marginBottom: theme.spacing.sm,
    },
    featureItem: {
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'flex-start',
    },
    featureDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary.main,
      marginTop: theme.spacing.xs,
      marginRight: theme.spacing.sm,
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      ...theme.typography.title.small,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.xs,
    },
    featureDescription: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.main,
    },
    methodItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.light,
      borderRadius: 8,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    methodName: {
      ...theme.typography.title.small,
      color: theme.colors.neutral.dark300,
    },
    methodScholar: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.main,
    },
    caseItem: {
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.light,
      borderRadius: 8,
      marginBottom: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    caseName: {
      ...theme.typography.title.small,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.xs,
    },
    caseDescription: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.main,
    },
    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: theme.spacing.md,
      marginBottom: theme.spacing.xs,
      backgroundColor: theme.colors.background.light,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light200,
    },
    contactButtonText: {
      ...theme.typography.body.medium,
      marginLeft: theme.spacing.sm,
      color: theme.colors.primary.main,
    },
    footer: {
      alignItems: 'center',
      marginTop: theme.spacing.xxxl,
      marginBottom: theme.spacing.xxxl,
      padding: theme.spacing.md,
    },
    footerText: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      textAlign: 'center',
    },
  });
