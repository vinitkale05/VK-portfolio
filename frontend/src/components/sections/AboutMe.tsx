import React from 'react';

const AboutMe: React.FC = () => (
  <div className="flex flex-col sm:flex-row gap-7 items-start w-full">
    <div className="shrink-0">
      <div className="w-40 h-40 rounded-2xl overflow-hidden ring-1 ring-border-light dark:ring-border-dark">
        <img
          src="/avatar.jpg"
          alt="Vinit Kale"
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 cursor-default"
        />
      </div>
    </div>

    <div className="space-y-2 text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark">
      <p>
        I am a <span className="text-text-light dark:text-text-dark font-medium">B.Tech in Computer Science Engineering (Artificial Intelligence)</span> student at MIT ADT University, Pune (2023 – 2027) with a CGPA of 8.74/10.
      </p>
      <p>
        I worked as an <span className="bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded font-medium">AI Intern at Intangles Lab Pvt. Ltd.</span> developing ML models for vehicle telemetry prediction and building real-time REST API inference workflows.
      </p>
      <p>
        Passionate about developing scalable AI applications, machine learning models, deep learning, NLP, and solving real-world engineering problems in Agile environments.
      </p>
    </div>
  </div>
);

export default AboutMe;
