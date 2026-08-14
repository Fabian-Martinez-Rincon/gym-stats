import { getGymData } from "@/lib/gym";
import { Reveal } from "./_components/reveal";
import { ResumenSection } from "./resumen/section";
import { EntrenamientosSection } from "./entrenamientos/section";
import { ProgresoSection } from "./progreso/section";
import { CuerpoSection } from "./cuerpo/section";
import { CardioSection } from "./cardio/section";
import { AsistenciaSection } from "./asistencia/section";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getGymData();

  return (
    <>
      <section id="resumen" className="scroll-mt-24 pt-6 pb-10">
        <Reveal>
          <ResumenSection data={data} />
        </Reveal>
      </section>

      <section id="entrenamientos" className="scroll-mt-24 border-t border-(--line) py-10">
        <Reveal>
          <EntrenamientosSection data={data} />
        </Reveal>
      </section>

      <section id="progreso" className="scroll-mt-24 border-t border-(--line) py-10">
        <Reveal>
          <ProgresoSection data={data} />
        </Reveal>
      </section>

      <section id="cuerpo" className="scroll-mt-24 border-t border-(--line) py-10">
        <Reveal>
          <CuerpoSection data={data} />
        </Reveal>
      </section>

      <section id="cardio" className="scroll-mt-24 border-t border-(--line) py-10">
        <Reveal>
          <CardioSection data={data} />
        </Reveal>
      </section>

      <section id="asistencia" className="scroll-mt-24 border-t border-(--line) py-10">
        <Reveal>
          <AsistenciaSection data={data} />
        </Reveal>
      </section>
    </>
  );
}
