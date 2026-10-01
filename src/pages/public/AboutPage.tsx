import React, { useState, useEffect } from 'react';
import { CheckCircle, Shield, Award, Users, Target, Dumbbell } from 'lucide-react';
import { HomepageContent } from '../../types';
import { apiService } from '../../services/api';

export const AboutPage: React.FC = () => {
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getHomepage().then(setHomepage).finally(() => setLoading(false));
  }, []);

  const about = homepage?.about;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
          OUR STORY & PHILOSOPHY
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
          Engineered for Athletic Excellence
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-light">
          {about?.description ||
            'Fitzone Fitness was built on a simple philosophy: eliminate distractions and provide the absolute best training environment possible.'}
        </p>
      </div>

      {/* Main Image Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl h-[400px] sm:h-[500px]">
        <img
          src={about?.image || '/src/assets/images/gym_interior_floor_1790868429405.jpg'}
          alt="Fitzone Gym Floor"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">World-Class Standards</p>
            <h2 className="text-2xl font-bold text-white font-display">Eleiko Calibrated Plates & Prime Fitness Mechanics</h2>
          </div>
        </div>
      </div>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-display">Our Mission</h3>
          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {about?.mission ||
              'To empower individuals to transcend physical limits through science-backed training, relentless discipline, and expert guidance.'}
          </p>
        </div>

        <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white font-display">Our Vision</h3>
          <p className="text-sm text-neutral-300 leading-relaxed font-light">
            {about?.vision ||
              'To establish the benchmark for modern physical training clubs across South Asia, integrating strength training, recovery, and metabolic health.'}
          </p>
        </div>
      </div>

      {/* Facilities & Equipment Breakdown */}
      <div className="bg-[#101622] border border-neutral-800 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            INFRASTRUCTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Facility Specifications & Equipment
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {about?.equipmentOverview ||
              'Calibrated steel plates, competition benches, dual cable towers, and specialized cambered bars sourced from premier international manufacturers.'}
          </p>
        </div>

        {about?.facilities && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {about.facilities.map((fac, index) => (
              <div
                key={index}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex items-start gap-3"
              >
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs text-neutral-300 leading-relaxed">{fac}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      {about?.whyChooseUs && about.whyChooseUs.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display text-center">
            Why Train at Fitzone
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.whyChooseUs.map((reason, idx) => (
              <div key={idx} className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-400 font-bold text-xs">
                  0{idx + 1}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-medium">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
