'use client';
import React, { useState } from 'react';
import { z } from 'zod';

interface Field {
  type: string;
  question: string;
  required: boolean;
}

type FieldKey = keyof Field;

const formSchema = z.object({
  name: z.string().min(1, "The name of the form is required"),
  fields: z.array(
    z.object({
      question: z.string().min(1, "The question is required"),
      type: z.enum(['text', 'boolean', 'datetime']),
      required: z.boolean(),
    })
  ).min(1, "It should have at least one field."),
});

const FormBuilder: React.FC = ({ addNewForm }) => {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleAddField = () => {
    setFields([...fields, { type: 'text', question: '', required: false }]);
  };

  const handleSaveForm = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const result = formSchema.safeParse({ name: formName, fields });

    if (!result.success) {
      setErrorMessage(result.error.errors.map(err => err.message).join(', '));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/api/forms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formName, fields }),
      });

      if (!response.ok) {
        throw new Error('Unexpected Error');
      }
      const savedForm = await response.json();
      addNewForm(savedForm);  
    } catch (error) {
      console.error('Error', error);
    } finally {
      setIsSubmitting(false);
      setFormName('');
      setFields([]);
      setErrorMessage(null);
    }
  };

  const handleFieldChange = (index: number, key: FieldKey, value: string | boolean) => {
    const updatedFields: Field[] = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-green-800 text-left">New Form</h2>

      <input
        type="text"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        placeholder="Form's name"
        disabled={isSubmitting}
        className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
      />

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={index} className="bg-white p-4 rounded-md border border-green-200 shadow-sm space-y-2">
            <input
              type="text"
              value={field.question}
              onChange={(e) => handleFieldChange(index, 'question', e.target.value)}
              placeholder="Question"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <select
              value={field.type}
              onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="text">Text</option>
              <option value="boolean">Boolean</option>
              <option value="datetime">Date</option>
            </select>

            <label className="flex items-center space-x-2 text-green-700">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) => handleFieldChange(index, 'required', e.target.checked)}
                disabled={isSubmitting}
                className="accent-green-500"
              />
              <span>Required</span>
            </label>
          </div>
        ))}

        <button
          onClick={handleAddField}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-green-900 bg-green-200 rounded-md hover:bg-green-300 transition-colors"
        >
          Add Field
        </button>
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{errorMessage}</p>
      )}

      <button
        onClick={handleSaveForm}
        disabled={isSubmitting}
        className="w-full py-2 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Creating form...' : 'Save Form'}
      </button>
    </div>
  );
};

export default FormBuilder;