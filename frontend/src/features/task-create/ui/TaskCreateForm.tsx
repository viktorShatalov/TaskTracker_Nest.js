import { Field, Form } from 'react-final-form';
import {
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
} from '../../../entities/task/model/constants';
import type { TaskStatus } from '../../../entities/task/model/types';
import { toApiDueDate } from '../../../shared/lib/date/date';
import {
  taskPriorityLabels,
  taskStatusLabels,
} from '../../../entities/task/model/constants';
import type { TaskCreateFormProps, TaskFormValues } from '../model/types';
import { validateTaskTitle } from '../model/validation';

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  async function handleSubmit(values: TaskFormValues) {
    await onSubmit({
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      priority: values.priority,
      status: values.status,
      dueDate: toApiDueDate(values.dueDate),
    });
  }

  return (
    <Form<TaskFormValues>
      onSubmit={async (values, form) => {
        await handleSubmit(values);
        form.restart();
      }}
      initialValues={{
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'TODO',
        dueDate: '',
      }}
      render={({ handleSubmit: submit, submitting, submitError }) => (
        <form
          onSubmit={submit}
          className="space-y-4"
        >
          <div>
            <label
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
              htmlFor="task-title"
            >
              Новая задача
            </label>
            <Field<string>
              name="title"
              validate={validateTaskTitle}
            >
              {({ input, meta }) => (
                <>
                  <input
                    {...input}
                    id="task-title"
                    placeholder="Что нужно сделать?"
                    className={[
                      'w-full rounded-xl border border-slate-200 bg-white px-4 py-3',
                      'text-sm text-slate-900 outline-none transition placeholder:text-slate-400',
                      'focus:border-amber-400 focus:ring-4 focus:ring-amber-100',
                    ].join(' ')}
                    maxLength={TASK_TITLE_MAX_LENGTH}
                  />
                  {meta.touched && meta.error && (
                    <span className="mt-1 block text-xs text-rose-600">
                      {meta.error}
                    </span>
                  )}
                </>
              )}
            </Field>
          </div>
          <Field<string> name="description">
            {({ input }) => (
              <textarea
                {...input}
                placeholder="Добавьте контекст или критерии готовности"
                rows={3}
                maxLength={TASK_DESCRIPTION_MAX_LENGTH}
                className={[
                  'w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3',
                  'text-sm text-slate-900 outline-none transition placeholder:text-slate-400',
                  'focus:border-amber-400 focus:ring-4 focus:ring-amber-100',
                ].join(' ')}
              />
            )}
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-slate-500">
              Приоритет
              <Field<TaskPriority>
                name="priority"
                component="select"
                className={[
                  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5',
                  'text-sm font-medium text-slate-800 outline-none focus:border-amber-400',
                ].join(' ')}
              >
                {Object.entries(taskPriorityLabels).map(([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </Field>
            </label>
            <label className="text-xs font-semibold text-slate-500">
              Статус
              <Field<TaskStatus>
                name="status"
                component="select"
                className={[
                  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5',
                  'text-sm font-medium text-slate-800 outline-none focus:border-amber-400',
                ].join(' ')}
              >
                {Object.entries(taskStatusLabels).map(([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </Field>
            </label>
          </div>
          <label className="block text-xs font-semibold text-slate-500">
            Срок
            <Field<string>
              name="dueDate"
              component="input"
              type="date"
              lang="ru"
              className={[
                'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5',
                'text-sm font-medium text-slate-800 outline-none focus:border-amber-400',
              ].join(' ')}
            />
          </label>
          {submitError && (
            <p className="text-xs text-rose-600">{submitError}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className={[
              'flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3',
              'text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-slate-950',
              'disabled:cursor-wait disabled:opacity-60',
            ].join(' ')}
          >
            <span className="text-lg leading-none">+</span>
            {submitting ? 'Сохраняем...' : 'Добавить задачу'}
          </button>
        </form>
      )}
    />
  );
}
