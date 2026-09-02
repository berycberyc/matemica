// Разбор файла с планом. Файл читается и проверяется до записи в базу,
// чтобы преподаватель видел, что именно собирается произойти.

export interface PlanTask {
  ключ: string;
  topic_ord: number;
  level: number;
  answer_type: "choice" | "number" | "compare";
  stem_ru: string;
  stem_kk?: string;
  answer_num?: number | null;
  target_seconds?: number;
  варианты?: { body: string; is_correct: boolean; error_code?: string | null }[];
}

export interface PlanDay { дата: string; задачи: (string | number)[] }
export interface PlanStudent { login: string; дни: PlanDay[] }

export interface PlanFile {
  вид: "план";
  неделя: string;
  задачи: PlanTask[];
  план: PlanStudent[];
}

export interface Preview {
  ok: boolean;
  problems: string[];
  неделя: string;
  новыхЗадач: number;
  учеников: number;
  назначений: number;
  дни: string[];
  неизвестныеЛогины: string[];
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function parsePlan(raw: unknown, knownLogins: Set<string>): Preview & { file?: PlanFile } {
  const problems: string[] = [];
  const empty: Preview = {
    ok: false, problems, неделя: "", новыхЗадач: 0, учеников: 0,
    назначений: 0, дни: [], неизвестныеЛогины: []
  };
  if (typeof raw !== "object" || raw === null) {
    problems.push("Файл не читается как план.");
    return empty;
  }
  const f = raw as Partial<PlanFile>;
  if (f.вид !== "план") problems.push("Это не файл плана.");
  if (typeof f.неделя !== "string" || !DATE.test(f.неделя))
    problems.push("Не указана неделя в виде 2026-09-07.");
  if (!Array.isArray(f.задачи)) problems.push("Нет списка задач.");
  if (!Array.isArray(f.план)) problems.push("Нет самого плана.");
  if (problems.length) return empty;

  const tasks = f.задачи as PlanTask[];
  const plan = f.план as PlanStudent[];
  const keys = new Set<string>();

  for (const t of tasks) {
    if (!t.ключ || keys.has(t.ключ)) problems.push(`Задача без ключа или ключ повторяется: ${t.ключ}`);
    keys.add(t.ключ);
    if (!t.stem_ru?.trim()) problems.push(`Задача ${t.ключ}: пустое условие.`);
    if (t.answer_type === "choice") {
      const opts = t.варианты ?? [];
      if (opts.length < 2) problems.push(`Задача ${t.ключ}: меньше двух вариантов.`);
      if (opts.filter(o => o.is_correct).length !== 1)
        problems.push(`Задача ${t.ключ}: верный вариант должен быть ровно один.`);
      if (opts.some(o => !o.is_correct && !o.error_code?.trim()))
        problems.push(`Задача ${t.ключ}: у неверного варианта нет кода ошибки.`);
    } else if (t.answer_num === undefined || t.answer_num === null) {
      problems.push(`Задача ${t.ключ}: нет числового ответа.`);
    }
  }

  const days = new Set<string>();
  const unknown = new Set<string>();
  let assignments = 0;
  for (const p of plan) {
    if (!knownLogins.has(String(p.login))) unknown.add(String(p.login));
    for (const d of p.дни ?? []) {
      if (!DATE.test(d.дата)) problems.push(`Плохая дата: ${d.дата}`);
      days.add(d.дата);
      for (const ref of d.задачи ?? []) {
        assignments++;
        if (typeof ref === "string" && !keys.has(ref))
          problems.push(`В плане есть задача ${ref}, которой нет в файле.`);
      }
    }
  }

  return {
    ok: problems.length === 0,
    problems,
    неделя: f.неделя as string,
    новыхЗадач: tasks.length,
    учеников: plan.length,
    назначений: assignments,
    дни: [...days].sort(),
    неизвестныеЛогины: [...unknown],
    file: f as PlanFile
  };
}
