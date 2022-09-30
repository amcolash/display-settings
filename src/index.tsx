import { definePlugin, Dropdown, Field, PanelSection, PanelSectionRow, ServerAPI, staticClasses } from 'decky-frontend-lib';
import { useEffect, useState, VFC } from 'react';
import { FaShip } from 'react-icons/fa';
import { ErrorBoundary } from 'react-error-boundary';

import xrandrParser, { Screens } from 'xrandr';

const internal = 'eDP';

function setIntervalImmediately(func: () => any, interval: number) {
  func();
  return setInterval(func, interval);
}

function ErrorFallback() {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
    </div>
  );
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [screens, setScreens] = useState<Screens>({});
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    setScreens({});

    serverAPI
      .callPluginMethod<{ args: string }, string>('xrandr', { args: '-q' })
      .then((result) => {
        if (!result.success) throw 'Error updating screens';
        setScreens(xrandrParser(result.result));
      })
      .catch((err) => {
        serverAPI.toaster.toast({ title: 'Displays', body: `Failed\n${err}` });
      });
  }, [counter, setScreens]);

  // Update screens on start
  useEffect(() => {
    setCounter(counter + 1);
  }, []);

  return (
    <PanelSection title="Connected Displays" spinner={Object.keys(screens).length === 0}>
      {Object.entries(screens || [])
        .filter((s) => s[1].connected)
        .map((s) => {
          const options = [
            { data: { screen: s[0], index: 0 }, label: 'Off' },
            ...s[1].modes.map((m, i) => {
              // Flip 800x1200 so it reads 1200x800
              const flipHW = s[0] === internal && m.width === 800 && m.height === 1280;
              const width = flipHW ? m.height : m.width;
              const height = flipHW ? m.width : m.height;

              return {
                data: { screen: s[0], mode: m, index: i + 1 },
                label: `${width}x${height} @ ${m.rate}hz ${m.native ? '[Default]' : ''}`,
              };
            }),
          ];

          const current = s[1].modes.findIndex((m) => m.current);
          const selected = current > -1 ? current + 1 : 0;
          const name = s[0].replace(internal, 'Internal Display');

          return (
            <PanelSectionRow>
              <Field label={name} style={{ display: 'flex', flexDirection: 'column' }}>
                <Dropdown
                  selectedOption={0}
                  rgOptions={options}
                  renderButtonValue={() => options[selected]?.label.replace('[Default]', '')}
                  onChange={(data) => {
                    const screen = data.data.screen;
                    const mode = data.data.mode;

                    if (data.data.index === 0) {
                      const args = `--output ${screen} --off`;
                      serverAPI
                        .callPluginMethod<{ args: string }, string>('xrandr', { args })
                        .catch((err) => serverAPI.toaster.toast({ title: 'Displays', body: `Failed\n${err}` }));
                      // .finally(() => setCounter(counter + 1));
                    } else {
                      const args = `--output ${screen} --mode ${mode.width}x${mode.height} ${screen === internal ? '--rotate right' : ''}`;
                      serverAPI
                        .callPluginMethod<{ args: string }, string>('xrandr', { args })
                        .catch((err) => serverAPI.toaster.toast({ title: 'Displays', body: `Failed\n${err}` }));
                      // .finally(() => setCounter(counter + 1));
                    }
                  }}
                />
              </Field>
            </PanelSectionRow>
          );
        })}
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Display Settings</div>,
    content: (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Content serverAPI={serverApi} />
      </ErrorBoundary>
    ),
    icon: <FaShip />,
  };
});
