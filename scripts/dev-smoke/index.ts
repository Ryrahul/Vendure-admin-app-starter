/** Registry of dev-server write suites. Each area group owns one file. */
import type { SmokeContext } from '../smoke-lib';
import { catalogSuites } from './catalog';
import { salesSuites } from './sales';
import { settingsASuites } from './settings-a';
import { settingsBSuites } from './settings-b';
import taxCategories from './tax-categories';

export type Suite = (ctx: SmokeContext) => Promise<void>;

export const suites: Record<string, Suite> = {
  'tax-categories': taxCategories,
  ...catalogSuites,
  ...salesSuites,
  ...settingsASuites,
  ...settingsBSuites,
};
