/**
 * Design audit for the V0.1 Android screens.
 *
 * This is intentionally kept as TypeScript instead of Markdown because the
 * project Markdown files are outdated and should not be treated as source of
 * truth for the V0.1 design review.
 */

export type DesignSeverity = "critical" | "high" | "medium" | "low";
export type ImplementationEffort = "small" | "medium" | "large";

export interface ScreenDesignFinding {
  screen: string;
  currentIssue: string;
  userImpact: string;
  modernRecommendation: string;
  bestPractice: string;
  severity: DesignSeverity;
  effort: ImplementationEffort;
}

export interface DesignRoadmapItem {
  phase: string;
  objective: string;
  deliverables: string[];
}

export const v01ScreenDesignFindings: ScreenDesignFinding[] = [
  {
    screen: "Calculator",
    currentIssue:
      "The screen mixes a hero summary, top tabs, fixed actions, and inline results in one vertical flow, which creates visual competition and can make the primary task feel longer than necessary.",
    userImpact:
      "Users may lose context about the next required action, especially on compact Android screens where the hero, tabs, and bottom actions compete for limited space.",
    modernRecommendation:
      "Replace the tabbed form with a single guided stepper: Estate details -> Heirs -> Madhhab -> Review. Keep one sticky primary action and show a compact progress header that collapses after scrolling.",
    bestPractice:
      "Progressive disclosure, one primary action per screen, sticky bottom CTA, and clear step completion states following Material Design 3 task-flow patterns.",
    severity: "critical",
    effort: "large",
  },
  {
    screen: "Calculator results preview",
    currentIssue:
      "Results can appear inline below the calculator while the app also has a dedicated Results tab, creating two competing destinations for the same information.",
    userImpact:
      "Users can be unsure whether the inline preview or Results tab is the canonical place to review, share, and compare inheritance output.",
    modernRecommendation:
      "After calculation, navigate to the Results tab with a short success transition. If a preview is needed, use a compact bottom sheet with only the net estate and top heirs plus a clear 'View full results' action.",
    bestPractice:
      "Single source of truth for critical outputs, predictable navigation, and bottom-sheet previews for transient summaries.",
    severity: "high",
    effort: "medium",
  },
  {
    screen: "Estate input",
    currentIssue:
      "The form is functional but dense; currency fields should provide stronger visual hierarchy, clearer helper text, and immediate net-estate feedback near the active input.",
    userImpact:
      "Users may enter values correctly but still need extra effort to understand how deductions affect the distributable estate.",
    modernRecommendation:
      "Use outlined Material 3 text fields with leading currency icons, localized numeral support, inline validation, and an always-visible net-estate summary card pinned below the form section.",
    bestPractice:
      "Immediate feedback, localized input affordances, accessible touch targets, and validation messages placed next to the field that needs attention.",
    severity: "high",
    effort: "medium",
  },
  {
    screen: "Heir selector",
    currentIssue:
      "The heir list uses categories and controls, but the interaction can still feel like data entry rather than guided selection for non-expert users.",
    userImpact:
      "Users may miss important family relationships or spouse constraints when scanning a long categorized list.",
    modernRecommendation:
      "Introduce searchable filter chips for relation groups, selected-heir summary chips, plus/minus quantity controls with 48dp targets, and contextual educational hints only when a category is expanded.",
    bestPractice:
      "Chunk large forms into scannable groups, provide selected-state summaries, and keep controls reachable with accessible target sizes.",
    severity: "high",
    effort: "medium",
  },
  {
    screen: "Madhhab selector",
    currentIssue:
      "The selector presents four schools with color and hints, but it should better explain what changes in the calculation and why the selected value matters.",
    userImpact:
      "Users who are unfamiliar with madhhab differences may choose a default without confidence.",
    modernRecommendation:
      "Use selectable Material cards with radio indicators, a short 'What changes?' explanation, and a comparison link that becomes available after a valid scenario exists.",
    bestPractice:
      "Explain consequential choices at the decision point and make selected states unmistakable through icon, border, fill, and accessible labels.",
    severity: "medium",
    effort: "small",
  },
  {
    screen: "Results",
    currentIssue:
      "The empty state is instruction-heavy and uses emoji as the main visual, while result presentation depends on a separate component that may become visually dense with shares, exports, and audit details.",
    userImpact:
      "First-time users receive a wall of guidance instead of a quick recovery action, and result readers may struggle to distinguish the final distribution from secondary actions.",
    modernRecommendation:
      "Use a polished illustration/icon container, a single 'Start calculation' CTA, and result sections ordered as: summary total, heir distribution cards, legal notes, audit trail, export actions.",
    bestPractice:
      "Actionable empty states, hierarchy-first result screens, and separating primary content from utility actions.",
    severity: "high",
    effort: "medium",
  },
  {
    screen: "Madhhab comparison",
    currentIssue:
      "Comparison data is likely table-like, which can become cramped on Android phones and hard to scan across four schools.",
    userImpact:
      "Users may miss meaningful differences between schools because horizontal comparisons are difficult on narrow screens.",
    modernRecommendation:
      "Use stacked comparison cards by heir, highlight only changed shares, and provide a segmented control for 'All', 'Differences only', and 'Explanation'.",
    bestPractice:
      "Mobile-first comparison views, difference highlighting, and avoiding wide tables on phones.",
    severity: "medium",
    effort: "medium",
  },
  {
    screen: "Settings",
    currentIssue:
      "Settings screens often become a mixed list of preferences, exports, language, legal, and support items without grouping by user intent.",
    userImpact:
      "Users spend more time scanning and may overlook important privacy, backup, or language controls.",
    modernRecommendation:
      "Group settings into modern sections: Profile & language, Calculation preferences, Data & backup, Legal & support. Use icons consistently and place destructive actions in a separated danger zone.",
    bestPractice:
      "Intent-based settings architecture, consistent list rows, clear section headers, and separated destructive actions.",
    severity: "medium",
    effort: "small",
  },
  {
    screen: "About",
    currentIssue:
      "About content reads like a static information page and does not leverage modern visual hierarchy to build trust quickly.",
    userImpact:
      "Users may not immediately understand version, credibility, supported schools, and limitations.",
    modernRecommendation:
      "Use a branded header, trust badges for supported madhhabs, concise feature cards, version/build metadata, and clear legal disclaimer links.",
    bestPractice:
      "Trust-first app information with scannable cards and explicit compliance/disclaimer access.",
    severity: "low",
    effort: "small",
  },
];

