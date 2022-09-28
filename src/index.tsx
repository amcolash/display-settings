import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  showContextMenu,
  staticClasses,
} from 'decky-frontend-lib';
import { VFC } from 'react';
import { FaShip } from 'react-icons/fa';

import logo from '../assets/logo.png';

interface AddMethodArgs {
  left: number;
  right: number;
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  return (
    <PanelSection title="Panel Section">
      {/* <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={(e) =>
            showContextMenu(
              <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                <MenuItem onSelected={() => {}}>Item #3</MenuItem>
              </Menu>,
              e.currentTarget ?? window
            )
          }
        >
          Server says yolo
        </ButtonItem>
      </PanelSectionRow> */}

      <PanelSectionRow>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={logo} />
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        {/* <ButtonItem
          layout="below"
          onClick={async () => {
            Router.CloseSideMenus();
            Router.Navigate('/decky-plugin-test');
          }}
        >
          Router
        </ButtonItem> */}

        <ButtonItem
          layout="below"
          onClick={async () => {
            const result = await serverAPI.callPluginMethod<AddMethodArgs, number>('add', {
              left: 2,
              right: 5,
            });
            if (result.success) {
              serverAPI.toaster.toast({ title: 'Add', body: result.result });
            }
          }}
        >
          TEST
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

// const DeckyPluginRouterTest: VFC = () => {
//   return (
//     <div style={{ marginTop: '50px', color: 'white' }}>
//       Hello World!
//       <DialogButton onClick={() => Router.NavigateToStore()}>Go to Store</DialogButton>
//     </div>
//   );
// };

export default definePlugin((serverApi: ServerAPI) => {
  // const EdidReader = require('edid-reader');
  // const edidReader = new EdidReader();

  // let data = '';
  // edidReader.scan().then(() => {
  //   data += '==========================';
  //   edidReader.monitors.forEach((monitor: any) => {
  //     data += `Vendor : ${monitor.vendor}`;
  //     data += `Model  : ${monitor.modelName}`;
  //     data += `EISA   : ${monitor.eisaId}`;
  //     data += `Code   : ${monitor.productCode}`;
  //     data += `Serial : ${monitor.serialNumber}`;
  //     data += '==========================';
  //   });

  //   log(data, serverApi);
  // });

  // serverApi.routerHook.addRoute('/decky-plugin-test', DeckyPluginRouterTest, {
  //   exact: true,
  // });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
      serverApi.routerHook.removeRoute('/decky-plugin-test');
    },
  };
});

// function log(data: string, serverApi: ServerAPI) {
//   return serverApi.callPluginMethod<{ data: string }>('log', {
//     data,
//   });
// }
