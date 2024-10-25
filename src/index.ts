import { defineHook } from "@directus/extensions-sdk";
import onHeaders from "on-headers";

export default defineHook((...args) => {
  const [{ init }, { env }] = args;
  let abort = true;
  let provider = "";

  for (const configName in env) {
    if (!configName.startsWith("AUTH_")) continue;

    const value: string = env[configName];
    if (configName.endsWith("_DRIVER") && value === "openid") {
      abort = false;
      provider =
        configName
          .match(/AUTH_(.*?)_DRIVER/)
          ?.at(1)
          ?.toLowerCase() || "";
    }
  }

  if (abort || !provider) return;

  init("routes.before", ({ app }) => {
    app.use((req, res, next) => {
      onHeaders(res, function () {
        if (req.originalUrl.startsWith(`/auth/login/${provider}`)) {
          const redirect = this.get("Location");
          if (redirect) {
            this.set(
              "Location",
              redirect.replace(/&scope=(.*?)(&|$)/, (match, scope) =>
                match.replace(scope, decodeURIComponent(scope))
              )
            );
          }
        }
      });

      next();
    });
  });
});
