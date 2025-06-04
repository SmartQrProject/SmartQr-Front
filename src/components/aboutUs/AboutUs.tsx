"use client";

import React from "react";

interface TeamMember {
    name: string;
    description: string;
    imageUrl: string;
}

const team: TeamMember[] = [
    {
        name: "Gabriel Amigo",
        description: "Full Stack Engineer with a focus on Back End development.",
        imageUrl: "https://res.cloudinary.com/dsrcokjsp/image/upload/w_300,h_300,c_thumb,g_face,q_auto:best,f_auto,dpr_auto/v1749049516/qpipj8bsaeujrqaeq4uv.jpg",
    },
    {
        name: "Federico Alvarez",
        description: "Full Stack Engineer with a focus on Back End development",
        imageUrl: "https://res.cloudinary.com/dsrcokjsp/image/upload/w_300,h_300,c_thumb,g_face,q_auto:best,f_auto,dpr_auto/v1749049516/fjetxvs13ts8qrh0hj9m.jpg",
    },
    {
        name: "Matías Gallardo",
        description: "Full Stack Engineer with a focus on Back End development.",
        imageUrl: "https://res.cloudinary.com/dsrcokjsp/image/upload/w_300,h_300,c_thumb,g_face,q_auto:best,f_auto,dpr_auto/v1749049516/gwvvjt4gdtuoemwj2bxq.jpg",
    },
    {
        name: "Andrea Larsen",
        description: "Full Stack Engineer with a focus on Front End development.",
        imageUrl: "https://res.cloudinary.com/dsrcokjsp/image/upload/w_300,h_300,c_thumb,g_face,q_auto:best,f_auto,dpr_auto/v1749049516/bkrlzx9xqtmkxmvuillc.jpg",
    },
    {
        name: "Eliana Tangarife Blandon",
        description: "Full Stack Engineer with a focus on Front End development.",
        imageUrl: "https://res.cloudinary.com/dsrcokjsp/image/upload/w_300,h_300,c_thumb,g_face,q_auto:best,f_auto,dpr_auto/v1749049516/bcpk3lzotonyt4qfkpdt.jpg",
    },
    {
        name: "Francisco José D'Alessandro",
        description: "Full Stack Engineer with a focus on Front End development.",
        imageUrl: "https://res.cloudinary.com/dsrcokjsp/image/upload/w_300,h_300,c_thumb,g_face,q_auto:best,f_auto,dpr_auto/v1749049516/dbocpx3aeavev3epn3qb.jpg",
    },
];

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Team</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                {team.map((member, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
                        <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full object-cover mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800">{member.name}</h2>
                        <p className="text-sm text-gray-600 mt-2">{member.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
