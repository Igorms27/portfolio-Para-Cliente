# Dependency and vulnerability policy

This project uses Yarn 4 and keeps `yarn.lock` as the authoritative dependency
lockfile. Dependency changes must use Yarn; npm lockfiles and
`--legacy-peer-deps` are not accepted.

## Automated updates

Dependabot checks npm/Yarn dependencies weekly and GitHub Actions monthly.
Minor and patch releases are grouped by ecosystem. Major releases are kept in
separate pull requests and require an explicit migration review. Normal version
updates use a cooldown; security updates are not delayed by that cooldown.

Automated pull requests are never merged based only on a green dependency
resolution. They must pass the same audit, lint, test, production build and
artifact smoke checks as any other pull request.

## Vulnerability thresholds

`yarn audit` scans the complete runtime and development dependency tree and
fails on high or critical advisories. The response targets are:

| Severity | Target |
| --- | --- |
| Critical | Triage immediately; patch or mitigate within 24 hours |
| High | Patch or mitigate within 7 days |
| Moderate | Review within 30 days and schedule according to exposure |
| Low | Review during the next quarterly dependency maintenance cycle |

Development-only advisories can have a different exposure from shipped runtime
code, but high and critical findings still block the validation pipeline.

An exception requires a GitHub issue containing the advisory, affected path,
exposure analysis, compensating control, owner and expiry date. Expired
exceptions block dependency updates.

## Review checklist

1. Read upstream release notes and migration guides.
2. Confirm the lockfile contains only the intended dependency changes.
3. Run `yarn validate:supply-chain` using a supported Node version.
4. Manually verify the contact form when CAPTCHA or EmailJS changes.
5. Do not auto-merge major framework, Firebase or security-sensitive updates.
