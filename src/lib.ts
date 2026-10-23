export const WHATSAPP = "553335363939";
export const PHONE = "(33) 3536-3939";
export const waLink = (msg = "Olá! Quero saber mais sobre a internet fibra da INET.") =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
