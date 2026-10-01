import React, { useState, useEffect } from 'react';
import { Mail, Phone, Instagram, Linkedin, Twitter, Award, Calendar } from 'lucide-react';
import { Trainer } from '../../types';
import { apiService } from '../../services/api';
import { BookingModal } from '../../components/common/BookingModal';

export const TrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');

  useEffect(() => {
    apiService.getTrainers().then(setTrainers).finally(() => setLoading(false));
  }, []);

  const handleBookTrainer = (trainerId: string) => {
    setSelectedTrainerId(trainerId);
    setIsBookingOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
          MASTER COACHING STAFF
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
          Elite Strength & Performance Trainers
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Our certified coaches possess competitive backgrounds in powerlifting, track athletics, and functional rehabilitation. Every protocol is individualized for your biomechanics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-72 bg-neutral-900 overflow-hidden">
                <img
                  src={trainer.profileImage}
                  alt={trainer.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101522] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 bg-neutral-950/80 backdrop-blur-sm px-3 py-1 rounded-md text-[11px] font-semibold text-amber-400 border border-neutral-800">
                  {trainer.experience}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white font-display">{trainer.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold">{trainer.specialization}</p>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-light">{trainer.bio}</p>

                {/* Contact & Socials */}
                <div className="space-y-1.5 pt-2 text-xs text-neutral-400">
                  {trainer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{trainer.email}</span>
                    </div>
                  )}
                  {trainer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{trainer.phone}</span>
                    </div>
                  )}
                </div>

                {/* Social icons */}
                {trainer.socialLinks && Object.values(trainer.socialLinks).some(Boolean) && (
                  <div className="flex items-center gap-2 pt-2">
                    {trainer.socialLinks.instagram && (
                      <a
                        href={trainer.socialLinks.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-amber-400 transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {trainer.socialLinks.linkedin && (
                      <a
                        href={trainer.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-amber-400 transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => handleBookTrainer(trainer.id)}
                className="w-full py-2.5 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-neutral-700 hover:border-transparent transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Session with {trainer.name.split(' ')[0]}
              </button>
            </div>
          </div>
        ))}
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        trainers={trainers}
        initialType="Personal Trainer"
        initialTrainerId={selectedTrainerId}
      />
    </div>
  );
};
