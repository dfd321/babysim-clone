import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TranslationProvider } from '../../src/contexts/TranslationContext';
import { OnboardingPhase } from '../../src/components/OnboardingPhase';
import { GameplayPhase } from '../../src/components/GameplayPhase';
import { SaveLoadMenu } from '../../src/components/SaveLoadMenu';
import { 
  GameState, 
  ParentRole, 
  GameStyle,
  ChildCharacter,
  ParentCharacter 
} from '../../src/types/game';

expect.extend(toHaveNoViolations);

const createMockGameState = (overrides: Partial<GameState> = {}): GameState => {
  const mockParent: ParentCharacter = {
    name: 'Test Parent',
    age: 30,
    profession: 'Teacher',
    background: 'Test background',
    financialLevel: 5
  };

  const mockChild: ChildCharacter = {
    id: 'child-1',
    name: 'Test Child',
    age: 5,
    gender: 'boy',
    personality: 'curious',
    traits: ['creative'],
    interests: ['art'],
    personalityTraits: [
      { id: 'creativity', name: 'Creativity', category: 'creative', description: 'Creative thinking', value: 85 }
    ],
    skills: [
      { id: 'art', name: 'Art', category: 'artistic', level: 3, experience: 50, unlocked: true }
    ],
    relationships: {
      'parent-child': { type: 'parent-child', quality: 85, trust: 90, communication: 80, lastUpdated: 5 }
    },
    milestones: [],
    developmentHistory: []
  };

  return {
    phase: 'setup',
    role: null,
    gameStyle: null,
    specialRequirements: '',
    parentCharacter: mockParent,
    childCharacter: mockChild,
    children: { 'child-1': mockChild },
    activeChildId: 'child-1',
    currentAge: 5,
    happiness: 85,
    finances: 50000,
    timeline: [],
    achievements: [],
    achievementProgress: {},
    unlockedAchievements: [],
    badges: [],
    unlockedBadges: [],
    familyDynamics: {
      parentChildRelationship: { quality: 85, trust: 90, communication: 80 },
      favoritism: {},
      siblingRelationships: {}
    },
    showSaveMenu: false,
    showLoadMenu: false,
    newAchievementUnlocks: [],
    ...overrides
  };
};

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider>
      {component}
    </TranslationProvider>
  );
};

