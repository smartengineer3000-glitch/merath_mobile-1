import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  I18nManager,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, SectionHeader } from "../../components/ui";
import { Ionicons } from "../../lib/icons";
import { APP_VERSION } from "../../lib/config";

const PRIVACY_POLICY_URL =
  "https://smartengineer3000-glitch.github.io/merath_mobile-1/";

export default function AboutScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const features = [
    { icon: "book", title: t("about.feature1") },
    { icon: "calculator", title: t("about.feature2") },
    { icon: "language", title: t("about.feature3") },
    { icon: "document-text", title: t("about.feature4") },
    { icon: "share-social", title: t("about.feature5") },
  ];

  const links = [
    {
      icon: "shield-checkmark",
      title: t("about.privacy"),
      onPress: () => Linking.openURL(PRIVACY_POLICY_URL),
    },
    {
      icon: "flask",
      title: t("settings.testEngine"),
      onPress: () => navigation.getParent()?.navigate("EngineTest"),
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader
        title={t("about.title")}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo & Version */}
        <View style={styles.logoSection}>
          <View
            style={[
              styles.logo,
              { backgroundColor: theme.colors.primary.main, borderRadius: 24 },
            ]}
          >
            <Text style={styles.logoText}>M</Text>
          </View>
          <Text
            style={[
              styles.appName,
              {
                color: theme.colors.neutral.dark300,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("app.name")}
          </Text>
          <Text
            style={[
              styles.version,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("about.version")} {APP_VERSION}
          </Text>
        </View>

        {/* Description */}
        <Card variant="elevated" style={styles.card}>
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.neutral.dark200,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("about.description")}
          </Text>
        </Card>

        {/* Features */}
        <Card variant="elevated" style={styles.card}>
          <SectionHeader title={t("about.features")} />
          {features.map((feature, i) => (
            <View
              key={i}
              style={[
                styles.featureRow,
                { borderBottomColor: theme.colors.neutral.light100 },
              ]}
            >
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: theme.colors.primary.lighter },
                ]}
              >
                <Ionicons
                  name={feature.icon as any}
                  size={22}
                  color={theme.colors.primary.main}
                />
              </View>
              <Text
                style={[
                  styles.featureTitle,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {feature.title}
              </Text>
            </View>
          ))}
        </Card>

        {/* Links */}
        <Card variant="elevated" style={styles.card}>
          {links.map((link, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.colors.neutral.light100 },
                  ]}
                />
              )}
              <View style={styles.featureRow}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: theme.colors.primary.lighter },
                  ]}
                >
                  <Ionicons
                    name={link.icon as any}
                    size={22}
                    color={theme.colors.primary.main}
                  />
                </View>
                <Text
                  style={[
                    styles.featureTitle,
                    {
                      color: theme.colors.neutral.dark200,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {link.title}
                </Text>
                <Ionicons
                  name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
                  size={16}
                  color={theme.colors.neutral.light400}
                />
              </View>
            </React.Fragment>
          ))}
        </Card>

        {/* Copyright */}
        <Text
          style={[
            styles.copyright,
            {
              color: theme.colors.neutral.light400,
              fontFamily: theme.fontFamily.english,
            },
          ]}
        >
          {t("about.copyright")}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  logoSection: { alignItems: "center", paddingVertical: 24 },
  logo: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  logoText: { color: "#ffffff", fontSize: 32, fontWeight: "800" },
  appName: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
  version: { fontSize: 13 },
  card: { marginBottom: 16 },
  description: { fontSize: 14, lineHeight: 22 },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: { fontSize: 13, fontWeight: "500", flex: 1 },
  divider: { height: 1, marginHorizontal: 0 },
  copyright: { fontSize: 11, textAlign: "center", marginTop: 8 },
});
