import React from "react";

const Benefits = () => {
  return (
    <main className="bg-white text-gray-800 font-sans">
      {/* Banner */}
      <section className="w-full">
        <img
          src="https://res.cloudinary.com/dsrcokjsp/image/upload/v1747973163/a6tdxavroee1vkrhbosw.png"
          alt="QR Ordering Banner"
          className="w-full h-[400px] object-cover"
        />
      </section>

      {/* Text Sections */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          A beautiful, digital,
          <br /> dine-in experience.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Increase revenue and save on operational costs, with QR code table
          ordering. Allow your staff to focus on the more meaningful
          interactions.
        </p>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            More revenue, with less overheads
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Venues that enable dine-in and use QR code table-ordering, see an
            increase of up to 30% in order size, and a saving of up to 25% on
            operational costs.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Better ordering experiences on both sides of the counter
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Customers can order and pay from their table using QR codes, freeing
            up your staff to create great customer experiences.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Benefits;
