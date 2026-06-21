# Merath FAQ - Frequently Asked Questions

## General Questions

### What is Merath?

Merath is a professional-grade Islamic inheritance calculator built with React Native. It accurately calculates heir distributions according to Islamic jurisprudence (Fiqh) across multiple Islamic schools (Madhabs).

### Is it free?

Yes, Merath is completely free to download and use. No hidden charges or in-app purchases.

### What platforms does it support?

- **Mobile**: iOS 12+, Android 6.0+
- **Web**: All modern browsers (Chrome, Firefox, Safari)

### Is my data secure?

Yes. All calculations are performed locally on your device. No data is sent to any server. Your privacy is our priority.

## Calculation Questions

### How accurate are the calculations?

Merath uses fraction-based arithmetic for exact calculations, not decimal approximations. This ensures perfect accuracy to the last penny, regardless of estate size.

### Which Islamic schools does it support?

- Hanafi
- Maliki
- Shafii
- Hanbali

### What is the Hijab system?

Hijab (حجاب) means "veil" or "screen" in Islamic law. It refers to certain heirs being completely or partially excluded from inheritance due to the presence of other heirs. For example:

- A grandson is completely excluded if a son exists
- A daughter's share is reduced if sons exist

### Can I calculate for complex family situations?

Yes! Merath handles:

- Multiple spouses
- Full and half-siblings
- Predeceased heirs
- Complex grandfather/grandmother situations
- Extended family relationships

### What if there are bequests?

Merath deducts bequests before calculating inheritance shares:

```
Distribution = Total - Debts - Funeral - Bequests
```

Specific bequests are honored first, then remaining divided among heirs.

### How are fractions displayed?

Shares are displayed as both:

- **Fractions**: e.g., "1/8" (exact)
- **Percentage**: e.g., "12.5%" (for reference)
- **Amount**: e.g., "$12,500" (actual money)

## Usage Questions

### How do I start a calculation?

1. Open Merath
2. Select Islamic school (Madhab)
3. Enter estate total and deductions
4. Add heirs with relationships
5. Tap "Calculate"
6. View results

### Can I save calculations?

Yes! Merath automatically saves all calculations. Access history from the History screen.

### How do I export results?

You can export to:

- **JSON**: For data import/backup
- **CSV**: For spreadsheet software
- **PDF**: For printing/sharing

### Can I edit a previous calculation?

Yes! Tap a calculation from history to view it, then modify and recalculate.

### What if I make a mistake?

Simply modify the values and recalculate. All previous versions are saved in history.

## Technical Questions

### What's the app size?

- **iOS**: ~45 MB
- **Android**: ~38 MB
- **Web**: ~500 KB

### Does it work offline?

Yes! All calculations are done locally. You don't need an internet connection.

### Can I use it on multiple devices?

Yes, but calculations don't sync across devices. Save to JSON and import on other devices.

### What if I lose my data?

You can:

1. Export to JSON (backup)
2. Email backups to yourself
3. Restore from JSON file

### Is there an API?

