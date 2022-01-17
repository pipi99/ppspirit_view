export interface Cache<V = any> {
  value?: V;
  timeoutId?: ReturnType<typeof setTimeout>;
  time?: number;
  alive?: number;
}

const NOT_ALIVE = 0;

export class Memory<T = any, V = any> {
  private cache: { [key in keyof T]?: Cache<V> } = {};
  private alive: number;

  constructor(alive = NOT_ALIVE) {
    // Unit second
    this.alive = alive * 1000;
  }

  get getCache() {
    return this.cache;
  }

  setCache(cache) {
    this.cache = cache;
  }

  // get<K extends keyof T>(key: K) {
  //   const item = this.getItem(key);
  //   const time = item?.time;
  //   if (!isNullOrUnDef(time) && time < new Date().getTime()) {
  //     this.remove(key);
  //   }
  //   return item?.value ?? undefined;
  // }

  get<K extends keyof T>(key: K) {
    return this.cache[key];
  }

  set<K extends keyof T>(key: K, value: V, expires?: number) {
    let item = this.get(key);

    if (!expires || (expires as number) <= 0) {
      expires = this.alive;
    }
    if (item) {
      if (item.timeoutId) {
        clearTimeout(item.timeoutId);
        item.timeoutId = undefined;
      }
      item.value = value;
    } else {
      item = { value, alive: expires };
      this.cache[key] = item;
    }

    if (!expires) {
      return value;
    }
    const now = new Date().getTime();

    //此处是vben的bug ,已提issue   : memory.ts set 方法，对于expires 传入的参数，未用作超时时间 #1530
    // item.time = now + this.alive;
    //修正为
    item.time = now + expires;
    item.timeoutId = setTimeout(
      () => {
        this.remove(key);
      },
      // expires > now ? expires - now : expires,
      expires,
    );

    return value;
  }

  remove<K extends keyof T>(key: K) {
    const item = this.get(key);
    Reflect.deleteProperty(this.cache, key);
    if (item) {
      clearTimeout(item.timeoutId!);
      return item.value;
    }
  }

  resetCache(cache: { [K in keyof T]: Cache }) {
    Object.keys(cache).forEach((key) => {
      const k = key as any as keyof T;
      const item = cache[k];
      if (item && item.time) {
        const now = new Date().getTime();

        // 页面多次刷新的时候会导致memeory中存储的，token 失效,已提issure #1533
        // const expire = item.time;
        // if (expire > now) {
        //   this.set(k, item.value, expire);
        // }
        const time = item.time;
        if (time > now) {
          const expire = time - now;
          this.set(k, item.value, expire);
        }
      }
    });
  }

  clear() {
    Object.keys(this.cache).forEach((key) => {
      const item = this.cache[key];
      item.timeoutId && clearTimeout(item.timeoutId);
    });
    this.cache = {};
  }
}
