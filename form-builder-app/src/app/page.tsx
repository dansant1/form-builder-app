'use client';
import React from 'react';
import FormList from './components/FormList';
import FormBuilder from './components/FormBuilder';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white-100 p-6">
      <h1 className="text-3xl text-green-800 font-bold text-center mb-8">Form Builder App</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl">
          <FormBuilder />
        </div>

        <div className="bg-white p-6 rounded-xl">
          <FormList />
        </div>
      </div>
    </div>
  );
};

export default Home;
