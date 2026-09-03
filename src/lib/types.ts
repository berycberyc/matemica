export type Role = "owner" | "teacher" | "student" | "parent";
export type Lang = "ru" | "kk";
export type AnswerType = "choice" | "number" | "compare";

export interface User {
  id: number; role: Role; full_name: string; login: string; password: string;
  lang: Lang; group_id: number | null; grade: number | null; note: string | null;
  is_active: boolean;
}
export interface Group { id: number; name: string }
export interface Topic { ord: number; code: string; title_ru: string; title_kk: string | null }
export interface Dep { topic_ord: number; depends_on: number }
export interface Option {
  id: number; task_id: number; pos: number; body: string;
  is_correct: boolean; error_code: string | null;
}
export interface Task {
  id: number; topic_ord: number; level: number; answer_type: AnswerType;
  stem_ru: string; stem_kk: string | null; svg: string | null;
  answer_num: string | number | null;
  target_seconds: number; options: Option[];
}
export interface Session {
  id: number; student_id: number; pass_no: number; supervised: boolean;
  status: "in_progress" | "done" | "abandoned";
}
export interface Item {
  id?: number; session_id: number; pos: number; task_id: number; topic_ord: number;
  given: string | null; is_correct: boolean | null; error_code: string | null;
  seconds: number | null; answered_at?: string; supervised?: boolean;
}
export interface Lesson {
  id: number; group_id: number; on_date: string; is_open: boolean;
  started_at: string; topic_ord: number | null;
}
