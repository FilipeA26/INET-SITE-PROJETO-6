// Linguagem de movimento única do site: toda animação usa a mesma curva e o mesmo ritmo.
export const EASE = [0.16, 1, 0.3, 1] as const; // "expo out": começa decidido e pousa devagar
export const DUR = 1.2;
export const STAGGER = 0.09;
// mola usada para suavizar valores ligados à rolagem
export const SPRING = { stiffness: 60, damping: 22, mass: 0.6 };