export const v01DesignRoadmap: DesignRoadmapItem[] = [
  {
    phase: "Foundation",
    objective:
      "Normalize the visual language before changing individual screens.",
    deliverables: [
      "Adopt a Material Design 3 screen template with safe-area aware headers and sticky bottom actions.",
      "Define reusable empty state, section header, status chip, and summary card components.",
      "Audit color contrast, typography scale, 48dp touch targets, and RTL alignment across all V0.1 screens.",
    ],
  },
  {
    phase: "Primary journey redesign",
    objective:
      "Make the calculation journey feel guided, shorter, and more trustworthy.",
    deliverables: [
      "Convert the calculator tabs into a guided stepper with review-before-calculate.",
      "Move full calculation output to the Results tab and keep any calculator preview as a compact bottom sheet only.",
      "Add contextual helper text for estate deductions, heir relationships, and madhhab choice.",
    ],
  },
  {
    phase: "Results and comparison modernization",
    objective:
      "Prioritize comprehension of final shares before secondary export actions.",
    deliverables: [
      "Create result summary cards for net estate, total heirs, and calculation school.",
      "Render heir shares as cards on phones and reserve tables for larger breakpoints.",
      "Highlight differences in madhhab comparison rather than showing all values with equal weight.",
    ],
  },
  {
    phase: "Polish and accessibility",
    objective:
      "Bring the Android experience to professional production quality.",
    deliverables: [
      "Add accessible labels and state descriptions to cards, steppers, chips, and icon-only controls.",
      "Validate text scaling, screen-reader order, keyboard behavior, dark mode, and low-contrast states.",
      "Run design QA on 320dp, 360dp, 411dp, and tablet widths before release.",
    ],
  },
];
