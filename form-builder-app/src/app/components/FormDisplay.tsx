'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import LoadingSpinner from './loadingSpinner';

interface Field {
  type: string;
  question: string;
  required: boolean;
}

const FormDisplay: React.FC<{ formId: string }> = ({ formId }) => {
  const router = useRouter();
  const [form, setForm] = useState<{ name: string; fields: Field[] } | null>(null);
  const [formData, setFormData] = useState<{ [key: number]: unknown }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchForm = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forms/${formId}`);
      if (!response.ok) {
        console.error('Unexpected Error');
        alert('Error');
        return;
      }
      const data = await response.json();
      setForm(data);
    };
    fetchForm();
  }, [formId]);

  const handleInputChange = (fieldIndex: number, value: unknown) => {
    setFormData({ ...formData, [fieldIndex]: value });
  };

  const validateFormData = (formData: { [key: number]: unknown }) => {
    const schema = z.object(
      form?.fields.reduce((acc, field, index) => {
        if (field.type === 'text') {
          if (field.required) {
            acc[index] = z.string().min(1, "this field is required");
          } else {
            acc[index] = z.string().optional();
          }
        } else if (field.type === 'boolean') {
          if (field.required) {
            acc[index] = z.boolean();
          } else {
            acc[index] = z.boolean().optional();
          }
        } else if (field.type === 'datetime') {
          if (field.required) {
            acc[index] = z.string().min(1, "this field is required");
          } else {
            acc[index] = z.string().optional();
          }
        }
        return acc;
      }, {} as Record<number, z.ZodTypeAny>)
    );
  
    return schema.safeParse(formData);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const validation = validateFormData(formData);

    if (!validation.success) {
      setErrorMessage(validation.error.errors.map(err => err.message).join(', '));
      setIsSubmitting(false);
      return;
    }

    const userData = Object.keys(formData).map((index) => {
      const field = form?.fields[parseInt(index)];
      return {
        question: field?.question || '',
        answer: formData[parseInt(index)],
      };
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/forms/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userData }),
    });

    if (!response.ok) {
      console.error('Unexpected Error');
      setIsSubmitting(false);
      return;
    }

    await response.json();
    router.push('/');
  };

  if (!form) return <div className="text-center mt-10 text-green-600"><LoadingSpinner/></div>;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-green-50 border border-green-200 p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">{form.name}</h1>

      <form className="space-y-6">
        {form.fields.map((field, index) => (
          <div key={index}>
            <label className="block mb-2 text-green-900 font-medium">{field.question}</label>
            {field.type === 'text' && (
              <input
                type="text"
                onChange={(e) => handleInputChange(index, e.target.value)}
                required={field.required}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            )}
            {field.type === 'boolean' && (
              <input
                type="checkbox"
                onChange={(e) => handleInputChange(index, e.target.checked)}
                disabled={isSubmitting}
                className="h-5 w-5 text-green-500 focus:ring-green-300"
              />
            )}
            {field.type === 'datetime' && (
              <input
                type="datetime-local"
                onChange={(e) => handleInputChange(index, e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-2 bg-white border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            )}
          </div>
        ))}

        {errorMessage && (
          <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full py-3 bg-green-400 hover:bg-green-500 text-white font-semibold rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default FormDisplay;