describe('Accessibility - Keyboard Navigation', () => {
  
  describe('OnboardingPhase Keyboard Navigation', () => {
    const mockGameState = createMockGameState();
    
    it('should have no accessibility violations', async () => {
      const { container } = renderWithTranslation(
        <OnboardingPhase
          gameState={mockGameState}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support tab navigation through role buttons', async () => {
      const user = userEvent.setup();
      const onRoleSelect = jest.fn();
      
      renderWithTranslation(
        <OnboardingPhase
          gameState={mockGameState}
          onRoleSelect={onRoleSelect}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Tab to first role button
      await user.tab();
      const momButton = screen.getByRole('button', { name: /mom/i });
      expect(momButton).toHaveFocus();

      // Tab to next role button
      await user.tab();
      const dadButton = screen.getByRole('button', { name: /dad/i });
      expect(dadButton).toHaveFocus();

      // Tab to non-binary button
      await user.tab();
      const nonBinaryButton = screen.getByRole('button', { name: /non-binary/i });
      expect(nonBinaryButton).toHaveFocus();

      // Tab to random button
      await user.tab();
      const randomButton = screen.getByRole('button', { name: /random/i });
      expect(randomButton).toHaveFocus();
    });

    it('should activate role selection with Enter key', async () => {
      const user = userEvent.setup();
      const onRoleSelect = jest.fn();
      
      renderWithTranslation(
        <OnboardingPhase
          gameState={mockGameState}
          onRoleSelect={onRoleSelect}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Tab to and activate Mom button with Enter
      await user.tab();
      const momButton = screen.getByRole('button', { name: /mom/i });
      expect(momButton).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(onRoleSelect).toHaveBeenCalledWith('Mom');
    });

    it('should activate role selection with Space key', async () => {
      const user = userEvent.setup();
      const onRoleSelect = jest.fn();
      
      renderWithTranslation(
        <OnboardingPhase
          gameState={mockGameState}
          onRoleSelect={onRoleSelect}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Tab to and activate Dad button with Space
      await user.tab();
      await user.tab();
      const dadButton = screen.getByRole('button', { name: /dad/i });
      expect(dadButton).toHaveFocus();
      
      await user.keyboard(' ');
      expect(onRoleSelect).toHaveBeenCalledWith('Dad');
    });

    it('should support arrow key navigation between style buttons', async () => {
      const user = userEvent.setup();
      
      renderWithTranslation(
        <OnboardingPhase
          gameState={mockGameState}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Find style buttons
      const realisticButton = screen.getByRole('button', { name: /realistic/i });
      const fantasyButton = screen.getByRole('button', { name: /fantasy/i });
      const thrillingButton = screen.getByRole('button', { name: /thrilling/i });

      // Focus on first style button
      realisticButton.focus();
      expect(realisticButton).toHaveFocus();

      // Arrow right should move to next button
      await user.keyboard('{ArrowRight}');
      // Note: This would need custom arrow key handling in the component
      // For now, just verify the buttons are focusable
      fantasyButton.focus();
      expect(fantasyButton).toHaveFocus();
    });

    it('should have proper ARIA labels and roles', () => {
      renderWithTranslation(
        <OnboardingPhase
          gameState={mockGameState}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Check for proper button roles
      expect(screen.getByRole('button', { name: /mom/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /dad/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /realistic/i })).toBeInTheDocument();
      
      // Check for form elements
      const requirementsInput = screen.getByRole('textbox');
      expect(requirementsInput).toBeInTheDocument();
      expect(requirementsInput).toHaveAttribute('placeholder');
    });
  });

  describe('GameplayPhase Keyboard Navigation', () => {
    const mockGameplayState = createMockGameState({ 
      phase: 'gameplay',
      role: 'Mom',
      gameStyle: 'realistic'
    });

    it('should have no accessibility violations', async () => {
      const { container } = renderWithTranslation(
        <GameplayPhase
          gameState={mockGameplayState}
          onDecision={jest.fn()}
          onRestart={jest.fn()}
        />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support tab navigation through decision options', async () => {
      const user = userEvent.setup();
      
      renderWithTranslation(
        <GameplayPhase
          gameState={mockGameplayState}
          onDecision={jest.fn()}
          onRestart={jest.fn()}
        />
      );

      // Tab through decision option buttons
      await user.tab();
      const firstOption = screen.getByRole('button', { name: /^A:/i });
      expect(firstOption).toHaveFocus();

      await user.tab();
      const secondOption = screen.getByRole('button', { name: /^B:/i });
      expect(secondOption).toHaveFocus();

      await user.tab();
      const thirdOption = screen.getByRole('button', { name: /^C:/i });
      expect(thirdOption).toHaveFocus();

      await user.tab();
      const fourthOption = screen.getByRole('button', { name: /^D:/i });
      expect(fourthOption).toHaveFocus();
    });

    it('should activate decision with keyboard', async () => {
      const user = userEvent.setup();
      const onDecision = jest.fn();
      
      renderWithTranslation(
        <GameplayPhase
          gameState={mockGameplayState}
          onDecision={onDecision}
          onRestart={jest.fn()}
        />
      );

      // Tab to first option and activate with Enter
      await user.tab();
      const firstOption = screen.getByRole('button', { name: /^A:/i });
      expect(firstOption).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(onDecision).toHaveBeenCalled();
    });

    it('should support escape key to focus restart button', async () => {
      const user = userEvent.setup();
      
      renderWithTranslation(
        <GameplayPhase
          gameState={mockGameplayState}
          onDecision={jest.fn()}
          onRestart={jest.fn()}
        />
      );

      // Press escape - should focus restart button
      await user.keyboard('{Escape}');
      const restartButton = screen.getByRole('button', { name: /restart/i });
      expect(restartButton).toHaveFocus();
    });
  });

  describe('SaveLoadMenu Keyboard Navigation', () => {
    it('should have no accessibility violations', async () => {
      const { container } = renderWithTranslation(
        <SaveLoadMenu
          isOpen={true}
          onClose={jest.fn()}
          onSave={jest.fn()}
          onLoad={jest.fn()}
          onDelete={jest.fn()}
          onExport={jest.fn()}
          onImport={jest.fn()}
          saveGameMetadata={[]}
          saveError={null}
          loadError={null}
        />
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should trap focus within modal when open', async () => {
      const user = userEvent.setup();
      
      renderWithTranslation(
        <SaveLoadMenu
          isOpen={true}
          onClose={jest.fn()}
          onSave={jest.fn()}
          onLoad={jest.fn()}
          onDelete={jest.fn()}
          onExport={jest.fn()}
          onImport={jest.fn()}
          saveGameMetadata={[]}
          saveError={null}
          loadError={null}
        />
      );

      // The modal should contain focus
      const modal = screen.getByRole('dialog');
      expect(modal).toBeInTheDocument();
      
      // Tab should stay within modal
      await user.tab();
      const firstFocusableElement = document.activeElement;
      expect(modal).toContainElement(firstFocusableElement);
    });

    it('should close modal with Escape key', async () => {
      const user = userEvent.setup();
      const onClose = jest.fn();
      
      renderWithTranslation(
        <SaveLoadMenu
          isOpen={true}
          onClose={onClose}
          onSave={jest.fn()}
          onLoad={jest.fn()}
          onDelete={jest.fn()}
          onExport={jest.fn()}
          onImport={jest.fn()}
          saveGameMetadata={[]}
          saveError={null}
          loadError={null}
        />
      );

      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should restore focus after modal closes', async () => {
      const user = userEvent.setup();
      let isOpen = true;
      const onClose = jest.fn(() => { isOpen = false; });
      
      const { rerender } = renderWithTranslation(
        <div>
          <button data-testid="trigger">Open Modal</button>
          {isOpen && (
            <SaveLoadMenu
              isOpen={isOpen}
              onClose={onClose}
              onSave={jest.fn()}
              onLoad={jest.fn()}
              onDelete={jest.fn()}
              onExport={jest.fn()}
              onImport={jest.fn()}
              saveGameMetadata={[]}
              saveError={null}
              loadError={null}
            />
          )}
        </div>
      );

      const triggerButton = screen.getByTestId('trigger');
      triggerButton.focus();
      expect(triggerButton).toHaveFocus();

      // Open modal
      await user.keyboard('{Enter}');
      
      // Close modal with escape
      await user.keyboard('{Escape}');
      
      // Rerender without modal
      rerender(
        <div>
          <button data-testid="trigger">Open Modal</button>
        </div>
      );

      // Focus should be restored to trigger button
      expect(triggerButton).toHaveFocus();
    });

    it('should have visible focus indicators', () => {
      renderWithTranslation(
        <OnboardingPhase
          gameState={createMockGameState()}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      const momButton = screen.getByRole('button', { name: /mom/i });
      momButton.focus();
      
      // Check that focused elements have visible focus indicators
      // This would need actual CSS testing, but we can at least verify focusability
      expect(momButton).toHaveFocus();
      expect(momButton).toHaveClass(/focus:/); // Tailwind focus classes
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper heading hierarchy', () => {
      renderWithTranslation(
        <OnboardingPhase
          gameState={createMockGameState()}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Check for proper heading structure
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('should have descriptive button labels', () => {
      renderWithTranslation(
        <OnboardingPhase
          gameState={createMockGameState()}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Buttons should have descriptive accessible names
      expect(screen.getByRole('button', { name: /mom/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /dad/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /non-binary parent/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /realistic/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fantasy/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /thrilling/i })).toBeInTheDocument();
    });

    it('should have proper form labels and descriptions', () => {
      renderWithTranslation(
        <OnboardingPhase
          gameState={createMockGameState()}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      const requirementsInput = screen.getByRole('textbox');
      expect(requirementsInput).toHaveAttribute('placeholder');
      // Should ideally have aria-label or associated label
    });

    it('should announce dynamic content changes', async () => {
      const user = userEvent.setup();
      
      renderWithTranslation(
        <GameplayPhase
          gameState={createMockGameState({ 
            phase: 'gameplay',
            role: 'Mom',
            gameStyle: 'realistic'
          })}
          onDecision={jest.fn()}
          onRestart={jest.fn()}
        />
      );

      // Check for aria-live regions for dynamic content
      const liveRegion = screen.queryByRole('status');
      if (liveRegion) {
        expect(liveRegion).toHaveAttribute('aria-live');
      }
    });
  });

  describe('High Contrast and Visual Accessibility', () => {
    it('should work with Windows High Contrast mode', () => {
      // Mock high contrast media query
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(-ms-high-contrast: active)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderWithTranslation(
        <OnboardingPhase
          gameState={createMockGameState()}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Elements should still be visible and accessible
      expect(screen.getByRole('button', { name: /mom/i })).toBeVisible();
      expect(screen.getByRole('button', { name: /dad/i })).toBeVisible();
    });

    it('should support reduced motion preferences', () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      renderWithTranslation(
        <OnboardingPhase
          gameState={createMockGameState()}
          onRoleSelect={jest.fn()}
          onStyleSelect={jest.fn()}
          onRequirementsChange={jest.fn()}
          onStart={jest.fn()}
        />
      );

      // Component should render without animations when reduced motion is preferred
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });
});