import { rendererConfig } from './webpack.renderer';
import { mainConfig } from './webpack.main';

export const config = [mainConfig, rendererConfig];
export default config;