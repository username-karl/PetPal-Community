import React, { useState, Children } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const Step = ({ children }) => {
    return <div className="w-full">{children}</div>;
};

const Stepper = ({
    children,
    initialStep = 0,
    onStepChange,
    onFinalStepCompleted,
    backButtonText = "Back",
    nextButtonText = "Next",
    finishButtonText = "Finish",
}) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const steps = Children.toArray(children);
    const totalSteps = steps.length;

    const goToStep = (stepIndex) => {
        if (stepIndex >= 0 && stepIndex < totalSteps) {
            setCurrentStep(stepIndex);
            onStepChange?.(stepIndex);
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            goToStep(currentStep + 1);
        } else if (currentStep === totalSteps - 1) {
            onFinalStepCompleted?.();
        }
    };

    const handleBack = () => {
        goToStep(currentStep - 1);
    };

    return (
        <div className="w-full">
            {/* Progress Indicator */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((_, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${index < currentStep
                                            ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                                            : index === currentStep
                                                ? 'bg-brand-600 text-white scale-110 shadow-xl shadow-brand-500/40'
                                                : 'bg-slate-100 text-slate-400'
                                        }`}
                                >
                                    {index < currentStep ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <span
                                    className={`mt-2 text-xs font-semibold ${index <= currentStep ? 'text-brand-600' : 'text-slate-400'
                                        }`}
                                >
                                    Step {index + 1}
                                </span>
                            </div>
                            {index < totalSteps - 1 && (
                                <div
                                    className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${index < currentStep ? 'bg-brand-600' : 'bg-slate-100'
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[320px] animate-in fade-in slide-in-from-right-4 duration-300">
                {steps[currentStep]}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
                <button
                    type="button"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 0
                            ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-md'
                        }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                    {backButtonText}
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 hover:shadow-xl hover:shadow-brand-500/30"
                >
                    {currentStep === totalSteps - 1 ? finishButtonText : nextButtonText}
                    {currentStep === totalSteps - 1 ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <ChevronRight className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default Stepper;
