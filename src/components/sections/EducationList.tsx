import {
  credentialInstitutions,
  education,
  educationLevels,
} from "../../content/professional";
import { InstitutionEmblem } from "../ui/InstitutionEmblem";
import { SectionHeading } from "../ui/SectionHeading";

const emblemFor = (institution: string) =>
  credentialInstitutions.find((c) => institution.startsWith(c.name));

/** Formación académica agrupada por nivel, como lista editorial. Sólo se muestran los años documentados. */
export function EducationList() {
  return (
    <section aria-labelledby="formacion-title" className="section-y">
      <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-4">
          <SectionHeading
            id="formacion-title"
            eyebrow="Formación académica"
            title="Formación jurídica y en gerencia de la salud."
          />
        </div>

        <div className="space-y-12 lg:col-span-8">
          {educationLevels.map(({ level, heading }) => {
            const degrees = education.filter(
              (degree) => degree.level === level,
            );
            return (
              <div key={level}>
                <h3 className="eyebrow mb-4">{heading}</h3>
                <ul className="border-b border-line-strong">
                  {degrees.map((degree) => {
                    const emblem = emblemFor(degree.institution);
                    return (
                      <li
                        key={degree.program}
                        className="flex flex-col gap-1 border-t border-line-strong py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                      >
                        <div className="flex items-center gap-4">
                          {emblem && (
                            <InstitutionEmblem
                              institution={emblem}
                              className="h-12 w-12 shrink-0 object-contain"
                            />
                          )}
                          <div>
                            <p className="font-sans text-base font-medium leading-snug">
                              {degree.program}
                            </p>
                            <p className="mt-1 text-sm text-muted">
                              {degree.institution}
                            </p>
                          </div>
                        </div>
                        {degree.year && (
                          <p className="font-serif text-lg text-accent sm:shrink-0">
                            {degree.year}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
