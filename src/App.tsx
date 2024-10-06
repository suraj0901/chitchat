import { ServiceWorkerToast } from "./ServiceWorkerToast";
import { ClientProvider, Config, Local, Defaults } from "@dxos/react-client";
import { Status, ThemeProvider } from "@dxos/react-ui";
import { useRegisterSW } from "virtual:pwa-register/react";
import { defaultTx } from "@dxos/react-ui-theme";
import translations from "./translations";
import { ErrorBoundary } from "./ErrorBoundary";

const config = async () => new Config(Local(), Defaults());

const createWorker = () =>
  new SharedWorker(new URL("./shared-worker", import.meta.url), {
    type: "module",
    name: "dxos-client-worker",
  });

const Loader = () => (
  <div className="flex bs-[100dvh] justify-center items-center">
    <Status indeterminate aria-label="Initializing" />
  </div>
);

export const App = () => {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady],
    updateServiceWorker,
  } = useRegisterSW();
  const variant = needRefresh
    ? "needRefresh"
    : offlineReady
    ? "offlineReady"
    : undefined;

  return (
    <ThemeProvider
      appNs="."
      tx={defaultTx}
      resourceExtensions={translations}
      fallback={<Loader />}
    >
      {variant && (
        <ServiceWorkerToast
          variant={variant}
          updateServiceWorker={updateServiceWorker}
        />
      )}
      <ErrorBoundary>
        <ClientProvider
          config={config}
          createWorker={createWorker}
          shell="./shell.html"
          fallback={Loader}
          onInitialized={async (client) => {
            const searchParams = new URLSearchParams(location.search);
            if (
              !client.halo.identity.get() &&
              !searchParams.has("deviceInvitationCode")
            ) {
              await client.halo.createIdentity();
            }
          }}
        >
          <p>Your code goes here</p>
        </ClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
};
