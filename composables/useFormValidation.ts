import { reactive, toRefs } from 'vue'

type Validator = (value: any, form?: Record<string, any>) => string | null

export function required(msg = 'This field is required'): Validator {
  return (v) => (v === null || v === undefined || v === '' ? msg : null)
}

export function minLength(length: number, msg?: string): Validator {
  return (v) => (v && String(v).length < length ? msg || `Must be at least ${length} characters` : null)
}

export function pattern(re: RegExp, msg?: string): Validator {
  return (v) => (v && !re.test(String(v)) ? msg || 'Invalid format' : null)
}

export function isUrl(msg = 'Must be a valid URL'): Validator {
  return (v) => {
    if (!v) return null
    try {
      // URL constructor will throw on invalid urls
      // allow protocol-relative and data urls by simple check
      new URL(v)
      return null
    } catch (e) {
      return msg
    }
  }
}

export function minNumber(min: number, msg?: string): Validator {
  return (v) => (v !== '' && v !== null && Number(v) < min ? msg || `Must be >= ${min}` : null)
}

export function createValidation<T extends Record<string, any>>(rules: Record<keyof T, Validator[]>) {
  // initialize errors and touched with keys from rules so toRefs returns stable refs
  const initialErrors: Record<string, string | null> = {}
  const initialTouched: Record<string, boolean> = {}
  for (const k of Object.keys(rules)) {
    initialErrors[k] = null
    initialTouched[k] = false
  }

  const errors = reactive<Record<string, string | null>>(initialErrors)
  const touched = reactive<Record<string, boolean>>(initialTouched)

  const validateField = (name: keyof T, form?: T) => {
    const fieldRules = (rules[name] || []) as Validator[]
    const value = form ? (form[name as string] as any) : undefined
    for (const r of fieldRules) {
      const res = r(value, form as any)
      if (res) {
        errors[name as string] = res
        return false
      }
    }
    errors[name as string] = null
    return true
  }

  const validateAll = (form: T) => {
    let ok = true
    for (const key of Object.keys(rules) as (keyof T)[]) {
      const valid = validateField(key, form)
      if (!valid) ok = false
    }
    return ok
  }

  const setTouched = (name: keyof T) => { touched[name as string] = true }

  const getError = (name: keyof T) => errors[name as string] || null
  const hasError = (name: keyof T) => !!errors[name as string]

  return {
    // errors as refs so template can unwrap each field directly (errors.field)
    errors: toRefs(errors),
    touched,
    validateField,
    validateAll,
    setTouched,
    getError,
    hasError
  }
}

export type { Validator }
