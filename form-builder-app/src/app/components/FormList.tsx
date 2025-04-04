import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from './loadingSpinner';

const FormList: React.FC = () => {
  const [forms, setForms] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        const response = await fetch(`${backendUrl}/api/forms`);
        
        if (!response.ok) {
          throw new Error('Error al obtener los formularios');
        }

        const data = await response.json();
        console.log('response.data=', data);
        setForms(data);
      } catch (error) {
        console.error('Error al obtener los formularios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, [forms]);

  return (
    <div className="max-w-2xl mx-auto bg-green-50 p-6 rounded-xl shadow-sm border border-green-200">
      <h1 className="text-2xl font-bold text-green-800 mb-6 text-left">Form List</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ul className="space-y-4">
        {forms.map((form) => (
          <li
            key={form.id}
            className="flex items-center justify-between bg-white border border-green-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-green-900 font-medium">{form.name}</span>
            <Link
              href={`/form/${form.id}`}
              className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white text-sm font-semibold rounded-md transition-colors"
            >
              Responder
            </Link>
          </li>
        ))}
      </ul>
      )}
    </div>
  );
};

export default FormList;
