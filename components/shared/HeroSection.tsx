import Image from "next/image";
import { MapPin, Award, AlertCircle } from "lucide-react";
import { HospitalProfile } from "../hospital/profile/types";

interface Props {
  hospital: HospitalProfile;
}

export function HeroSection({ hospital }: Props) {
  return (
    <div className="relative h-80 bg-gradient-to-r from-indigo-900 to-purple-900">
      {hospital.primary_image && (
        <Image
          src={hospital.primary_image}
          alt={hospital.name}
          fill
          className="object-cover opacity-40"
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/30" />

      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-5xl font-black tracking-tighter">
                  {hospital.name}
                </h1>
                {hospital.is_verified && (
                  <Award className="w-8 h-8 text-amber-400 fill-amber-400" />
                )}
              </div>

              <div className="flex items-center gap-6 text-white/80">
                {hospital.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {hospital.location.city}, {hospital.location.state}
                    </span>
                  </div>
                )}

                {hospital.trauma_level && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Trauma Level {hospital.trauma_level}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
