import { DefaultDrawer } from 'leto-modelizer-plugin-core';

class DockerComposatorDrawer extends DefaultDrawer {
  constructor(pluginData, resources, rootId, options) {
    super(pluginData, resources, rootId, {
      ...options,
      minHeight: 80,
      minWidth: 110,
      margin: 10,
      padding: 20,
    });
  }
}

export default DockerComposatorDrawer;
