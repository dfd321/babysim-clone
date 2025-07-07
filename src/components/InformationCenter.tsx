import React, { useState } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { SecureTextInput } from './SecureTextInput';

interface InformationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InformationCenter: React.FC<InformationCenterProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('words');

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && isEmailValid && agreeToTerms) {
      console.log('Subscribing:', email);
      // Handle subscription logic here
      setEmail('');
      setIsEmailValid(false);
      setAgreeToTerms(false);
    }
  };

  const handleEmailChange = (value: string, valid: boolean) => {
    setEmail(value);
    setIsEmailValid(valid);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-orange-500 text-white p-4 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">{t('information_center')}</h1>
        </div>

        <div className="p-6 space-y-6">
          {/* Newsletter Subscription */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <SecureTextInput
                    value={email}
                    onChange={handleEmailChange}
                    placeholder={t('email_placeholder')}
                    type="email"
                    required={true}
                    showValidation={true}
                    className="px-4 py-2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isEmailValid || !agreeToTerms}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                >
                  {t('subscribe')}
                </button>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4"
                />
                {t('agree_terms')}
              </label>
            </form>
          </div>

          {/* Words from developers */}
          <div className="border-t pt-6">
            <button
              onClick={() => toggleSection('words')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">❤️</span>
                <h3 className="text-lg font-semibold">{t('words_from_developer')}</h3>
              </div>
              <span className="text-gray-500">
                {expandedSection === 'words' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'words' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed">
                  {t('developer_message')}
                </p>
              </div>
            )}
          </div>

          {/* Privacy Policy */}
          <div className="border-t pt-6">
            <button
              onClick={() => toggleSection('privacy')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔒</span>
                <h3 className="text-lg font-semibold">{t('privacy_policy')}</h3>
              </div>
              <span className="text-gray-500">
                {expandedSection === 'privacy' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'privacy' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Privacy policy content would go here...</p>
              </div>
            )}
          </div>

          {/* Terms of Service */}
          <div className="border-t pt-6">
            <button
              onClick={() => toggleSection('terms')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <h3 className="text-lg font-semibold">{t('terms_of_service')}</h3>
              </div>
              <span className="text-gray-500">
                {expandedSection === 'terms' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'terms' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Terms of service content would go here...</p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="border-t pt-6">
            <button
              onClick={() => toggleSection('disclaimer')}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-lg font-semibold">{t('disclaimer')}</h3>
              </div>
              <span className="text-gray-500">
                {expandedSection === 'disclaimer' ? '▲' : '▼'}
              </span>
            </button>
            {expandedSection === 'disclaimer' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Disclaimer content would go here...</p>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-4 border-t">
          <button
            onClick={onClose}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};