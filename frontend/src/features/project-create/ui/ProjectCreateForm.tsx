import { Field, Form } from 'react-final-form';
import { PROJECT_NAME_MAX_LENGTH } from '../../../entities/project/model/constants';
import type {
  ProjectCreateFormProps,
  ProjectCreateValues,
} from '../model/types';
import { validateProjectName } from '../model/validation';

export function ProjectCreateForm({ onSubmit }: ProjectCreateFormProps) {
  return (
    <Form<ProjectCreateValues>
      onSubmit={async (values, form) => {
        await onSubmit({ name: values.name.trim() });
        form.restart();
      }}
      initialValues={{ name: '' }}
      render={({ handleSubmit, submitting, submitError }) => (
        <form
          onSubmit={handleSubmit}
          className="mt-6 border-t border-slate-800 pt-5"
        >
          <label
            className="mb-2 block text-xs font-semibold text-slate-500"
            htmlFor="new-project"
          >
            Новый проект
          </label>
          <div className="flex gap-2">
            <Field<string>
              name="name"
              validate={validateProjectName}
            >
              {({ input, meta }) => (
                <div className="min-w-0 flex-1">
                  <input
                    {...input}
                    id="new-project"
                    placeholder="Название"
                    maxLength={PROJECT_NAME_MAX_LENGTH}
                    className={[
                      'w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2',
                      'text-xs text-white outline-none focus:border-amber-400',
                    ].join(' ')}
                  />
                  {meta.touched && meta.error && (
                    <span className="mt-1 block text-[10px] text-rose-400">
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>
            <button
              type="submit"
              disabled={submitting}
              aria-label="Создать проект"
              className={[
                'rounded-lg bg-amber-400 px-3 text-lg font-bold text-slate-950',
                'hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60',
              ].join(' ')}
            >
              +
            </button>
          </div>
          {submitError && (
            <p className="mt-2 text-[10px] text-rose-400">{submitError}</p>
          )}
        </form>
      )}
    />
  );
}
