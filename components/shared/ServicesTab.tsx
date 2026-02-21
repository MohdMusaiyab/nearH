// components/hospital/profile/tabs/ServicesTab.tsx
import {
  Pill,
  Stethoscope,
  FlaskConical,
  Ambulance,
  Droplets,
  HeartPulse,
  LucideIcon,
} from "lucide-react";

interface Props {
  services: string[];
  specialties: string[]; // Keep specialties separate
}

// Map common services to icons
const getServiceIcon = (service: string) => {
  const iconMap: Record<string, LucideIcon> = {
    ICU: HeartPulse,
    Emergency: Ambulance,
    "Blood Bank": Droplets,
    Pharmacy: Pill,
    Diagnostic: FlaskConical,
    General: Stethoscope,
  };

  for (const [key, Icon] of Object.entries(iconMap)) {
    if (service.toLowerCase().includes(key.toLowerCase())) {
      return Icon;
    }
  }
  return Pill;
};

export function ServicesTab({ services, specialties }: Props) {
  const hasServices = services.length > 0;
  const hasSpecialties = specialties.length > 0;

  if (!hasServices && !hasSpecialties) {
    return (
      <div className="text-center py-12">
        <Pill className="w-16 h-16 mx-auto text-slate-300 mb-4" />
        <p className="text-slate-500">No services or specialties listed</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Services Section */}
      {hasServices && (
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-4">
            Hospital Services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => {
              const Icon = getServiceIcon(service);
              return (
                <div
                  key={service}
                  className="p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  <Icon className="w-5 h-5 text-indigo-500 mb-2" />
                  <span className="font-bold text-sm text-indigo-900">
                    {service}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Specialties Section (from doctors) */}
      {hasSpecialties && (
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-4">
            Medical Specialties
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map((specialty) => (
              <div
                key={specialty}
                className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
              >
                <Stethoscope className="w-5 h-5 text-purple-500 mb-2" />
                <span className="font-bold text-sm text-purple-900">
                  {specialty}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
