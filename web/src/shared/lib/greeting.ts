export function getGreeting(): { en: string; ko: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { en: "Good morning", ko: "\uC88B\uC740 \uC544\uCE68\uC774\uC5D0\uC694" };
  if (hour < 18) return { en: "Good afternoon", ko: "\uC88B\uC740 \uC624\uD6C4\uC5D0\uC694" };
  return { en: "Good evening", ko: "\uC88B\uC740 \uC800\uB141\uC774\uC5D0\uC694" };
}
