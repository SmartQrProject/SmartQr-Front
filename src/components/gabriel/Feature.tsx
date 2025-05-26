// pages/index.tsx o pages/pricing.tsx

export default function PricingPage() {
  const plan = {
    title: "All Plans Same Features!!!",
    description:
      "Perfect for getting started with your online presence. For businesses looking to expand their sales channels. For brands seeking a fully customized experience.",
    features: [
      "Meals/Products categories",
      "Custom branding and theming",
      "QR code table ordering",
      "Pick-up and delivery ordering",
      "Email order status updates",
      "Interactive digital menu",
      "Personalized landing page",
      "Chatbot based on IA",
      "Online and takeaway ordering",
      "Integration with digital payments",
      "Sales and performance analytics",
      "Custom store URL",
      "Dedicated support and consulting",
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-gray-800 font-sans">
      <section className="w-full">
        <img
          src="https://res.cloudinary.com/dsrcokjsp/image/upload/v1747973163/a6tdxavroee1vkrhbosw.png"
          alt="QR Ordering Banner"
          className="w-full h-[400px] object-cover"
        />
      </section>
      <section className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">{plan.title}</h1>
        <p className="text-lg text-gray-600">{plan.description}</p>
      </section>

      <section className="flex justify-center">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Included Features
          </h2>
          <ul className="space-y-4">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 ">
                <span className="text-green-600 text-xl mt-1 ">✓</span>
                <span className="text-base">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
