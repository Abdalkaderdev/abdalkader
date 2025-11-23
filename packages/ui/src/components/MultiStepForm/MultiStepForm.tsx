/**
 * MultiStepForm Component
 * Multi-step form with validation and progress tracking
 */

import React, { useState, useCallback } from 'react';
import './MultiStepForm.css';
import { Button } from '../Button';

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<FormStepProps>;
  validation?: (data: Record<string, any>) => Promise<boolean> | boolean;
}

export interface FormStepProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
  onNext?: () => void;
  onPrevious?: () => void;
}

export interface MultiStepFormProps {
  steps: FormStep[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  onStepChange?: (stepIndex: number) => void;
  className?: string;
  showProgress?: boolean;
  allowStepNavigation?: boolean;
}

export function MultiStepForm({
  steps,
  initialData = {},
  onSubmit,
  onStepChange,
  className = '',
  showProgress = true,
  allowStepNavigation = true,
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateStep = useCallback(async (stepIndex: number): Promise<boolean> => {
    const step = steps[stepIndex];
    if (!step.validation) return true;

    try {
      const isValid = await step.validation(formData);
      if (!isValid) {
        setErrors((prev) => ({
          ...prev,
          _step: `Please complete all required fields in ${step.title}`,
        }));
      }
      return isValid;
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        _step: error instanceof Error ? error.message : 'Validation failed',
      }));
      return false;
    }
  }, [steps, formData]);

  const handleNext = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
      setErrors({});
    }
  }, [currentStep, steps.length, validateStep, onStepChange]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
      setErrors({});
    }
  }, [currentStep, onStepChange]);

  const handleSubmit = useCallback(async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        _submit: error instanceof Error ? error.message : 'Submission failed',
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [currentStep, steps, formData, validateStep, onSubmit]);

  const goToStep = useCallback((stepIndex: number) => {
    if (!allowStepNavigation) return;
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex);
      setErrors({});
    }
  }, [allowStepNavigation, steps.length, onStepChange]);

  const currentStepData = steps[currentStep];
  const CurrentStepComponent = currentStepData.component;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`multi-step-form ${className}`.trim()}>
      {/* Progress Indicator */}
      {showProgress && (
        <div className="multi-step-form__progress">
          <div className="multi-step-form__progress-bar">
            <div
              className="multi-step-form__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="multi-step-form__steps">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                className={`multi-step-form__step ${index === currentStep ? 'multi-step-form__step--active' : ''} ${index < currentStep ? 'multi-step-form__step--completed' : ''}`}
                onClick={() => goToStep(index)}
                disabled={!allowStepNavigation}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              >
                <div className="multi-step-form__step-number">
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <div className="multi-step-form__step-info">
                  <div className="multi-step-form__step-title">{step.title}</div>
                  {step.description && (
                    <div className="multi-step-form__step-description">{step.description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="multi-step-form__content">
        <div className="multi-step-form__header">
          <h2 className="multi-step-form__title">{currentStepData.title}</h2>
          {currentStepData.description && (
            <p className="multi-step-form__description">{currentStepData.description}</p>
          )}
        </div>

        {errors._step && (
          <div className="multi-step-form__error" role="alert">
            {errors._step}
          </div>
        )}

        {errors._submit && (
          <div className="multi-step-form__error" role="alert">
            {errors._submit}
          </div>
        )}

        <div className="multi-step-form__fields">
          <CurrentStepComponent
            data={formData}
            onChange={updateField}
            errors={errors}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        {/* Navigation */}
        <div className="multi-step-form__navigation">
          {!isFirstStep && (
            <Button variant="secondary" onClick={handlePrevious} disabled={isSubmitting}>
              Previous
            </Button>
          )}
          <div style={{ flex: 1 }} />
          {isLastStep ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext} disabled={isSubmitting}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

