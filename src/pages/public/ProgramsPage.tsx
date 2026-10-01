import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Dumbbell, Filter } from 'lucide-react';
import { Program } from '../../types';
import { apiService } from '../../services/api';
import { BookingModal } from '../../components/common/BookingModal';

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');

  useEffect(() => {
    apiService.getPrograms().then(setPrograms).finally(() => setLoading(false));
  }, []);

  const filteredPrograms =
    selectedDifficulty === 'All'
      ? programs
      : programs.filter((p) => p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());

  const handleBook = (progId: string) => {
    setSelectedProgramId(progId);
    setIsBookingOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
          METHODOLOGY & PROTOCOLS
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
          Dynamic Training Programs
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          From hypertrophy periodization to athletic conditioning and mobility restoration, every program is engineered to create measurable physical progression.
        </p>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex justify-center">
        <div className="flex flex-wrap items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800 text-xs">
          {['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPrograms.map((prog) => (
          <div
            key={prog.id}
            className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-56 bg-neutral-900 overflow-hidden">
                <img
                  src={prog.image}
                  alt={prog.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-400 border border-neutral-800">
                  {prog.difficulty}
                </div>
                <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-300 border border-neutral-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {prog.duration}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white font-display">{prog.name}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed font-light">{prog.description}</p>

                {prog.benefits && prog.benefits.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                    <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Key Highlights:
                    </p>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {prog.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => handleBook(prog.id)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15"
              >
                Enroll in Program
              </button>
            </div>
          </div>
        ))}
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        programs={programs}
        initialType="Workout Program"
        initialProgramId={selectedProgramId}
      />
    </div>
  );
};
