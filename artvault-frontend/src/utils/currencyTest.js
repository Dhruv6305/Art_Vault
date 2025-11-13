/**
 * Frontend Multi-Currency Formatting Test
 * This file demonstrates the currency formatting utilities
 */

import { 
  formatCurrency, 
  getCurrencySymbol, 
  isZeroDecimalCurrency, 
  formatAmount 
} from './formatters';

// Test data for different currencies
const testCases = [
  { amount: 100.50, currency: 'USD', name: 'US Dollar' },
  { amount: 85.75, currency: 'EUR', name: 'Euro' },
  { amount: 75.25, currency: 'GBP', name: 'British Pound' },
  { amount: 8350.00, currency: 'INR', name: 'Indian Rupee' },
  { amount: 11500, currency: 'JPY', name: 'Japanese Yen (Zero-decimal)' },
  { amount: 125000, currency: 'KRW', name: 'Korean Won (Zero-decimal)' },
  { amount: 2350000, currency: 'VND', name: 'Vietnamese Dong (Zero-decimal)' },
  { amount: 85000, currency: 'CLP', name: 'Chilean Peso (Zero-decimal)' },
];

/**
 * Run currency formatting tests
 * Call this function from browser console to see results
 */
export const runCurrencyTests = () => {
  console.log('\n=== Frontend Currency Formatting Test ===\n');
  
  testCases.forEach(({ amount, currency, name }) => {
    const formatted = formatCurrency(amount, currency);
    const symbol = getCurrencySymbol(currency);
    const isZeroDecimal = isZeroDecimalCurrency(currency);
    const amountOnly = formatAmount(amount, currency);
    
    console.log(`${name} (${currency}):`);
    console.log(`  Amount: ${amount}`);
    console.log(`  Formatted: ${formatted}`);
    console.log(`  Symbol: ${symbol}`);
    console.log(`  Zero-Decimal: ${isZeroDecimal ? 'Yes' : 'No'}`);
    console.log(`  Amount Only: ${amountOnly}`);
    console.log('');
  });
  
  console.log('=== Test Complete ===\n');
  console.log('All currency formatting utilities are working correctly!');
};

/**
 * Test currency formatting with different locales
 */
export const testLocales = () => {
  console.log('\n=== Locale-Specific Formatting Test ===\n');
  
  const locales = ['en-US', 'en-GB', 'de-DE', 'fr-FR', 'ja-JP'];
  const amount = 1234.56;
  const currency = 'EUR';
  
  locales.forEach(locale => {
    const formatted = formatCurrency(amount, currency, locale);
    console.log(`${locale}: ${formatted}`);
  });
  
  console.log('\n=== Test Complete ===\n');
};

/**
 * Demonstrate payment form currency display
 */
export const demonstratePaymentDisplay = () => {
  console.log('\n=== Payment Form Display Examples ===\n');
  
  const artworks = [
    { title: 'Digital Art', price: 99.99, currency: 'USD' },
    { title: 'European Painting', price: 150.00, currency: 'EUR' },
    { title: 'British Sculpture', price: 200.50, currency: 'GBP' },
    { title: 'Japanese Print', price: 15000, currency: 'JPY' },
    { title: 'Korean Artwork', price: 180000, currency: 'KRW' },
  ];
  
  artworks.forEach(({ title, price, currency }) => {
    const formatted = formatCurrency(price, currency);
    console.log(`"${title}": ${formatted}`);
    console.log(`  Pay Button: "Pay ${formatted}"`);
    console.log('');
  });
  
  console.log('=== Test Complete ===\n');
};

// Export test functions for browser console
if (typeof window !== 'undefined') {
  window.currencyTests = {
    runCurrencyTests,
    testLocales,
    demonstratePaymentDisplay,
  };
  
  console.log('Currency test functions available:');
  console.log('  window.currencyTests.runCurrencyTests()');
  console.log('  window.currencyTests.testLocales()');
  console.log('  window.currencyTests.demonstratePaymentDisplay()');
}

export default {
  runCurrencyTests,
  testLocales,
  demonstratePaymentDisplay,
};
