// @ts-ignore
import { createCache } from "simple-cache-provider";

let cache: any;

function initCache() {
  cache = createCache(initCache);
}

initCache();

export default cache;
