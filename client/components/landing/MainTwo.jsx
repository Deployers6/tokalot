export const MainTwo = () => {
  const steps = [
    {
      roman: "I",
      title: "Registration",
      description:
        "Create your account and introduce yourself to the Tokalot community.",
    },
    {
      roman: "II",
      title: "Become a Member",
      description:
        "Choose your membership plan and get access to exclusive café sessions.",
    },
    {
      roman: "III",
      title: "Book a Session",
      description:
        "Pick your preferred date and time to start your English journey.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="w-full min-h-[586px] bg-[#051F25] flex items-center justify-center px-6 py-20 
                 max-md:py-16"
    >
      <div className="w-full max-w-7xl">
        {/* Гарчиг хэсэг */}
        <div className="flex flex-col space-y-4 max-md:text-center mb-16">
          <p className="text-[36px] md:text-[48px] font-bold text-[#CEE7F0]">
            How it Works
          </p>
          <p className="text-[#BCC8D1] max-w-lg max-md:mx-auto">
            Your journey from silence to eloquence in three deliberate
            movements.
          </p>
        </div>

        {/* Алхмууд (Картууд) */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-1 min-h-[250px] bg-[#0A232A] rounded-2xl p-8 border border-white/5 
                         hover:border-sky-400/30 transition-all duration-300 group 
                         flex flex-col justify-between max-md:items-center max-md:text-center shadow-lg shadow-black/20"
            >
              {/* Ром тоо */}
              <p
                className="text-[40px] md:text-[48px] text-[#89D6FF] font-serif font-bold opacity-50 
                            group-hover:opacity-100 transition-opacity"
              >
                {step.roman}
              </p>

              {/* Текст агуулга */}
              <div className="space-y-2 w-full">
                <h3 className="text-xl md:text-2xl font-bold text-[#CEE7F0]">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-[#BCC8D1] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
