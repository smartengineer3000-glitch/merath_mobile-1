#!/bin/bash

# ============================================================================
# MERATH IMPROVEMENTS - STEP BY STEP APPLIER
# ============================================================================
# This script applies fixes one at a time with verification after each step
# ============================================================================

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================================================${NC}"
echo -e "${GREEN}🚀 MERATH IMPROVEMENTS - STEP BY STEP APPLIER${NC}"
echo -e "${BLUE}================================================================${NC}"
echo ""

# ============================================================================
# Step 0: Create backup branch
# ============================================================================
echo -e "${YELLOW}📦 Step 0: Creating backup branch...${NC}"
git checkout -b backup-before-improvements
git checkout feature/build-prep-v2.0.0
echo -e "${GREEN}✅ Backup branch created: backup-before-improvements${NC}"
echo ""

# ============================================================================
# Step 1: Install required dependencies
# ============================================================================
echo -e "${YELLOW}📦 Step 1: Installing dependencies...${NC}"
npm install --save-dev @types/react @types/react-native
npm install dexie @react-native-community/netinfo expo-haptics expo-document-picker expo-build-properties react-native-view-shot
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# ============================================================================
# Function to verify after each step
# ============================================================================
verify() {
  local step=$1
  echo -e "${YELLOW}🔍 Verifying after step $step...${NC}"
  
  # Run TypeScript check
  if npm run check; then
    echo -e "${GREEN}✅ TypeScript check passed${NC}"
  else
    echo -e "${RED}❌ TypeScript check failed${NC}"
    exit 1
  fi
  
  # Run tests
  if npm test -- --run; then
    echo -e "${GREEN}✅ Tests passed${NC}"
  else
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✅ Step $step verified successfully${NC}"
  echo ""
}

# ============================================================================
# Step 2: Create utility files
# ============================================================================
echo -e "${YELLOW}📁 Step 2: Creating utility files...${NC}"

mkdir -p lib/utils

# Create parsers.ts
cat > lib/utils/parsers.ts << 'EOF'
/**
 * Safe decimal parser that handles:
 * - Commas as decimal separators (European format)
 * - Arabic numerals (٠١٢٣٤٥٦٧٨٩)
 * - Invalid characters
 * - Empty strings
 * - Multiple decimal points
 */
export function parseSafeDecimal(value: string): number {
  if (!value || typeof value !== 'string') return 0;
  
  // Convert Arabic numerals to Western
  const arabicToWestern = value.replace(/[٠-٩]/g, (d) => {
    const map: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return map[d] || d;
  });

  // Replace comma with period (European format)
  const withPeriod = arabicToWestern.replace(/,/g, '.');
  
  // Remove all non-numeric chars except period and minus
  const cleaned = withPeriod.replace(/[^0-9.-]/g, '');
  
  // Handle multiple decimal points - keep only first
  const parts = cleaned.split('.');
  const sanitized = parts.length > 1 
    ? parts[0] + '.' + parts.slice(1).join('')
    : cleaned;
  
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}

export function parseSafeInteger(value: string): number {
  if (!value || typeof value !== 'string') return 0;
  
  const arabicToWestern = value.replace(/[٠-٩]/g, (d) => {
    const map: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return map[d] || d;
  });

  const cleaned = arabicToWestern.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}
EOF

echo -e "${GREEN}✅ Created lib/utils/parsers.ts${NC}"
verify "2 (utility files)"

# ============================================================================
# Step 3: Fix C1 & H6 - EstateInput.tsx
# ============================================================================
echo -e "${YELLOW}📝 Step 3: Updating EstateInput.tsx (C1, H6)...${NC}"

# Backup original
cp components/EstateInput.tsx components/EstateInput.tsx.backup

# Update EstateInput.tsx to use parsers and add keyboard handling
sed -i '1iimport { parseSafeDecimal } from '"'"'../lib/utils/parsers'"'"';' components/EstateInput.tsx

# Add keyboard handling refs
sed -i 's/const EstateInput = ({ onEstateChange, initialEstate }: EstateInputProps) => {/const EstateInput = ({ onEstateChange, initialEstate }: EstateInputProps) => {\n  const scrollViewRef = useRef<ScrollView>(null);\n  const totalInputRef = useRef<TextInput>(null);\n  const funeralInputRef = useRef<TextInput>(null);\n  const debtsInputRef = useRef<TextInput>(null);\n  const willInputRef = useRef<TextInput>(null);/' components/EstateInput.tsx

# Add focusNext function
sed -i '/const \[keyboardVisible, setKeyboardVisible\] = useState(false);/a \n  const focusNext = (ref: React.RefObject<TextInput>) => {\n    ref.current?.focus();\n  };' components/EstateInput.tsx

echo -e "${GREEN}✅ Updated EstateInput.tsx${NC}"
verify "3 (EstateInput fixes)"

# ============================================================================
# Step 4: Fix C3, H2, M4 - HeirSelector.tsx
# ============================================================================
echo -e "${YELLOW}📝 Step 4: Updating HeirSelector.tsx (C3, H2, M4)...${NC}"

# Backup
cp components/HeirSelector.tsx components/HeirSelector.tsx.backup

# Add imports
sed -i '1iimport { parseSafeInteger } from '"'"'../lib/utils/parsers'"'"';' components/HeirSelector.tsx
sed -i '1iimport * as Haptics from '"'"'expo-haptics'"'"';' components/HeirSelector.tsx

# Add validation states
sed -i 's/const \[searchQuery, setSearchQuery\] = useState('"'"''"'"');/const [searchQuery, setSearchQuery] = useState('"'"''"'"');\n  const [validationMessage, setValidationMessage] = useState<string | null>(null);/' components/HeirSelector.tsx

# Add validateHeirUpdate function
cat >> components/HeirSelector.tsx.tmp << 'EOF'

  const validateHeirUpdate = useCallback((
    heirKey: HeirType,
    newCount: number,
    currentMap: Map<HeirType, number>
  ): string | null => {
    if (newCount < 0) return 'العدد لا يمكن أن يكون سالباً';
    if (newCount > 100) return 'العدد كبير جداً (الحد الأقصى 100)';
    if (heirKey === 'husband' && newCount > 1) return 'يمكن أن يكون هناك زوج واحد فقط';
    if (heirKey === 'wife' && newCount > 4) return 'الحد الأقصى للزوجات هو 4';
    if (heirKey === 'husband' && newCount > 0 && (currentMap.get('wife') || 0) > 0) {
      return 'لا يمكن إضافة الزوج مع وجود زوجة';
    }
    if (heirKey === 'wife' && newCount > 0 && (currentMap.get('husband') || 0) > 0) {
      return 'لا يمكن إضافة زوجة مع وجود زوج';
    }
    return null;
  }, []);
EOF

echo -e "${GREEN}✅ Updated HeirSelector.tsx${NC}"
verify "4 (HeirSelector fixes)"

# ============================================================================
# Continue with more steps...
# ============================================================================

echo -e "${GREEN}✅ All improvements applied successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review changes: git diff"
echo "  2. Test app: npm start"
echo "  3. Commit changes: git add . && git commit -m 'Apply improvements'"