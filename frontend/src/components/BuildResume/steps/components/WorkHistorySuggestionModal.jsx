import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdLightbulb, MdBolt } from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';
import config from '../../../../conf/configuration';

const WorkHistorySuggestionModal = ({ isOpen, onClose, selectedEmployment, onApplySuggestion }) => {
    const { t } = useTranslation('common');
    const [isGenerating, setIsGenerating] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState(null);

    const generateAiSuggestions = async () => {
        if (!selectedEmployment || !selectedEmployment.jobTitle || !selectedEmployment.employer) {
            setError(t('WorkHistorySuggestionModal.errors.requiredFields'));
            return;
        }

        setIsGenerating(true);
        setError(null);
        setSuggestions([]);

        try {
            // Get the current language from localStorage
            const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
            console.log('Preferred language from localStorage:', preferredLanguage);

            const apiUrl = `${config.provider}://${config.backendUrl}/api/generate-work-description`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobTitle: selectedEmployment.jobTitle,
                    employer: selectedEmployment.employer,
                    startDate: selectedEmployment.begin,
                    endDate: selectedEmployment.end,
                    current: selectedEmployment.current,
                    language: preferredLanguage,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.suggestions && Array.isArray(data.suggestions)) {
                setSuggestions(data.suggestions);
            } else {
                throw new Error('Invalid response format from server');
            }
        } catch (err) {
            console.error('Error generating AI suggestions:', err);
            setError(t('WorkHistorySuggestionModal.errors.failed'));

            // Fallback to some default suggestions
            setSuggestions([
                `• Led key initiatives and projects for ${selectedEmployment.jobTitle} role at ${selectedEmployment.employer}\n• Collaborated with cross-functional teams to deliver successful outcomes\n• Implemented solutions that improved efficiency and productivity`,
                `• Managed responsibilities as ${selectedEmployment.jobTitle} with focus on quality and performance\n• Contributed to team success through innovative approaches and problem-solving\n• Achieved measurable results in key performance areas`,
                `• Executed ${selectedEmployment.jobTitle} duties with commitment to excellence and continuous improvement\n• Worked effectively with stakeholders to meet organizational objectives\n• Demonstrated expertise and professional growth throughout tenure`,
            ]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleApplySuggestion = (suggestion) => {
        onApplySuggestion(suggestion);
        onClose();
    };

    const handleClose = () => {
        setSuggestions([]);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <MdLightbulb className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{t('WorkHistorySuggestionModal.title')}</h3>
                            <p className="text-sm text-gray-500">{t('WorkHistorySuggestionModal.subtitle')}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MdClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    {/* Job Info Summary */}
                    {selectedEmployment && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <h4 className="font-medium text-gray-900 mb-2">{t('WorkHistorySuggestionModal.positionDetails.title')}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">{t('WorkHistorySuggestionModal.positionDetails.jobTitle')}</span>
                                    <p className="font-medium text-gray-900">{selectedEmployment.jobTitle || t('WorkHistorySuggestionModal.positionDetails.notSpecified')}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">{t('WorkHistorySuggestionModal.positionDetails.company')}</span>
                                    <p className="font-medium text-gray-900">{selectedEmployment.employer || t('WorkHistorySuggestionModal.positionDetails.notSpecified')}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500">{t('WorkHistorySuggestionModal.positionDetails.duration')}</span>
                                    <p className="font-medium text-gray-900">
                                        {selectedEmployment.begin || t('WorkHistorySuggestionModal.positionDetails.notSpecified')} -{' '}
                                        {selectedEmployment.current
                                            ? t('WorkHistorySuggestionModal.positionDetails.present')
                                            : selectedEmployment.end || t('WorkHistorySuggestionModal.positionDetails.notSpecified')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generate Button */}
                    <div className="mb-6">
                        <button
                            onClick={generateAiSuggestions}
                            disabled={isGenerating || !selectedEmployment?.jobTitle || !selectedEmployment?.employer}
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-400 transition-colors flex items-center justify-center">
                            {isGenerating ? (
                                <>
                                    <FiLoader className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" />
                                    {t('WorkHistorySuggestionModal.generateButton.generating')}
                                </>
                            ) : (
                                <>
                                    <MdBolt className="w-4 h-4 mr-2" />
                                    {t('WorkHistorySuggestionModal.generateButton.generate')}
                                </>
                            )}
                        </button>
                        {(!selectedEmployment?.jobTitle || !selectedEmployment?.employer) && (
                            <p className="text-sm text-gray-500 mt-2 text-center">{t('WorkHistorySuggestionModal.requirements.fillFields')}</p>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* AI Suggestions */}
                    {!isGenerating && suggestions.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">{t('WorkHistorySuggestionModal.suggestions.title')}</h4>

                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                                    {t('WorkHistorySuggestionModal.suggestions.suggestionLabel', { number: index + 1 })}
                                                </span>
                                            </div>
                                            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{suggestion}</pre>
                                        </div>
                                        <button onClick={() => handleApplySuggestion(suggestion)} className="ml-4 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                                            {t('WorkHistorySuggestionModal.suggestions.useThis')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Instructions when no suggestions yet */}
                    {!isGenerating && suggestions.length === 0 && !error && (
                        <div className="text-center py-8">
                            <MdLightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">{t('WorkHistorySuggestionModal.instructions.title')}</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button onClick={handleClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        {t('WorkHistorySuggestionModal.actions.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkHistorySuggestionModal;
