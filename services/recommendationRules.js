const recommendationRules = [
  {
    objective: "Environmental Assessment",
    geology: "Nigerian Sedimentary Basin",
    methods: [
      { name: "Electrical Resistivity Tomography (ERT)", min: 0.5, max: 150 },
      { name: "Time-Domain Electromagnetic", min: 13, max: 300 },
      { name: "Frequency-Domain Electromagnetic", min: 1, max: 60 },
      { name: "Seismic Refraction", min: 3, max: 50 },
      { name: "Seismic Reflection", min: 30, max: 4000 },
      { name: "Ground Penetrating Radar (GPR)", min: 0.05, max: 8 },
      { name: "Magnetic Survey", min: 0, max: 500 }
    ]
  },
  {
    objective: "env_ass",
    geology: "Nigerian Basement Complex",
    methods: [
      { name: "Vertical Electrical Sounding (VES)/ERT", min: 0.5, max: 150 },
      { name: "Frequency-Domain EM", min: 0, max: 70 },
      { name: "Magnetic Survey", min: 0, max: 400 },
      { name: "Seismic Refraction", min: 1, max: 60 },
      { name: "Ground Penetrating Radar (GPR)", min: 0.05, max: 10 }
    ]
  },

  {
    objective: "gw_ex",
    geology: "Nigerian Sedimentary Basin",
    methods: [
      { name: "Vertical Electrical Sounding", min: 0.5, max: 250 },
      { name: "Time-Domain Electromagnetic", min: 13, max: 500 },
      { name: "Frequency-Domain Electromagnetic", min: 1, max: 60 },
      { name: "Seismic Refraction", min: 3, max: 50 },
      { name: "Seismic Reflection", min: 30, max: 4000 },
      { name: "Gravity Survey", min: 20, max: 4000 },
      { name: "Magnetic Survey", min: 0, max: 500 }
    ]
  },
  {
    objective: "gw_ex",
    geology: "Nigerian Basement Complex",
    methods: [
      { name: "Vertical Electrical Sounding (VES)/ERT", min: 0.5, max: 150 },
      { name: "Frequency-Domain EM", min: 0, max: 70 },
      { name: "Magnetic Survey", min: 0, max: 200 },
      { name: "Seismic Refraction", min: 1, max: 60 },
      { name: "Time-Domain Electromagnetic", min: 13, max: 200 }
    ]
  },

  {
    objective: "eng_inv",
    geology: "Nigerian Sedimentary Basin",
    methods: [
      { name: "Seismic Refraction", min: 1, max: 100 },
      { name: "Multichannel Analysis of Surface Waves (MASW)", min: 0.5, max: 60 },
      { name: "Electrical Resistivity Tomography (ERT)", min: 0.5, max: 150 },
      { name: "Ground Penetrating Radar (GPR)", min: 0.05, max: 8 },
      { name: "Seismic Reflection", min: 10, max: 1500 }
    ]
  },
  {
    objective: "eng_inv",
    geology: "Nigerian Basement Complex",
    methods: [
      { name: "Seismic Refraction", min: 1, max: 70 },
      { name: "Electrical Resistivity (VES / ERT)", min: 0.5, max: 150 },
      { name: "Multichannel Analysis of Surface Waves (MASW)", min: 0.5, max: 40 },
      { name: "Ground Penetrating Radar (GPR)", min: 0.05, max: 15 },
      { name: "Magnetic Survey", min: 0, max: 250 }
    ]
  },

  {
    objective: "arc_sur",
    geology: "Nigerian Sedimentary Basin",
    methods: [
      { name: "Ground Penetrating Radar (GPR)", min: 0.02, max: 8 },
      { name: "Electrical Resistivity Tomography", min: 0.1, max: 30 },
      { name: "Magnetometry", min: 0.05, max: 3 },
      { name: "Frequency-Domain EM", min: 0.1, max: 5 },
      { name: "Induced Polarization", min: 0.3, max: 25 }
    ]
  },
  {
    objective: "arc_sur",
    geology: "Nigerian Basement Complex",
    methods: [
      { name: "Magnetometry", min: 0.05, max: 2 },
      { name: "Ground Penetrating Radar (GPR)", min: 0.02, max: 12 },
      { name: "Electrical Resistivity Tomography", min: 0.1, max: 20 },
      { name: "Induced Polarization", min: 0.3, max: 20 },
      { name: "Frequency-Domain EM", min: 0.1, max: 5 }
    ]
  }
];

module.exports = recommendationRules;