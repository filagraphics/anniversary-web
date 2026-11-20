/** The little gold line–diamond–line ornament. Place it inside a flex row. */
export default function GoldDivider() {
  return (
    <>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8c98f]/80" />
      <span className="size-1.5 rotate-45 bg-[#f3dca6] shadow-[0_0_10px_rgb(243_220_166/0.9)]" />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#e8c98f]/80" />
    </>
  );
}
