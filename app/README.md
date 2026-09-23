# Siris Combat Playbook

React + Vite + TypeScript build of the Claude Design prototype `project/Siris Combat Playbook v4.dc.html`.

```sh
npm install
npm run dev      # local dev server
npm run build    # static site in dist/ (relative paths, host anywhere)
npm test         # tracker rule tests
npm run images   # re-export project/assets/*.png → public/assets/*.webp
```

## Deploy to AWS

This is a static site: a private S3 bucket served through CloudFront over HTTPS (`deploy/cloudformation.yml`). With the AWS CLI and credentials set up:

```sh
deploy/deploy.sh   # builds, tests, creates/updates the stack, uploads, prints the URL
```

The first run takes about 5 minutes while CloudFront provisions; later runs take under a minute. You can set `STACK_NAME` (default `siris-playbook`) and `AWS_REGION` (default `us-east-1`). Running costs are well under $1/month at this traffic. To tear it down, empty the bucket, then run `aws cloudformation delete-stack --stack-name siris-playbook`.

The credentials need CloudFormation, S3, CloudFront, Lambda, DynamoDB, IAM and SSM permissions.

## Shared state (sync)

Tracker state and prefs sync across devices through a small API in the same stack: CloudFront routes `/api/state` to a Lambda function URL backed by a DynamoDB table. Access is guarded by a sync passphrase, generated on first deploy and kept in SSM Parameter Store (`/<stack>/sync-token`); `deploy.sh` prints it, or fetch it with:

```sh
aws ssm get-parameter --name /siris-playbook/sync-token --with-decryption --query Parameter.Value --output text
```

Tap the **Sync** chip in the tracker header and enter the passphrase once per device. After that the device pushes changes (debounced) and pulls newer revisions on load, on a 20 s poll while visible, and on tab focus. It's offline-first: without a connection the tracker keeps working from local storage and pushes when it reconnects. If two devices write at once, the server's copy wins and replaces the loser's local state. To rotate the passphrase, overwrite the SSM parameter and redeploy; every device then re-enters it. In `npm run dev` there is no backend, so the chip shows "Sync offline" and the app runs local-only.

## Layout

- `src/data/` holds the content: tokens and palette (`tokens.ts`), play cards, decision flow and DM rulings (`cards.ts`), and spell pop-ups (`spells.ts`).
- `src/tracker/logic.ts` holds the pure tracker rules: lane costs, `check` (can it be paid?), `apply` (pay it), and `plan` (the play dialog's step-by-step simulation).
- `src/tracker/useTracker.ts` holds tracker state, undo history and persistence.
- `src/components/` holds the Loadout, Playbook, footer, tracker rail and play dialog.

## Switches (`src/data/tokens.ts`)

- `SHOW_L5`: Level 5 content is hidden for now. Set this to `true` when Siris levels up.
- `SHOT_CAP`: the 18-shot cannon limit. This is a table rule, still pending DM confirmation.
- `SETTINGS`: how Level 5 cards and filtered-out cards appear (dimmed or hidden), and the grid column count.

State is also cached in `localStorage` under the prototype's keys (`siris-playbook-v1`, `siris-tracker-v1`), which keeps the app working offline and carries state over from the prototype when served from the same origin.
