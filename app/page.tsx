import {  SystemIntelligence } from "@/components/general/FeaturedHospitals";
import {ForHospitalAdmins} from "@/components/general/ForHospitalAdmins";
import { Hero } from "@/components/general/Hero";
import { WhyNearH } from "@/components/general/WhyNearH";

const page = () => {
  return (
    <div>
      <Hero />
      <WhyNearH />
      <SystemIntelligence/>
      <ForHospitalAdmins />
    </div>
  );
};

export default page;

