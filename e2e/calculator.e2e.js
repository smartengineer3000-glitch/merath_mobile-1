describe('Merath Islamic Inheritance Calculator', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display calculator screen', async () => {
    await expect(element(by.id('calculator-screen'))).toBeVisible();
  });

  it('should allow entering estate data', async () => {
    await element(by.id('estate-total-input')).typeText('100000');
    await element(by.id('estate-funeral-input')).typeText('5000');
    await element(by.id('estate-debts-input')).typeText('10000');

    await expect(element(by.id('estate-total-input'))).toHaveText('100000');
  });

  it('should calculate inheritance correctly', async () => {
    // Enter estate data
    await element(by.id('estate-total-input')).typeText('100000');
    await element(by.id('estate-funeral-input')).typeText('5000');
    await element(by.id('estate-debts-input')).typeText('10000');

    // Select heirs
    await element(by.id('heir-husband')).tap();
    await element(by.id('heir-son')).tap();

    // Calculate
    await element(by.id('calculate-button')).tap();

    // Check results appear
    await expect(element(by.id('results-display'))).toBeVisible();
    await expect(element(by.text('85,000 ر.س'))).toBeVisible(); // Expected result
  });

  it('should handle madhab comparison', async () => {
    // Enter estate data
    await element(by.id('estate-total-input')).typeText('100000');
    await element(by.id('heir-husband')).tap();

    // Calculate
    await element(by.id('calculate-button')).tap();

    // Open comparison
    await element(by.id('compare-madhabs-button')).tap();

    // Check comparison results
    await expect(element(by.id('comparison-results'))).toBeVisible();
  });
});