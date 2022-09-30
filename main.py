import logging
import os
from pathlib import Path
import subprocess

logging.basicConfig(filename="/tmp/decky-plugin-template.log",
                    format='[Template] %(asctime)s %(levelname)s %(message)s',
                    filemode='w+',
                    force=True)
logger=logging.getLogger()
logger.setLevel(logging.INFO) # can be changed to logging.DEBUG for debugging issues

xauthority = None

class Plugin:
    async def xrandr(self, args):
        global xauthority

        # Last ditch effort if xauth file not set or missing
        if xauthority == None or not Path(xauthority).exists():
            logger.warn("Double checking xauth")
            self.findXAuth(self)

        try:
            my_env = os.environ.copy()
            my_env["XAUTHORITY"] = xauthority
            my_env["DISPLAY"] = ":0"

            command = ["xrandr"] + args.split()
            command = "xrandr " + args
            logger.info(command)
            logger.info(xauthority)

            status = subprocess.run(command, timeout=10, env=my_env, shell=True, text=True, capture_output=True)
            if status.returncode == 0:
                logger.info(status.stdout)
                return status.stdout
            else:
                logger.error(status.stdout + status.stderr)

        except Exception as e:
            logger.error(e)

        return 'ERROR'

    # Figure out where the xauth file is by scanning the directory
    def findXAuth(self):
        global xauthority

        logger.info("Scanning for X-Auth file")
        xauthority = None

        runDir = "/run/user/1000"
        files = os.scandir(runDir)

        with os.scandir(runDir) as files:
            for f in files:
                if f.is_file() and Path(f).suffix == "":
                    with open(f.path, "rb") as data:
                        if "MIT-MAGIC-COOKIE" in str(data.readline()):
                            xauthority = f.path

        if xauthority == None:
            logger.error("Could not find xauth file")
        else:
            logger.info(f"Found xauth file {xauthority}")


    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        logger.info("Starting display-settings plugin")

        # On startup, make sure that we know where the xauth file is
        self.findXAuth(self)

        pass