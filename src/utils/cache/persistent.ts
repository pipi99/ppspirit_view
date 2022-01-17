import type { LockInfo, UserInfo } from '/#/store';
import type { ProjectConfig } from '/#/config';
import type { RouteLocationNormalized } from 'vue-router';

import { createLocalStorage, createSessionStorage } from '/@/utils/cache';
import { Memory } from './memory';
import {
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_INFO_KEY,
  ROLES_KEY,
  LOCK_INFO_KEY,
  PROJ_CFG_KEY,
  APP_LOCAL_CACHE_KEY,
  APP_SESSION_CACHE_KEY,
  MULTIPLE_TABS_KEY,
  REMEMBERME_KEY,
} from '/@/enums/cacheEnum';
import { DEFAULT_CACHE_TIME } from '/@/settings/encryptionSetting';
import { toRaw } from 'vue';
import { pick, omit } from 'lodash-es';

interface BasicStore {
  [REMEMBERME_KEY]: string | number | null | undefined;
  [TOKEN_KEY]: string | number | null | undefined;
  [REFRESH_TOKEN_KEY]: string | number | null | undefined;
  [USER_INFO_KEY]: UserInfo;
  [ROLES_KEY]: string[];
  [LOCK_INFO_KEY]: LockInfo;
  [PROJ_CFG_KEY]: ProjectConfig;
  [MULTIPLE_TABS_KEY]: RouteLocationNormalized[];
}

type LocalStore = BasicStore;

type SessionStore = BasicStore;

export type BasicKeys = keyof BasicStore;
type LocalKeys = keyof LocalStore;
type SessionKeys = keyof SessionStore;

const ls = createLocalStorage();
const ss = createSessionStorage();

const localMemory = new Memory(DEFAULT_CACHE_TIME);
const sessionMemory = new Memory(DEFAULT_CACHE_TIME);

/***
 * 1、Memory 中负责存储系统相关的信息，LocalStorage或者SessionStorage 负责存储Memory
 *
 * 2、每次打开页面会从浏览器的LocalStorage或者SessionStorage 中获取暂存数据，初始化Memory
 *
 * 3、Memory 过期时间用settimeout监控，LocalStorage或者SessionStorage过期时间在获取数据的时候判断
 *
 * 4、Memory过期时间与LocalStorage或者SessionStorage过期时间 无关。
 *
 * 5、memory 默认使用构造时提供的过期时间，也可以方法传入
 *
 * 6、** memory 的过期时间参数单位 毫秒
 */

export function initPersistentMemory() {
  const localCache = ls.get(APP_LOCAL_CACHE_KEY);
  const sessionCache = ss.get(APP_SESSION_CACHE_KEY);
  localCache && localMemory.resetCache(localCache);
  sessionCache && sessionMemory.resetCache(sessionCache);
}

export class Persistent {
  static getLocal<T>(key: LocalKeys) {
    return localMemory.get(key)?.value as Nullable<T>;
  }

  /**
   * @description
   * @author Liv
   * @date 24/12/2021
   * @static
   * @param {LocalKeys} key
   * @param {LocalStore[LocalKeys]} value
   * @param {boolean} [immediate=false]
   * @param {number} [expire] 参数单位 毫秒
   * @memberof Persistent
   */
  static setLocal(
    key: LocalKeys,
    value: LocalStore[LocalKeys],
    immediate = false,
    expire?: number,
  ): void {
    localMemory.set(key, toRaw(value), expire);
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  static removeLocal(key: LocalKeys, immediate = false): void {
    localMemory.remove(key);
    immediate && ls.set(APP_LOCAL_CACHE_KEY, localMemory.getCache);
  }

  static clearLocal(immediate = false): void {
    localMemory.clear();
    immediate && ls.clear();
  }

  static getSession<T>(key: SessionKeys) {
    return sessionMemory.get(key)?.value as Nullable<T>;
  }

  /**
   * @description
   * @author Liv
   * @date 24/12/2021
   * @static
   * @param {SessionKeys} key
   * @param {SessionStore[SessionKeys]} value
   * @param {boolean} [immediate=false]
   * @param {number} [expire] 参数单位 毫秒
   * @memberof Persistent
   */
  static setSession(
    key: SessionKeys,
    value: SessionStore[SessionKeys],
    immediate = false,
    expire?: number,
  ): void {
    sessionMemory.set(key, toRaw(value), expire);
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
  }

  static removeSession(key: SessionKeys, immediate = false): void {
    sessionMemory.remove(key);
    immediate && ss.set(APP_SESSION_CACHE_KEY, sessionMemory.getCache);
  }
  static clearSession(immediate = false): void {
    sessionMemory.clear();
    immediate && ss.clear();
  }

  static clearAll(immediate = false) {
    sessionMemory.clear();
    localMemory.clear();
    if (immediate) {
      ls.clear();
      ss.clear();
    }
  }
}

window.addEventListener('beforeunload', function () {
  // TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
  // LOCK_INFO_KEY 在锁屏和解锁时写入，此处也不应修改
  ls.set(APP_LOCAL_CACHE_KEY, {
    ...omit(localMemory.getCache, LOCK_INFO_KEY),
    ...pick(ls.get(APP_LOCAL_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
  });
  ss.set(APP_SESSION_CACHE_KEY, {
    ...omit(sessionMemory.getCache, LOCK_INFO_KEY),
    ...pick(ss.get(APP_SESSION_CACHE_KEY), [TOKEN_KEY, USER_INFO_KEY, LOCK_INFO_KEY]),
  });
});

function storageChange(e: any) {
  const { key, newValue, oldValue } = e;

  if (!key) {
    Persistent.clearAll();
    return;
  }

  if (!!newValue && !!oldValue) {
    if (APP_LOCAL_CACHE_KEY === key) {
      Persistent.clearLocal();
    }
    if (APP_SESSION_CACHE_KEY === key) {
      Persistent.clearSession();
    }
  }
}

window.addEventListener('storage', storageChange);

initPersistentMemory();
