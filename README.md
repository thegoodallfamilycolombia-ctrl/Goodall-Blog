# The Goodall Family — Blog

Source for [www.thegoodallfamily.blog](https://www.thegoodallfamily.blog), the
missionary blog for the Goodall family (Santa Marta, Colombia).

The published website lives in [`site/`](site/) — see that folder's own
README for how to edit pages, add a monthly report, or add a blog entry.

Pushes to `main` are deployed automatically to IONOS hosting via the
[IONOS Deploy Now](https://docs.ionos.space/) GitHub App, which manages the
`.github/workflows/Goodall-Blog-*.yaml` and `deploy-to-ionos.yaml` workflows.
Those files are owned by that app — avoid hand-editing them except for the
`DEPLOYMENT_FOLDER` setting in `Goodall-Blog-build.yaml`, which must stay
`./site` since that's where the actual site files live.
