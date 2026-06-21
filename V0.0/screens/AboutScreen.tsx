import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface FeatureItemProps {
  title: string;
  description: string;
}

interface MethodItemProps {
  name: string;
  scholar: string;
}

interface CaseItemProps {
  name: string;
  description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
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

function MethodItem({ name, scholar }: MethodItemProps) {
  return (
    <View style={styles.methodItem}>
      <Text style={styles.methodName}>{name}</Text>
      <Text style={styles.methodScholar}>({scholar})</Text>
    </View>
  );
}

function CaseItem({ name, description }: CaseItemProps) {
  return (
    <View style={styles.caseItem}>
      <Text style={styles.caseName}>{name}</Text>
      <Text style={styles.caseDescription}>{description}</Text>
    </View>
  );
}

export default function AboutScreen() {
  const features = [
    {
      title: "Islamic Inheritance Calculator",
      description: "Calculate inheritance shares according to Islamic law",
    },
    {
      title: "Multi-Madhhab Support",
      description: "Supports Hanafi, Maliki, Shafi'i, and Hanbali schools",
    },
    {
      title: "Comprehensive Heirs",
      description: "All types of heirs: spouses, children, parents, siblings",
    },
    {
      title: "Real-time Calculations",
      description: "Instant calculation with immediate feedback",
    },
    {
      title: "Export & Share",
      description: "Export results and share with family",
    },
    {
      title: "Educational Content",
      description: "Learn about Islamic inheritance laws",
    },
  ];

  const madhabs = [
    { name: "Hanafi", scholar: "Imam Abu Hanifa" },
    { name: "Maliki", scholar: "Imam Malik" },
    { name: "Shafi'i", scholar: "Imam Shafi'i" },
    { name: "Hanbali", scholar: "Imam Ahmad ibn Hanbal" },
  ];

  const specialCases = [
    { name: "Umm Walad", description: "Rules for freed concubines" },
    { name: "Dhawu al-Arham", description: "Inheritance by blood relation" },
    { name: "Radd (Return)", description: "Estate returned to heirs" },
    { name: "Aul (Increase)", description: "Portions increased when needed" },
  ];

  const handleContact = (type: string) => {
    let url = "";
    switch (type) {
      case "email":
        url = "mailto:support@merath.app";
        break;
      case "website":
        url = "https://merath.app";
        break;
      case "github":
        url = "https://github.com/merath";
        break;
    }
    if (url) {
      Linking.openURL(url).catch(() => {});
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="mosque" size={48} color="#2E7D32" />
        <Text style={styles.title}>Merath</Text>
        <Text style={styles.subtitle}>Islamic Inheritance Calculator</Text>
        <Text style={styles.version}>Version 1.1.3</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Supported Madhabs</Text>
        {madhabs.map((madhab, index) => (
          <MethodItem key={index} name={madhab.name} scholar={madhab.scholar} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Special Cases</Text>
        {specialCases.map((case_, index) => (
          <CaseItem
            key={index}
            name={case_.name}
            description={case_.description}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Islamic Inheritance</Text>
        <Text style={styles.description}>
          Islamic inheritance law (Fara'id) is based on the Quran and Sunnah. It
          ensures fair distribution of wealth among heirs according to
          prescribed shares.
        </Text>
        <Text style={styles.description}>
          This calculator follows the traditional Islamic inheritance rules for
          all Sunni schools.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact("email")}
        >
          <MaterialCommunityIcons name="email" size={24} color="#2E7D32" />
          <Text style={styles.contactButtonText}>Email Support</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact("website")}
        >
          <MaterialCommunityIcons name="web" size={24} color="#2E7D32" />
          <Text style={styles.contactButtonText}>Visit Website</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleContact("github")}
        >
          <MaterialCommunityIcons name="github" size={24} color="#2E7D32" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E7D32",
    marginTop: 16,
    fontFamily: "Inter-Bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#666666",
    marginTop: 8,
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  version: {
    fontSize: 14,
    color: "#999999",
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    fontFamily: "Inter-Bold",
  },
  description: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: "Inter-Regular",
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2E7D32",
    marginTop: 6,
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
    fontFamily: "Inter-Bold",
  },
  featureDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    fontFamily: "Inter-Regular",
  },
  methodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  methodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    fontFamily: "Inter-Bold",
  },
  methodScholar: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Inter-Regular",
  },
  caseItem: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  caseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
    fontFamily: "Inter-Bold",
  },
  caseDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
    fontFamily: "Inter-Regular",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  contactButtonText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#2E7D32",
    fontFamily: "Inter-Regular",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
    padding: 16,
  },
  footerText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
});
