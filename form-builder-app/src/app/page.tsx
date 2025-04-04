'use client';
import React, { useState } from 'react';
import FormList from './components/FormList';
import FormBuilder from './components/FormBuilder';

const Home: React.FC = () => {
  const [forms, setForms] = useState<{ id: number; name: string }[]>([]);

  const addNewForm = (newForm: { id: number; name: string }) => {
    setForms((prevForms) => [...prevForms, newForm]);
  };
  
  return (
    <div className="min-h-screen bg-white-100 p-6">
      <h1 className="text-3xl text-green-800 font-bold text-center mb-8">Form Builder App</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl">
          <FormBuilder addNewForm={addNewForm} />
        </div>

        <div className="bg-white p-6 rounded-xl">
          <FormList forms={forms} setForms={setForms} />
        </div>
      </div>
    </div>
  );
};

export default Home;
