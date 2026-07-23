const steps = [
  {
    step: "01",
    title: "Register",
    description: "Create your account with your name, email, phone, and a secure password.",
  },
  {
    step: "02",
    title: "Get onboarded",
    description: "An admin reviews your account and enables the algos relevant to your interests.",
  },
  {
    step: "03",
    title: "Watch live signals",
    description: "Your dashboard streams each enabled algo's latest signal the moment it fires.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-semibold text-cream">How it works</h2>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.step} className="relative border-l border-border pl-6">
            <span className="text-3xl font-semibold text-brown-600">{s.step}</span>
            <h3 className="mt-3 text-base font-semibold text-cream">{s.title}</h3>
            <p className="mt-2 text-sm text-muted">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
