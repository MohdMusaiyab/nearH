import { FeaturedHospitals } from "@/components/general/FeaturedHospitals";
import { ForHospitalAdmins } from "@/components/general/ForHospitalAdmins";
import { Hero } from "@/components/general/Hero";
import { WhyNearH } from "@/components/general/WhyNearH";
import React from "react";

const page = () => {
  return (
    <div>
      <Hero />
      <WhyNearH />
      <FeaturedHospitals />
      <ForHospitalAdmins />
    </div>
  );
};

export default page;