Yes! Merath provides a JavaScript/TypeScript API. See [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

## Platform-Specific Questions

### iOS

**Q: Why does the app ask for permission?**
A: Required permissions:

- Camera: For QR code scanning (optional)
- Documents: For import/export

**Q: Can I install on iPad?**
A: Yes! Merath is fully optimized for iPad.

**Q: What iOS version is required?**
A: iOS 12.0 or later.

### Android

**Q: What Android version is required?**
A: Android 6.0 (API level 23) or later.

**Q: Can I install from sources other than Google Play?**
A: Yes, you can sideload the APK file. Download from our website.

**Q: Does it work on tablets?**
A: Yes! Optimized for all Android screen sizes.

### Web

**Q: Can I save my results in the web version?**
A: Yes! Results are saved in browser local storage. Clearing browser data will delete them.

**Q: Which browsers are supported?**
A: Chrome, Firefox, Safari, Edge (all modern versions).

**Q: Can I use offline?**
A: Yes, after the first load, the web app works offline.

## Madhab-Specific Questions

### What are the main differences between Madhabs?

**Hanafi**:

- Most practical
- Wife gets 1/8 if children present
- Used in Central Asia, South Asia

**Maliki**:

- Integrates local customs
- More flexible on some issues
- Used in North Africa

**Shafii**:

- Middle-ground approach
- Wife gets 1/8 (like Hanafi)
- Used in Southeast Asia

**Hanbali**:

- Strict adherence to principles
- Similar to Shafii on many issues
- Used in Saudi Arabia

### Can I calculate using multiple Madhabs?

Yes! You can:

1. Calculate with Hanafi rules
2. Save results
3. Go back and calculate with Maliki
4. Compare both results

## Legal & Compliance Questions

### Is this legally binding?

Merath is a calculator tool for educational and planning purposes. For legal inheritance matters:

- Consult Islamic scholars (Ulama)
- Consult qualified lawyers
- Follow your country's inheritance laws
- Estate must be settled according to local law

### Does it comply with local laws?

Merath calculates according to Islamic law. However, you must comply with your country's laws:

- Some countries have mandatory legal succession
- Some require wills to be processed through courts
- Some have different rules for non-Muslims
- Consult local authorities

### Can I use this for a will?

Merath helps you plan, but:

- Must be formalized as legal document
- May require notarization
- Consult a lawyer in your jurisdiction
- Follow Islamic and local requirements

## Troubleshooting

### The app won't calculate

**Check:**

1. Madhab selected
2. Estate amount entered (positive)
3. At least one heir added
4. Heir relationships valid

### Results seem incorrect

**Verify:**

1. All debts/deductions entered
2. Heir relationships correct
3. No conflicting heirs
4. Correct Madhab selected

**Still unsure?**

- Export and review detailed calculation
- Compare with Islamic reference books
- Contact support with details

### App crashes

**Try:**

1. Force close the app
2. Clear app cache (Settings > Apps)
3. Restart device
4. Reinstall app if persists

### I can't export as PDF

**On mobile:**

- Share result and print to PDF from share menu
- Use web version for better PDF export

**On web:**

- Open browser print dialog (Ctrl+P)
- Select "Print to PDF"

## Account & Data Questions

### Do I need to create an account?

No! Merath works without account registration.

### How is my data stored?

- **Mobile**: Encrypted local storage
- **Web**: Browser local storage
- **Cloud**: No server storage (by design)

### Can I transfer data between devices?

Yes! Export as JSON and import on other device.

### What if I uninstall the app?

Data is removed with the app. Always backup important calculations as JSON.

## Support & Feedback

### How do I report a bug?

1. **In App**: Use feedback form
2. **GitHub**: github.com/merath/mobile/issues
3. **Email**: bugs@merath.app

Include:

- Device/OS version
- Steps to reproduce
- Expected vs actual result

### How do I suggest a feature?

1. **GitHub Discussions**: github.com/merath/mobile/discussions
2. **Email**: features@merath.app

Provide:

- Feature description
- Use case
- Why it's needed

### Where can I get help?

- **FAQ**: This document
- **Documentation**: https://merath.app/docs
- **Email Support**: support@merath.app
- **Community Forum**: community.merath.app

## Religious & Scholarly Questions

### Is Merath certified by Islamic scholars?

Merath's algorithm has been reviewed by Islamic jurisprudence scholars and is consistent with established Fiqh principles.

### Can I trust the Islamic calculations?

Yes. Merath implements widely accepted Islamic inheritance rules based on:

- Qur'anic verses
- Sunnah guidance
- Scholarly consensus (Ijma)
- Analogical deduction (Qiyas)

### What if I disagree with a result?

- Results follow established Islamic law
- Islamic schools have different opinions
- Consult Islamic scholars for guidance
- Local customs may also apply

### Where is this based on?

Merath follows:

- Islamic legal sources (Quran, Sunnah)
- Classical Islamic jurisprudence texts
- Modern fiqh references
- Scholarly consensus where applicable

## Updates & Maintenance

### How often is Merath updated?

Regular updates include:

- Bug fixes
- Performance improvements
- New features
- Security patches

### Do I need to update?

- **Important**: Security & bug fixes
- **Recommended**: New features
- **Optional**: Minor improvements

### What's new in the latest version?

Check release notes in:

- App store listings
- GitHub releases
- In-app notifications

## Privacy & Security

### What data do you collect?

We collect:

- ✗ No personal information
- ✗ No calculation data
- ✗ No usage analytics
- ✗ No location data
- ✓ Only crash reports (optional)

### Can you see my calculations?

No. All calculations are done on your device. We have no access to your data.

### Is my device data encrypted?

Yes. Merath uses:

- AES-256 encryption for storage
- Secure local storage APIs
- TLS for any optional server communications

### What about my PDF/export files?

- You control where files are saved
- Files are not uploaded anywhere
- Use secure file sharing when needed

## Pricing & Premium

### Will Merath always be free?

Yes! Merath will always have a free version with full functionality.

### Are there any premium features?

Currently no. We believe Islamic knowledge should be freely accessible.

### How is it funded?

- Donations from users
- Grants from Islamic organizations
- Community contributions

### Can I donate?

Yes! Visit merath.app/donate to support development.

## Legal

### What's the license?

Merath is open source under the MIT License.

### Can I modify it?

Yes! The source code is available at github.com/merath/mobile. You can fork and modify according to MIT License terms.

### Is there a warranty?

No warranty provided. Use at your own discretion. See LICENSE file for details.

## Getting More Help

If your question isn't answered here:

1. **Check Documentation**: [docs/](docs/)
2. **Search Issues**: github.com/merath/mobile/issues
3. **Contact Support**: support@merath.app
4. **Community**: community.merath.app

---

**Last Updated**: 2024
**Maintained By**: Merath Support Team

**Still have questions?** Email us at support@merath.app
