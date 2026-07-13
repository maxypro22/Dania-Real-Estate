// One-time boot: load saved overrides synchronously and apply them BEFORE React
// renders, so the first paint already shows the edited content (no flash).
//
// Called from main.tsx right after i18n is initialized.

import { readOverridesSync } from './store'
import { setOverrides } from './state'
import { applyOverrides } from './apply'

export function bootstrapCms(): void {
  setOverrides(readOverridesSync())
  applyOverrides()
}
