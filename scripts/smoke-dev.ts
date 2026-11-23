/**
 * Write-path smoke tests against the LOCAL dev-server (see dev-server/README.md).
 * Every suite in scripts/dev-smoke/ (registered in index.ts) creates its own data and cleans up after itself.
 *
 *   DEV_API=http://127.0.0.1:3300/admin-api DEV_USER=superadmin DEV_PASS=... npm run smoke:dev [suite…]
 */
import { suites } from './dev-smoke';
import { assertLocal, connect } from './smoke-lib';

async function main() {
  const api = process.env.DEV_API ?? 'http://127.0.0.1:3300/admin-api';
  assertLocal(api);
  const ctx = await connect(api, process.env.DEV_USER ?? 'superadmin', process.env.DEV_PASS ?? 'superadmin');
  const only = process.argv.slice(2);
  const names = Object.keys(suites).filter((name) => !only.length || only.includes(name));
  let failed = 0;
  for (const name of names) {
    try {
      await suites[name](ctx);
    } catch (e) {
      failed++;
      console.error(`✗ ${name}: ${(e as Error).message}`);
    }
  }
  console.log(failed ? `${failed} suite(s) failed` : `All ${names.length} suite(s) passed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
