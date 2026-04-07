export const MainFour = () => {
  const benefits = [
    {
      title: "Flexible Hours",
      description:
        "Book your sessions on any day and at any time that works best for you. Your schedule, your rules!",
    },
    {
      title: "Vibrant Community",
      description:
        "Connect with like-minded people and make new friends in a welcoming environment.",
    },
    {
      title: "Open to Everyone",
      description:
        "Everyone over 18 is welcome—no matter your level, background, or story.",
    },
    {
      title: "Engaging Topics",
      description:
        "Share your opinions on different topics and enjoy meaningful conversations.",
    },
  ];

  return (
    <section
      id="membership"
      className="w-full min-h-screen bg-[#001016] flex items-center justify-center px-6 py-20 max-md:py-16"
    >
      <div className="flex flex-col items-center w-full max-w-[1200px]">
        <h2 className="text-[36px] md:text-[48px] font-bold text-[#CEE7F0] text-center tracking-tight mb-4">
          Membership Benefits
        </h2>
        <p className="text-[#64748B] text-center max-w-2xl mb-12 md:mb-20">
          Join us and be part of a vibrant community where your voice matters.
        </p>

        {/* Агуулгын хэсэг: Desktop дээр хажуу тийшээ, Mobile дээр дээр дээрээсээ */}
        <div className="flex flex-col xl:flex-row gap-12 items-start justify-center w-full">
          {/* Зүүн тал: 5 Benefit Cards */}
          {/* 5 карт болсон тул grid-cols-2 ашиглан PC дээр илүү цэгцтэй харагдуулна */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full xl:w-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="w-full md:w-[280px] min-h-[190px] bg-[#162D34] rounded-2xl border border-white/5 
                           p-6 flex flex-col justify-center gap-3 hover:border-sky-400/30 transition-all group"
              >
                <p className="text-sky-400 font-bold text-lg group-hover:translate-x-1 transition-transform">
                  {benefit.title}
                </p>
                <p className="text-[13px] text-slate-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Баруун тал: Main CTA Card */}
          <div
            className="w-full xl:w-[584px] h-full min-h-[400px] bg-[#162D34] rounded-3xl border border-white/5 
                          flex flex-col items-center justify-center p-12 relative overflow-hidden text-center max-md:h-auto max-md:py-16 self-stretch"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/5 blur-[100px] rounded-full" />

            <div className="space-y-6 mb-12 relative z-10">
              <h3 className="text-2xl md:text-3xl text-[#CEE7F0] font-bold">
                This isn’t a language center — <br />
                <span className="text-sky-400">it’s Tokalot Café.</span>
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                A place where connection comes first, and English follows
                naturally. Are you ready to join the conversation?
              </p>
            </div>

            <button
              className="w-full max-w-[400px] h-[60px] rounded-xl text-[#004963] text-[18px] bg-[#89D6FF] font-bold
                               hover:bg-sky-300 transition-all active:scale-95 shadow-lg shadow-sky-400/10 relative z-10"
            >
              Apply for Membership
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
