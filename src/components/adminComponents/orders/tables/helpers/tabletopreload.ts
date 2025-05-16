import { ITables } from "@/types";

// Función para generar booleano aleatorio
const getRandomBoolean = () => Math.random() < 0.5;

export const tabletopreload: ITables[] = [
    {
        id: 1,
        is_active: true,
        created_at: 1045,
        exist: getRandomBoolean(),
    },
    {
        id: 2,
        is_active: true,
        created_at: 1045,
        exist: getRandomBoolean(),
    },
    {
        id: 3,
        is_active: true,
        created_at: 1045,
        exist: getRandomBoolean(),
    },
    {
        id: 4,
        is_active: true,
        created_at: 1145,
        exist: getRandomBoolean(),
    },
    {
        id: 5,
        is_active: true,
        created_at: 1045,
        exist: getRandomBoolean(),
    },
    {
        id: 6,
        is_active: true,
        created_at: 1045,
        exist: getRandomBoolean(),
    },
    {
        id: 7,
        is_active: false,
        created_at: 1245,
        exist: getRandomBoolean(),
    },
    {
        id: 8,
        is_active: false,
        created_at: 1245,
        exist: getRandomBoolean(),
    },
    {
        id: 9,
        is_active: false,
        created_at: 1245,
        exist: getRandomBoolean(),
    },
];
