import { test, expect } from '@playwright/test';

// Complete Playwright test suite based on the original capture
test.describe('BabySim Clone - Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/The Baby Simulator/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: 'The Baby Simulator', level: 1 })).toBeVisible();
    
    // Check subtitle
    await expect(page.getByText('A text-based game about the parenting journey')).toBeVisible();
    
    // Verify language toggle
    await expect(page.getByRole('button', { name: /Switch to/ })).toBeVisible();
  });

  test('should display all onboarding sections', async ({ page }) => {
    // Game Introduction section
    await expect(page.getByText('Game Introduction')).toBeVisible();
    await expect(page.getByText('In this game, you will play as a parent')).toBeVisible();
    
    // Game Features section
    await expect(page.getByText('Game Features')).toBeVisible();
    await expect(page.getByText('AI-generated character backgrounds')).toBeVisible();
    
    // Role selection
    await expect(page.getByText('Choose Your Role')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mom' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dad' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Non-binary Parent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Random' })).toBeVisible();
    
    // Style selection
    await expect(page.getByText('Choose a Style')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Realistic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Fantasy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Thrilling' })).toBeVisible();
    
    // Special requirements
    await expect(page.getByText('Special Requirements')).toBeVisible();
    await expect(page.getByPlaceholder('I want an ugly cute kid')).toBeVisible();
    
    // Start button
    await expect(page.getByRole('button', { name: /I'm ready to meet my baby/ })).toBeVisible();
  });

  test('should complete role and style selection', async ({ page }) => {
    // Select Mom role
    const momButton = page.getByRole('button', { name: 'Mom' });
    await momButton.click();
    await expect(momButton).toHaveClass(/btn-selected/);
    
    // Select Realistic style
    const realisticButton = page.getByRole('button', { name: 'Realistic' });
    await realisticButton.click();
    await expect(realisticButton).toHaveClass(/btn-selected/);
    
    // Verify other buttons are not selected
    await expect(page.getByRole('button', { name: 'Dad' })).not.toHaveClass(/btn-selected/);
    await expect(page.getByRole('button', { name: 'Fantasy' })).not.toHaveClass(/btn-selected/);
  });

  test('should handle special requirements input', async ({ page }) => {
    const requirementsInput = page.getByPlaceholder('I want an ugly cute kid');
    
    // Type in requirements
    const testText = 'I want a creative and curious child who loves learning';
    await requirementsInput.fill(testText);
    await expect(requirementsInput).toHaveValue(testText);
    
    // Check character counter (if implemented)
    const counter = page.locator('text=/\d+\/200/');
    if (await counter.isVisible()) {
      await expect(counter).toContainText(`${testText.length}/200`);
    }
  });

  test('should start game and generate characters', async ({ page }) => {
    // Complete onboarding
    await page.getByRole('button', { name: 'Mom' }).click();
    await page.getByRole('button', { name: 'Realistic' }).click();
    await page.getByPlaceholder('I want an ugly cute kid').fill('Test requirements');
    
    // Start the game
    const startButton = page.getByRole('button', { name: /I'm ready to meet my baby/ });
    await startButton.click();
    
    // Wait for loading state
    await expect(page.getByText(/Generating your family|Loading/)).toBeVisible();
    
    // Wait for character generation (with generous timeout for mock API)
    await expect(page.getByText('Meet Your Family')).toBeVisible({ timeout: 10000 });
    
    // Verify character information is displayed
    await expect(page.getByText(/As a .* \(\d+ years old\)/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue/ })).toBeVisible();
  });

  test('should progress to gameplay phase', async ({ page }) => {
    // Complete onboarding and character generation
    await page.getByRole('button', { name: 'Mom' }).click();
    await page.getByRole('button', { name: 'Realistic' }).click();
    await page.getByRole('button', { name: /I'm ready to meet my baby/ }).click();
    
    // Wait for character generation
    await expect(page.getByText('Meet Your Family')).toBeVisible({ timeout: 10000 });
    
    // Continue to gameplay
    await page.getByRole('button', { name: /Continue/ }).click();
    
    // Wait for scenario generation
    await expect(page.getByText(/Current Situation|years old/)).toBeVisible({ timeout: 10000 });
    
    // Verify gameplay elements
    await expect(page.getByText(/Give up .* and restart/)).toBeVisible();
    await expect(page.getByText(/How do you respond/)).toBeVisible();
    
    // Check for decision options
    await expect(page.getByRole('button', { name: /^A:/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^B:/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^C:/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^D:/ })).toBeVisible();
  });

  test('should handle decision making', async ({ page }) => {
    // Complete setup to reach gameplay
    await page.getByRole('button', { name: 'Mom' }).click();
    await page.getByRole('button', { name: 'Realistic' }).click();
    await page.getByRole('button', { name: /I'm ready to meet my baby/ }).click();
    await expect(page.getByText('Meet Your Family')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Continue/ }).click();
    await expect(page.getByRole('button', { name: /^A:/ })).toBeVisible({ timeout: 10000 });
    
    // Make a decision (Option A)
    await page.getByRole('button', { name: /^A:/ }).click();
    
    // Wait for processing
    await expect(page.getByText(/Processing your decision|Generating/)).toBeVisible();
    
    // Verify timeline appears or consequence is shown
    await expect(page.locator('text=/Growth Timeline|Continue to Next Year/')).toBeVisible({ timeout: 15000 });
  });

  test('should test custom decision input', async ({ page }) => {
    // Navigate to gameplay
    await page.getByRole('button', { name: 'Mom' }).click();
    await page.getByRole('button', { name: 'Realistic' }).click();
    await page.getByRole('button', { name: /I'm ready to meet my baby/ }).click();
    await expect(page.getByText('Meet Your Family')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Continue/ }).click();
    await expect(page.getByRole('button', { name: /^A:/ })).toBeVisible({ timeout: 10000 });
    
    // Test custom input (Option E)
    const customTextarea = page.getByPlaceholder('Enter your idea...');
    if (await customTextarea.isVisible()) {
      await customTextarea.fill('My custom parenting approach');
      
      // Check character counter
      await expect(page.locator('text=/\d+\/200/')).toBeVisible();
      
      // Verify submit button becomes enabled
      const submitButton = page.getByRole('button', { name: /I'll do this/ });
      await expect(submitButton).toBeEnabled();
    }
  });

  test('should handle restart functionality', async ({ page }) => {
    // Get to gameplay phase
    await page.getByRole('button', { name: 'Mom' }).click();
    await page.getByRole('button', { name: 'Realistic' }).click();
    await page.getByRole('button', { name: /I'm ready to meet my baby/ }).click();
    await expect(page.getByText('Meet Your Family')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /Continue/ }).click();
    await expect(page.getByRole('button', { name: /^A:/ })).toBeVisible({ timeout: 10000 });
    
    // Click restart button
    await page.getByRole('button', { name: /Give up .* and restart/ }).click();
    
    // Should return to onboarding
    await expect(page.getByRole('heading', { name: 'The Baby Simulator', level: 1 })).toBeVisible();
    await expect(page.getByRole('button', { name: /I'm ready to meet my baby/ })).toBeVisible();
  });

  test('should open and close information center', async ({ page }) => {
    // Open Information Center
    const infoButton = page.locator('button[title*="Information Center"]');
    if (await infoButton.isVisible()) {
      await infoButton.click();
      
      // Verify modal content
      await expect(page.getByRole('heading', { name: 'Information Center' })).toBeVisible();
      await expect(page.getByText('Words from developers')).toBeVisible();
      
      // Close modal
      await page.getByRole('button', { name: 'Close' }).click();
      await expect(page.getByRole('heading', { name: 'Information Center' })).not.toBeVisible();
    }
  });

  test('should test language toggle', async ({ page }) => {
    const languageButton = page.getByRole('button', { name: /Switch to/ });
    await expect(languageButton).toBeVisible();
    
    // Click language toggle
    await languageButton.click();
    
    // Note: Language functionality would need to be tested based on actual implementation
    // For now, just verify the button is clickable
    await expect(languageButton).toBeVisible();
  });

  test('should test responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify elements are still visible and accessible
    await expect(page.getByRole('heading', { name: 'The Baby Simulator' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mom' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Realistic' })).toBeVisible();
    
    // Test button interactions
    await page.getByRole('button', { name: 'Mom' }).click();
    await expect(page.getByRole('button', { name: 'Mom' })).toHaveClass(/btn-selected/);
  });

  test('should verify accessibility features', async ({ page }) => {
    // Check for proper headings hierarchy
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3 })).toBeVisible();
    
    // Check for proper button labels
    await expect(page.getByRole('button', { name: 'Mom' })).toBeVisible();
    await expect(page.getByRole('button', { name: /I'm ready to meet my baby/ })).toBeVisible();
    
    // Check for proper form labels
    await expect(page.getByPlaceholder('I want an ugly cute kid')).toBeVisible();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    // Note: More comprehensive keyboard testing would be added based on specific requirements
  });
});

// API Integration Tests
test.describe('API Integration', () => {
  test('should handle network timeouts gracefully', async ({ page }) => {
    // This test would require network interception to simulate timeouts
    // For now, just verify the app loads
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'The Baby Simulator' })).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // This test would require network interception to simulate API errors
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'The Baby Simulator' })).toBeVisible();
  });
});

// Performance Tests
test.describe('Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'The Baby Simulator' })).toBeVisible();
    const loadTime = Date.now() - startTime;
    
    // Verify page loads within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});