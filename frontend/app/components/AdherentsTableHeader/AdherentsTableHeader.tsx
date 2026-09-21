export function AdherentsTableHeader() {
  return (
    <div className="hidden items-center gap-3.5 border-b border-[#eff3fb] bg-[#fafbff] px-5.5 py-3.5 md:flex">
      <span className="flex-[2_1_200px] text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
        Adhérent
      </span>
      <span className="flex-[1_1_120px] text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
        N° licence
      </span>
      <span className="flex-[1_1_130px] text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
        Grade
      </span>
      <span className="w-27 flex-none text-[10px] font-bold tracking-[0.14em] text-encre-30 uppercase">
        Cotisation
      </span>
    </div>
  );
}
